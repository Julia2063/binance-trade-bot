import './ScreenFour.scss'

export const ScreenFour = () => {

    return (
        <section className='screenFour'>
            <div className='screenFour__item'>
                <div className='screenFour__item__count'>5<span>K</span></div>
                <div className='screenFour__item__content'>TRADERS AND CUSTOMERS WORLDWIDE </div>
            </div>
            <div className='screenFour__item'>
                <div className='screenFour__item__count'>20<span>K</span></div>
                <div className='screenFour__item__content'>BOTS STARTED</div>
            </div>
            <div className='screenFour__item'>
                <div className='screenFour__item__count'>$150<span>K</span></div>
                <div className='screenFour__item__content'>TRADING VOLUME</div>
            </div>
        </section>
    )
};