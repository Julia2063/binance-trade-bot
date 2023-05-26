import React, {useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Sale01 from '../components/sale/Sale01';

import classNames from 'classnames';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PageTitle from '../components/pagetitle';

import {Link, useNavigate} from 'react-router-dom'
import {auth, signUpAndCreateUser, createNewUser} from "../helpers/firebaseConfigAndControls";
import {AppContext} from "../helpers/appContext";
import ModalNotification from "../components/modals/ModalNotification";
import {Col, Row} from "reactstrap";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';


import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup,
  FacebookAuthProvider, 
} from "firebase/auth";

import google from '../assets/images/icon/google.svg';
import facebook from '../assets/images/icon/facebook.svg';



Register.propTypes = {

};

function Register(props) {
    //#region Get user from context
    const {user, setUser} = useContext(AppContext);
    //#endregion

    //#region Get router
    const navigate = useNavigate();
    //#endregion

    //#region Error
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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

    const handlePasswordRepeatChange = (event) => {
        let newRegInfo = {
            ...regInfo,
            passwordConfirm: event.target.value,
        }

        setRegInfo(newRegInfo);
    };

    const handleChange = (fieldName, newValue) => {
        let newRegInfo = {
            ...regInfo,
            [fieldName]: newValue,
        }

        // console.log(newRegInfo);
        setRegInfo(newRegInfo);
    };


    //#endregion

    //#region Handle modal notification appearance and content
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    //#endregion

    //#region Submit sign up form
    const submitSingUpWithEmailAndPassword = async (event, regInfo) => {
        event.preventDefault();

        if (!regInfo.isPrivacyPolicyAccepted) {
            setShowNotification(true);
            setNotificationTitle('Register error');
            setNotificationMessage('You should accept privacy policy before registration');

            return;
        };

        if(regInfo.passwordConfirm !== regInfo.password) {
            setShowNotification(true);
            setNotificationTitle('Register error');
            setNotificationMessage('Re-entered password must be equal to password');
            return;
        }

        
          const ifSignUp = await signUpAndCreateUser(regInfo, setUser);

          if (ifSignUp) {
            navigate('/wallet');
          } else {
            setShowNotification(true);
            setNotificationTitle('Register error');
            setNotificationMessage('Perhaps a user with this email address already exists');
          }

    }

    
 
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
        const response = await setUpRecaptcha(phoneNumber);
        setConfirmObj(response);
        setIsSendNumber(true);
        setRegInfo({...regInfo, phoneNumber: phoneNumber});
      } catch (err) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage(`${err}`);
      }

    }

    const submitSingUpWithPhoneNumber = async (event, regInfo) => {
      event.preventDefault();
    
      if (!regInfo.isPrivacyPolicyAccepted) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage('You should accept privacy policy before registration');

        return;
    };

      try {
      
        const result = await  confirmObj.confirm(otp);
       
        const newUser = {
            ...regInfo,
            uid: result.user.uid,
            isEmailVerified: result.user.emailVerified,
        };

        const user = await createNewUser(newUser);
        setUser(user);
        
        navigate('/wallet');
      } catch (err) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage(`${err}`);
      }
    };
    //#endregion

    const providerGoogle = new GoogleAuthProvider();

    const submitSingUpWithGoogle = async (event, regInfo) => {
      event.preventDefault();

      if (!regInfo.isPrivacyPolicyAccepted) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage('You should accept privacy policy before registration');

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
        setNotificationTitle('Register error');
        setNotificationMessage(`${err.message}`);
      }
      
    }

    const providerFacebook = new FacebookAuthProvider();

    const submitSingUpWithFacebook = async (event, regInfo) => {
      event.preventDefault();

      if (!regInfo.isPrivacyPolicyAccepted) {
        setShowNotification(true);
        setNotificationTitle('Register error');
        setNotificationMessage('You should accept privacy policy before registration');

        return;
      };

      try {
        const result = await signInWithPopup(auth, providerFacebook);

        console.log(result);

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

    //#region Render

    return (
        <div>
            <PageTitle heading='Register' title='Register' />

            <section className="register">
            <div className="container">
                <div className="row">
                <div className="col-md-12">
                    <div className="block-text center">
                    <h3 className="heading">Register To BinanceBot</h3>
                    <p className="desc fs-20">
                        Register in advance and enjoy the event benefits
                    </p>
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
                              onSubmit={(event) => submitSingUpWithEmailAndPassword(event, regInfo)}
                            >
                                <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    placeholder="Please fill in the email form."
                                    onChange={(event) => handleChange('email', event.target.value)}
                                    required
                                />
                                </div>
                                <div className="form-group">
                                <label
                                    >Password
                                    {/*<span>*/}
                                    {/*    (8 or more characters, including numbers and special*/}
                                    {/*    characters)*/}
                                    {/*</span>*/}
                                </label>
                                <input
                                    type="password"
                                    className="form-control mb-10"
                                    placeholder="Please enter a password."
                                    onChange={(event) => handleChange('password', event.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Please re-enter your password."
                                    onChange={(event) => handleChange('passwordConfirm', event.target.value)}
                                    required
                                />
                                </div>
                                {/*<div className="form-group">*/}
                                {/*<label>Country </label>*/}
                                {/*<select className="form-control">*/}
                                {/*    <option>South Korea (+82)</option>*/}
                                {/*    <option>Vietnamese (+84)</option>*/}
                                {/*    <option>South Korea (+82)</option>*/}
                                {/*    <option>South Korea (+82)</option>*/}
                                {/*</select>*/}
                                {/*</div>*/}
                          
                                <div className={'form-group'}>
                                    <Row>
                                        <Col xs={1}>
                                            <div className={'CheckBoxContainer'}>
                                                <label
                                                    htmlFor={'PrivacyPolicyAccept'}
                                                    className={regInfo.isPrivacyPolicyAccepted ? 'PrivacyPolicyAcceptLabel PrivacyPolicyAcceptLabel_Checked' : 'PrivacyPolicyAcceptLabel'}
                                                >
                                                    <input
                                                        id={'PrivacyPolicyAccept'}
                                                        type={"checkbox"}
                                                        className={'CheckBox'}
                                                        checked={regInfo.isPrivacyPolicyAccepted}
                                                        onChange={(event) => handleChange('isPrivacyPolicyAccepted', event.target.checked)}
                                                        // required
                                                    />
                                                </label>
                                            </div>
                                        </Col>

                                        <Col xs={11}>
                                            <Link to={'/privacy'} target={'_blank'}>
                                                I accept the privacy policy
                                            </Link>
                                        </Col>
                                    </Row>
                                </div>

                                {/*<div className="form-group">*/}
                                {/*<label>UID Code </label>*/}
                                {/*<input*/}
                                {/*    type="text"*/}
                                {/*    className="form-control"*/}
                                {/*    placeholder="Please enter your invitation code."*/}
                                {/*/>*/}
                                {/*</div>*/}

                                <button type="submit" className="btn-action">
                                    Register
                                </button>
                                <div className="bottom">
                                <p>Already have an account?</p>
                                <Link to="/login">Login</Link>
                                </div>
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
                                  <p>Already have an account?</p>
                                  <Link to="/login">Login</Link>
                                </div>
                            </form>
                    
                            <form 
                              onSubmit={(event) => submitSingUpWithPhoneNumber(event, regInfo)}
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
                                <button type="submit" className="btn-action">
                                  Registration
                                </button>
                                <div className="bottom">
                                  <p>Already have an account?</p>
                                  <Link to="/login">Login</Link>
                                </div>
                              </form>  
                          </div>
                      </TabPanel>

                      <TabPanel>
                        <div className="content-inner">
                          <form onSubmit={(event) => submitSingUpWithGoogle(event, regInfo)}>
                            <div className="form-group">
                              <label>Register as a user of</label>
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
                              <div className="bottom">
                                <p>Already have an account?</p>
                                <Link to="/login">Login</Link>
                              </div>
                            </div>
                          </form>
                        </div>
                      </TabPanel>

                      <TabPanel>
                        <div className="content-inner">
                          <form onSubmit={(event) => submitSingUpWithFacebook(event, regInfo)}>
                            <div className="form-group">
                              <label>Register as a user of</label>
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
                              <div className="bottom">
                                <p>Already have an account?</p>
                                <Link to="/login">Login</Link>
                              </div>
                            </div>
                          </form>
                        </div>
                      </TabPanel>

                  </Tabs>

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

export default Register;
