import { BonusSet, BonusSetKey } from '@/pages/bonusSetManager/BonusSet';
import { AllTypesStats, AttackTypesWithAny, ElementDmgTypesWithAll, ResultDmg } from '../../shared/Stat.types';
import { Character } from './char/Character';
import { Enemy } from './enemy/Enemy';

function sumByKey(bonuses: BonusSet, key: AllTypesStats, atkType?: AttackTypesWithAny, elementType?: ElementDmgTypesWithAll): number {
    return bonuses
        .filter(e =>
            e.key === key &&
            (e.atkTypeOption === (atkType ?? e.atkTypeOption) || e.atkTypeOption === 'any') &&
            (e.elemTypeOption === (elementType ?? e.elemTypeOption) || e.elemTypeOption === 'all'))
        .map(a => a.value)
        .reduce((prev, curr) => prev + curr, 0);
}
//i think it might be calculated when useEffect maybe with atkType and elementType dependency

export const dmgResult = (character: Character, enemy: Enemy, bonuses: BonusSet): ResultDmg => {

    if (!character || !enemy || !bonuses) {
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
    
    //BASE BONUS
    const baseBonus = sumByKey(bonuses, `base${character.srcStat}`);
    const statIncreaseBonus = sumByKey(bonuses, `${character.srcStat}Increase`);
    const flatBonus = sumByKey(bonuses, `flat${character.srcStat}`);
    //BASE TOTAL
    const baseDmg = ((charStats[`base${character.srcStat}`] + baseBonus) * (1 + charBuffs[`${character.srcStat}Increase`] + statIncreaseBonus) + charBuffs[`flat${character.srcStat}`] + flatBonus) * charStats.multiplier;

    //DMG BONUS
    const dmgBonus = sumByKey(bonuses, 'dmgIncrease', character.atkType, character.element);
    const elemBonus = sumByKey(bonuses, 'elemIncrease', character.atkType, character.element);
    //DMG TOTAL
    const dmgMultiplier = 1 + charBuffs.dmgIncrease + charBuffs.elemIncrease + dmgBonus + elemBonus;

    //DEF RED BONUS
    const defReductionBonus = sumByKey(bonuses, 'defReduction');
    const defIgnoreBonus = sumByKey(bonuses, 'defIgnore');
    //DEF TOTAL
    let totalDef = enemy.stats.def * (1 + defIncrease - (enemyDebuffs.defReduction + defReductionBonus + charBuffs.defIgnore + defIgnoreBonus));

    if (totalDef < 0) {
        totalDef = 0;
    }

    const defMultiplier = 1 - (totalDef / (totalDef + 200 + 10 * AttackerLvl));

    //RES RED BONUS
    const resPenBonus = sumByKey(bonuses, 'resPen', character.atkType, character.element);
    const resReductionBonus = sumByKey(bonuses, 'resReduction', character.atkType, character.element);

    //TOTAL RES
    let totalRes = enemyStats.res - (enemyDebuffs.resReduction + resReductionBonus) - (charBuffs.resPen + resPenBonus);

    if (totalRes < -1) {
        totalRes = -1;
    }

    const resMultiplier = 1 - totalRes;

    //DMG TAKEN BONUS
    const dmgTakenIncreaseBonus = sumByKey(bonuses, 'dmgTakenIncrease', character.atkType, character.element);

    //TOTAL DMGTAKEN
    const dmgTakenMultiplier = 1 + enemyDebuffs.dmgTakenIncrease + dmgTakenIncreaseBonus;

    //CRRATE BONUS
    const crRateBonus = sumByKey(bonuses, 'crrate');
    //TOTAL CRRATE
    const finalCrRate = (character.buffs.crrate + crRateBonus) > 1 ? 1 : (character.buffs.crrate + crRateBonus);

    //CRDMG BONUS
    const crDmgBonus = sumByKey(bonuses, 'crdmg');

    //TOTAL CRDMG
    const finalCrDmg = charBuffs.crdmg + crDmgBonus;

    const dmg = Math.floor(baseDmg * dmgMultiplier * defMultiplier * resMultiplier * dmgTakenMultiplier * brokenMultiplier);
    const critDmg = Math.floor(dmg * (1 + finalCrDmg));
    const avgDmg = Math.floor(dmg + (critDmg - dmg) * finalCrRate);

    return ([dmg, critDmg, avgDmg]);
    //return [0,0,0];
}