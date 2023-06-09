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
import { updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';

import { useNavigate } from 'react-router-dom';


function Bots({ setTabIndex }) {
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Active');
    const [isUpdateLimit, setIsUpdateLimit] = useState(false);

    const { user } = useContext(AppContext);

    const navigate = useNavigate();

    const handleAddBot = () => {
      if(user.email.length > 0) {
        setIsUpdateLimit(false);
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
    
    return (
        <div className="tabs-page__container bots__container">
        
        
          {user.tradingLimit === 0 &&
           <div className="bots__actions">
               {/*  <BellAttention isAttention/> */}
              
               <CustomButton 
                  title='Create Bot' 
                  customClass='addBotButton' 
                  img={<AiOutlinePlus />}
                  handleClick={handleAddBot}
                />
            </div>
          }
            
       

        <div className="row bots__row">
           <div className="bots__tabs">
              {/* <div className="bots__tabs__list">
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
              </div> */}

              {activeTab === 'Active' && (
                <div className='bots__tabs__tabPanel'>
                    <div className='row bots__tabs__tabPanel__title'>
                      <div className='col-1'>#</div>
                      <div className='col'>Bot Name</div>
                      {/* <div className='col'>Pair</div>
                      <div className='col'>Status</div>
                      <div className='col'>Growth</div> */}
                      <div className='col'>Fund Allocation</div>
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
                      <div className='col-2 center'>Action</div>
                    </div>
                     {user.tradingLimit > 0 &&  
                       <Bot setIsModal={setIsModal} setIsUpdateLimit={setIsUpdateLimit} setTabIndex={setTabIndex} />
                     }
                </div>

              )}
              {/* {activeTab === 'Inactive' && (
                 <div className='bots__tabs__tabPanel'>
                 <div className='row bots__tabs__tabPanel__title'>
                   <div className='col-1'>#</div>
                   <div className='col'>Bot Name</div>
                   <div className='col'>Pair</div>
                   <div className='col'>Status</div>
                   <div className='col'>Growth</div>
                   <div className='col'>Fund Allocation</div>
                   <div className='col'>
                     <label class="switch">
                       <input type="checkbox" />
                       <span class="slider round slider--all"></span>
                     </label>
                     <p>On/Off</p>
                   </div>
                   <div className='col-3 center'>Action</div>
                 </div>
                   <div className="bots__bots">
                     {bots.filter(bot => !bot.turn).map((bot, i) => {
                         return (
                             <Bot bot={bot} i={i} key={bot.name}/>
                         )
                     })}
                   </div>

             </div>
              )} */}
              
              
           </div>
        </div>
       
        <Modal 
          handleModal={handleModal}
          isModal={isModal}
          message={
            <AddBotsForm 
              handleModal={handleModal} 
              setTabIndex={setTabIndex} 
              isUpdateLimit={isUpdateLimit}
            />
          }
          
        />
       </div>
    );
};

export default Bots;