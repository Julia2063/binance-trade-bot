import React from 'react';


function CustomButton({ title, customClass, handleClick, img, ...props}) {
    return (
        <button 
          className={customClass}
          onClick={handleClick}
          {...props}
        >
          <span>{title} {img}</span>
        </button>
        
    );
}

export default CustomButton;
