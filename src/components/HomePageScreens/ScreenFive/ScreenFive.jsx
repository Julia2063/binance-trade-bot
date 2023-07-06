import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { Timer } from '../../Timer/Timer';
import './ScreenFive.scss';

export const ScreenFive = () => {
    return (
        <section className='screenFive'>
            
            <div className='container'> 
              <h2>Token presale</h2>
              
              <Timer date={new Date('2023/09/10')} />
              
              <ProgressBar proc={'5%'} />
              <button className='btn-action btn-action--disabled' disabled>
                Comming soon
              </button>
            </div>
            
        </section>
    )
}