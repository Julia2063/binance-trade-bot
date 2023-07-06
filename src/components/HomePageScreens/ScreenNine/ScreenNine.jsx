import { useNavigate } from 'react-router-dom';
import './ScreenNine.scss';

export const ScreenNine = () => {
    const navigate = useNavigate();

    return (
        <section className='screenNine'>
            <div className='container'>
                <div className='screenNine__title'>
                    Create your crypto trading bot now and unlock the power of automation!
                </div>
                <button className='btn-action' onClick={() => navigate('/register')}>
                    Start free
                </button>
            </div>
            <div className='screenNine__background'></div>
        </section>
    )
}