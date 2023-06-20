import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Link } from 'react-router-dom';
import img1 from '../../assets/images/layout/banner-01.png'


import { Navigation, Scrollbar, A11y   } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import Button from '../button';
import {getTranslation} from "../../helpers/adminHelper";
import {AppContext} from "../../helpers/appContext";
import EventCard from "../custom/EventCard";
import ModalBuyToken from "../modals/ModalBuyToken";

Banner01.propTypes = {
    data: PropTypes.array,
};

function Banner01(props) {
    const {data} = props;

    //#region Get data from AppContext (including language)
    const {user, dictionary, defaultDictionary} = useContext(AppContext);
    //#endregion

    const [dataBlock] = useState(
        {
            title: 'Buy & Sell Digital Assets With Profit',
            desc : 'Binance bot is a safe, comfortable way to get passive income using crypto asset exchange.',
            // title2: 'Our Partners'
        }
    );

    //#region Render
    return (
        <section className="banner">
                <div className="container">
                    <div className="row">
                    <div className="col-xl-6 col-md-12">
                        <div className="banner__content">
                        <h2 className="title">{dataBlock.title}</h2>
                        <p className="fs-20 desc">
                            {dataBlock.desc}
                        </p>
                        <Button
                            title={getTranslation('Get started now', dictionary, defaultDictionary)}
                            path='/work-page'
                        />
                        {/*<div className="partner">*/}
                        {/*    <h6>{dataBlock.title2}</h6>*/}
                        {/*    <div className="partner__list">*/}

                        {/*    <Swiper*/}
                        {/*        modules={[Navigation,  Scrollbar, A11y ]}*/}
                        {/*            spaceBetween={65}*/}
                        {/*            slidesPerView={4}*/}
                        {/*            className="swiper-partner"*/}
                        {/*        >*/}
                        {/*        {*/}
                        {/*            data.map(idx => (*/}
                        {/*                <SwiperSlide key={idx.id}>*/}
                        {/*                    <Link to="#">*/}
                        {/*                        <img src={idx.img} alt="BinanceBots"/>*/}
                        {/*                    </Link>*/}
                        {/*                </SwiperSlide>*/}

                        {/*            ))*/}
                        {/*        }*/}
                        {/*    </Swiper>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-12">
                        <div className="banner__image">
                            <div className={'EventContainer'}>
                                <EventCard eventId={'5y1IvZRaz6fIurbVevtP'} setShowModal={props.setShowModal} />
                            </div>
                            <div className={'ImageContainer'}>
                                <img
                                    src={img1}
                                    alt="Binance Bot"
                                    className={'BannerImage'}
                                />
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
    );
    //#endregion
}

export default Banner01;
