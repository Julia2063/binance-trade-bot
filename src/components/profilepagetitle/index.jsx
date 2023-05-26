import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import './styles.scss'
import {Link} from 'react-router-dom'
import {AppContext} from "../../helpers/appContext";

ProfilePageTitle.propTypes = {
    title: PropTypes.string,
};

function ProfilePageTitle(props) {
    //#region Get data from props
    const {title , heading} = props;
    //#endregion

    //#region Get user form context
    const {user} = useContext(AppContext);
    //#endregion

    //#region Render
    return (
        <section className="page-title">
            <div className="container">
                <div className="row">
                <div className="col-md-6">
                    <h3 className="heading">{'Balance'}</h3>
                </div>
                <div className="col-md-6">
                    <ul className="breadcrumb">
                    <li>
                        <p className="fs-18">
                            {Intl.NumberFormat('en', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(user.balanceTokens)}{' BCB'}
                        </p>
                    </li>
                    <li><p className="fs-18">/</p></li>
                    <li>
                        <p className="fs-18">
                            {Intl.NumberFormat('en', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(user.balanceUSDT)}{' USDT'}
                        </p>
                    </li>
                    </ul>
                </div>
                </div>
            </div>
        </section>
    );
    //#endregion
}

export default ProfilePageTitle;
