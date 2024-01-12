import { useState } from 'react';
import classes from './App.module.scss';
import { Link, Outlet, redirect, useNavigate } from 'react-router-dom';
import { UserModule } from './userModule/UserModule';
import { Panel } from './panel/Panel';

export const App = () => {

    return (
        <div>
            <div className={classes.bgContainer}>
                <div className={classes.bg}></div>
            </div>
            <div className={classes.main}>
                <Panel />
                <div className={classes.modulesContainer}>
                    <UserModule />
                    <Outlet />
                </div>
            </div>
        </div>

    );
};