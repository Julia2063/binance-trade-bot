import React , { useState ,useEffect } from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/icon/logo.svg';

import bot from '../../assets/images/icon/bot.svg';
import twitter from '../../assets/images/icon/twitter.svg';
import insta from '../../assets/images/icon/insta.svg';
import youtube from '../../assets/images/icon/youtube.svg';

function Footer(props) {
   
    const [listSocial] = useState([
        {
            icon: bot,
            path: '#'
        },
        {
            icon: twitter,
            path: '#'
        },
        {
            icon: insta,
            path: '#'
        },
        {
            icon: youtube,
            path: '#'
        },
    ]);

    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener("scroll", toggleVisibility);

      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (

        <footer className="footer style-2">
            <div className="container">
                <div className="footer__main">
                <div className="row">
                    <div className="col-xl-4 col-md-6">
                        <Link to="/" className="footer__logo">
                          <img src={logo} alt="" />
                        </Link>
                        <div className='footer__main__text'>
                        Auto buy low and sell
                        high
                        with exclusive crypto 
                        trading
                        bot
                        </div>
                        <ul className="list-social">
                            {
                                listSocial.map((data,idx) => (
                                    <li key={idx}>
                                        <Link to={data.path}>
                                            <img src={data.icon} alt='' />
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>

                    </div>

                    <div className="col-3 col-md-6">
                        <Link to='/terms-and-conditions'>Terms & Conditions</Link>
                        <Link to='/privacy-policy'>Privacy Policy</Link>
                    </div>

                    <div className="col-xl-4 col-md-6 footer__letter">
                        <h5>Newsletters</h5>
                        <p>
                        Subscribe our newsletter to get more information.
                        </p>
                        <form action="#">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required=""
                            />
                            <button type="submit" className="btn-action">Submit</button>
                        </form>
                    </div>
                    

                </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="footer__bottom">
                    ©{new Date().getFullYear()} Designed by NonameDigital. All rights reserved
                </div>
            </div>

            {
                isVisible &&
                <Link onClick={scrollToTop}  to='#' id="scroll-top"></Link>
            }
        </footer>
    );
}

export default Footer;
