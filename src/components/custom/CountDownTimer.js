import React, {useEffect} from 'react';
import { useTimer } from 'use-timer';
import Timer from "react-compound-timer";
import {Col, Row} from "react-bootstrap";

function CountDownTimer({expiryTimestamp}) {
    //#region Render
    return (
        <>
            <Timer
                initialTime={expiryTimestamp - Date.now()}
                direction="backward"
            >
                {() => (
                    <React.Fragment>
                        {/*<div className={'TimerContainer'}>*/}
                        {/*    <span className={'Timer_Item'}>*/}
                        {/*        <Timer.Days />*/}
                        {/*    </span>*/}
                        {/*    <span>{' : '} </span>*/}
                        {/*    <span className={'Timer_Item'}>*/}
                        {/*        <Timer.Hours />*/}
                        {/*    </span>*/}
                        {/*    <span>{' : '} </span>*/}
                        {/*    <span className={'Timer_Item'}>*/}
                        {/*        <Timer.Minutes />*/}
                        {/*    </span>*/}
                        {/*    <span>{' : '} </span>*/}
                        {/*    <span className={'Timer_Item'}>*/}
                        {/*        <Timer.Seconds />*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                        <div className={'Timer_Titles'}>
                            <Row>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        {'D'}
                                    </div>
                                </Col>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        {'H'}
                                    </div>
                                </Col>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        {'M'}
                                    </div>
                                </Col>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        {'S'}
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <h6>
                            <Row>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        <Timer.Days />
                                    </div>
                                </Col>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        <Timer.Hours />
                                    </div>
                                </Col>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        <Timer.Minutes />
                                    </div>
                                </Col>
                                <Col md={3} xs={3} className={'TimerItemContainer'}>
                                    <div className={'Timer_Item'}>
                                        <Timer.Seconds />
                                    </div>
                                </Col>
                            </Row>
                        </h6>
                    </React.Fragment>
                )}
            </Timer>
        </>
    );
    //#endregion
}

export default CountDownTimer;
