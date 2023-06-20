import React, { useState } from 'react';
import './ElementWithExplain.scss';
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { CSSTransition } from 'react-transition-group';
import classes from './ElementWithExplain.module.scss';


function ElementWithExplain({ title, text }) {
    const [show, setShow] = useState(false);

    const transitionClasses = {
        enter: classes.exampleEnter,
        enterActive: classes.exampleEnterActive,
        exit: classes.exampleExit,
        exitActive: classes.exampleExitActive,
      };

    const handleShow = () => {
        setShow(true);
    };

    const handleHide = () => {
        setShow(false);
    };

    return (
        <div className='elementWithExplain'>
            <p>{title}</p>
            <div 
              className='elementWithExplain__tooltip'
              onMouseEnter={handleShow}
              onMouseLeave={handleHide}
            >
                <AiOutlineQuestionCircle />
                <CSSTransition in={show} timeout={750} classNames={transitionClasses} unmountOnExit>
                   <div className='elementWithExplain__tooltip__body'>
                     {text}
                   </div>
                </CSSTransition>
                
                
            </div>
            
        </div>
    );
};

export default ElementWithExplain;