export function setToLocalStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        const error = e as { code: string } | undefined;
        if (error?.code === "22" || error?.code === "1024") {
            alert('Not enough space to save. Please, free space to save'); //data wasn't successfully saved due to quota exceed so throw an error
        } else {
            alert('Can not save item. Code: ' + error?.code);
            return;
        }
    }
}