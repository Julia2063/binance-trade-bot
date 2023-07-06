import { useNavigate } from 'react-router-dom';
import './ScreenNine.scss';
import { useContext } from 'react';
import { AppContext } from '../../../helpers/appContext';

export const ScreenNine = () => {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    return (
        <section className='screenNine'>
            <div className='container'>
                <div className='screenNine__title'>
                    Create your crypto trading bot now and unlock the power of automation!
                </div>
                <button className='btn-action' onClick={() => navigate(user.idPost ? '/work-page' : '/register')}>
                    Start free
                </button>
            </div>
            <div className='screenNine__background'></div>
        </section>
    )
}