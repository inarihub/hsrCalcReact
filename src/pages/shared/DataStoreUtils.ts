export function setToLocalStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        if (e.code === "22" || e.code === "1024") {
            alert('Not enough space to save. Please, free space to save'); //data wasn't successfully saved due to quota exceed so throw an error
        } else {
            alert('Can not save item. Code: ' + e.code);
            return;
        }
    }
}