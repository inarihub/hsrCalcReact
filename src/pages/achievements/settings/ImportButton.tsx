import { FC } from 'react';
import { loadJSONFile } from '../../hsrCalc/services/store/SetupsStorage';
import { CompletedAchievements } from '../types';

interface ImportButtonProps {
    onImport: (data: CompletedAchievements) => void;
}

export const ImportButton: FC<ImportButtonProps> = ({ onImport }) => {
    const importAchievementsHandler = async () => {
        let files: FileList | undefined = undefined;

        try {
            files = await loadJSONFile(false, 600);
        } catch (e) {
            console.error(e);
            return;
        }

        if (!files || !files[0]) return;

        let data: CompletedAchievements;

        try {
            const jsonText = await files[0].text();
            data = JSON.parse(jsonText);
        } catch (e) {
            console.error(e);
            return;
        }

        if (
            !data ||
            !('hsr_achievements' in data) ||
            !Array.isArray(data.hsr_achievements) ||
            !data.hsr_achievements.length ||
            typeof data.hsr_achievements[0] !== 'number'
        ) {
            console.error('There is nothing to import');
            return;
        }

        onImport(data);
    };

    return (
        <button onClick={importAchievementsHandler}>
            Import
        </button>
    )
}