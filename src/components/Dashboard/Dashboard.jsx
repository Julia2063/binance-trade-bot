import { useState } from 'react';
import CustomButton from "../CustomButton/CustomButton";
import './Dashboard.scss';

import { Chart } from '../Chart/Chart';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { db, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { collection, doc, onSnapshot } from 'firebase/firestore';
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
    const { user, getedOrders, setGetedOrders, history, setHistory } = useContext(AppContext);
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
    const [chartData, setChartData] = useState([]);
    const [visibledHistory, setVisibledHistory] = useState([]);

    const handleGetInformations = () => {
      setGetedOrders([]);
      if(!user.status) {
        return;
      };
        try {
              updateFieldInDocumentInCollection('users', user.idPost, 'command', user.lastOrderTime ?  `GetOrders|start_time=${user.lastOrderTime + 1}`: 'GetOrders')
              .then(res => {
                onSnapshot(doc(db, 'orders', user.idPost), (doc) => {
                  if(doc.data()) {
                    setGetedOrders(doc.data() ? Object.entries(doc.data()).sort((a, b) => b[1].closed_at - a[1].closed_at).map(el => el[1]) : []);
                  }
               });
               updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetHistory')
               .then(r => {
                onSnapshot(doc(db, 'history', user.idPost), (doc) => {
                  if(doc.data()) {
                    setHistory(doc.data() ? Object.entries(doc.data()).sort((a, b) => a[0] - b[0]) : [] );
                  }
               });
               })    
          }); 
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
      if (getedOrders.length === 0) {
        console.log('getInfo');
        handleGetInformations();
      };
    }, [user.idPost]);

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
        
        const unsubscribeOrd = onSnapshot(doc(db, 'orders', user.idPost));
        const unsubscribeHis = onSnapshot(doc(db, 'history', user.idPost));

        return (() => {
          unsubscribeOrd();
          unsubscribeHis();
      });
    }
  },[]);

    useEffect(() => {
      if(start?.toString().length > 0 || end?.toString().length > 0) {

        const periodOrders = getedOrders.filter(el => (start ? new Date(el.closed_at) >= start :  new Date(el.created_at)) && (end ? new Date(el.closed_at) <= new Date(end).setDate(end?.getDate() + 1) : new Date(el.closed_at)));
        const periodHistory = history.map(el => {
          return [new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`)), el[1]]
          }).filter(el => {
            return (start ? new Date(el[0])  >= new Date(start) : el[0]) && (end ? new Date(el[0]) <= new Date(end).setDate(end?.getDate() + 1) : el[0]);
          }).map(el => [format(el[0], 'yyyyMMddHH'), el[1]]);
            
        
        setOrders(periodOrders);
        setVisibledHistory(periodHistory);
        setIncome(periodOrders.map(el => +el.profit_stable).reduce((a, b) => a + b, 0).toFixed(2));
        setIncomePerc(Math.abs((periodOrders.map(el => +el.profit_stable / (el.limit === 'None' ? (user.tradingLimit) : (+el.limit))).reduce((a, b) => a + b, 0)) * 100).toFixed(2));
      } else {
        setIncome(getedOrders.map(el => +el.profit_stable).reduce((a, b) => a + b, 0).toFixed(2));
        setIncomePerc(Math.abs((getedOrders.map(el => +el.profit_stable / (el.limit === 'None' ? (user.tradingLimit) : (+el.limit))).reduce((a, b) => a + b, 0)) * 100).toFixed(2));
        setOrders(getedOrders);
        setVisibledHistory(history);
      }
    }, [getedOrders, history, start, end]);

    const handleModal = () => {
      setIsModal(false);
    };

    const getPeriod = () => {
      switch(true) {
        case (start === end && start === new Date()):
        case (new Date(start).getDate() === new Date().getDate()):
          return 'Today';
        case ((start !== end) && (end !== null)): 
          return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
        case ((!start) && (!end)): 
          return 'All';  
        case ((start.length !== 0) && (start === end)): 
          return `${format(start, 'dd/MM/yyyy')}`;
        

        default: 
          return;
      }
    };

    const handleReverse = (arr) => {
      let a = [];
      for (let i = 0; i < arr.length; i++){
         a[i] = arr[(arr.length - 1) - i];
      };
      return a;
    };

    const getOrdersByHours = () => {
      if(orders.length > 0) {
        const newArray = [];
        const redusedOrders = handleReverse(orders).map(el => {
          return {
            date: format(new Date(el.closed_at), 'HH dd.MM.yy'),
            profit: +el.profit_stable,
            limit: el.limit === 'None' ? user.tradingLimit : +el.limit,
          };
        });
      
      for(let i = 0; i < redusedOrders.length; i++) {
        const arrOrdersHour = redusedOrders?.filter(el => {
          return el?.date === redusedOrders[i].date
        });
        const orderHour = {
          date: redusedOrders[i].date, 
          profit: arrOrdersHour.map(el => el.profit).reduce(function(sum, elem) {
            return sum + elem}, 0),
          limit: arrOrdersHour[0].limit
        };
        newArray.push(orderHour);
      };

      const result = {};

      for (const item of newArray) {
        if(!result[item.date]) {
          result[item.date] = [item.profit, item.limit];
        } else {
          continue;
        }
          
      };
      return(Object.entries(result).sort((a, b) => new Date(a.date) - new Date(b.date)));
      }
    };

    useEffect(() => {
      const data = getOrdersByHours();
      setChartData(data);
    }, [orders]);

    console.log(visibledHistory);

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
                  times={chartData?.map(el => el[0].split(' '))}

                  profit={chartData?.map((el, i, arr) => el[1][0] + el[1][1] + arr.map(el => el[1][0]).slice(0, i).reduce(function(sum, elem) {
                    return sum + elem}, 0))} 

                  balance={visibledHistory.length > 0 && visibledHistory?.map(el => {
                    return  [new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`)), el[1]];
                  }
                    ).filter(el => {
                    return chartData?.map(e => e[0]).includes(format(el[0], 'HH dd.MM.yy') )
                  }).map(el => +(el[1].balance + el[1].usdt).toFixed(2))}
            />
            </div>
            
            <div className="dashboard__chartSection__datas">
              <div className="dashboard__chartSection__datas__item">
                <div className="dashboard__chartSection__datas__item__title">
                  Income
                </div>
                <div className="dashboard__chartSection__datas__item__value">
                  <span>
                    {orders.length > 0 
                      && `$${income}` 
                    }
                  </span>
                  <span className={cn({
                    "dashboard__chartSection__datas__item__value--profit": orders.map(el => +el.profit_stable).reduce((a, b) => a + b, 0) > 0,
                    "dashboard__chartSection__datas__item__value--min": orders.map(el => +el.profit_stable).reduce((a, b) => a + b, 0) < 0,
                  })} >
                    {getedOrders.length > 0 &&
                      `${orders.map(el => +el.profit_stable).reduce((a, b) => a + b, 0) > 0 ? '+' : '-'}${incomPerc}%` 
                    }
                  </span>
                </div>
              </div> 
              <div className="dashboard__chartSection__datas__item">
                <div className="dashboard__chartSection__datas__item__title">
                  Current balance
                </div>
                <div className="dashboard__chartSection__datas__item__value">
                  <span>{history.length > 0 && `$${(history[history.length - 1][1].balance + history[history.length - 1][1]?.usdt).toFixed(2)}` }</span>
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
              {visibleOrders.map(el => <OrderLine data={el} key={el.closed_at} />)}
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
                  orders={orders}
                />
              }
            />
        </div>
    );
};

export default Dashboard;