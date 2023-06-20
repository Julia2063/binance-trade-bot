import React from 'react';


function CustomButton({ title, customClass, handleClick, img}) {
    return (
        <button 
          className={customClass}
          onClick={handleClick}
        >
          <span>{title}  {img}</span>
        </button>
        
    );
}

export default CustomButton;
