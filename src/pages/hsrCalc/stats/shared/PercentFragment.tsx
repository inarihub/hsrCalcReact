import classes from './PercentFragment.module.scss';

interface PercentFragmentProps {
}

export const PercentFragment = (props: PercentFragmentProps) => {
    return (
        <p className={classes.percentText}>%</p>
    );
}