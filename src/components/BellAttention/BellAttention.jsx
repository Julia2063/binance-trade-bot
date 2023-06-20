import React from 'react';
import './BellAttention.scss';

function BellAttention({ isAttention }) {
    return (
        <div className='bellAttention'>
           <svg width={20.25} height={23.63}>
                <circle 
                  className="st0" 
                  cx="16.3" 
                  cy="5.1" 
                  r="3.9" 
                  fill={isAttention ? 'red' : 'white'}/>
                <path fill="#fff" className="st0" d="M18,12.7c0-0.9-0.8-1.5-1.7-1.5l0,0c-1.6,0-3.2-0.7-4.4-1.8c-1.2-1.2-1.8-2.7-1.8-4.4c0-1.3,0.4-2.5,1.1-3.5
	            c0.3-0.5,0.3-1.1-0.2-1.3l0,0C10.8,0.1,10.4,0,10.1,0C8.9,0,7.9,1,7.9,2.2l0,0c0,0.2-0.1,0.4-0.3,0.4c-3.2,1.1-5.3,4.1-5.3,7.4v5.2
	            c0,1-0.4,2-1.1,2.7l-0.9,0.9C0.1,19,0,19.2,0,19.5l0,0c0,0.4,0.4,0.8,0.8,0.8h18.7c0.4,0,0.8-0.4,0.8-0.8l0,0c0-0.2-0.1-0.4-0.2-0.6
	            l-1-1c-0.6-0.6-1-1.5-1-2.4V12.7z"/>
                <path fill="#fff" className="st0" d="M10.1,23.6c0.5,0,0.9-0.1,1.2-0.4c1-0.7,0-1.9-1.2-1.9H9.6c-1,0-1.8,0.9-1.1,1.6l0,0C9,23.4,9.5,23.6,10.1,23.6
	            z"/>
            </svg>
        </div>
    );
};

export default BellAttention;