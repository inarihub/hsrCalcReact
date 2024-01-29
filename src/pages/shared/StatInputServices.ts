export class StatInputValidationService {

    public static invalidChars = ['+', 'e', '-'];

    public static invalidCharsValidation(value: string): string {

        for (const char of this.invalidChars) {
            value.replace(char, '');
        }
        return value;
    }

    public static emptyValidation(value: string): string {
        return value === '' ? '0' : value;
    }

    public static startWithZeroValidation(value: string): string {

        if (value.startsWith('0') && !value.startsWith('0.') && value.length > 1) {
            let index = 1;
            while (index < value.length - 1 && value[index] === '0') {
                index++;
            }
            return value.slice(index, value.length);
        }

        return value;
    }

    public static maxFloatLengthValidation(value: string): string {

        if (value.split('.')[1]?.length > 2) {
            value = value.slice(0, value.length - 1);
        }
        if (value.split('.')[0]?.length > 6 && value.split('.')[1]) {
            value = value.slice(1, value.length);
        }
        if (value.length > 9) {
            value = value.slice(0, value.length - 1);
        }

        return value;
    }

    public static maxIntegerLengthValidation(value: string): string {

        const dotCharIndex = value.indexOf('.');
        const commaCharIndex = value.indexOf(',');

        if (dotCharIndex !== -1 || commaCharIndex !== -1) {
            const firstAppearance = Math.min(dotCharIndex === -1 ? 9 : dotCharIndex, commaCharIndex === -1 ? 9 : commaCharIndex);
            value = value.slice(0, firstAppearance);
        }

        if (value.length > 9) {
            value = value.slice(0, value.length - 1);
        }

        return value;
    }

    public static parseStringValueToPercentFloat(value: string): number {
        if (isNaN(Number(value))) {
            return 0;
        } else {
            return Number((Number(value) / 100).toFixed(4))
        }
    }

    public static parseStringValueToInteger(value: string): number {
        if (isNaN(parseInt(value))) {
            console.log("Can't parse current value: " + value.toString());
            return 0;
        }
        return parseInt(value);
    }

    public static getValidatedStatData(currentAsString: string, isPercents: boolean): {valueAsString: string, valueAsNumber: number} {

        //currentAsString = StatInputValidationService.emptyValidation(currentAsString);
        if (currentAsString === '') return {valueAsString: '', valueAsNumber: 0};
        currentAsString = StatInputValidationService.invalidCharsValidation(currentAsString);
        currentAsString = StatInputValidationService.startWithZeroValidation(currentAsString);

        currentAsString = isPercents ? StatInputValidationService.maxFloatLengthValidation(currentAsString) : StatInputValidationService.maxIntegerLengthValidation(currentAsString);
        const currentAsValue = isPercents ? StatInputValidationService.parseStringValueToPercentFloat(currentAsString) : StatInputValidationService.parseStringValueToInteger(currentAsString);

        return { valueAsString: currentAsString, valueAsNumber: currentAsValue };
    }
}

export class StatKeyValidationService {

    public static localeDecimalSeparator = (1.1).toLocaleString().substring(1, 2);

    public static isValidKeys(key: string): boolean {
        return !(key === '-' || key === '+' || key === 'e');
    }

    public static isValidLocaleSeparator(key: string) {
        const separator = StatKeyValidationService.localeDecimalSeparator;
        return !((key === '.' || key === ',') && separator !== key);
    }

    public static isValidFormat(key: string, isPercents: boolean): boolean {
        return  !(StatKeyValidationService.localeDecimalSeparator === key && !isPercents);
    }

    public static isValidKeyInput(key: string, isPercents: boolean): boolean {
        return StatKeyValidationService.isValidKeys(key) &&
        StatKeyValidationService.isValidLocaleSeparator(key) &&
        StatKeyValidationService.isValidFormat(key, isPercents);
    }
}