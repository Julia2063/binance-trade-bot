import './ScreenFour.scss'

export const ScreenFour = () => {

    return (
        <section className='screenFour'>
            <div className='screenFour__item'>
                <div className='screenFour__item__count'>500<span>K</span></div>
                <div className='screenFour__item__content'>TRADERS WORLDWIDE</div>
            </div>
            <div className='screenFour__item'>
                <div className='screenFour__item__count'>3.7<span>M</span></div>
                <div className='screenFour__item__content'>BOTS STARTED</div>
            </div>
            <div className='screenFour__item'>
                <div className='screenFour__item__count'>$300<span>B</span></div>
                <div className='screenFour__item__content'>TRADING VOLUME</div>
            </div>
        </section>
    )
};