import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import './PageNavLink.scss';

export const PageNavLink = ({ to, text, disabled }) => 
  {
    return disabled 
    ? (
      <div className='pageNavLink disabled'>{text}</div>
    ) : (
       <NavLink
          to={to}
          className={({ isActive }) => classNames(
            'pageNavLink', { 'pageNavLink--active': isActive },
          )}
      >
           <p >{text}</p> 
       </NavLink>
    )
  };