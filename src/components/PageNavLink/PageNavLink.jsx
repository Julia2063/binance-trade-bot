import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import './PageNavLink.scss';

export const PageNavLink = ({ to, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) => classNames(
      'pageNavLink', { 'pageNavLink--active': isActive },
    )}
  >
    <p >{text}</p> 
  </NavLink>
);