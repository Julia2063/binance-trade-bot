import React, { useState } from 'react';
import './Bots.scss';
import ElementWithExplain from '../ElementWithExplain/ElementWithExplain';
import BellAttention from '../BellAttention/BellAttention';
import CustomButton from '../CustomButton/CustomButton';
import { AiOutlinePlus } from "react-icons/ai";
import { Modal } from '../Modal/Modal';
import AddBotsForm from '../AddBotsForm/AddBotsForm';

import cn from 'classnames';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import Bot from '../Bot/Bot';
import { db, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


function Bots({ setTabIndex }) {
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Active');

    const { bots, user } = useContext(AppContext);

    const navigate = useNavigate();

    const handleAddBot = () => {
      if(user.email.length > 0) {
        setIsModal(true);
      } else {
        navigate('/login')
      }
      
    };

    const handleModal = () => {
        setIsModal(false);
    };

    const handleTabs = (event) => {
      setActiveTab(event.currentTarget.title);
    };

    console.log(bots);

    const handleChange = async ({ target: { checked } }) => {
       try {
        await updateFieldInDocumentInCollection('users', user.idPost, 'status', checked);
       } catch (error) {
        console.log(error);
       }
    };

    console.log(user.status);
    
    return (
        <div className="work-page__container bots__container">
        <div className="row bots__row">
            <div className="col-2 bots__col">
                <ElementWithExplain title="Profit"/>
                <div>$0.00</div>
            </div>
            <div className="col-2 bots__col">
                <div>Tot. Balances</div>
                <div>$0.00</div>
            </div>
            <div className="col-8 bots__col">
                <BellAttention isAttention/>
                <CustomButton 
                  title='Create Bot' 
                  customClass='addBotButton' 
                  img={<AiOutlinePlus />}
                  handleClick={handleAddBot}
                />
            </div>
        </div>

        <div className="row bots__row">
           <div className="bots__tabs">
              <div className="bots__tabs__list">
                <div 
                  className={cn("bots__tabs__tab", {"bots__tabs__tab--active": activeTab === 'Active' })}
                  title="Active"
                  onClick={(e) => {handleTabs(e)}}
                >
                  Active
                </div>
                <div 
                  className={cn("bots__tabs__tab", {"bots__tabs__tab--active": activeTab === 'Inactive' })} 
                  title="Inactive"
                  onClick={(e) => {handleTabs(e)}}
                >
                  Inactive
                </div>
              </div>

              {activeTab === 'Active' && (
                <div className='bots__tabs__tabPanel'>
                    <div className='row bots__tabs__tabPanel__title'>
                      <div className='col-1'>#</div>
                      <div className='col'>Bot Name</div>
                      {/* <div className='col'>Pair</div>
                      <div className='col'>Status</div>
                      <div className='col'>Growth</div> */}
                      <div className='col'>Net Profit</div>
                      <div className='col'>
                       {/*  <label className="switch">
                          <input 
                            type="checkbox"
                            onChange={handleChange}
                            value={user.status}
                          />
                          <span className="slider round slider--all"></span>
                        </label> */}
                        <p>On/Off</p>
                      </div>
                      <div className='col-3 center'>Action</div>
                    </div>
                      <div className="bots__bots">
                        {/* {bots.filter(bot => bot.turn).map((bot, i) => {
                            return (
                                <Bot bot={bot} i={i} key={bot.name}/>
                            )
                        })} */}
                      </div>
   
                </div>
              )}
              {activeTab === 'Inactive' && (
                 <div className='bots__tabs__tabPanel'>
                 <div className='row bots__tabs__tabPanel__title'>
                   <div className='col-1'>#</div>
                   <div className='col'>Bot Name</div>
                  {/*  <div className='col'>Pair</div>
                   <div className='col'>Status</div>
                   <div className='col'>Growth</div> */}
                   <div className='col'>Net Profit</div>
                   <div className='col'>
                     {/* <label class="switch">
                       <input type="checkbox" />
                       <span class="slider round slider--all"></span>
                     </label> */}
                     <p>On/Off</p>
                   </div>
                   <div className='col-3 center'>Action</div>
                 </div>
                   <div className="bots__bots">
                     {/* {bots.filter(bot => !bot.turn).map((bot, i) => {
                         return (
                             <Bot bot={bot} i={i} key={bot.name}/>
                         )
                     })} */}
                   </div>

             </div>
              )}
              
              
           </div>
        </div>
       
        <Modal 
          handleModal={handleModal}
          isModal={isModal}
          message={<AddBotsForm handleModal={handleModal} setTabIndex={setTabIndex} />}
          
        />
       </div>
    );
};

export default Bots;