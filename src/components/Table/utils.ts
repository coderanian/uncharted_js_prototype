import {IDataset} from "../Chart/utils/data/dataInterfaces";
import {getKeys, getLegendLabels, validateAllowedKeys} from "../common/utils/utils";

/**
 * Function to create summary row that summarizes numeric data based on the provided keys and summary type.
 * @param {any} dataset - The dataset containing the data to be summarized.
 * @param {string[]} keys - The array of keys used to access data properties for summarization.
 * @param {'average' | 'sum'} summaryType - The type of summary, either 'average' or 'sum'.
 * @returns {number[] | string[]} - Returns an array of summarized values based on the specified summary type.
 */
export function summarizeData(dataset: IDataset<string|number>[], keys: string[], summaryType: string, valueFormat: string): (string | number)[] {
    const legendTitles: string[] = getLegendLabels(keys);
    let sum: (number | string)[] = legendTitles.map((key: string) => {
        let sum: number = dataset.reduce((total: number, item: any) => {
            return isNaN(item[key]) ? total : total + item[key];
        }, 0);
        return summaryType === 'average' ? Math.round(sum / dataset.length) : sum;
    });
    sum = sum.map((value: any): string | number => (isNaN(value) ? '-' : value));
    sum.unshift('Grand ' + summaryType);
    return sum;
}

/**
 * Function to sort the dataset based on a specific key in ascending or descending order.
 * @param {any} dataset - The dataset to be sorted.
 * @param {string} key - The key used to access data properties for sorting.
 * @param {boolean} ascOrder - A boolean value indicating whether to sort in ascending (true) or descending (false) order.
 * @returns {any} - Returns the sorted dataset.
 */
export function sortDataByKey(dataset: IDataset<string|number>[], key: string, ascOrder: boolean): IDataset<string|number>[] {
    return dataset.sort((a: IDataset<string|number>, b: IDataset<string|number>): number => {
        if (ascOrder) {
            if (a[key] === '-') return 1;
            if (b[key] === '-') return -1;
            return typeof a[key] === 'number' ? (b[key] as number) - (a[key] as number) : (b[key] as string).localeCompare(a[key] as string);
        } else {
            if (a[key] === '-') return -1;
            if (b[key] === '-') return 1;
            return typeof a[key] === 'number' ? (a[key] as number) - (b[key] as number) : (a[key] as string).localeCompare(b[key] as string);
        }
    });
}

/**
 * Function to capitalize the first letter of a given JSON object key ( = DWH response column name)
 * @param {string} key - The input string to be capitalized.
 * @returns {string} - Returns the input string with the first letter capitalized.
 */
/*
export function capitalizeKey(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
}
*/

/**
 * Reduces JSON dataset to only allowed keys
 * @param data JSON dataset
 * @param allowedKeys keys to keep in JSON object (= columns)
 * @return filtered or unchanged data if no keys provided
 */
export function reduceDataset(
    data: IDataset<number | string>[],
    valueFormat: 'euro' | 'percent' | 'none',
    allowedKeys?: string[],
): IDataset<number | string>[] {
    if(allowedKeys){
        const keys: string[] = getKeys(data);
        allowedKeys = validateAllowedKeys(keys, allowedKeys);
        return data.map((item: IDataset<string|number>) => {
            let filteredKey: { [key: string]: any } = {};
            for (let i: number = 0; i < (allowedKeys as string[]).length; i++) {
                const key: string = (allowedKeys as string[])[i];
                filteredKey[key] = item[key];
            }
            return filteredKey;
        });
    }
    return data;
}