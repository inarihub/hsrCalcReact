import { useNavigate } from "react-router-dom";
import classes from "./Panel.module.scss";
import img from '../../assets/img/hsr_logo.png';

export const Panel = () => {
    const navigate = useNavigate();
    return (
        <div className={classes.mainPanel}>
            <div className={classes.logoContainer}>
                <img className={classes.logo} src={img} alt=''></img>
            </div>
            <div className={classes.navigationContainer}>
                <button className={classes.navButton} onClick={() => navigate('/hsrCalc')}>HSRCalc</button>
                <button className={classes.navButton} onClick={() => navigate('/about')}>About</button>
            </div>
        </div>
    );
}