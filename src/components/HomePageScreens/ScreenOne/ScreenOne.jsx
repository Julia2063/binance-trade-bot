import { useNavigate } from 'react-router-dom';
import './ScreenOne.scss';
import { useContext } from 'react';
import { AppContext } from '../../../helpers/appContext';

export const ScreenOne = () => {
    const { user } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <section className='screenOne'>
            <div className='screenOne__content'>
                <div className='screenOne__text'>
                    <h1>
                        Auto buy <span>low</span> and sell&nbsp;
                        <span>high</span>&nbsp;
                        with exclusive crypto&nbsp; 
                        <span>trading </span>
                        bot
                    </h1>
                    <button 
                      className='btn-action'
                      onClick={() => navigate(user.idPost ? '/work-page' : '/register')}
                    >
                        Sign Up
                    </button>
                </div>
                <div className='screenOne__image'>
                    <img src={require('../../../assets/images/homePage/main.png')}  alt=''/>
                </div>
            </div>
        </section>
    )
};