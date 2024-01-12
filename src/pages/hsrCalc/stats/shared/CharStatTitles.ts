import { EntityProperty } from "../Stat.types";
import { CharacterBuffsKey, CharacterStatKey } from "../char/Character";
import { EnemyDebuffKey, EnemyStatKey } from "../enemy/Enemy";

const charTitles = {
    multiplier: 'Dmg multiplier',
    crrate: 'Crit. rate%',
    crdmg: 'Crit.DMG%',
    baseatk: 'Base Atk',
    basehp: 'Base HP',
    basedef: 'Base Def',
    flatatk: 'Flat Atk',
    flathp: 'Flat HP',
    flatdef: 'Flat Def',
    atkIncrease: 'Atk%',
    hpIncrease: 'HP%',
    defIncrease: 'Def%',
    dmgIncrease: 'Dmg%',
    defIgnore: 'Def Ignore',
    resPen: 'Res Pen'
};

const enemyTitles = {
    lvl: 'Level',
    res: 'Res%',
    def: 'Defense',
    defReduction: 'Def reduction%',
    resReduction: 'Res reduction%',
    dmgTakenIncrease: 'More DMG taken%',
    brokenMultiplier: 'Is broken'
};

function isChar(key: string): key is CharacterStatKey | CharacterBuffsKey {
    return (Object.keys(charTitles)).indexOf(key) !== -1;
};

function isEnemy(key: string): key is EnemyStatKey | EnemyDebuffKey {
    return (Object.keys(enemyTitles)).indexOf(key) !== -1;
};

export const getTitle = (key: string): string => {
    if (isChar(key)) {
        return charTitles[key];
    }
    if (isEnemy(key)) {
        return enemyTitles[key];
    }

    return 'null';
};