import { useState } from 'react';
import CustomButton from "../CustomButton/CustomButton";
import './Dashboard.scss';

import { Chart } from '../Chart/Chart';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { db, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { format } from 'date-fns';

import { TbRefresh } from "react-icons/tb";
import { FaAngleDown } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { Modal } from '../Modal/Modal';
import FullDatePicker from '../Datepicker/FullDatePicker';
import OrderLine from '../OrderLine/OrderLine';

import cn from "classnames";

function Dashboard() {
    const { user, profits, setProfits, getedOrders, setGetedOrders } = useContext(AppContext);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    
    const [orders, setOrders] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState([]);

    const [isModal, setIsModal] = useState(false);
    const [income, setIncome] = useState('');
    const [incomPerc, setIncomePerc] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6);
    const pagination = [];
    const [paginationCount, setPaginationCount] = useState([]);
    const [paginationSlice, setPaginationSlice] = useState({start: 0, end: 4});

    const handleGetInformations = async () => {
      setProfits([]);
        try {
          updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetProfitH')
          .then(res => {
            onSnapshot(doc(db, "profits_hour", user.idPost), (doc) => {
              setProfits(doc.data() ? Object.entries(doc.data()).sort((a, b) => a[0] - b[0]) : [] );
            });    
          });
            setTimeout(() => {
              updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetOrders')
                .then(res => {
            onSnapshot(doc(db, "orders", user.idPost), (doc) => {
              if(doc.data()) {
                setGetedOrders(doc.data() ? Object.entries(doc.data()).sort((a, b) => b[1].created_at - a[1].created_at) : []);
              }
             
            });    
          });
            }, 500);
           
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
      if (profits.length === 0 && user.status) {
        handleGetInformations();
      }
    }, []);

    useEffect(() => {
      const lastOrderIndex = currentPage * ordersPerPage;
      const firstOrdertIndex = lastOrderIndex - ordersPerPage;

      const currentOrders = orders.slice(firstOrdertIndex, lastOrderIndex);
  
        for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
          pagination.push(i);
        };

        setPaginationCount(pagination);
  
        setVisibleOrders(currentOrders);
  
    }, [currentPage, orders, start, end]);

    useEffect(() => {
      setCurrentPage(1);
    }, [end, start])
   
    const paginate = pageNumber => setCurrentPage(pageNumber);

    useEffect(() => {
      if (user.idPost) {
        const unsubscribe = onSnapshot(doc(db, "profits", user.idPost));
        const unsubscribeOrd = onSnapshot(doc(db, "orders", user.idPost));
        return (() => {
          
            unsubscribe();
            unsubscribeOrd();

        });
      }
    },[]);

    useEffect(() => {
      if(start?.toString().length > 0 || end?.toString().length > 0) {
        const perideIncome = profits.map(el => {
                        
          return [new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`)), el[1]]
          }).filter(el => (start?.toString().length > 0 ? el[0] >= start : el[0]) && (end?.toString().length > 0 ? el[0] <= new Date(end).setDate(end?.getDate() + 1) : el[0])).map(el => el[1]).reduce((a, b) => a + b, 0);
          setIncome(perideIncome.toFixed(2));
          setIncomePerc((perideIncome/ user.tradingLimit * 100).toFixed(2));

        const periodOrders = getedOrders.filter(el => (start?.toString().length > 0 ? new Date(el[1].created_at * 1000) >= start :  new Date(el[1].created_at * 1000)) && (end?.toString().length > 0 ? new Date(el[1].created_at * 1000)  <= new Date(end).setDate(end?.getDate() + 1) : new Date(el[1].created_at * 1000)));
        setOrders(periodOrders);
      } else {
        setIncome(profits.map(el => el[1]).reduce((a, b) => a + b, 0).toFixed(2));
        setIncomePerc(Math.abs((profits.map(el => el[1]).reduce((a, b) => a + b, 0)) / user.tradingLimit * 100).toFixed(2));
        setOrders(getedOrders);
      }
    }, [profits, getedOrders, start, end])

    const handleModal = () => {
      setIsModal(false);
    };

    const getPeriod = () => {
      console.log((start !== end) && (end !== null))
      switch(true) {
        case (start === end && start === new Date()):
        case (new Date(start).getDate() === new Date().getDate()):
          return 'Today';
        case ((start !== end) && (end !== null)): 
          return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
        case ((end === null) && (start !== null)): 
          return format(start, 'dd/MM/yyyy');

        default: 
          return 'All'
        
      }
    };

    return (
        <div className="tabs-page__container">
          <h1 className="tabs-page__title dashboard__title">
              <p>Dashboard</p>
              <div className='dashboard__title__control'>
                <div className='dashboard__title__buttons'>
                  <span>Report for:</span>
                  <button
                    onClick={() => setIsModal(true)}
                  >
                    <MdOutlineCalendarMonth />
                    {getPeriod()}
                      <FaAngleDown />
                  </button>
                  <button className='disabled' disabled>
                    Binance
                    <FaAngleDown />
                  </button>
                </div>
                <CustomButton
                  title="Refresh"
                  customClass="dashboard__refresh btn-action"
                  handleClick={handleGetInformations}
                  img={<TbRefresh/>}
                  disabled={!user.idPost}
              />
              </div>
          </h1> 
          
          <div className="dashboard__chartSection">
            <div className="dashboard__chartSection__chart">
              <Chart 
              times={(start?.toString().length > 0 || end?.toString().length > 0) 
                ? profits.map(el => {
                        
                  return new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`))
                  }).filter(el => (start?.toString().length > 0 ? el > start : el) && (end?.toString().length > 0 ? el <= new Date(end).setDate(end.getDate() + 1) : el)).map(el => format(el, 'HH:mm dd.MM.yy'))
                : profits.map(el => {
                        
                  return format(new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`)), 'HH:mm dd.MM.yy');
                })} 

              profit={profits.map((el) => el[1]).map((el, i, arr) => el + arr.slice(0, i).reduce(function(sum, elem) {
	                  return sum + elem}, 0)) } 
            />
            </div>
            
            <div className="dashboard__chartSection__datas">
              <div className="dashboard__chartSection__datas__item">
                <div className="dashboard__chartSection__datas__item__title">
                  Income
                </div>
                <div className="dashboard__chartSection__datas__item__value">
                  <span>
                    {profits.length > 0 
                      && `$${income}` 
                    }
                  </span>
                  <span className="dashboard__chartSection__datas__item__value--proc">
                    {profits.length > 0 &&
                      `${profits.map(el => el[1]).reduce((a, b) => a + b, 0) > 0 ? '+' : '-'}${incomPerc}%` 
                    }
                  </span>
                </div>
              </div> 
              <div className="dashboard__chartSection__datas__item">
                <div className="dashboard__chartSection__datas__item__title">
                  Current balance
                </div>
                <div className="dashboard__chartSection__datas__item__value">
                  <span>?</span>
                </div>
              </div> 
            </div>
          </div>

          <div className='dashboard__ordersSection'>
            <h2 className='dashboard__ordersSection__title'>Statistics of closed orders</h2>
            <div className='dashboard__ordersSection__table'>
              <div className='dashboard__ordersSection__table__item dashboard__ordersSection__table__title'>
               <div>Date</div>
               <div>Time</div>
               <div>Coin</div>
               <div>Buy QTY</div>
               <div>Buy Quote QTY</div>
               <div>Buy price</div>
               <div>Sell QTY</div>
               <div>Sell Quote QTY</div>
               <div>Sell Price</div>
               <div>Fee</div>
               <div>Profit</div>
              </div>
              {visibleOrders.map(el => <OrderLine data={el[1]} key={el[0]} />)}
            </div>
            <div className='dashboard__ordersSection__table__footer'>
            {paginationCount.length > 1 && (
              <div className="dashboard__ordersSection__table__footer__pagination">
                <button
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    if(paginationSlice.start > 0) {
                      setPaginationSlice({start: paginationSlice.start - 1, end: paginationSlice.end - 1});
                    }
                    
                  }}
                  disabled={currentPage === 1}
                  className={cn({dashboard__ordersSection__table__footer__pagination__disabled: currentPage === 1})}
                >« Previous
                </button>
              {paginationCount.length < 8  
              ? paginationCount.map(el => {
                  return (
                    
              <div 
                className={cn(
                  'dashboard__ordersSection__table__footer__pagination__item', 
                  {'dashboard__ordersSection__table__footer__pagination__item--active': currentPage === el}
                )}
              
                key={el}
                onClick={() => paginate(el)}
              >
                {el}
              </div>
            );
          })
          :  
          (<>
          {paginationCount.slice(0, -1).slice(paginationSlice.start, paginationSlice.end).map(el => {
            return (
              
        <div 
          className={cn(
            'dashboard__ordersSection__table__footer__pagination__item', 
            {'dashboard__ordersSection__table__footer__pagination__item--active': currentPage === el}
          )}
        
          key={el}
          onClick={() => paginate(el)}
        >
          {el}
        </div>
          );
        })}
        {paginationSlice.end < paginationCount.length - 1 &&
          <div className='dashboard__ordersSection__table__footer__pagination__item'>...</div>
        }
        
        <div  className={cn(
            'dashboard__ordersSection__table__footer__pagination__item', 
            {'dashboard__ordersSection__table__footer__pagination__item--active': currentPage === paginationCount.length}
          )}
          onClick={() =>  {
             paginate(paginationCount.length);
             setPaginationSlice({start: paginationCount.length - 4, end: paginationCount.length});
          }
           }
          >{paginationCount.length}</div>
        </>
        )}
          <button
            onClick={() => {
              setCurrentPage(currentPage + 1);
              if(!(paginationCount.slice(0, -1).slice(paginationSlice.start, paginationSlice.end).length < 4)) {
                setPaginationSlice({start: paginationSlice.start + 1, end: paginationSlice.end + 1});
              }
            }
            } 
            className={cn({dashboard__ordersSection__table__footer__pagination__disabled: currentPage === paginationCount.length})}
            disabled={currentPage === paginationCount.length}
          >
            Next »
          </button>
        </div>
      )}
            </div>
          </div>

            <Modal 
              handleModal={handleModal}
              isModal={isModal}
              className="dashboard__datepicker"
              message={
                <FullDatePicker 
                  setStart={setStart} 
                  setEnd={setEnd} 
                  handleModal={handleModal} 
                  handleGetInformations={handleGetInformations}
                  profits={profits}
                />
              }
            />
        </div>
    );
};

export default Dashboard;