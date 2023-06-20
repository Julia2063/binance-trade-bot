import React , { useState ,useEffect } from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import img from '../../assets/images/logo/log-footer.png'
import img1 from '../../assets/images/logo/logo-footer-dark.png'

function Footer(props) {
    const [productLink] = useState([
        {
            title: 'Product1',
            path: '/work-page'
        },
        {
            title: 'Product2',
            path: '#'
        },
        {
            title: 'Product3',
            path: '#'
        },
        {
            title: 'Product4',
            path: '#'
        },
        {
            title: 'Product5',
            path: '#'
        },
        {
            title: 'Product6',
            path: '#'
        },
    ]);
    const [servicesLink] = useState([
        {
            title: 'Service1',
            path: '#'
        },
        {
            title: 'Service2',
            path: '#'
        },
        {
            title: 'Service3',
            path: '#'
        },
        {
            title: 'Service4',
            path: '#'
        },
        {
            title: 'Service5',
            path: '#'
        },
        {
            title: 'Service6',
            path: '#'
        },
    ]);


    const [listSocial] = useState([
        {
            icon: 'icon-facebook-f',
            path: '#'
        },
        {
            icon: 'icon-instagram',
            path: '#'
        },
        {
            icon: 'icon-youtube',
            path: '#'
        },
        {
            icon: 'icon-twitter',
            path: '#'
        },
    ])


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
                    <div className="info">
                        <Link to="/" className="logo light">
                        <img src={img} alt="" />
                        </Link>
                        <Link to="/" className="logo dark">
                        <img src={img1} alt="" />
                        </Link>
                        <h6>Let's talk! 🤙</h6>
                        <ul className="list">
                        <li><p>+38 000 000 0000</p></li>
                        <li><p>binancebotemail@Gmail.Com</p></li>
                        <li>
                            <p>
                            Our address
                            </p>
                        </li>
                        </ul>
                    </div>
                    </div>
                    <div className="col-xl-4 col-md-6">
                    <div className="widget">
                        <div className="widget-link">
                        <h6 className="title">PRODUCTS</h6>
                        <ul>
                            {
                                productLink.map((data,idx) => (
                                    <li key={idx}><Link to={data.path}>{data.title}</Link></li>
                                ))
                            }
                        </ul>
                        </div>
                        <div className="widget-link s2">
                        <h6 className="title">SERVICES</h6>
                        <ul>
                            {
                                servicesLink.map((data,idx) => (
                                    <li key={idx}><Link to={data.path}>{data.title}</Link></li>
                                ))
                            }
                        </ul>
                        </div>
                    </div>
                    </div>
                    <div className="col-xl-4 col-md-12">
                    <div className="footer-contact">
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
                        <ul className="list-social">
                            {
                                listSocial.map((data,idx) => (
                                    <li key={idx}>
                                        <Link to={data.path}><span className={data.icon}></span></Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="footer__bottom">
                <p>
                    ©{new Date().getFullYear()} Designed by NonameDigital. All rights reserved
                </p>
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
