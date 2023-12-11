import { useState } from 'react';
import classes from './App.module.scss';
import { Link, Outlet } from 'react-router-dom';
import { Clock } from './Clock';

export const App = () => {
const [count, setCount] = useState<number>(0);
const increment = () => setCount(prev => prev + 1);
const clear = () => setCount(prev => 0);

    return (
        <div className={classes.main}>
            <Clock />
            <Link to={'/about'}>About</Link>
            <Link to={'/store'}>Store</Link>
            <h1 className={classes.value}>Hello World!</h1>
            <h2>{count}</h2>
            <button className={classes.button} onClick={increment}>Click!</button>
            <button className={classes.button} onClick={clear}>Clear</button>
            <Outlet />
        </div>
    );
};