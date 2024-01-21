import classes from './EnemyStats.module.scss';
import { StatRow } from '../shared/StatRow';
import { Enemy, EnemyDebuffKey, EnemyStatKey } from './Enemy';

interface EnemyStatsProps {
    enemy: Enemy;
    onChangeCallback: (enemyStats: Enemy) => void;
}

export const EnemyStats = (props: EnemyStatsProps) => {
    const lvl = props.enemy.lvl;
    const element = props.enemy.element;
    const stats = props.enemy.stats;
    const debuffs = props.enemy.debuffs;
    const isBroken = props.enemy.isBroken;

    const changeEnemyLvl = (lvlKey: string, value: number) => {
        props.onChangeCallback(new Enemy(value, element, stats, debuffs, isBroken));
    };

    const changeEnemyStats = (statKey: EnemyStatKey, value: number) => {
        props.onChangeCallback(new Enemy(lvl, element, {...stats, [statKey]: value}, debuffs, isBroken));
    };

    const changeEnemyDebuff = (debuffKey: EnemyDebuffKey, value: number) => {
        props.onChangeCallback(new Enemy(lvl, element, stats, {...debuffs, [debuffKey]: value}, isBroken));
    };

    const changeEnemyBrokenState = (value: boolean) => {
        props.onChangeCallback(new Enemy(lvl, element, stats, debuffs, value));
    };

    return (
        <div className={classes.enemyModule}>
            <p className={classes.header}>Enemy:</p>
            <StatRow key='lvl' value={lvl} statType={'lvl'} changeCallback={changeEnemyLvl} />
            <StatRow key='res' value={stats['res']} statType={'res'} type='percent' changeCallback={changeEnemyStats} />
            <StatRow key='defReduction' value={debuffs['defReduction']} statType={'defReduction'} type='percent' changeCallback={changeEnemyDebuff} />
            <StatRow key='resReduction' value={debuffs['resReduction']} statType={'resReduction'} type='percent' changeCallback={changeEnemyDebuff} />
            <StatRow key='dmgTakenIncrease' value={debuffs['dmgTakenIncrease']} statType={'dmgTakenIncrease'} type='percent' changeCallback={changeEnemyDebuff} />
            <section className={classes.enemyBreakSection}>
                <label htmlFor='isBrokenCheck'>Is enemy broken?</label>
                <input id='isBrokenCheck' type='checkbox' checked={props.enemy.isBroken} onInput={e => {
                    changeEnemyBrokenState(!e.currentTarget.checked);
                }}></input>
            </section>
        </div>
    )
}