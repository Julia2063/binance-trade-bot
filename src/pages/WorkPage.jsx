import React, { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AiFillAppstore } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import Bots from '../components/Bots/Bots';
import Exchanges from '../components/Exchanges/Exchanges';
import Dashboard from '../components/Dashboard/Dashboard';
import { AppContext } from '../helpers/appContext';

function WorkPage() {
    const [ tabIndex ,  setTabIndex ]  =  useState ( 0 ) ;
    const [workPageTab] = useState([
        {

            id: 1,
            title: 'Dashboard',
            icon: <AiFillAppstore />

            
            
        },
        {
           
            id: 2,
            title: 'Bots',
            icon: <svg width="16" height="20" viewBox="0 0 16 20" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.7723 11.879C15.0031 11.879 16 12.8914 16 14.1414V15.0026H15.9938C15.952 15.9776 15.6886 17.1988 14.6117 18.1963C13.4351 19.2875 11.4031 20 8 20C4.59569 20 2.56492 19.2875 1.38831 18.1963C0.311384 17.1988 0.0480001 15.9764 0.00615399 15.0026H0V14.1402C0 12.8914 0.996923 11.879 2.22769 11.879H13.7723ZM3.69231 1.25051C3.20268 1.25051 2.7331 1.44805 2.38688 1.79967C2.04066 2.15129 1.84615 2.62819 1.84615 3.12546V8.12532C1.84615 8.62259 2.04066 9.09949 2.38688 9.45111C2.7331 9.80273 3.20268 10.0003 3.69231 10.0003H12.3077C12.7973 10.0003 13.2669 9.80273 13.6131 9.45111C13.9593 9.09949 14.1538 8.62259 14.1538 8.12532V3.12546C14.1538 2.62819 13.9593 2.15129 13.6131 1.79967C13.2669 1.44805 12.7973 1.25051 12.3077 1.25051H8.61539V0.625527C8.61887 0.542509 8.60533 0.459662 8.57564 0.382234C8.54595 0.304806 8.50074 0.234487 8.44289 0.175731C8.38503 0.116976 8.31579 0.0710647 8.23956 0.0409081C8.16332 0.0107514 8.08174 -0.00299354 8 0.000544011C7.66031 0.000544011 7.38462 0.288036 7.38462 0.625527V1.25051H3.69231ZM4.30769 5.62539C4.30769 5.29388 4.43736 4.97595 4.66818 4.74153C4.89899 4.50712 5.21204 4.37542 5.53846 4.37542C5.86488 4.37542 6.17793 4.50712 6.40875 4.74153C6.63956 4.97595 6.76923 5.29388 6.76923 5.62539C6.76923 5.9569 6.63956 6.27484 6.40875 6.50925C6.17793 6.74366 5.86488 6.87536 5.53846 6.87536C5.21204 6.87536 4.89899 6.74366 4.66818 6.50925C4.43736 6.27484 4.30769 5.9569 4.30769 5.62539ZM9.23077 5.62539C9.23077 5.29388 9.36044 4.97595 9.59125 4.74153C9.82207 4.50712 10.1351 4.37542 10.4615 4.37542C10.788 4.37542 11.101 4.50712 11.3318 4.74153C11.5626 4.97595 11.6923 5.29388 11.6923 5.62539C11.6923 5.9569 11.5626 6.27484 11.3318 6.50925C11.101 6.74366 10.788 6.87536 10.4615 6.87536C10.1351 6.87536 9.82207 6.74366 9.59125 6.50925C9.36044 6.27484 9.23077 5.9569 9.23077 5.62539Z" />
            </svg>
        },
        {
            id: 3,
            title: 'Exchanges',
            icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1908 13.375C11.1908 13.6193 11.2758 13.8569 11.433 14.052C11.5902 14.2471 11.8111 14.3891 12.0622 14.4564C12.3133 14.5238 12.581 14.5128 12.8249 14.4253C13.0688 14.3378 13.2756 14.1784 13.414 13.9712L16.6479 10.9484C16.7596 10.8439 16.8481 10.7198 16.9086 10.5832C16.969 10.4467 17.0001 10.3004 17 10.1526C16.9999 10.0048 16.9688 9.85853 16.9082 9.72203C16.8477 9.58553 16.759 9.46151 16.6473 9.35706C16.5355 9.25261 16.4028 9.16977 16.2568 9.11327C16.1108 9.05677 15.9543 9.02772 15.7963 9.02777C15.6383 9.02782 15.4818 9.05698 15.3358 9.11358C15.1898 9.17017 15.0572 9.2531 14.9455 9.35763L13.5981 10.6176V2.125C13.5981 1.82663 13.4714 1.54048 13.2457 1.32951C13.0201 1.11853 12.7141 1 12.395 1C12.076 1 11.77 1.11853 11.5444 1.32951C11.3187 1.54048 11.192 1.82663 11.192 2.125L11.1908 13.375ZM8.82316 6.625C8.82316 6.38072 8.73813 6.14307 8.58092 5.94798C8.42371 5.75288 8.20287 5.61094 7.95176 5.54359C7.70065 5.47625 7.43292 5.48716 7.18904 5.57469C6.94515 5.66222 6.73835 5.8216 6.5999 6.02875L3.36728 9.05162C3.25238 9.1554 3.16072 9.27954 3.09767 9.4168C3.03462 9.55405 3.00143 9.70167 3.00005 9.85105C2.99866 10.0004 3.0291 10.1486 3.08959 10.2868C3.15008 10.4251 3.23941 10.5507 3.35237 10.6563C3.46533 10.7619 3.59965 10.8455 3.7475 10.902C3.89535 10.9586 4.05377 10.9871 4.21351 10.9858C4.37326 10.9845 4.53112 10.9534 4.6779 10.8945C4.82468 10.8355 4.95743 10.7498 5.06841 10.6424L6.41704 9.38238V17.875C6.41704 18.1734 6.54379 18.4595 6.76941 18.6705C6.99502 18.8815 7.30103 19 7.6201 19C7.93917 19 8.24517 18.8815 8.47079 18.6705C8.69641 18.4595 8.82316 18.1734 8.82316 17.875V6.625Z" />
            </svg>
            
        },
        {
            id: 4,
            title: 'Setting',
            icon: <IoSettingsOutline />
        }
    ]);

    const { user } = useContext(AppContext);

    useEffect(() => {
        if(!user.idPost) {
            setTabIndex(1);
        } else {
            setTabIndex(0);
        }
    }, [user]);

    return (
        <div className="work-page">
                <Tabs selectedIndex = { tabIndex } onSelect = { ( index )  =>  setTabIndex ( index ) }>
                        <TabList>
                            {
                                workPageTab.map(idx => (
                                    <Tab key={idx.id}>{idx.icon}{idx.title}</Tab>
                                ))
                            }
                        </TabList>
                <TabPanel>
                  <Dashboard />
                   
                </TabPanel>
                <TabPanel>
                  <Bots setTabIndex={setTabIndex} />
                </TabPanel>
                <TabPanel>
                  <Exchanges />
                </TabPanel>
                
                
                
                <TabPanel>
                Setting
                </TabPanel>
                </Tabs>
        </div>
    )
}

export default WorkPage;
