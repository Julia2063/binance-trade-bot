import React, { useState } from 'react';
import './Bot.scss';

import cn from 'classnames';

import { FaEdit } from "react-icons/fa";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { useEffect } from 'react';


function Bot({ setIsUpdateLimit, setIsModal, setTabIndex}) {
    const { user } = useContext(AppContext);
    const [on, setOn] = useState(false);

    useEffect(() => {
        setOn(user.status);
    }, [user]);
    console.log(on);

    const handleChange = async ({ target: { checked } }) => {
        try {
            if(user.error.length === 0) {
                 await updateFieldInDocumentInCollection('users', user.idPost, 'status', checked);
            }
        
        } catch (error) {
         console.log(error);
        }
     };
    
    const handleChangeLimit = () => {
        setIsUpdateLimit(true);
        setIsModal(true);
    };

    return (
        <div className={cn('bot row', {
            'bot--off': !on,
        })} >
            <div className='col-1'>1</div>
            <div className='col'>BinanceBot</div>
            <div className='col'>{`${user.tradingLimit} USDT` }</div>
            <div className='col'>
            <label class="switch">
                <input 
                  type="checkbox" 
                  onChange={handleChange}
                  checked={on}
                />
                <span class="slider round"></span>
            </label>
            </div>
            <div className='col-2 center'>
                <div className="row">
                 
                    <button
                      className="col"
                      onClick={handleChangeLimit}
                    >
                        <FaEdit />
                    </button>
                    <button className="col" onClick={() => setTabIndex(0)}>
                        < BsFillBarChartLineFill  />
                    </button>
                </div>
            </div>
        </div>
        
    );
};

export default Bot;