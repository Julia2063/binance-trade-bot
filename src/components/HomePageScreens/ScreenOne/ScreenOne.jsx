import { useNavigate } from 'react-router-dom';
import './ScreenOne.scss';

export const ScreenOne = () => {

    const navigate = useNavigate();

    return (
        <section className='screenOne'>
            <div className='screenOne__content'>
                <div className='screenOne__text'>
                    <h1>
                        Auto buy low and sell&nbsp;
                        <span>high</span>&nbsp;
                        with exclusive crypto&nbsp; 
                        <span>trading </span>
                        bot
                    </h1>
                    <button 
                      className='btn-action'
                      onClick={() => navigate('/register')}
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