import { FC } from 'react';

interface CounterLabelProps {
    current: number;
    total: number;
    onInvalid?: string;
}

function getLabel(value: number, onInvalid: string) {
    return Number.isNaN(value) ? onInvalid : String(value);
}

export const CounterLabel: FC<CounterLabelProps> = ({current, total, onInvalid = '-'}) => {
    return <label>{getLabel(current, onInvalid)}/{getLabel(total, onInvalid)}</label>;
}