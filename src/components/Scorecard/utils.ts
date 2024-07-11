import {formatValue, getKeys} from "../common/utils/utils";
import {IDataset} from "../Chart/utils/data/dataInterfaces";

/**
 * Summarizes the data in the provided dataset based on the specified summary key and type.
 * @param {any[]} dataset - The dataset containing the data to be summarized.
 * @param {string} summaryKey - The key of the property in the dataset objects to be summarized.
 * @param {'average' | 'sum'} summaryType - The type of summary to be calculated: 'average' or 'sum'.
 * @returns {string} - The summarized data as a formatted string with European number format.
 */
export function summarizeData(
    dataset: IDataset<string|number>[],
    summaryKey: string,
    summaryType: 'average' | 'sum',
    valueFormat: 'euro' | 'number' | 'percent'
): string | number {
    if (!getKeys(dataset).includes(summaryKey)) {
        throw new Error(`Unknown key: ${summaryKey}`);
    }
    const total: number = dataset.reduce((acc: number, item: any) => {
        const value: number = parseFloat(item[summaryKey]);
        return isNaN(value) ? acc : acc + value;
    }, 0);
    let result: number = (summaryType === 'average' ? Math.round(total / dataset.length) : total);
    return formatValue(result, valueFormat);
}