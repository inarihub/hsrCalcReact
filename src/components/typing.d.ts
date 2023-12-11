declare module '*.module.scss' {
    interface IClassName {
        [classname: string]: string;
    }
    const classNames: IClassName;
    export = classNames;
}

declare module '*.png';