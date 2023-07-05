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

    const features = [
        {
            title: "Automated Trading",
            path: '#'
        },
        {
            title: "Technical Indicators",
            path: '#'
        },
        {
            title: "Bots Marketplace",
            path: '#'
        },
        {
            title: "Help",
            path: '#'
        },
    ];

    const aboutUs = [
        {
            title: "Latest",
            path: '#'
        },
        {
            title: "Pricing",
            path: '#'
        },
        {
            title: "Contact Us",
            path: '#'
        },
        {
            title: "More about EasyCoin",
            path: '#'
        },
    ];


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
            <div className="container container--layout">
                <div className="footer__main">
                <div className="row">
                    <div className="col-xl-4 col-md-6">
                        <Link to="/" className="footer__logo">
                          <img src={logo} alt="" />
                        </Link>
                        <div className='footer__main__text'>
                            The leading NFT Marketplace on EasyCoinHome to the next generation of digital creators. Discover the best NFT collections.
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

                    <div className="col-2">
                        <h6>Features</h6>
                        <div className='footer__main__linkList'>
                            {features.map(f => (
                                <Link to={f.path} key={f.title}>{f.title}</Link>
                            ))}
                        </div>
                    </div>
                    <div className="col-2">
                        <h6>About Us</h6>
                        <div className='footer__main__linkList'>
                            {aboutUs.map(a => (
                                <Link to={a.path} key={a.title}>{a.title}</Link>
                            ))}
                        </div>
                    </div>
                    <div className="col-3">
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
                <span>Terms & Conditions</span>
                <span>
                    ©{new Date().getFullYear()} Designed by NonameDigital. All rights reserved
                </span>
                <span>Privacy Policy</span>
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
