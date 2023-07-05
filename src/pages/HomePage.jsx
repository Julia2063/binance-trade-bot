import React from 'react';
import { ScreenOne } from '../components/HomePageScreens/ScreenOne/ScreenOne';
import { ScreenTwo } from '../components/HomePageScreens/ScreenTwo/ScreenTwo';
import { ScreenThree } from '../components/HomePageScreens/ScreenThree/ScreenThree';
import { ScreenFour } from '../components/HomePageScreens/ScreenFour/ScreenFour';
import { ScreenEight } from '../components/HomePageScreens/ScreenEight/ScreenEight';
import { ScreenNine } from '../components/HomePageScreens/ScreenNine/ScreenNine';
import { ScreenFive } from '../components/HomePageScreens/ScreenFive/ScreenFive';
import { ScreenSix } from '../components/HomePageScreens/ScreenSix/ScreenSix';
import { ScreenSeven } from '../components/HomePageScreens/ScreenSeven/ScreenSeven';

function HomePage(props) {

    return (
        <div className='homePage'>
            <div className='container'>
                <ScreenOne />
                <ScreenTwo />
                
            </div>
            <ScreenThree />
            <ScreenFour />
            <ScreenFive />
            <div className='container'>
                
                <ScreenSix />
            </div>
            <ScreenSeven/>
            <ScreenEight/>
            <ScreenNine />
            
        </div>
    )
}

export default HomePage;
