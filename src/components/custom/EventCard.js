import React, {useEffect, useState} from 'react';
import {auth, getDocInCollection} from "../../helpers/firebaseConfigAndControls";
import {collectionsNames} from "../../helpers/models";
import CountDownTimer from "./CountDownTimer";
import {ProgressBar} from "react-bootstrap";
import Button from "../button";
import ModalBuyToken from "../modals/ModalBuyToken";
import ModalNotification from "../modals/ModalNotification";

const EventCard = ({eventId, setShowModal}) => {
    //#region Get event data from DB
    const [eventData, setEventData] = useState({
        startDate: 1672524000000,
        soldAmount: 46541,
        totalAmount: 1000000,
    });

    useEffect(() => {
        // getDocInCollection(collectionsNames.events, eventId)
        //     .then(event => setEventData(event)).catch(error => console.log(error));
    }, []);
    //#endregion

    //#region Handle notification modal appearance and content
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    //#endregion

    //#region Handle buy tokens click
    const handleBuyTokensClick = () => {
        if (auth.currentUser) {
            setShowModal(true);
        } else {
            setShowNotification(true);
            setNotificationTitle('Notification');
            setNotificationMessage('Only registered users can buy tokens. Please sign in or register.')
        }
    }
    //#endregion

    //#region Render
    return (
        <>
            <div className={'EventCard'}>
                <h6
                    className={'EventCard_Item EventCard_Title'}
                >
                    Hurry, Final Stage
                </h6>

                {eventData?.startDate &&
                    <div className={'EventCard_Item'}>
                        <CountDownTimer expiryTimestamp={eventData?.startDate} />
                    </div>
                }

                <p className={'EventCard_Item'}>
                    1BCB = 1.0000 USDT
                </p>
                <div className={'EventCard_Item'}>
                    <p>USDT Raised: </p>
                    <p>
                        <span>
                            {Intl.NumberFormat('en', {minimumFractionDigits: 2, maximumFractionDigits: 4}).format(eventData.soldAmount)}
                        </span>
                        <span>
                            {' / '}
                        </span>
                        <span>
                            {Intl.NumberFormat('en', {minimumFractionDigits: 2, maximumFractionDigits: 4}).format(eventData.totalAmount)}
                        </span>
                    </p>
                </div>
                <div className={'EventCard_Item EventCard_Progress'}>
                    <p className={'SoldTokensAmount'}>
                        {Math.round(eventData.soldAmount / eventData.totalAmount * 100)}
                        {'% sold'}
                    </p>
                    <ProgressBar variant={'danger'}  now={Math.round(eventData.soldAmount / eventData.totalAmount * 100)}/>
                </div>

                <div className={'EventCard_Item'}>
                    <p className={'TokensRemained'}>
                        {'Only '}
                        {Intl.NumberFormat('en', {minimumFractionDigits: 2, maximumFractionDigits: 4}).format(eventData.totalAmount - eventData.soldAmount)}
                        {' BCB Tokens Remaining until end of Presale'}
                    </p>

                </div>

                <div className={'EventCard_Item BuyTokensButtonContainer'}>
                    <button
                        type={'button'}
                        onClick={() => handleBuyTokensClick()}
                        className={'btn-action'}
                    >
                        {'Buy tokens'}
                    </button>
                </div>
            </div>

            {showNotification &&
                <ModalNotification
                    showModal={showNotification}
                    setShowModal={setShowNotification}
                    title={notificationTitle}
                    message={notificationMessage}
                    areAuthButtonsVisible={true}
                />
            }
        </>
    );
    //#endregion
};

export default EventCard;
