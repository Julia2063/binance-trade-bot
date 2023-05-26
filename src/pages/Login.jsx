import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import Sale01 from '../components/sale/Sale01';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PageTitle from '../components/pagetitle';

import {Link, useNavigate} from 'react-router-dom';
import {Col, Row} from "reactstrap";

import img from '../assets/images/icon/qrcode.png'
import {signIn} from "../helpers/firebaseConfigAndControls";
import ModalNotification from "../components/modals/ModalNotification";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth, getCollectionWhereKeyValue, createNewUser } from "../helpers/firebaseConfigAndControls";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';

import firebase from 'firebase/compat/app';

import {AppContext} from "../helpers/appContext";

import google from '../assets/images/icon/google.svg';
import facebook from '../assets/images/icon/facebook.svg';

import classNames from 'classnames';
import { collectionsNames } from '../helpers/models';

Login.propTypes = {

};

function Login(props) {
    //#region Get router
    const navigate = useNavigate();
    //#endregion

    const {user, setUser} = useContext(AppContext);

    //#region Error
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    //#region Handle modal notification appearance and content
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    //#endregion

    //#region Handle inputs change and blur
    const [regInfo, setRegInfo] = useState({});
    const [isSendNumber, setIsSendNumber] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isRecapcha, setIsRecapcha] = useState(false);

    const [otp, setOtp] = useState('');
    const [confirmObj, setConfirmObj] = useState('');

    const handleEmailChange = (event) => {
        let newRegInfo = {
            ...regInfo,
            email: event.target.value,
        }

        setRegInfo(newRegInfo);
    };

    const handlePasswordChange = (event) => {
        let newRegInfo = {
            ...regInfo,
            password: event.target.value,
        }

        setRegInfo(newRegInfo);
    };

    const handleChange = (fieldName, newValue) => {
        let newRegInfo = {
            ...regInfo,
            [fieldName]: newValue,
        }
        setRegInfo(newRegInfo);
    }

    const handleBlur = (fieldName) => {

    }
    //#endregion

    //#region Submit sign in form
    const submitSignIn = async (event, regInfo) => {
        event.preventDefault();
        try {
          const result = await signIn(regInfo.email, regInfo.password);
          console.log(result.user.providerData);
          navigate('/wallet');
        } catch (err) {
          setShowNotification(true);
          setNotificationTitle('LogIn error');
          setNotificationMessage(`${err}`);
        }
    }
    //#endregion

    const setUpRecaptcha = (phoneNumber) => {
        setIsRecapcha(true);
          const recaptchaVerifier = new RecaptchaVerifier (
          'recaptcha-container',
          {},
          auth,
        );
  
        recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      }
  
      const getOtp = async (event) => {
        event.preventDefault();
  
        try {
          const existUser = await getCollectionWhereKeyValue(collectionsNames.users, 'phoneNumber', phoneNumber);

          if (existUser.length !== 0) {
            const response = await setUpRecaptcha(phoneNumber);

            setConfirmObj(response);
            setIsSendNumber(true);
          } else {
            setShowNotification(true);
            setNotificationTitle('Login error');
            setNotificationMessage('You are not a member. Please, register!');

            setPhoneNumber('');
          }
        } catch (err) {
          setShowNotification(true);
          setNotificationTitle('Login error');
          setNotificationMessage(`${err}`);
        }
  
      }

      const submitSingInWithPhoneNumber = async (event, regInfo) => {
        event.preventDefault();

        try {
          await confirmObj.confirm(otp);


          navigate('/wallet');
        } catch (err) {
          setShowNotification(true);
          setNotificationTitle('Login error');
          setNotificationMessage(`${err}`);
        }
      };

      const providerGoogle = new GoogleAuthProvider();

      const submitSingInWithGoogle = async (event) => {
        event.preventDefault();

        if (!regInfo.isPrivacyPolicyAccepted) {
          setShowNotification(true);
          setNotificationTitle('Register error');
          setNotificationMessage('You should accept privacy policy before login');
  
          return;
        };
  
        try {
          const result = await signInWithPopup(auth, providerGoogle);
          
          const newUser = {
            ...regInfo,
            uid: result.user.uid,
            isEmailVerified: result.user.emailVerified,
            fullName: result.user.displayName,
            email: result.user.email,
          };
  
          const user = await createNewUser(newUser);
          setUser(user);

          navigate('/wallet');
        } catch (err) {
          setShowNotification(true);
          setNotificationTitle('Login error');
          setNotificationMessage(`${err.message}`);
        }
    };

    const providerFacebook = new FacebookAuthProvider();

    const submitSingInWithFacebook = async (event) => {
      event.preventDefault();

      if (!regInfo.isPrivacyPolicyAccepted) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage('You should accept privacy policy before registration');

        return;
      };

      try {
        const result = await signInWithPopup(auth, providerFacebook);

        const newUser = {
          ...regInfo,
          uid: result.user.uid,
          isEmailVerified: result.user.emailVerified,
          fullName: result.user.displayName,
          email: result.user.email,
        };

        const user = await createNewUser(newUser);
        setUser(user);

        navigate('/wallet');
      } catch (err) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage(`${err.message}`);
      }
    }

    const handleSendEmailResetPassword = async () => {
      try {
          await sendPasswordResetEmail(auth, regInfo.email);

          setShowNotification(true);
          setNotificationTitle('Notification');
          setNotificationMessage('Password reset email sent! Please check it, confirm reset and re-login!');

          await signOut(auth);

          setTimeout(() => {
            navigate('/login');
          }, 5000);
        
      } catch (error) {
          console.log(error);
          setShowNotification(true);
          setNotificationTitle('Error');
          setNotificationMessage('Something went wrong with reset password sending');
      }
  }

    //#region Render
    return (
        <div>
            <PageTitle heading='Login' title='Login' />

            <section className="register login">
              <div className="container">
                <div className="row">
                <div className="col-md-12">
                    <div className="block-text center">
                    <h3 className="heading">Login To BinanceBot</h3>
                    <p className="desc fs-20">
                        Welcome! Log In now to start trading
                    </p>
                    {/*<div className="lock">*/}
                    {/*    <div className="icon">*/}
                    {/*    <svg*/}
                    {/*        width="16"*/}
                    {/*        height="20"*/}
                    {/*//         viewBox="0 0 16 20"*/}
                    {/*//         fill="none"*/}
                    {/*        xmlns="http://www.w3.org/2000/svg"*/}
                    {/*    >*/}
                    {/*        <path*/}
                    {/*        d="M8.00004 11.7578C7.67672 11.7578 7.41406 12.0205 7.41406 12.3438C7.41406 12.6671 7.67672 12.9298 8.00004 12.9298C8.32336 12.9298 8.58602 12.6671 8.58602 12.3438C8.58602 12.0205 8.32336 11.7578 8.00004 11.7578Z"*/}
                    {/*        fill="white"*/}
                    {/*        />*/}
                    {/*        <path*/}
                    {/*        d="M11.5162 8.24219H4.2187C2.10011 8.24219 0.382568 9.95965 0.382568 12.0783C0.382568 15.6973 2.78413 19.0605 6.32241 19.8205C11.2508 20.8791 15.618 17.0922 15.618 12.344C15.618 10.0787 13.7816 8.24219 11.5162 8.24219ZM8.58628 13.9941V17.071C8.58628 17.3949 8.32417 17.657 8.0003 17.657C7.6764 17.657 7.41433 17.3949 7.41433 17.071V13.9941C6.73374 13.7514 6.24237 13.107 6.24237 12.3441C6.24237 11.3747 7.03093 10.5861 8.0003 10.5861C8.96968 10.5861 9.75823 11.3747 9.75823 12.3441C9.75823 13.107 9.26686 13.7513 8.58628 13.9941Z"*/}
                    {/*        fill="white"*/}
                    {/*        />*/}
                    {/*        <path*/}
                    {/*        d="M8.00039 0C5.08223 0 2.72656 2.35562 2.72656 5.27383V7.3234C3.20102 7.17391 3.69582 7.07086 4.21898 7.07086H5.07051V5.27383C5.07051 3.65652 6.38309 2.34395 8.00039 2.34395C9.6177 2.34395 10.9303 3.65652 10.9303 5.27383V7.07082H11.5163C12.1356 7.07082 12.7216 7.19777 13.2742 7.3948V5.27383C13.2742 2.35844 10.9128 0 8.00039 0Z"*/}
                    {/*        fill="white"*/}
                    {/*        />*/}
                    {/*    </svg>*/}
                    {/*    </div>*/}
                    {/*    <p><span>https://</span>accounts.BinanceBot.com/login</p>*/}
                    {/*</div>*/}
                    </div>
                </div>
                <div className="col-md-12">
                <Tabs>
                    <TabList>
                        <Tab><h6 className="fs-16">Email</h6></Tab>
                        <Tab><h6 className="fs-16">Mobile</h6></Tab>
                        <Tab><h6 className="fs-16">Google</h6></Tab>
                        <Tab><h6 className="fs-16">Facebook</h6></Tab>
                    </TabList>

                    <TabPanel>
                        <div className="content-inner">
                            <form
                                onSubmit={(event) => submitSignIn(event, regInfo)}
                            >
                                <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    placeholder="Please fill in the email form."
                                    onChange={(event) => handleChange('email', event.target.value)}
                                />
                                </div>
                                <div className="form-group s1">

                                <label>Password </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Please enter a password."
                                    onChange={(event) => handleChange('password', event.target.value)}
                                />
                                </div>

                                {/*<div className="form-group form-check">*/}
                                {/*<div>*/}
                                {/*    <input type="checkbox" className="form-check-input" />*/}
                                {/*    <label className="form-check-label">Remember Me</label>*/}
                                {/*</div>*/}
                                {/*<p>Forgot Password?</p>*/}
                                {/*</div>*/}

                                <button type="submit" className="btn-action">Login</button>
                                <div className="bottom">
                                <p>Not a member?</p>
                                <Link to="/register">Register</Link>
                                </div>
                                <button 
                                  type="button"
                                  className="buttonText"
                                  onClick={handleSendEmailResetPassword}
                                >
                                  Forgot your password?
                                </button>
                            </form>
                        </div>
                    </TabPanel>

                    <TabPanel>
                      <div className="content-inner">
                        <form 
                          onSubmit={(event) => getOtp(event)}
                          style={{ display: !isSendNumber ? 'block' : 'none'}}
                        >
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Mobile Phone</label>
                            <PhoneInput 
                              placeholder="Enter phone number"
                              value={phoneNumber}
                              onChange={setPhoneNumber}
                                    />
                          </div>
                            
                          <div 
                            className={classNames('register__recapcha-container', {'form-control' : isRecapcha, 'register__recapcha-container--visible' : isRecapcha} )}
                            id='recaptcha-container'
                          />
                          <button className="btn-action" type="submit">
                            Send
                          </button>
                          <div className="bottom">
                            <p>Not a member?</p>
                            <Link to="/register">Register</Link>
                          </div>
                        </form>
                    
                        <form 
                          onSubmit={(event) => submitSingInWithPhoneNumber(event, regInfo)}
                          style={{ display: isSendNumber ? 'block' : 'none'}}
                        >
                          <div className="form-group">
                            <label>
                              Enter a code      
                            </label>
                            <input
                              type="text"
                              className="form-control mb-10"
                              placeholder="Please enter your code"
                              value={otp}
                              onChange={(event) => setOtp(event.target.value)}
                              required 
                            />
                          </div>
                          <button type="submit" className="btn-action">Login</button>
                          <div className="bottom">
                            <p>Not a member?</p>
                            <Link to="/register">Register</Link>
                          </div>
                        </form>  
                      </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="content-inner">
                          <form onSubmit={(event) => submitSingInWithGoogle(event)}>
                            <div className="form-group">
                              <label>Login as a user of</label>
                            </div>

                            <div className="form-group">
                              <Row>
                                <Col xs={1}>
                                  <div className={'CheckBoxContainer'}>
                                    <label
                                      htmlFor={'PrivacyPolicyAccept'}
                                      className={regInfo.isPrivacyPolicyAccepted ? 'PrivacyPolicyAcceptLabel PrivacyPolicyAcceptLabel_Checked' : 'PrivacyPolicyAcceptLabel'}
                                    >
                                      <input
                                        id={'PrivacyPolicyAccept'}
                                        type="checkbox"
                                        className='CheckBox'
                                        checked={regInfo.isPrivacyPolicyAccepted}
                                        onChange={(event) => handleChange('isPrivacyPolicyAccepted', event.target.checked)} 
                                      />
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={11}>
                                  <Link to={'/privacy'}>
                                    I accept the privacy policy
                                  </Link>
                                </Col>
                              </Row>
                            </div>

                            <div className="form-group">  
                              <button className="btn-action register__social-media-button" type="submit">
                                <img src={google} alt="google" className="register__icon" />
                                Google
                              </button>
                            </div>
                          </form>
                        </div>
                      </TabPanel>

                      <TabPanel>
                        <div className="content-inner">
                          <form onSubmit={(event) => submitSingInWithFacebook(event)}>
                            <div className="form-group">
                              <label>Login as a user of</label>
                            </div>

                            <div className="form-group">
                              <Row>
                                <Col xs={1}>
                                  <div className={'CheckBoxContainer'}>
                                    <label
                                      htmlFor={'PrivacyPolicyAccept'}
                                      className={regInfo.isPrivacyPolicyAccepted ? 'PrivacyPolicyAcceptLabel PrivacyPolicyAcceptLabel_Checked' : 'PrivacyPolicyAcceptLabel'}
                                    >
                                      <input
                                        id={'PrivacyPolicyAccept'}
                                        type="checkbox"
                                        className='CheckBox'
                                        checked={regInfo.isPrivacyPolicyAccepted}
                                        onChange={(event) => handleChange('isPrivacyPolicyAccepted', event.target.checked)} 
                                      />
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={11}>
                                  <Link to={'/privacy'}>
                                    I accept the privacy policy
                                  </Link>
                                </Col>
                              </Row>
                            </div>

                            <div className="form-group">
                              <button className="btn-action register__social-media-button" type="submit">
                                <img src={facebook} alt="google" className="register__icon" />
                                Facebook
                              </button>
                            </div>
                          </form>
                        </div>
                      </TabPanel>
                </Tabs>

                    {/*<div className="qr-code center">*/}
                    {/*<img src={img} alt="" />*/}
                    {/*<h6 className="fs-20">Login with QR code</h6>*/}
                    {/*<p className="fs-14">*/}
                    {/*    Scan this code with the <span>BinanceBot mobile app</span> <br />*/}
                    {/*    to log in instantly.*/}
                    {/*</p>*/}
                    {/*</div>*/}
                </div>
                </div>
            </div>
            </section>

            {showNotification &&
                <ModalNotification
                    showModal={showNotification}
                    setShowModal={setShowNotification}
                    title={notificationTitle}
                    message={notificationMessage}
                    areAuthButtonsVisible={false}
                />
            }

            {/*<Sale01 />*/}

        </div>
    );
    //#endregion
}

export default Login;
