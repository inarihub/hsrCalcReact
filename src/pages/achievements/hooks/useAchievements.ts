import { useEffect, useState } from 'react';
import { Achievement, AchievementSeries } from '../types';
import { Achievements } from '../Achievements';
import { Language } from '../settings/LanguageSelector';

const LANG_MAP: Record<Language, string> = {
    en: 'In progress',
    ru: 'В прогрессе',
};

function getInProgressSeries(lang: Language) {
    return { id: 0, name: LANG_MAP[lang] };
}

interface State {
    achievements: {
        data: Achievement[] | null;
        fetching: boolean;
    };
    series: {
        data: AchievementSeries[] | null;
        fetching: boolean;
    }
}

export function useAchievements(lang: 'ru' | 'en') {
    const [state, setState] = useState<State>({
        achievements: {
            data: null,
            fetching: false
        },
        series: {
            data: null,
            fetching: false
        }
    });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`https://stardb.gg/api/achievements?lang=${lang}`, { signal })
            .then(data => data.json())
            .then(dataParsed => {
                if (!Array.isArray(dataParsed)) {
                    throw new Error('Invalid data');
                }
                setState(prev => ({ ...prev, achievements: { data: dataParsed, fetching: false } }))
            })
            .catch(e => console.error('error:', e));

        fetch(`https://stardb.gg/api/achievement-series?lang=${lang}`, { signal })
            .then(data => data.json())
            .then(dataParsed => {
                if (!Array.isArray(dataParsed)) {
                    throw new Error('Invalid data');
                }
                const result = [getInProgressSeries(lang), ...dataParsed];
                setState(prev => ({ ...prev, series: { data: result, fetching: false } }));
            })
            .catch(e => console.error('error:', e));

        setState(prev => ({
            ...prev,
            achievements: {
                data: null,
                fetching: true,
            },
            series: {
                data: null,
                fetching: true,
            }
        }))

        return () => {
            controller.abort('New language has been requested');
        }
    }, [lang])

    return { achievements: state.achievements.data, series: state.series.data };
}