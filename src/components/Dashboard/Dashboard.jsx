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



function Dashboard() {
    const { user } = useContext(AppContext);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const [profits, setProfits] = useState([]);
    const [orders, setOrders] = useState([]);

    const [isModal, setIsModal] = useState(false);

    const handleGetInformations = async () => {
      setProfits([]);
        try {
          updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetProfitH')
          .then(res => {
            onSnapshot(doc(db, "profits_hour", user.idPost), (doc) => {
              setProfits(Object.entries(doc.data()).sort((a, b) => a[0] - b[0]) );
            });    
          });
            setTimeout(() => {
              updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetOrders')
                .then(res => {
            onSnapshot(doc(db, "orders", user.idPost), (doc) => {
              if(doc.data()) {
                setOrders( Object.entries(doc.data()));
              }
             
            });    
          });
            }, 500);
           
        } catch (error) {
            console.log(error);
        }
    };

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

    console.log(orders);
    console.log(profits);
    console.log(start, end);
    

    return (
        <div className="work-page__container">
          <h1 className="work-page__title dashboard__title">
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
                  customClass="dashboard__refresh"
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
                  }).filter(el => (start?.toString().length > 0 ? el > start : el) && (end.toString().length > 0 ? el <= new Date(end).setDate(end.getDate() + 1) : el)).map(el => format(el, 'HH:mm dd.MM.yy'))
                    : profits.map(el => {
                        
                      return format(new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`)), 'HH:mm dd.MM.yy');
                    })} 
                      profit={profits.map((el) => el[1]).map((el, i, arr) => el + user.tradingLimit + arr.slice(0, i).reduce(function(sum, elem) {
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
                      && `$${profits.map(el => el[1]).reduce((a, b) => a + b, 0)}` 
                    }
                  </span>
                  <span className="dashboard__chartSection__datas__item__value--proc">
                    {profits.length > 0 &&
                      Math.sign(profits.map(el => el[1]).reduce((a, b) => a + b, 0)) / user.tradingLimit}
                  </span>
                </div>
              </div> 
              <div className="dashboard__chartSection__datas__item">
                <div className="dashboard__chartSection__datas__item__title">
                  Current balance
                </div>
                <div className="dashboard__chartSection__datas__item__value">
                  <span>gberb</span>
                </div>
              </div> 
            </div>
          </div>

            <Modal 
              handleModal={handleModal}
              isModal={isModal}
              className="dashboard__datepicker"
              message={
                <FullDatePicker setStart={setStart} setEnd={setEnd} handleModal={handleModal} />
              }
            />
        </div>
    );
};

export default Dashboard;