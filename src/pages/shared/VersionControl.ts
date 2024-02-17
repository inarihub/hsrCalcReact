declare const APP_VERSION: string;

export function versionControlValidation() {
    
    const versionKey = 'version';

    if (localStorage.getItem(versionKey)?.split('.')[0] !== APP_VERSION.split('.')[0]) {
        localStorage.clear();
        localStorage.setItem(versionKey, APP_VERSION);
    }
}