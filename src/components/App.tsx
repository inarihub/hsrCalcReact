import classes from './App.module.scss';
import { Outlet } from 'react-router-dom';
import { UserModule } from './userModule/UserModule';
import { Panel } from './panel/Panel';

declare const APP_VERSION: string;

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
                <p style={{fontSize: 14, textAlign: 'right', paddingRight: 14}}>ver.{APP_VERSION}</p>
            </div>
        </div>
    );
};