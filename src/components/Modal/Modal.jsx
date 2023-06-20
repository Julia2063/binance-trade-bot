import React, { useEffect } from 'react';
import './Modal.scss'

import { CSSTransition } from 'react-transition-group';
import classes from './Modal.module.scss';


export const Modal = ({ message, handleModal, isModal }) => {
  const transitionClasses = {
    enter: classes.exampleEnter,
    enterActive: classes.exampleEnterActive,
    exit: classes.exampleExit,
    exitActive: classes.exampleExitActive,
  };

  const closeModalKeyDown = (e) => {
    if (e.key === 'Escape') {
    handleModal()
    };
  };
  
  useEffect(() => {
     document.addEventListener('keydown', closeModalKeyDown);

     return (() => closeModalKeyDown) ;
  }, []);
 

    return (
      <>
        <CSSTransition in={isModal} timeout={750} classNames={transitionClasses} unmountOnExit>
        <div className="modal">
        <div className="modal__window">
          <button className="modal__close" onClick={handleModal}>
                <svg fill="#fff" id="Capa_1" width={20} height={20} data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612.02 612.04"><defs></defs><g id="cross"><path className="cls-1" d="M397.5,306,593.08,110.43A64.69,64.69,0,0,0,501.6,19L306,214.55,110.44,19A64.69,64.69,0,0,0,19,110.46L214.54,306,19,501.61a64.69,64.69,0,0,0,91.48,91.48L306,397.52,501.6,593.09a64.69,64.69,0,0,0,91.48-91.48Z" transform="translate(-0.01 0)"/></g></svg>
          </button>
          <div className="modal__body">
            {message}
          </div>
        </div>
      </div>
      </CSSTransition>
      <CSSTransition in={isModal} timeout={50} unmountOnExit>
        <div className="modal__shadow" />
      </CSSTransition>
      
    </>
  );
};