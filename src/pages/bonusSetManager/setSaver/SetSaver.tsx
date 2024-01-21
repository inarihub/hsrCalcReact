import classes from './SetSaver.module.scss';

export const SetSaver = () => {
    return (<div className={classes.saveModule}>
        <p className={classes.header}>Save set:</p>
        <div className={classes.saveControls}>

            <select defaultValue={'none'}>
                <option hidden disabled value={'none'}>-select type-</option>
                <option value={'teammate'}>Teammate</option>
                <option value={'weapon'}>Weapon</option>
                <option value={'realics'}>Relics</option>
                <option value={'planars'}>Planars</option>
            </select>

            <input type='text' placeholder='Type the name of set'></input>

            <button>Save</button>

        </div>
    </div>);
};