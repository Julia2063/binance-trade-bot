import { useState } from 'react';
import CustomButton from "../CustomButton/CustomButton";
import './Dashboard.scss';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Chart } from '../Chart/Chart';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { db, getDocInCollection, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { format } from 'date-fns';



function Dashboard() {
    const { user } = useContext(AppContext);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [profits, setProfits] = useState([]);
    const [orders, setOrders] = useState([]);

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

    console.log(orders);
    console.log(profits);

    return (
        <div className="work-page__container dashboard__container">
           <h1 className="work-page__title dashboard__title">
              <p>Dashboard</p>
              <CustomButton
                title="Get Informations"
                customClass="addBotsForm__submit"
                handleClick={handleGetInformations}
              />
           </h1> 
           <div className="row">
                <div className="col">
                    <Chart 
                      times={(startDate.toString().length > 0 || endDate.toString().length > 0) 
                        ? profits.map(el => {
                        
                          return new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`))
                      }).filter(el => (startDate.toString().length > 0 ? el > startDate : el) && (endDate.toString().length > 0 ? el <= new Date(endDate).setDate(endDate.getDate() + 1) : el)).map(el => format(el, 'HH:mm dd.MM.yy'))
                        : profits.map(el => {
                        
                          return format(new Date([el[0].slice(0, 4), el[0].slice(4, 6), el[0].slice(6, 8)].join('/') + (` ${el[0].slice(8)}:00`)), 'HH:mm dd.MM.yy');
                      })} 
                      profit={profits.map((el) => el[1]).map((el, i, arr) => el + user.tradingLimit + arr.slice(0, i).reduce(function(sum, elem) {
	                  return sum + elem}, 0)) } />
                </div>
                <div className="col flex">
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                  -
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;