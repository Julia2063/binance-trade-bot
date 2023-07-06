import { useState, useRef } from 'react';
import { useOnClickOutside } from '../../helpers/hooks/useOnClickOutside';
import arrow from '../../assets/images/icon/arrow.svg';

import cn from 'classnames';

import './InfoDrop.scss';

export const InfoDrop = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const refInfoDrop = useRef();
  
    useOnClickOutside (refInfoDrop, () => setIsOpen(false));
  
    const toggle = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className='infoDrop' ref={refInfoDrop}>
        <label>
          <div className='infoDrop__title'
          >
            {item.title}
            <button 
              className='infoDrop__toggler' 
              onClick={toggle}
            >
              <img 
                src={arrow} 
                alt="select" 
                className={cn('infoDrop__toggler__arrow', {'infoDrop__toggler__arrow--open' : isOpen})}
              />
            </button>
          </div>
          {isOpen && (
            <div className='infoDrop__text'>
               {item.text}
            </div>
          )}
        </label>
      </div>
    );
  };
