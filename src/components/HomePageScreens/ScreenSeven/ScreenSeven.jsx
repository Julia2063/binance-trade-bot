import { InfoDrop } from '../../InfoDrop/InfoDrop';
import './ScreenSeven.scss';

export const ScreenSeven = () => {
    const questions = [
        {
            title: 'How long does it take to set up a trading bot?',
            text: 'The bot takes no more than five minutes to connect. You need to follow the steps as shown in the video'
        },
        {
            title: 'Is it safe to trade with your crypto bot?',
            text: 'The robot is completely safe, unable to withdraw your funds. It is only capable of trading on the exchange. The algorithm of operation is created in such a way that it can not lose money when trading, as the trade is carried out exclusively on spot, as well as in compliance with money management'
        },
        {
            title: 'How much money do I need to start trading with crypto bot?',
            text: 'For normal trading and compliance with all levels of money management, the recommended deposit on your account should be 500 USDT and more. The robot will work with a smaller sum, but it is not recommended to use it if the deposit is less than 200 USDT. In this case, we recommend using our trading pool'
        },
        {
            title: 'What crypto pairs are available for bot trading?',
            text: 'The robot uses ten basic cryptocurrencies for trading: BTC, ETH, BNB, XRP, XNO, XLM, LTC, SOL, DOT, XRM'
        },
    ]

    return (
        <section className='screenSeven'>
            <div className='container'>
                <h2>FAQ</h2>
                <div className='screenSeven__description'>
                    If you have any questions about our website, Here are answers to the most frequently asked questions. If you cannot find your answer below, please contact us via the contact
                </div>
                <div className='screenSeven__content'>
                    {questions.map(el => (
                    <InfoDrop item={el} key={el.title} />
                ))}
                </div>
                
            </div>
        </section>
    )
}