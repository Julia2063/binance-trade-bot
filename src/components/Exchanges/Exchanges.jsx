import React, { useEffect } from 'react';
import './Exchanges.scss';
import cn from 'classnames';
import { useState } from 'react';

import ElementWithExplain from '../ElementWithExplain/ElementWithExplain';
/* import Binance from '../Binance/Binance'; */



import { FaRegCopy } from "react-icons/fa";
import { db, updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { toast } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import ExchangeItem from '../ExchangeItem/ExchangeItem';
import Input from '../Input/Input';


function Exchanges() {

    const selectValues = ['Choose exchange -', 'Binance'];
    const [exchange, setExchange] = useState(null);
    const [keys, setKeys] = useState({});

    const [exchangeConnect, setExchangeConnect] = useState(false);
    const [isExchange, setIsExchange] = useState(false);
    

    const { user } = useContext(AppContext);

    const handleChange = (fieldName, newValue) => {
        let newKeys = {
            ...keys,
            [fieldName]: newValue,
        }
        setKeys(newKeys);
    };

    const getBalance = async () => {
        try {
            await updateFieldInDocumentInCollection('users', user.idPost, 'command', 'CheckKeys');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(user.balanceUSDT === 0 && user.BinanceApiKey.length > 0) {
            getBalance();
        console.log(user.BinanceApiKey);
        };
    }, [user.BinanceApiKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(user.error.length > 0) {
                await updateFieldInDocumentInCollection('users', user.idPost, `error`, ''); 
            };
            await updateFieldInDocumentInCollection('users', user.idPost, `${exchange}ApiKey`, keys.apiKey);
            await updateFieldInDocumentInCollection('users', user.idPost, `${exchange}SecretKey`, keys.secretKey);
            
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
    }, [user]);
    
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

                        <Input
                          selectValues={selectValues}
                          value={exchange ? exchange : exchangeConnect ? "Binance" : selectValues[0]}
                          setValue={setExchange}
                          disabled={exchangeConnect}
                          className={cn('input--gray', {
                            disabled: exchangeConnect,
                          })}
                        />
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