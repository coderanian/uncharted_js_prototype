import {IDataset} from "../../Chart/utils/data/dataInterfaces";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

/**
 * Reduce the keys array for chart data to include only the provided keys.
 * When labels and datasets are calculated only provided data keys will be shown.
 * If key is not in the JSON array received from API error will be thrown
 * @param keys Every key from JSON dataset
 * @param allowedKeys Array of keys for line or bar chart on the combined chart
 * @return filtered keys array or error if key is unknown
 */
export function validateAllowedKeys(keys: string[], allowedKeys: string[]): string[] {
    const unknownKeys: string[] = allowedKeys.filter((key: string) => !keys.includes(key));
    if (unknownKeys.length > 0) {
        throw new Error(`Unknown keys: ${unknownKeys.join(', ')}`);
    }
    return keys.filter((key: string) => [keys[0], ...allowedKeys].includes(key));
}

/**
 * Extract key names from JSON dataset
 * @param chartData JSON dataset
 * @return keys string array with every key in JSON dataset
 */
export function getKeys(data: IDataset<number | string>[]): string[] {
    const keys: string[] = Object.keys(data[0]);
    if (keys.length < 2) {
        throw new Error('JSON object must include at least two key-value pairs: one for x-axis titles and one for y-axis values');
    }
    return keys;
}

/**
 * Extracts non-aggregation keys from the JSON dataset
 * @example {date: 2023-01-01, metric: 1} -> returns metric which is used for legend creation
 * @param keys every key of dataset
 * @return keys without aggregation key
 */
export function getLegendLabels(keys: string[]): string[] {
    return keys.slice(1);
}

/**
 * Checks if dataset has no values for any of the keys
 * @param dataset JSON array object
 * @return boolean
 */
export function isDatasetEmpty(dataset: IDataset<number | string>[] | []): boolean {
    /*
    Function simplified as current API implementation returns empty array in case of unavailable parameters
    return dataset.every(row => {
        return Object.values(row).slice(1).every(value => {
            return value === "-" || value === null || isNaN(Number(value));
        });
    });
     */
    return dataset.length === 0;
}

/**
 * Helper function to reformat JSON object value data based on provided props
 * @param value - datapoint value
 * @param valueFormat - format
 * @return reformatted datapoint value
 */
export function formatValue(value: string | number, valueFormat: string): string | number {
    switch (valueFormat){
        case "percent":
            return value.toLocaleString() + '%';
        case "euro":
            return value.toLocaleString() + '€';
        default:
            return value.toLocaleString()
    }
}

/**
 * Checks if server response has an error key to flag response as failed
 * Type is any on purpose to accommodate possibility of IError object types instead of regular dataset
 * @param dataset JSON object returned from server
 * @return boolean true if key is in JSON object
 */
export function checkResponseError(dataset: any): boolean{
    return dataset[0].hasOwnProperty("error")
}

/**
 * Returns header value of server response
 * Type is any on purpose to accommodate possibility of IError object types instead of regular dataset
 * @param {any} dataset JSON object returned from server
 * @return {string} true if key is in JSON object
 */
export function extractError(dataset: any): string {
    return dataset[0].error.header;
}

/**
 * Converts a snake_case label received from a database response into low case.
 * If label already includes upper case character than it's official name (only column title are lowercase in postgres)
 * @param label The label from the database response object in snake_case format.
 * @return  The reformatted label with first word capitalized, rest in lowercase separated by s paces or unedited label
 */
export function convertSnakeToLowCase(label: string): string {
    if(label.charAt(0) === label.charAt(0).toUpperCase()){
        return label;
    }
    const words: string[] = label.split('_');
    return words.join(' ');
}
