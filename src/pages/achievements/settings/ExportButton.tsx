import { FC, useCallback } from 'react'
import { Achievement, CompletedAchievements } from '../types'
import { saveToJSONFile } from '@/pages/hsrCalc/services/store/SetupsStorage';

interface ExportButton {
    checked: Set<Achievement['id']>
}

export const ExportButton: FC<ExportButton> = ({ checked }) => {
    const onClick = useCallback(() => {
        const sortedList = Array.from(checked).sort((a, b) => a - b);
        const data: CompletedAchievements = {
            hsr_achievements: sortedList,
        }

        const stringifiedData = JSON.stringify(data);
        let file = new File([stringifiedData], 'achieves.json', { type: "text/plain:charset=UTF-8" });

        saveToJSONFile(file);
    }, [checked]);
    return <button onClick={onClick}>Export</button>
}