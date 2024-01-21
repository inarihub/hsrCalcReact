import { ResultDmg } from '../../shared/Stat.types';
import { Character } from './char/Character';
import { Enemy } from './enemy/Enemy';

export const dmgResult = (character: Character, enemy: Enemy): ResultDmg => {

    if (!character || !enemy) {
        return [0, 0, 0];
    }

    const charStats = character.stats;
    const charBuffs = character.buffs;
    
    const enemyStats = enemy.stats;
    const enemyDebuffs = enemy.debuffs;

    const brokenMultiplier = enemy.isBroken ? 1 : 0.9;

    const AttackerLvl = 80;
    const defIncrease = 0;

    const lvlBreakMultiplier = 3767.5533;
    const maxThoughness = 420;
    const maxThoughnessMultiplier = 0.5 + (maxThoughness / 120);
    const breakBaseDmg = 2 * lvlBreakMultiplier * maxThoughnessMultiplier;
    const maxHPTarget = 400000;

    const baseDmg = (charStats[`base${character.srcStat}`] * (1 + charBuffs[`${character.srcStat}Increase`]) + charBuffs[`flat${character.srcStat}`]) * charStats.multiplier;
    const dmgMultiplier = 1 + charBuffs.dmgIncrease + charBuffs.elemIncrease;

    let totalDef = enemy.stats.def * (1 + defIncrease - (enemyDebuffs.defReduction + charBuffs.defIgnore));

    if (totalDef < 0) {
        totalDef = 0;
    }

    const defMultiplier = 1 - (totalDef / (totalDef + 200 + 10 * AttackerLvl));

    let totalRes = enemyStats.res - enemyDebuffs.resReduction - charBuffs.resPen;

    if (totalRes < -1) {
        totalRes = -1;
    }

    const resMultiplier = 1 - totalRes;
    const dmgTakenMultiplier = 1 + enemyDebuffs.dmgTakenIncrease;

    const finalCrRate = character.buffs.crrate > 1 ? 1 : character.buffs.crrate;

    const dmg = Math.floor(baseDmg * dmgMultiplier * defMultiplier * resMultiplier * dmgTakenMultiplier * brokenMultiplier);
    const critDmg = Math.floor(dmg * (1 + charBuffs.crdmg));
    const avgDmg = Math.floor(dmg + (critDmg - dmg) * finalCrRate);

    return ([dmg, critDmg, avgDmg]);
    //return [0,0,0];
}