import { InfoItem } from '../../InfoItem/InfoItem';
import './ScreenThree.scss';

import icon1 from '../../../assets/images/icon/homePage1.svg';
import icon2 from '../../../assets/images/icon/homePage2.svg';
import icon3 from '../../../assets/images/icon/homePage3.svg';
import icon4 from '../../../assets/images/icon/homePage4.svg';
import icon5 from '../../../assets/images/icon/homePage5.svg';
import icon6 from '../../../assets/images/icon/homePage6.svg';

export const ScreenThree = () => {

    const content = [
        {
            img: icon1,
            title: 'Advanced Parameters',
            text: 'Offers a powerful and customizable tool for passive income in the cryptocurrency market.'
        },
        {
            img: icon2,
            title: 'Currencies & Commodities',
            text: 'Provides specialized data, analysis, and insights for currency and commodity markets, empowering users with valuable information for trading decisions.'
        },
        {
            img: icon3,
            title: 'Cyrptocurrencies',
            text: 'Real-time data, interactive charts, and advanced analysis tools, facilitating informed trading decisions in the dynamic crypto market.'
        },
        {
            img: icon4,
            title: 'Cloud-based',
            text: 'Our algorithms work reliably 24/7 and never miss a trade. We eliminate the need to set up your own trading servers!'
        },
        {
            img: icon5,
            title: 'Secure',
            text: 'Your funds lie safely on your exchange. We only use official exchange APIs.'
        },
        {
            img: icon6,
            title: 'Encrypted',
            text: 'Your trading strategies are end-to-end encrypted. We can\'t see your strategies as they are in-browser encrypted.'
        },
    ]

    return (
        <section className='screenThree'>
            <div className='container'>
                <h2>Your funds and algorithms are safe.</h2>
                <div className='screenThree__content'>
                     {content.map(item => (
                        <div key={item.title}>
                           
                            <InfoItem 
                            
                                title={item.title}
                                text={item.text}
                                Img={item.img}
                                clTitle='screenThree__content__title'
                                clText='screenThree__content__text'
                                clImg='screenThree__content__img'
                            />
                        </div>
                        
                     ))}
                </div>
            </div>
           
        </section>
    )
};