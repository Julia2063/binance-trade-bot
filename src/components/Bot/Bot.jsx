import React, { useState } from 'react';
import './Bot.scss';

import cn from 'classnames';

import { FaRegCopy, FaRegEdit} from "react-icons/fa";
import { HiOutlineEye } from "react-icons/hi";

function Bot({ bot, i }) {

    const [on, setOn] = useState(bot.turn);

    const handleChange = () => { 
        setOn(!on);   
    }; 


    return (
        <div className='bot row'>
            <div className='col-1'>{i + 1}</div>
            <div className='col'>{bot.name}</div>
            <div className='col'>{bot.pair}</div>
            <div className={cn("col bot__status",
              {"bot__status--wait": bot.status === "waiting for entry",
               "bot__status--ready": bot.status === "",
               "bot__status--work": bot.status === "deal in progress"
              })}>
                
                {bot.status}</div>
            <div className='col'>{`+${bot.growth}%`  }</div>
            <div className='col'>{`$${bot.profit}` }</div>
            <div className='col'>
            <label class="switch">
                <input 
                  type="checkbox" 
                  checked={on}
                  onChange={handleChange}
                />
                <span class="slider round"></span>
            </label>
            </div>
            <div className='col-3 center'>
                <div className="row">
                    <button className="col">
                        <FaRegCopy />
                    </button>
                    <button className="col">
                        <FaRegEdit />
                    </button>
                    <button className="col">
                        <HiOutlineEye />
                    </button>
                </div>
            </div>
        </div>
        
    );
};

export default Bot;