import React, { useEffect } from 'react';
import './Exchanges.scss';
import cn from 'classnames';
import { useState } from 'react';

import { TbCaretDown } from "react-icons/tb";
import ElementWithExplain from '../ElementWithExplain/ElementWithExplain';
/* import Binance from '../Binance/Binance'; */

import { SiBinance } from "react-icons/si";
import { useRef } from 'react';
import { useOnClickOutside } from '../../helpers/hooks/useOnClickOutside';

import { FaRegCopy } from "react-icons/fa";
import { db, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { toast } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import ExchangeItem from '../ExchangeItem/ExchangeItem';


function Exchanges() {

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const selectValues = [[<SiBinance color='orange'/>,'Binance']];
    const [exchange, setExchange] = useState(null);
    const [keys, setKeys] = useState({});

    const [exchangeConnect, setExchangeConnect] = useState(false);
    const [isExchange, setIsExchange] = useState(false);
    

    const { user } = useContext(AppContext);

    const inputRef = useRef();

    useOnClickOutside(inputRef, () => setIsSelectOpen(false));

    const handleChange = (fieldName, newValue) => {
        let newKeys = {
            ...keys,
            [fieldName]: newValue,
        }
        setKeys(newKeys);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateFieldInDocumentInCollection('users', user.idPost, `${exchange}ApiKey`, keys.apiKey);
            await updateFieldInDocumentInCollection('users', user.idPost, `${exchange}SecretKey`, keys.secretKey);
            await updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetBalance');
            toast.success("Perfect! Your API keys has been added. Let's create a bot)");
            setExchange(null);
            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(user.BinanceApiKey.length > 0 && user.error.length === 0) {
            setExchangeConnect(true);
        } else {
            setExchangeConnect(false);
        }
        if(user.BinanceApiKey.length > 0) {
            setIsExchange(true);
        }
    }, [user])

    console.log(exchangeConnect);
    
    return (
        <div className="work-page__container exchanges__container">
           <h1 className="work-page__title">Exchanges</h1> 
           <div className="row">
                <div className="col">
                    <div className="exchanges__label">
                        Connect New Exchange
                        <p>Choose among the top crypto currency exchanges</p>
                    </div>
                    <div className="exchanges__inputGroop">
                        <div className="input exchanges__input" ref={inputRef}>
                            {exchange ? exchange : (
                            <span className="exchanges__placeholder">Chouse your exchange</span>
                        )}
                        <button 
                            className={cn("input__button1", {
                                'input__button1--open': isSelectOpen,
                                'input__button1--disabled': exchangeConnect,
                            })} 
                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                            type='button'
                            disabled={exchangeConnect}
                        >
                            <TbCaretDown width={11} height={20}/>
                        </button>
                        {isSelectOpen && (
                            <div className='input__drop exchanges__input__drop'>
                                {selectValues.map(el => {
                                    return (
                                        <div 
                                            className="input__item"
                                            onClick={() => {
                                            setExchange(el[1]);
                                            setIsSelectOpen(false);
                                         }}
                                        >
                                            {el}
                                        </div>
                                    )})}
                            </div>
                           )}
                        </div>
                        <ElementWithExplain />
                    </div>
                    {/* <p className="center">or</p>
                    <div className="exchanges__inputGroop">
                        <Binance />
                        <ElementWithExplain />
                    </div> */}

                    
                    
                </div>
                <div className="col">
                    <div className="exchanges__label">
                        Connected Exchanges
                        {isExchange
                        ? (
                            <>
                                <p>You are currently trading on the following platforms</p>
                                <ExchangeItem />
                            </>
                        ) : (
                            <p>You haven't connected any exchange yet.</p>
                        )} 
                    </div>
                    
                </div>
           </div>
           
           <CSSTransition in={exchange} timeout={300} classNames="item" unmountOnExit>
                <div className="row">
                    <div className="col">
                        <form className="exchanges__keys" onSubmit={(e) => handleSubmit(e)}>
                            <div className="exchanges__inputGroop">
                                <label>
                                    <p>API Key</p>
                                    <input 
                                      className="exchanges__keys"
                                      placeholder="eg. 43435453324243545455"
                                      onChange={(e) => handleChange('apiKey', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="exchanges__inputGroop">
                                <label>
                                    <p>Secret Key</p>
                                    <input 
                                      className="exchanges__keys"
                                      placeholder="eg. 43435453324243545455"
                                      onChange={(e) => handleChange('secretKey', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="exchanges__inputGroop">
                                <label>
                                    <p>IP Address to Whitelist</p>
                                    <input 
                                      className="exchanges__keys"
                                      placeholder="eg. 43435453324243545455"
                                    />
                                    <button className="exchanges__copy" type="button">
                                        <FaRegCopy />
                                    </button>
                                </label>
                                <ElementWithExplain />
                            </div>
                            <div className="exchanges__inputGroop">
                                <button 
                                  type="submit"
                                  className="btn-action exchanges__submit" 
                                >
                                    Connect
                                </button>
                            </div>
                            <div className="exchanges__inputGroop">
                                berghwe4
                            </div>
                            
                        </form>
                    </div>
                    <div className="col" />
                    
                </div>
                        
                </CSSTransition>
        </div>
    );
};

export default Exchanges;