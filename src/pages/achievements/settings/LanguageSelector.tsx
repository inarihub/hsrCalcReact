import { FC, memo, useCallback, useMemo } from 'react';

const LANGUAGES = ['ru', 'en'] as const;
export type Language = typeof LANGUAGES[number];

interface LanguageSelectorProps {
    lang: Language;
    onLangChange: (lang: Language) => void;
}

export const LanguageSelector: FC<LanguageSelectorProps> = memo(({ lang, onLangChange }) => {
    const getActiveStyle = useCallback((predicate: boolean) => {
        return predicate ? { border: '1px solid #22aaff' } : { color: 'grey' };
    }, [])

    const languagesButtons = useMemo(() => {
        return LANGUAGES.map(l => (
            <button
                disabled={lang === l}
                style={getActiveStyle(lang === l)}
                onClick={() => onLangChange(l)}>
                {l.toUpperCase()}
            </button>
        ))
    }, [lang, onLangChange, getActiveStyle]);

    return <div>{languagesButtons}</div>;
});