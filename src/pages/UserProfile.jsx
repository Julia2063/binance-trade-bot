import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Sale01 from '../components/sale/Sale01';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PageTitle from '../components/pagetitle';
import {Link, useNavigate} from 'react-router-dom';
import img from '../assets/images/avt/avt.png'
import {AppContext} from "../helpers/appContext";
import ProfilePageTitle from "../components/profilepagetitle";
import {GiConfirmed} from "react-icons/gi";
import { 
  sendEmailVerification,
  updateEmail, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  updatePassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth, logOut, updateFieldInDocumentInCollection, updateDocumentInCollection } from "../helpers/firebaseConfigAndControls";
import ModalNotification from "../components/modals/ModalNotification";

import { collectionsNames, userModel } from "../helpers/models";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input';
import ModalReAuthenticate from '../components/modals/ModalReAuthenticate';

UserProfile.propTypes = {

};

function UserProfile(props) {
    const [dataCoinTab, setDataCoinTab] = useState([
        {
          id: 1,
          title: 'User Profile',
          icon: 'fa-user'
        },
        {
          id: 2,
          title: 'Referrals',
          icon: 'fa-share-nodes'
        },
        {
          id: 3,
          title: 'API keys',
          icon: 'fa-gear'
        },
        // {
        //     id: 4,
        //     title: '2FA',
        //     icon: 'fa-barcode'
        // },
       
        {
          id: 5,
          title: 'Change password',
          icon: 'fa-lock'
        },
    ]);

    //#region Get data from AppContext
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    //#endregion

    //#region Handle modal notification appearance and content
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');

    const [showReAutrnticateNotification, setShowReAutrnticateNotification] = useState(false);

    const [isUpdateAvatarButton, setIsUpdateAvatarButton] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateEmail, setIsUpdateEmail] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

    const [updatedData, setUpdatedData] = useState({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isEmailVerified: user.isEmailVerified,
    });

    const [promptForCredentials, setPromptForCredentials] = useState(null);

    const[newPassword, setNewPassword] = useState('');
    const[reNewPassword, setReNewPassword] = useState('');

    //#endregion

    useEffect(() => {

      const user = auth.currentUser;

      console.log(user);

      if (user?.providerData[0].providerId !== 'password') {
        setDataCoinTab(dataCoinTab.slice(0, dataCoinTab.length - 1))
      }
    }, [])

    //#region Handling email verification
    const handleSendEmailVerificationClick = async () => {
        try {
            await sendEmailVerification(auth.currentUser);

            setShowNotification(true);
            setNotificationTitle('Notification');
            setNotificationMessage('Verification link was sent to your email. Please check it and confirm your email. ' +
              'After email confirmation you should refresh page or make relogin to apply updates');
        } catch (error) {
            console.log(error);
            setShowNotification(true);
            setNotificationTitle('Error');
            setNotificationMessage('Something went wrong with email verification link sending');
        }
    }

    const handleLogOut = async (event) => {
      try {
        await logOut(event, setUser, navigate, '/login');
      } catch (error) {
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage(error.message);
      }
    }

    const loadUserAvatar = (e) => {
      e.preventDefault();

      const reader = new FileReader();
      const file = e.target.files[0];
        
      const size = file.size;
      const name = file.name;
      const fileExtension = ['jpeg', 'ico', 'jpg', 'png', 'svg'];

      if(1000000 < size){
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage('Your file size is over 800 KB. Please choose another file');

        return;
      }
            
      if (!fileExtension.includes(name.split('.').pop().toLowerCase())) {
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage('Only the following file types can be loaded: .jpeg, .ico, .jpg, .png, .svg. Please choose another file');
    
        return;
      }

      reader.onloadend = () => {
        setUser({...user, avatarLink: reader.result});
      }
    
      reader.readAsDataURL(file)
      setIsUpdateAvatarButton(true);
    };

    const updateAvatarInBD = async (e) => {
      e.preventDefault();

      try {
       
        await updateFieldInDocumentInCollection(collectionsNames.users, user.idPost, 'avatarLink', user.avatarLink);
        setShowNotification(true);
        setNotificationTitle('Success');
        setNotificationMessage('Your avatar was updated');

        setIsUpdateAvatarButton(false);

      } catch (error) {
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage(error.message);
      }
    }


    const handleSubmitUserData = async (e) => {
      e.preventDefault();

      if (auth.currentUser.providerData[0].providerId === "password" && user.email !== updatedData.email && !promptForCredentials) {
        setShowReAutrnticateNotification(true);
        setNotificationTitle('To change the email, please log in again');
        return;
      }
      console.log(user.email);
      console.log(updatedData.email);

        
      if (auth.currentUser.providerData[0].providerId === "password" && user.email !== updatedData.email && promptForCredentials) {
          
        try {
          const password = promptForCredentials.password;
          const { currentUser } = auth;
          const { email } = currentUser;
          const credential = EmailAuthProvider.credential(email, password);

          const result = await reauthenticateWithCredential(currentUser, credential);
          
          console.log(result);
          
        } catch (error) {
          console.log(error);
          setShowNotification(true);
          setNotificationTitle('Error');
          setNotificationMessage(error.message);
          setUpdatedData({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isEmailVerified: user.isEmailVerified,
          });
          return;
        }

          try {
        
          await updateEmail(auth.currentUser, updatedData.email);
          setPromptForCredentials(null);
        } catch (error) {
          setShowNotification(true);
          setNotificationTitle('Error');
          setNotificationMessage(error.message);
        }
        }
      
      
      const newData = {...user, ...updatedData, phoneNumber};

      try {
        await updateDocumentInCollection(collectionsNames.users, newData, user.idPost);
        setUser(newData);
        setIsUpdating(false);
        setShowNotification(true);
        setNotificationTitle('Success');
        setNotificationMessage('Your data has been updated successfully');

      } catch (error) {
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage(error.message);
      }
    };
    
    const handleSubmitPassword = async (e) => {
      e.preventDefault();

      if (newPassword !== reNewPassword) {
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage('New Password and re-New password must be equal');
        return;
      }

      if (!promptForCredentials) {
        setShowReAutrnticateNotification(true);
        setNotificationTitle('To change the password, please log in again');
        return;
      }

      try {
        const password = promptForCredentials.password;
        const { currentUser } = auth;
        const { email } = currentUser;
        const credential = EmailAuthProvider.credential(email, password);

        await reauthenticateWithCredential(currentUser, credential);
        
      } catch (error) {
        console.log(error);
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage(error.message);
        setNewPassword('');
        setReNewPassword('');

        setPromptForCredentials(null);
        return;
      }

        try {
  
        await updatePassword(auth.currentUser, newPassword);
        setPromptForCredentials(null);
        setNewPassword('');
        setReNewPassword('');
        setShowNotification(true);
        setNotificationTitle('Success');
        setNotificationMessage('Your password has been updated successfully');
      } catch (error) {
        setShowNotification(true);
        setNotificationTitle('Error');
        setNotificationMessage(error.message);
      }
    };

    const handleSendEmailResetPassword = async () => {
      try {
          await sendPasswordResetEmail(auth, user.email);

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

    //#endregion  
    //#region Render
    return (
        <div>
            <ProfilePageTitle heading='User Profile' title='User' />

            <section className="user-profile flat-tabs">
            <div className="container">
                <div className="row">
                <Tabs>
                    <TabList>
                        <div className="user-info center">
                          <form onSubmit={(e) => updateAvatarInBD(e)}>
                            <div className="avt">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="imgInp"
                                onChange={(e) => loadUserAvatar(e)}
                                required
                              />
                                <img id="blah" src={user.avatarLink.length > 0 ? user.avatarLink  : img} alt="no file" 
                              />
                            </div>

                            {isUpdateAvatarButton && (
                              <button 
                                type="submit" 
                                className="btn-action mt-15"
                              >
                                Update avatar
                              </button> 
                            )}
                            
                          </form>
                            <h6 className="name">
                                {updatedData.fullName}
                            </h6>
                            <p>
                                {updatedData.email}
                            </p>
                        </div>
                        { 
                            dataCoinTab.map(idx => (
                              <Tab key={idx.id}>
                                <h6 className="fs-16">
                                  <i className={`fa ${idx.icon}`}></i>
                                  {idx.title}
                                </h6>
                              </Tab>
                            ))
                        }

                    </TabList>

                    <TabPanel>
                      <div className="content-inner profile" >
                        <form action="#" onSubmit={(e) => handleSubmitUserData(e)}>
                          <h4>User Profile</h4>
                          <h6>Information</h6>

                          <div className="form-group d-flex s1 ">
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Enter your Name"
                              value={updatedData.fullName} 
                              onFocus={() => {
                                setIsUpdating(true);
                              }}
                              onChange={(e) => setUpdatedData({...updatedData, fullName: e.target.value})}
                            />
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Enter your Name"
                              value={updatedData.fullName} 
                              onFocus={() => {
                                setIsUpdating(true);
                              }}
                              onChange={(e) => setUpdatedData({...updatedData, fullName: e.target.value})}
                            />
                          </div>
                          <div className="form-group d-flex UserEmailContainer">
                            <input
                              type="email"
                              className="form-control UserEmailInput"
                              placeholder="Enter your email"
                              id="exampleInputEmail1"
                              value={updatedData.email}
                              onFocus={() => {
                                setIsUpdating(true);
                              }}
                              onChange={(e) => {
                                setIsUpdateEmail(true);
                                setUpdatedData({...updatedData, email: e.target.value, isEmailVerified: false});
                              }}
                            />

                            {user.isEmailVerified && !isUpdateEmail
                              ? <div className={'EmailVerifiedIcon'} title={'Verified'}>
                                <GiConfirmed/>
                                </div>
                              : <button
                                  type={'button'}
                                  onClick={handleSendEmailVerificationClick}
                                  className={'btn-action EmailVerificationButton'}
                                >
                                  {'Verify'}
                                </button>
                            }

                            <div className="sl">
                            <PhoneInput 
                              onFocus={() => {
                                setIsUpdating(true);
                              }}
                              placeholder="Enter your phone number"
                              value={phoneNumber}
                              onChange={setPhoneNumber}
                            />
                            </div>
                          </div>
                          
                          {isUpdating && (
                            <div className="form-group d-flex">
                              <button 
                                className="btn-action mt-0 full-width" 
                                type="submit"
                              >
                                Update User Data
                              </button>
                          </div>
                          )}
                          

                            <div className="form-group d-flex flex-center">
                              <button 
                              className="btn-action mt-0" 
                              type="button"
                              onClick={(event) => handleLogOut(event)}
                            >
                                LogOut
                              </button>  
                            </div>
                            
                            {/*<div className="form-group d-flex">*/}
                            {/*    <select className="form-control" id="exampleFormControlSelect2">*/}
                            {/*    <option>South Korean</option>*/}
                            {/*    <option>Vietnamese</option>*/}
                            {/*    <option>South Korean</option>*/}
                            {/*    <option>South Korean</option>*/}
                            {/*    </select>*/}
                            {/*    <div className="sl">*/}
                            {/*    <select*/}
                            {/*        className="form-control gt"*/}
                            {/*        id="exampleFormControlSelect3"*/}
                            {/*    >*/}
                            {/*        <option>Male</option>*/}
                            {/*        <option>Female</option>*/}
                            {/*    </select>*/}
                            {/*    <input*/}
                            {/*        className="form-control fc-datepicker"*/}
                            {/*        placeholder="dD/MM/YY"*/}
                            {/*        type="text"*/}
                            {/*    />*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<h6 className="two">Features</h6>*/}
                            {/*<div className="bt d-flex">*/}
                            {/*    <div className="left">*/}
                            {/*    <h6>level 1</h6>*/}
                            {/*    <ul>*/}
                            {/*        <li>*/}
                            {/*        <p>Deposit assets</p>*/}
                            {/*        <input*/}
                            {/*            type="checkbox"*/}
                            {/*            className="check-box__switcher"*/}
                            {/*            checked*/}
                            {/*        />*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*        <p>Withdraw assets</p>*/}
                            {/*        <p className="text">Enabled $1,000,000/day</p>*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*        <p>Card purchases</p>*/}
                            {/*        <input type="checkbox" className="check-box__switcher" />*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*        <p>Bank deposit</p>*/}
                            {/*        <input type="checkbox" className="check-box__switcher" />*/}
                            {/*        </li>*/}
                            {/*    </ul>*/}
                            {/*    </div>*/}
                            {/*    <div className="right">*/}
                            {/*    <h6>level 2</h6>*/}
                            {/*    <ul>*/}
                            {/*        <li>*/}
                            {/*        <p>Fiat and Spot wallet</p>*/}
                            {/*        <input*/}
                            {/*            type="checkbox"*/}
                            {/*            className="check-box__switcher"*/}
                            {/*            checked*/}
                            {/*        />*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*        <p>Margin wallet</p>*/}
                            {/*        <p className="text">Enabled 100x Leverage</p>*/}
                            {/*        </li>*/}
                            {/*    </ul>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<button type="submit" className="btn-action">*/}
                            {/*    Update Profile*/}
                            {/*</button>*/}
                            </form>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="content-inner referrals">
                            <h6>Total rewards</h6>
                            <h4>$1,056.00 <span>USD</span></h4>
                            <p>
                                You're earning of the trading fees your referrals pay.
                                Learn more
                            </p>
                            <div className="main">
                            <h6>Invite friends to earn</h6>

                            {/*<div className="refe">*/}
                            {/*    <div>*/}
                            {/*    <p>Referral link</p>*/}
                            {/*    <input*/}
                            {/*        className="form-control"*/}
                            {/*        type="text"*/}
                            {/*        value="https://accounts.BinanceBot.com/login"*/}
                            {/*    />*/}
                            {/*    </div>*/}
                            {/*    <div>*/}
                            {/*    <p>Referral code</p>*/}
                            {/*    <input*/}
                            {/*        className="form-control"*/}
                            {/*        type="text"*/}
                            {/*        value="N84CRDKK"*/}
                            {/*    />*/}
                            {/*    <span className="btn-action">Copied</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            </div>

                            <Link to="/wallet" className="btn-action">My Wallet</Link>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="content-inner api">
                            <h6>Enable API access on your account to generate keys.</h6>
                            <h4>API Access is <span>Disabled</span></h4>
                            <p className="mail">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5ZM4 3C2.34315 3 1 4.34315 1 6V18C1 19.6569 2.34315 21 4 21H20C21.6569 21 23 19.6569 23 18V6C23 4.34315 21.6569 3 20 3H4Z"
                                fill="#23262F"
                                />
                                <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5.2318 7.35984C5.58537 6.93556 6.21593 6.87824 6.64021 7.2318L11.3598 11.1648C11.7307 11.4739 12.2694 11.4739 12.6402 11.1648L17.3598 7.2318C17.7841 6.87824 18.4147 6.93556 18.7682 7.35984C19.1218 7.78412 19.0645 8.41468 18.6402 8.76825L13.9206 12.7013C12.808 13.6284 11.192 13.6284 10.0795 12.7013L5.35984 8.76825C4.93556 8.41468 4.87824 7.78412 5.2318 7.35984Z"
                                fill="#23262F"
                                />
                            </svg>
                                {user?.email}
                            </p>
                            <div className="main">
                            {/*<h6>Enable API keys</h6>*/}
                            {/*<p>Enter your password and 2FA code to Enable the API keys</p>*/}

                            <div className="refe">
                                <div className="form-group">
                                <p>Your Password</p>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Password"
                                />
                                </div>
                                <div className="form-group">
                                <p>2FA Code</p>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="2FA code"
                                />
                                </div>
                            </div>
                            <Link to="#" className="btn-action">Enable API keys</Link>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel> 
                      <div className="content-inner api">
                        <h6>You can change your Password</h6>
                        <form onSubmit={(e) => handleSubmitPassword(e)}>
                          <div className="main">
                            <div className="refe">
                              <div className="form-group">
                               <p>Your New Password</p>
                                <input
                                  className="form-control"
                                  type="password"
                                  placeholder="New Password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <p>Re-enter your new password</p>
                                <input
                                  className="form-control"
                                  type="password"
                                  placeholder="re-enter New Password"
                                  value={reNewPassword}
                                  onChange={(e) => setReNewPassword(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="center">
                              <button 
                                className="btn-action mb-20"
                                type="submit"
                              >
                                Change password
                              </button>
                              <div className="bottom">
                                <button 
                                  type="button"
                                  className="buttonText"
                                  onClick={handleSendEmailResetPassword}
                                >
                                  Forgot your password?
                                </button>
                                </div>
                            </div>
                          </div>
                        </form>
                          
                        </div>
                    </TabPanel>
                    {/*<TabPanel>*/}
                    {/*    <div className="content-inner api">*/}
                    {/*        <h4>2FA <span className="color-success">Enabled</span></h4>*/}
                    {/*        <p>*/}
                    {/*        If you want to turn off 2FA, input your account password and*/}
                    {/*        the six-digit code provided by the Google Authenticator app*/}
                    {/*        below, then click <strong>"Disable 2FA"</strong>.*/}
                    {/*        </p>*/}

                    {/*        <div className="main">*/}
                    {/*        <h6>Disable 2FA</h6>*/}
                    {/*        <p>*/}
                    {/*            Enter your password and 2FA code to Disable the 2FA*/}
                    {/*            verification*/}
                    {/*        </p>*/}

                    {/*        <div className="refe">*/}
                    {/*            <div className="form-group">*/}
                    {/*            <p>Your Password</p>*/}
                    {/*            <input*/}
                    {/*                className="form-control"*/}
                    {/*                type="password"*/}
                    {/*                placeholder="Passworld"*/}
                    {/*            />*/}
                    {/*            </div>*/}
                    {/*            <div className="form-group">*/}
                    {/*            <p>2FA Code</p>*/}
                    {/*            <input*/}
                    {/*                className="form-control"*/}
                    {/*                type="text"*/}
                    {/*                placeholder="2FA code"*/}
                    {/*            />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <Link to="#" className="btn-action">Disable 2FA verification</Link>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</TabPanel>*/}
                    {/*<TabPanel>*/}
                    {/*    <div className="content-inner profile change-pass">*/}
                    {/*        <h4>Change Password</h4>*/}
                    {/*        <h6>New Passworld</h6>*/}
                    {/*        <form action="#">*/}
                    {/*        <div className="form-group">*/}
                    {/*            <div>*/}
                    {/*            <label>Old Passworld<span>*</span>:</label>*/}
                    {/*            <input*/}
                    {/*                type="text"*/}
                    {/*                className="form-control"*/}
                    {/*                value="123456789"*/}
                    {/*            />*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*            <label>2FA Code<span>*</span>:</label>*/}
                    {/*            <input type="text" className="form-control" />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className="form-group">*/}
                    {/*            <div>*/}
                    {/*            <label>New Passworld<span>*</span>:</label>*/}
                    {/*            <input*/}
                    {/*                type="password"*/}
                    {/*                className="form-control"*/}
                    {/*                placeholder="New Passworld"*/}
                    {/*            />*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*            <label>Confirm Passworld<span>*</span>:</label>*/}
                    {/*            <input*/}
                    {/*                type="password"*/}
                    {/*                className="form-control"*/}
                    {/*                placeholder="Confirm Passworld"*/}
                    {/*            />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        </form>*/}
                    {/*        <button type="submit" className="btn-action">*/}
                    {/*        Change Passworld*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</TabPanel>*/}
                </Tabs>
                </div>
            </div>
            </section>

            {/*<Sale01 />*/}

            {showNotification &&
              <ModalNotification
                showModal={showNotification}
                setShowModal={setShowNotification}
                title={notificationTitle}
                message={notificationMessage}
                areAuthButtonsVisible={false}
              />
            }

            {showReAutrnticateNotification &&
              <ModalReAuthenticate
                showModal={showReAutrnticateNotification}
                setShowModal={setShowReAutrnticateNotification}
                title={notificationTitle}
                setPromptForCredentials={setPromptForCredentials}
              />
            }
        </div>
    );
    //#endregion
}

export default UserProfile;
