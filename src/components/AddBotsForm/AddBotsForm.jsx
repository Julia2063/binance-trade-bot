import React, { useEffect, useRef, useState } from 'react';
import ElementWithExplain from '../ElementWithExplain/ElementWithExplain';
import cn from 'classnames';

import { TbCaretDown } from "react-icons/tb";

import './AddBotsForm.scss';
import CustomButton from '../CustomButton/CustomButton';

import { SiBinance } from "react-icons/si";
import { useOnClickOutside } from '../../helpers/hooks/useOnClickOutside';
import { createNewBot, db, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';

import { toast } from "react-toastify";
import Input from '../Input/Input';


function AddBotsForm({ handleModal, setTabIndex, isUpdateLimit }) {

    const selectValues = ['Choose exchange -', 'Demo', 'Binance'];
    const [exchange, setExchange] = useState(selectValues[0]);
    const [available, setAvailable] = useState(0);
    const [fund, setFund] = useState(0);
    const [isInput, setIsInput] = useState(false);
    const { user } = useContext(AppContext);

    console.log(fund);

    useEffect(() => {
      setAvailable(user.balanceUSDT);
    }, [user]);

    useEffect(() => {
      if(isUpdateLimit) {
        setFund(user.tradingLimit);
      }
    }, [])

    const handleChange = (e) => {
      if(e.target.value.match(/[^0-9]/g)){
        e.target.value = e.target.value.replace(/[^0-9]/g, "") ;
       };
      switch (true) {
        case +e.target.value < 0: 
          setFund(0);
          break;
      
        default:
          setFund(+e.target.value);
          break;
      }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (exchange !== "Demo" && user.BinanceApiKey.length === 0) {
          toast.warning("Connect to the exchange, please!");
          setTabIndex(2);
          handleModal();
          return;
        };

        try {
          /* await createNewBot(fund, user.uid, exchange); */
          await updateFieldInDocumentInCollection('users', user.idPost, 'tradingLimit', fund);
          isUpdateLimit 
          ? toast.success('Fund has been updated!')
          : toast.success('Bot has been created!');
          
          /* setBotAdded(botAdded + 1); */
        } catch (error) {
          console.log(error);
        }
        
        handleModal();
    };

    
    return (
       <form className="addBotsForm" onSubmit={(e) => handleSubmit(e)}>
        <div className="addBotsForm__section">
            <p className="addBotsForm__label">1. Accet</p>
            <ElementWithExplain 
              title="Exchange"
              text="Connect your exchanges in settings or use a simulated account using Paper Trading."
            />
            <Input
              selectValues={selectValues}
              value={exchange}
              setValue={setExchange}
              disabled={isUpdateLimit}
              className={'input--dark'}
            />
        </div>
        <div className="addBotsForm__section">
            <p className="addBotsForm__label">2. Trade Parameters</p>
            <ElementWithExplain 
              title="Fund Allocation"
              text="Maximum initial funds set aside for the bot. If this parameter remains equal to zero, trading will be carried out for the entire sum of the exchange deposit"
            />
            <div 
              className="input input--dark"
              onClick={() => setIsInput(true)}
            >
                {isInput 
                ? <input 
                    value={fund}
                    onChange={(e) => handleChange(e)}
                    onBlur={() => setIsInput(false)}
                />
               
                : fund}
                <button 
                  className="input__button2 input__button2--1"
                  onClick={() => setFund(fund + 10)}
                  type='button'
                >
                    <TbCaretDown width={11} height={20}/>
                </button>
                <button 
                  className="input__button2 input__button2--2"
                  onClick={() => setFund(fund - 10)}
                  type='button'
                  disabled={fund === 0}
                >
                    <TbCaretDown width={11} height={20}/>
                </button>
            </div>
            <div>
                {`Available: ${available} USDT`}
            </div>
        </div>
          <CustomButton 
            title={isUpdateLimit ? "Change limit" : "Create bot"}
            customClass="addBotsForm__submit"
          />
        
       </form>
    );
};

export default AddBotsForm;