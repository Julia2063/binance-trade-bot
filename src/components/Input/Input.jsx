import cn from 'classnames';
import { useState } from 'react';

import { TbCaretDown } from "react-icons/tb";
import { useOnClickOutside } from '../../helpers/hooks/useOnClickOutside';
import { useRef } from 'react';

import './Input.scss';

function Input ({ value, setValue, selectValues, disabled, className }) {
    
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const inputRef = useRef();

    useOnClickOutside(inputRef, () => setIsSelectOpen(false));

    return (
        <div className={cn("input", className, {'input--open':  isSelectOpen})}  ref={inputRef}>
            {value}
            <button 
                className={cn("input__button1", {
                    'input__button1--open': isSelectOpen,
                    'input__button1--disabled': disabled,

                  })} 
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  type='button'
                  disabled={disabled}
                >
                    <TbCaretDown width={11} height={20}/>
                </button>
                {isSelectOpen && (
                    <div className={cn('input__drop addBotsForm__input__drop', {'input__drop--open': isSelectOpen})} >
                      {selectValues.slice(1).map(el => {
                        return (
                            <div 
                                key={el}
                                className="input__item"
                                onClick={() => {
                                setValue(el);
                                setIsSelectOpen(false);
                              }}
                            >
                                {el}
                            </div>
                        )
                      })}
                    </div>
                ) }
      </div>
    )
}

export default Input;

