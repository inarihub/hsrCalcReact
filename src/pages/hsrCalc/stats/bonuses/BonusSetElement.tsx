import classes from './BonusSetElement.module.scss';
import { Fragment, useState } from 'react';
import { isPercent } from '@/pages/shared/Stat.types';
import local from '@/pages/shared/StatDictionary';
import { ContextBonusSet } from '@/pages/shared/BonusSetTypes';

interface BonusSetElementProps {
    set: ContextBonusSet,
    setActiveCallback: (ids?: number | number[]) => void,
    deleteCallback: () => void
}

const dmgTypePrefix = {base: 'Base:', crit: 'Crit:', average: 'Avg:'};

function getStringExplicitPositive(value: number) {
    return value >= 0 ? "+" : "";
}

function floatToFixedString(value: number, isPercent: boolean = true, fractionDigits: number = 2) {
    return isPercent ? parseFloat((value * 100).toFixed(fractionDigits)).toString() : value.toString();
}

function getStyleByModal(value: number): React.CSSProperties {
    return { color: value > 0 ? 'greenyellow' : 'gray' };
}

function formatCompString(value: number) {
    return getStringExplicitPositive(value) + floatToFixedString(value) + "%";
}

export const BonusSetElement = (props: BonusSetElementProps) => {

    const [isMinimized, setIsMinimized] = useState<boolean>(true);

    let bonusSetRows = [];

    for (const bonusItem of props.set.items) {

        const optionOneText = !bonusItem.atkTypeOption || bonusItem.atkTypeOption === 'any' || bonusItem.atkTypeOption === 'none' ? '' : local['en'][bonusItem.atkTypeOption];
        const optionTwoText = !bonusItem.elemTypeOption || bonusItem.elemTypeOption === 'all' || bonusItem.elemTypeOption == 'none' ? '' : local['en'][bonusItem.elemTypeOption];
        const optionsText = optionOneText === '' && optionTwoText === '' ? '' : `(${optionTwoText} ${optionOneText})`

        const isPercents = isPercent(bonusItem.key);
        let value = isPercents ? parseFloat((bonusItem.value * 100).toFixed(1)) : bonusItem.value;

        const itemCompNonCritValue = bonusItem.comparisonValue[0];
        const itemCompNonCritString = formatCompString(itemCompNonCritValue);

        const itemCompCritValue = bonusItem.comparisonValue[1];
        const itemCompCritString = formatCompString(itemCompCritValue);

        const itemCompAvgValue = bonusItem.comparisonValue[2];
        const itemCompAvgString = formatCompString(itemCompAvgValue);

        const activationButtonStyle: React.CSSProperties = bonusItem.isActive ? undefined : { backgroundColor: 'darkred' };

        bonusSetRows.push(
            (<div className={classes.bonus} key={bonusItem.key + bonusItem.id + '_bonus'}>

                <div className={classes.mainBlock}>

                    <div className={classes.mainRow}>
                        <p className={classes.bonusDesc}>{local['en'][bonusItem.key]} {optionsText}:</p>
                        <p className={classes.bonusValue}>{value}{isPercents ? '%' : ''}</p>
                    </div>

                    <div className={classes.compValuesSection}>

                        <div className={classes.compValueBlock}>
                            <p className={classes.valueDescription}>{dmgTypePrefix.base}</p>
                            <p className={classes.compValues} style={getStyleByModal(itemCompNonCritValue)}>{itemCompNonCritString}</p>
                        </div>

                        <div className={classes.compValueBlock}>
                            <p className={classes.valueDescription}>{dmgTypePrefix.crit}</p>
                            <p className={classes.compValues} style={getStyleByModal(itemCompCritValue)}>{itemCompCritString}</p>
                        </div>

                        <div className={classes.compValueBlock}>
                            <p className={classes.valueDescription}>{dmgTypePrefix.average}</p>
                            <p className={classes.compValues} style={getStyleByModal(itemCompAvgValue)}>{itemCompAvgString}</p>
                        </div>

                    </div>

                </div>

                <button className={classes.activationButton} style={activationButtonStyle} disabled={!props.set.isActive} onClick={e => props.setActiveCallback(bonusItem.id)}>👁</button>
            </div>))
    }

    const setType = props.set.type;
    const setName = props.set.name;

    const setCompValueNonCrit = props.set.comparisonValue[0];
    const setCompValueNonCritString = formatCompString(setCompValueNonCrit);

    const setCompValueCrit = props.set.comparisonValue[1];
    const setCompValueCritString = formatCompString(setCompValueCrit);

    const setCompValueAvg = props.set.comparisonValue[2];
    const setCompValueAvgString = formatCompString(setCompValueAvg);

    const activationButtonStyle: React.CSSProperties = props.set.isActive ?
        (props.set.items.some(e => !e.isActive) ? { backgroundColor: 'gray' } : undefined) : { backgroundColor: 'darkred' };
    const opacityStyleByStatus: React.CSSProperties = { opacity: props.set.isActive ? '1' : '0.5' };

    const deactivateHint = 'Activate or deactivate this bonus';
    const showHideHint = 'Minimize or restore details';
    const deleteHint = 'Delete this bonus';

    return (

        <div className={classes.bonusSetContainer}>

            <div className={classes.headerSection}>

                <div className={classes.titles}>
                    <p className={classes.group}>{local['en'][setType]}{setType?.length > 0 ? ':' : ''}</p>
                    <p className={classes.header}>{setName}</p>
                </div>

                <div className={classes.controlButtonsSection}>

                    <button key='deactivateButton' title={deactivateHint} style={activationButtonStyle}
                        className={classes.controlButton} onClick={e => props.setActiveCallback()}>👁</button>

                    <button key='showHideButton' title={showHideHint} className={classes.controlButton}
                        onClick={e => setIsMinimized((prev) => !prev)}>...</button>

                    <button key='deleteButton' title={deleteHint} className={classes.controlButton}
                        onClick={e => props.deleteCallback()}>x</button>
                </div>

            </div>

            <div className={classes.compValuesSection}>

                <div className={classes.compValueBlock}>
                    <p className={classes.valueDescription}>{dmgTypePrefix.base}</p>
                    <p className={classes.compValues} style={getStyleByModal(setCompValueNonCrit)}>{setCompValueNonCritString}</p>
                </div>

                <div className={classes.compValueBlock}>
                    <p className={classes.valueDescription}>{dmgTypePrefix.crit}</p>
                    <p className={classes.compValues} style={getStyleByModal(setCompValueCrit)}>{setCompValueCritString}</p>
                </div>

                <div className={classes.compValueBlock}>
                    <p className={classes.valueDescription}>{dmgTypePrefix.average}</p>
                    <p className={classes.compValues} style={getStyleByModal(setCompValueAvg)}>{setCompValueAvgString}</p>
                </div>

            </div>

            {isMinimized ? <Fragment /> : (
                <div className={classes.bonusesPreviewList} style={opacityStyleByStatus}>
                    {bonusSetRows}
                </div>
            )}

        </div>
    );
};