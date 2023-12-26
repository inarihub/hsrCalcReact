import { useState } from 'react';
import classes from './App.module.scss';
import { Link, Outlet, redirect, useNavigate } from 'react-router-dom';
import { UserModule } from './userModule/UserModule';
import { Panel } from './panel/Panel';

export const App = () => {
    const [count, setCount] = useState<number>(0);
    const increment = () => setCount(prev => prev + 1);
    const clear = () => setCount(prev => 0);
    const navigate = useNavigate();

    return (
        <div className={classes.main}>
            <Panel />
            <div className={classes.modulesContainer}>
                <UserModule />
                <Outlet />
            </div>
        </div>
    );
};