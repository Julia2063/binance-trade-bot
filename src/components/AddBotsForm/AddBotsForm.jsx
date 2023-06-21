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

function AddBotsForm({ handleModal, setTabIndex, isUpdateLimit }) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    

    const selectValues = [[<div />, "Demo"],[<SiBinance color='orange'/>,'Binance']];
    const [exchange, setExchange] = useState(selectValues[0][1]);
    const [available, setAvailable] = useState(1000);
    const [fund, setFund] = useState(0);
    const [isInput, setIsInput] = useState(false);
    const { user } = useContext(AppContext);

    const inputRef = useRef();

    console.log(fund);

    useEffect(() => {
      setAvailable(user.balanceUSDT);
    }, [user]);

    useEffect(() => {
      if(isUpdateLimit) {
        setFund(user.tradingLimit);
      }
    }, [])

    useOnClickOutside(inputRef, () => setIsSelectOpen(false));

    const handleChange = (e) => {
      if(e.target.value.match(/[^0-9]/g)){
        e.target.value = e.target.value.replace(/[^0-9]/g, "") ;
       };
      switch (true) {
        case +e.target.value < 0: 
          setFund(0);
          break;
        case +e.target.value > available:
          setFund(available);
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
          setTabIndex(1);
          handleModal();
        };

        if(fund === 0) {
          toast.warning('Set fund, please!');
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
            <div className="input addBotsForm__input" ref={inputRef}>
                {isUpdateLimit ? selectValues[1][1] : exchange}
                <button 
                  className={cn("input__button1", {
                    'input__button1--open': isSelectOpen,
                    'input__button1--disabled': isUpdateLimit,

                  })} 
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  type='button'
                  disabled={isUpdateLimit}
                >
                    <TbCaretDown width={11} height={20}/>
                </button>
                {isSelectOpen && (
                    <div className='input__drop addBotsForm__input__drop'>
                      {selectValues.map(el => {
                        return (
                            <div 
                              className="input__item"
                              onClick={() => {
                                setExchange(el[1]);
                                setIsSelectOpen(false);
                              }}
                            >
                                {el[0]}{el[1]}
                            </div>
                        )
                      })}
                    </div>
                ) }
            </div>
        </div>
        <div className="addBotsForm__section">
            <p className="addBotsForm__label">2. Trade Parameters</p>
            <ElementWithExplain 
              title="Fund Allocation"
              text="Maximum initial funds set aside for the bot."
            />
            <div 
              className="input addBotsForm__input"
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
                  disabled={fund === available}
                >
                    <TbCaretDown width={11} height={20}/>
                </button>
                <button 
                  className="input__button2 input__button2--2"
                  onClick={() => setFund(fund - 10)}
                  type='button'
                  disabled={fund <= 10}
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