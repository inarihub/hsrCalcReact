export interface Achievement {
    id: number,
    series: number,
    series_name: string,
    name: string,
    currency: number,
    description: string,
    hidden: boolean,
    version?: string | null,
    comment?: string | null,
    reference?: string | null,
    difficulty?: 'easy' | 'medium' | 'hard' | null,
    gacha: boolean,
    timegated: string | null,
    missable: false,
    impossible: false,
    set?: number | null,
    related?: number[],
    percent: number,
    video?: string | null
}

export interface AchievementSeries {
    id: number;
    name: string;
}

export interface CompletedAchievements {
    hsr_achievements: Achievement['id'][]
}