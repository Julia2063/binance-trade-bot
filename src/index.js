import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './App.scss'
import ScrollToTop from "./ScrollToTop";
import {AppProvider} from "./helpers/appContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.Fragment>
        <BrowserRouter>
        <ScrollToTop />
            <AppProvider>
                <App />
            </AppProvider>
        </BrowserRouter>
    </React.Fragment>
);

