export class LangUtils {
    static exists(obj: any) {
        return obj !== null && obj !== undefined;
    }

    static isANumber(num: number) {
        return !Number.isNaN(num);
    }
}