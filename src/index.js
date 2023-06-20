import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import './App.scss'
import ScrollToTop from "./ScrollToTop";
import {AppProvider} from "./helpers/appContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.Fragment>
        <Router>
        <ScrollToTop />
            <AppProvider>
                <App />
            </AppProvider>
        </Router>
    </React.Fragment>
);

