import React, { useState } from 'react';
import './Bot.scss';

import cn from 'classnames';

import { FaEdit } from "react-icons/fa";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { useContext } from 'react';
import { AppContext } from '../../helpers/appContext';
import { updateFieldInDocumentInCollection } from '../../helpers/firebaseConfigAndControls';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


function Bot({ setIsUpdateLimit, setIsModal, setTabIndex}) {
    const { user } = useContext(AppContext);
    const [on, setOn] = useState(false);

    useEffect(() => {
        setOn(user.status);
    }, [user]);
  

    const handleChange = async ({ target: { checked } }) => {
        if (user.error.length !== 0) {
            toast.warning("You have some exchange error, please check your exchange connect!");
            return;
        };
        if (user.status) {
            await updateFieldInDocumentInCollection('users', user.idPost, 'status', checked);
            toast.success('Trade was suspended');
            return;
        }
            updateFieldInDocumentInCollection('users', user.idPost, 'command', 'GetBalance').then(async res => {
                if (user.balanceUSDT < 10) {
                    toast.warning("Start trading is not possible with a exchange balance of less than 10 USDT.  Please fill the ballance exchange, please");
                    return;
                } else if (user.balanceUSDT < 200) {
                    try {
                            await updateFieldInDocumentInCollection('users', user.idPost, 'status', checked);
                            toast.warning("Trading started, but we recommend refilling the Ballance Exchange, as the optimal deposit should be over 200 USDT");
                        } catch (error) {
                            console.log(error);
                        }
                } else {
                    try {
                    await updateFieldInDocumentInCollection('users', user.idPost, 'status', checked);
                    toast.success('Trading started');
                } catch (error) {
                    console.log(error);
                }}       
            })};

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
            <label className="switch">
                <input 
                  type="checkbox" 
                  onChange={handleChange}
                  checked={on}
                />
                <span className="slider round"></span>
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