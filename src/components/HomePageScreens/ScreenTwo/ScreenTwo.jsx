import { InfoItem } from '../../InfoItem/InfoItem';
import './ScreenTwo.scss';

export const ScreenTwo = () => {
    const leftSide = [
        {
            title: 'Speed & Precision',
            text: 'Our mechanisms allow you to set the best combination of parameters for buying or selling.'
        },
        {
            title: 'Increase Margins',
            text: 'Leverage speed and efficiency to increase profit margins.'
        },
        {
            title: 'Reduce Mistakes',
            text: 'Trade without letting emotions get in the way of realizing profits or preventing losses.'
        },
    ];

    const rightSide = [
        {
            title: 'Trade 24/7/365',
            text: 'Use crypto trading bots running proven strategies and let them trade around your schedule, 24 hours, day or night.'
        },
        {
            title: 'Risk Management',
            text: 'Use the right risk management with a cool head'
        },
        {
            title: 'Improve Efficiency',
            text: 'Let trade automation perform mundane and repetitive tasks.'
        },
    ];

    return (
        <section className='screenTwo'>
            <div className='container'></div>
            <h2>Create, Test and Run Your Crypto Trading Bot In Minutes</h2>
            <div className='screenTwo__content'>
                <div className='screenTwo__content__item'>
                    {leftSide.map(item => (
                        <InfoItem 
                          key={item.title}
                          title={item.title}
                          text={item.text}
                          clTitle='screenTwo__content__title'
                          clText='screenTwo__content__text'
                        />
                    ))}    
                </div>
                <div>
                  <img src={require('../../../assets/images/homePage/screen.png')}  alt=''/>
                </div>
                <div className='screenTwo__content__item'>
                    {rightSide.map(item => (
                        <InfoItem 
                          key={item.title}
                          title={item.title}
                          text={item.text}
                          clTitle='screenTwo__content__title'
                          clText='screenTwo__content__text'
                        />
                    ))}    
                </div>
            </div>
        </section>
    )
};