import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { Timer } from '../../Timer/Timer';
import './ScreenFive.scss';

export const ScreenFive = () => {
    return (
        <section className='screenFive'>
            
            <div className='container'> 
              <h2>Token presale</h2>
              
              <Timer date={new Date('2023/08/06')} />
              
              <ProgressBar proc={'70%'} />
              <button className='btn-action'>
                Buy
              </button>
            </div>
            
        </section>
    )
}