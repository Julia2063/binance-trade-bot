import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import './ScreenSix.scss';

import '../../../scss/components/_swiper.scss';


export const ScreenSix = () => {
    const roadMap = [
        {
            id: 1,
            q: 3,
            year: 2023,
            text: ['Start trading on Binance.', 'Creation of a trading pool.', 'Release our own token.']
        },
        {
            id: 2,
            q: 4,
            year: 2023,
            text: ['Development of a staking program.', 'Connecting popular exchanges.']
        },
        {
            id: 3,
            q: 1,
            year: 2024,
            text: ['Development of a mechanism for working with Dex - exchanges.']
        },
        {
            id: 4,
            q:2,
            year: 2024,
            text: ['Creating a multi-currency wallet']
        },
        {
            id: 5,
            q: 3,
            year: 2024,
            text: ['Start trading on DEX - exchanges in automatic mode']
        },
        {
            id: 6,
            q: 4,
            year: 2024,
            text: ['Token Listing']
        },
    ]

    return (
        <section className='screenSix'>
           <h2>ROAD MAP</h2>
           <Swiper
              slidesPerView={3}
              spaceBetween={40}
            
              navigation
              modules={[Navigation]}
              className='swiper'
        >
          
          {roadMap.map(el => (
            <SwiperSlide key={el.id} className='slide' >
                <div className='screenSix__date'>
                    <div className='screenSix__date__q'>{`Q${el.q}`}</div>
                    <span className='screenSix__date__year'>{el.year}</span>
                </div>
                <ul>
                    {el.text.map(e => (
                    <li key={e}>{e}</li>
                ))}</ul>
              
             
            </SwiperSlide>
          ))}
        </Swiper>
        </section>
    )
}