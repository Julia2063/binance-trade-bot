import React from 'react';
import './ExchangeItem.scss';
import {SiBinance} from "react-icons/si";
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';

import { FaRegCopy } from "react-icons/fa";
import ElementWithExplain from '../ElementWithExplain/ElementWithExplain';

function ExchangeItem() {
    const { user } = useContext(AppContext);
    return (
        <div className='exchangeItem'>
            
                <div className='exchangeItem__logo'>
                    <SiBinance color='orange'/>
                    <span>BINANCE</span>
                </div>
                <div className='exchangeItem__info'>
                    <div className='exchangeItem__info__connect'>
                        <span>Banance</span>
                        {user.error.length === 0 
                        ? <span className='exchangeItem__info__connect--on'>live</span>
                        : <>
                            <span className='exchangeItem__info__connect--off'>
                                off
                                <div className='exchangeItem__info__connect--off__explain'>
                                    <ElementWithExplain text={user.error}/>
                                </div>
                            </span>
                           
                        </>
                        }
                    </div>
                    
                    <div className='exchangeItem__api'>{`APIKey: ${user.BinanceApiKey}`}</div>
                    <div className='exchangeItem__path'>
                        <div className='exchangeItem__path__content'>
                        <span>3.54654654.54654654.54654</span>
                        <button className='exchangeItem__path__copy'><FaRegCopy color='gray'/></button>
                        </div>
                        <button className='exchangeItem__path__remove'>Remove</button>
                    </div>
                    
                </div>
        
            
        </div>
    )
}

export default ExchangeItem;