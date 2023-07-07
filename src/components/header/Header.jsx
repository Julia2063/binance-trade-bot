import React, {useState, useEffect, useContext} from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import './Header.scss';
import logo from '../../assets/images/icon/logo.svg';

import DarkMode from './DarkMode';

import en from '../../assets/images/flags/en.svg'

import { AppContext } from "../../helpers/appContext";
import { PageNavLink } from '../PageNavLink/PageNavLink';
import { logOut } from '../../helpers/firebaseConfigAndControls';

import { FiLogOut } from 'react-icons/fi'


const Header = ({ background }) => {
    const [scroll, setScroll] = useState(false);
    const { user, setUser } = useContext(AppContext);

    const navigate = useNavigate();


    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 300);
        });
        return () => {
            setScroll({});
        }
    }, []);

    const [menuActive, setMenuActive] = useState(null);

    const handleMenuActive = () => {
        setMenuActive(!menuActive);
    };

    const [activeIndex, setActiveIndex] = useState(null);
    const handleDropdown = index => {
        setActiveIndex(index);
    };   
   

    const menu = [ ['Home', '/', false], ['Trading', user.idPost ? '/work-page' : '/login', false] , ['Pricing', '/jdrj', true] , ['About us', '/jrjy', true]]

    const handleLogOut = async (event) => {
        try {
          await logOut(event, setUser, navigate, '/login');
        } catch (error) {
            console.log(error);
        }
      };


   
    return (
        <header id="header_main" className={ `header ${scroll ? 'is-fixed' : ''}`}>
            <div className='container container--layout'>
                 <div className="container-fluid">
                <div className="row">
                   {background && <div className="header__background" />}
                <div className="col-12">
                    <div className="header__body d-flex justify-content-between">
                    <div className="header__left">
                        <div className="logo">
                        <NavLink to='/' className="dark">
                            <img
                            src={logo}
                            alt="Bot"
                            />
                        </NavLink>
                        </div>
                        <div className="left__main">
                            <nav className={`main-nav ${menuActive ? 'active' : ''}`}>
                                <ul className="menu">
                                {
                                    menu.map((data, idx) => (
                                        <li key={idx} className='menu-item'>
                                            <PageNavLink 
                                              to={data[1]} 
                                              onClick={handleMenuActive} 
                                              text={data[0]}
                                              disabled={data[2]}
                                            />
                                           
                                        </li>
                                    ))
                                }
                                </ul>
                            </nav>
                        </div>
                    </div>
                        <DarkMode />

    
                    <div className="header__right">
                    <nav className='main-nav'> 
                        <ul className='menu'>
                            {!user.idPost
                          ? (
                            <>
                              <li className='menu-item'>
                                 <PageNavLink text='Sign Up' to='/register'/>
                              </li>
                              <li className='menu-item'>
                                <PageNavLink text='Log In' to='/login' />
                              </li>
                               
                                
                            </>
                          )
                          : <PageNavLink text='User Profile' to='/user-profile'/>
                          
                        }
                        </ul>
                    </nav>
                        {user.idPost && (
                           <button  
                            onClick={(event) => handleLogOut(event)} className='header__logout'
                            >
                                <FiLogOut />
                            </button > 
                        )}
                        
                        <div className='header__languageToogler'>
                            <img src={en} alt='en'/>
                            <span>{`English (UK)`}</span>
                        </div>
                       
                        <div className={`mobile-button ${menuActive ? 'active' : ''}`} onClick={handleMenuActive}><span></span></div>
                       
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
           
           
        </header>
    );
}

export default Header;
