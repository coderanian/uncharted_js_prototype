import {
    ICustomTooltipDataset,
    IDataset,
    IBasicChartDataset,
    IPieDataset,
    IScatterBubbleDataset,
    IChartJSDatasets
} from "./dataInterfaces";
import {ChartType} from "chart.js";
import {
    validateAllowedKeys,
    getKeys,
    getLegendLabels,
    formatValue,
    convertSnakeToLowCase
} from '../../../common/utils/utils'

/**
 * Chart color pallet
 */
const DARKBLUE: string[][] = [
    ['#1c3742'],
    ['#1c3742', '#77878e'],
    ['#1c3742', '#697b82', '#b4bdc1'],
    ['#1c3742', '#495f68', '#77878e', '#a4afb3'],
    ['#1c3742', '#495f68', '#77878e', '#a4afb3', '#d2d7d9'],
    ['#1c3742', '#495f68', '#6e7f86', '#929fa5', '#b5bfc2', '#dbdfe1'],
];
const ORANGE: string[][] = [
    ['#e63b09'],
    ['#e63b09', '#f29d84'],
    ['#e63b09', '#ef7e5d', '#f7beae'],
    ['#e63b09', '#ec6c47', '#f29d84', '#f9cec1']
];

/**
 * Sets up a dataset for chart type of ChartJS types
 * lineType and lineStyle deleted from params on Ana's request.
 * Add lineType?: string, lineStyle?: string as parameters to allow line appearence customization
 * @param data array of dataset objects containing numerical or string data.
 * @param type chart type
 * @param keysChartTypeA JSON dataset keys (columns) to consider for the chart (main chart type)
 * @param keysChartTypeB JSON dataset keys (columns) to consider for the chart (secondary chart type, combined chart only)
 */
export function chartDataSetupFactory(
    data: IDataset<number | string>[],
    type: 'area' | 'combined' | 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut',
    keysChartTypeA: string[],
    keysChartTypeB?: string[],
): IChartJSDatasets {
    let keys: string[];
    let labels: string[];
    let datasets: IBasicChartDataset[] | IScatterBubbleDataset[] | IPieDataset[] = [];
    [data, labels, keys] = updateDataLabelsAndKeys(data, type);
    let reducedKeys: string[] = validateAllowedKeys(keys, keysChartTypeA);
    switch (type) {
        case 'combined':
            const datasetsBar: IBasicChartDataset[] = createBasicChartDataset(data, 'bar', 'y', reducedKeys, 'darkblue', 2);
            const datasetsLine: IBasicChartDataset[] = createBasicChartDataset(data, 'line', 'y2', validateAllowedKeys(keys, keysChartTypeB as string[]), 'orange', 1);
            datasets = [...datasetsBar, ...datasetsLine];
            break;
        case 'pie':
        case 'doughnut':
            datasets = createPieChartDataset(data, type, reducedKeys, labels);
            break;
        case 'scatter':
        case 'bubble':
            const normalizationParams: [number, number] = normalizeBubbleChartData(data, reducedKeys);
            datasets = createScatterChartDataset(data, type, reducedKeys, normalizationParams, labels);
            break;
        case 'line':
        case 'bar':
        case 'area':
            datasets = createBasicChartDataset(data, type, 'y', reducedKeys, 'darkblue', 2);
            break;
        default:
            throw new Error('Chart type unknown.');
    }
    return { datasets, labels };
}

/**
 * The function prepares the data for rendering the chart, including extracting labels and keys from the datasets.
 * Updates the given data array of datasets for a ChartJS chart by generating 'others' label and keys for specific chart types
 * @param data - JSON array containing numerical or string values to be plotted on the chart.
 * @param type - A string representing the type of chart
 * @returns A tuple containing three elements:
 *   1. The updated array of datasets, with generated 'others' label and keys for the specific chart types.
 *   2. An array of strings representing the extracted labels from the datasets.
 *   3. An array of strings representing the extracted keys from the datasets.
 */
function updateDataLabelsAndKeys(
    data: IDataset<number | string>[],
    type: string,
): [IDataset<number | string>[], string[], string[]] {
    if(type === 'pie' || type === 'doughnut') {
        data = generateOthersLabelPie(data);
    }else if(type === 'scatter' || type === 'bubble') {
        data = generateOthersLabelScatterBubble(data);
    }
    const keys: string[] = getKeys(data);
    const labels: string[] = data.map((item: IDataset<number | string>) => item[keys[0]] as string);
    return [data, labels, keys];
}

/**
 * Creates basic chart datasets ChartJS based on the provided data and configurations.
 * @param data - A JSON array containing chart data.
 * @param type - A string specifying the type of chart - 'line', 'bar', 'area'.
 * @param yAxisId - A string specifying the ID of the Y-axis to which the dataset belongs.
 * @param keys - An array of JSON object key names as strings.
 * @param baseColor - A string representing the base color for the datasets, used to assign two pallets to combined chart.
 * @param order - A number representing the order of the dataset, used to render line chart over bar chart for combined chart.
 * @returns An array of basic chart datasets of type IBasicChartDataset[].
 */
function createBasicChartDataset(
    data: IDataset<number | string>[],
    type: 'line' | 'bar' | 'area',
    yAxisId: string,
    keys: string[],
    baseColor: string,
    order: number,
): IBasicChartDataset[] {
    const legendTitles: string[] = getLegendLabels(keys);
    const colors: string[] = baseColor === 'darkblue' ? DARKBLUE[legendTitles.length - 1] : ORANGE[legendTitles.length - 1];
    return legendTitles.map((metric: string, index: number) => {
            let dataset: IBasicChartDataset = {
                label: convertSnakeToLowCase(metric.toString()),
                type: (type === 'area' ? 'line' : type) as ChartType,
                data: extractMetricValues(data, metric),
                backgroundColor: colors[index],
                borderColor: colors[index],
                yAxisID: yAxisId,
                order: type !== 'area' ? order : index
            };
            if (type === 'area') {
                dataset.fill = true;
                dataset.pointRadius = 0;
            }
            return dataset;
        }
    );
}

/**
 * Creates a pie or doughnut ChartJS chart dataset based on the provided data and configurations.
 * @param data - A JSON array containing chart data.
 * @param type - A string specifying the type of chart - 'pie', 'doughnut'.
 * @param keys - An array of JSON object key names as strings.
 * @param labels - An array of strings representing the legend labels for the chart.
 * @returns A pie chart dataset of type IPieDataset[].
 */
function createPieChartDataset(
    data: IDataset<number | string>[],
    type: 'pie' | 'doughnut',
    keys: string[],
    labels: string[]
): IPieDataset[] {
    const legendTitles: string[] = getLegendLabels(keys);
    const colors: string[] = DARKBLUE[labels.length - 1];
    let dataset: IPieDataset[] = legendTitles.map((metric: string): IPieDataset => ({
        label: convertSnakeToLowCase(metric.toString()),
        type: type as ChartType,
        data: extractMetricValues(data, metric),
    }))
    dataset[0].backgroundColor = labels.map((value: string, i: number) => (colors[i]))
    dataset[0].borderColor = labels.map((value: string, i: number) => (colors[i]))
    return dataset;
}

/**
 * Creates a scatter or bubble chart ChartJS dataset based on the provided data and configurations.
 * @param data - A JSON array containing chart data.
 * @param type - A string specifying the type of chart - 'scatter', 'bubble'.
 * @param keys - An array of JSON object key names as strings.
 * @param labels - An array of strings representing the legend labels for the chart.
 * @returns A ChartJS dataset of type IPieDataset[].
 */
function createScatterChartDataset(
    data: IDataset<number | string>[],
    type: 'scatter' | 'bubble',
    keys: string[],
    radiusRange: [number, number],
    labels: string[]
): IScatterBubbleDataset[] {
    const pointSizeMax: number = 20;
    const pointSizeMin: number = 5;
    const legendTitles: string[] = getLegendLabels(keys);
    const colors: string[] = labels.length < 5 ? DARKBLUE[labels.length - 1] : [...ORANGE[0],...DARKBLUE[labels.length - 2]];
    return data.map((item: IDataset<string|number>, index: number): IScatterBubbleDataset => {
        return {
            label: convertSnakeToLowCase(item[keys[0]].toString()),
            type: type as ChartType,
            radius: 10,
            pointHoverRadius: 12,
            data: legendTitles.length < 3
                ? [{"x": item[legendTitles[0]], "y": item[legendTitles[1]]}]
                : [{"x": item[legendTitles[0]],
                    "y": item[legendTitles[1]],
                    "r": calculateBubblePointRadius(item[legendTitles[2]] as number, radiusRange, pointSizeMin, pointSizeMax)
            }],
            backgroundColor: colors[index],
            borderColor: colors[index]
        }
    });
}

/**
 * Validates if the JSON object has the specified keys and reduces the keys to those allowed for a specific chart type.
 * Checks if the selected dataset keys are within the minimum and maximum amount of data categories supported by the specific chart.
 * @param keys - An array of strings containing the JSON object keys (column titles).
 * @param allowedKeys - An array of strings containing the JSON array keys to consider for the chart.
 * @param type - A string specifying the type of chart.
 * @returns An array of strings representing the reduced JSON object keys containing only the aggregation key and selected data categories.
 * @throws {Error} If the number of selected keys is outside the allowed range for the specific chart type.
 * @example For a bubble chart, allowedKeys must contain exactly 4 keys (aggregation key + keys for x,y values + key for point radius size).
 */
function reduceDatasetKeys(keys: string[], allowedKeys: string[], type: string): string[]{
    let reducedKeys: string[] =  validateAllowedKeys(keys, allowedKeys);
    return reducedKeys;
}

/**
 * Extracts metric values from the dataset for a given metric.
 * @param data JSON dataset
 * @param metric key name
 * @return key value
 */
function extractMetricValues(data: IDataset<number | string>[], metric: string): (string | number)[] {
    return data.map((key: IDataset<string|number>) => key[metric]);
}

/**
 * Takes data, first 9 labels are reused, others grouped into 'Others' label
 * The values are then summarized and assigned to new key "others"
 * Usage example: grouping Pie chart slices into one bigger slice
 * @param data original query data for the metric
 * @param keys initial categories without "Others"
 * @param labels dataset labels,
 * @return reduced dataset with new key-value pair "others"
 */
function generateOthersLabelPie(data: IDataset<string|number>[]): IDataset<string|number>[] {
    let keys: string[] = getKeys(data);
    let labels: string[] = data.map((item: IDataset<number | string>) => item[keys[0]] as string);
    if(labels.length < 5){
        return data
    }
    const keysToGroup: string[] = labels.slice(5,);
    let othersSum: number = 0;
    let groupedData: IDataset<string|number>[] = data.reduce(
        (resultArray: IDataset<number | string>[], row: any) => {
            if (keysToGroup.includes(row[keys[0]])) {
                othersSum += row[keys[1]];
            } else {
                resultArray.push(row);
            }
            return resultArray;
        }, []
    );
    const regex: RegExp = /average|avg/i;
    const othersLabelData: IDataset<string|number> = {
        [keys[0]]: "Others",
        [keys[1]]: regex.test(keys[1]) ? othersSum /= keysToGroup.length : othersSum,
    }
    groupedData.push(othersLabelData);
    return groupedData;
}

/**
 * Function to generate a new dataset by grouping certain data points under "Others".
 * For scatter and bubble chart types, it groups data points based on specific labels.
 * If title includes char group avg or average then average value is calculated instead of a sum
 * @param {any} data - The original dataset to be processed.
 * @param {any} keys - The array of keys used to access data properties.
 * @param {any} labels - The labels associated with the data points.
 * @returns {any} - Returns a new dataset with grouped data points under "Others".
 */
function generateOthersLabelScatterBubble(data: IDataset<string|number>[]): IDataset<string|number>[] {
    let keys: string[] = getKeys(data);
    let labels: string[] = data.map((item: IDataset<number | string>) => item[keys[0]] as string);
    if(labels.length < 6){
        return data
    }
    const keysToGroup: string[] = labels.slice(6);
    let othersSumX: number = 0;
    let othersSumY: number = 0;
    let othersSumZ: number = 0;
    const groupedData: IDataset<string|number>[] = data.reduce(
        (resultArray: IDataset<number | string>[], row: any) => {
            if (keysToGroup.includes(row[keys[0]])) {
                othersSumX += row[keys[1]];
                othersSumY += row[keys[2]];
                if (keys.length === 4) {
                    othersSumZ += row[keys[3]];
                }
            } else {
                resultArray.push(row);
            }
            return resultArray;
        },
        []
    );
    const regex: RegExp = /average|avg/i;
    const othersLabelData: IDataset<string|number> = {
        [keys[0]]: "Others",
        [keys[1]]: regex.test(keys[1]) ? othersSumX /= keysToGroup.length : othersSumX,
        [keys[2]]: regex.test(keys[2]) ? othersSumY /= keysToGroup.length : othersSumY,
    };
    if (keys.length === 4) {
        othersLabelData[keys[3]] = regex.test(keys[3]) ? othersSumZ /= keysToGroup.length : othersSumZ;
    }
    groupedData.push(othersLabelData);
    return groupedData;
}

/**
 * Normalizes bubble chart data by calculating the minimum value and range of a specified property in the data.
 * @param data - An array of objects containing the data to be normalized.
 * @param keys - An array of string keys representing the properties of the objects in the 'data' array.
 * @returns A tuple containing the minimum value and range of the specified property.
 */
function normalizeBubbleChartData(data: any, keys: string[]): [number, number] {
    let rMax: number = data[0][keys[3]];
    let rMin: number = data[0][keys[3]];
    for(let i=1; i < data.length; i++){
        const currentValue = data[i][keys[3]];
        if(rMax < currentValue){
            rMax = currentValue;
        }
        if(rMin > currentValue){
            rMin = currentValue;
        }
    }
    return [rMin, rMax];
}

/**
 * Calculate the radius of a data point in a bubble chart based on its data value and a specified range of possible radii.
 * @param dataVal The data value of the data point.
 * @param radiusRange The range of possible radii [min, max].
 * @param pointSizeMin The desired minimum radius for the data points.
 * @param pointSizeMax The desired maximum radius for the data points.
 * @returns The calculated radius for the data point.
 */
function calculateBubblePointRadius(dataVal: number, radiusRange: [number, number], pointSizeMin: number, pointSizeMax: number): number {
    if (radiusRange[0] === radiusRange[1]) {
        return pointSizeMin;
    }
    return (dataVal - radiusRange[0]) * (pointSizeMax - pointSizeMin) / (radiusRange[1] - radiusRange[0]) + pointSizeMin
}

/**
 * Returns data specifically for scatter and bubble chart custom tooltip.
 * Custom tooltip is required as ChartJS doesn't separate x, y and r values of a data point as separate keys
 * @param data chart data
 * @param type chart type
 * @param valueFormat how to format x, y, r values of scatter / bubble datapoint
 * @return tooltip data with title (set to empty string to show label as title with color instead) and x,y,r key-value string
 */
export function createBubbleChartTooltipDataset(
    data: IDataset<number | string>[],
    type: 'bubble' | 'scatter',
    valueFormat: [string, string] | [string, string, string],
    allowedKeys: string[]
): ICustomTooltipDataset[] {
    [data] = updateDataLabelsAndKeys(data, type);
    let keysReduced: string[] = reduceDatasetKeys(getKeys(data), allowedKeys, type);
    return data.map((item: IDataset<string|number>): {title: string, label: string|number, data: string} => {
        return {
            title: '',
            label: item[keysReduced[0]],
            data: `${convertSnakeToLowCase(keysReduced[1].toString())}: ${formatValue(item[keysReduced[1]], valueFormat[0])}` +
                `\n${convertSnakeToLowCase(keysReduced[2].toString())}: ${formatValue(item[keysReduced[2]], valueFormat[1])}` +
                `${type === 'bubble' ? `\n${convertSnakeToLowCase(keysReduced[3].toString())}: ${formatValue(item[keysReduced[3]], valueFormat[2] as string)}` : ''}`
        }
    });
}

/**
 * Calculates the percentage values for each key in the dataset array, ensuring each dataset sums up to 100%.
 * This function won't calculate correct result for data categories which already has a percentage values.
 * The function assumes that the first key in each dataset is the aggregation key, and the rest of the keys represent individual data categories.
 * @param data - A JSON array containing numerical or string values to be processed.
 * @returns A new JSON array with recalculated values representing percentages for each key.
 */
export function calculateDataPercentage(data: IDataset<number | string>[], allowedKeys: string[]): IDataset<number | string>[] {
    let keys: string[] = getKeys(data);
    let recalculatedData = JSON.parse(JSON.stringify(data));
    for(let row in recalculatedData){
        let total: number = 0;
        let object: IDataset<number | string> = recalculatedData[Number(row)];
        for(const key in object){
            if(allowedKeys.includes(key) && object[key] !== '-'){
                total += object[key] as number;
            }
        }
        for(const key in object){
            if(allowedKeys.includes(key)){
                object[key] = object[key] === '-' ? '-' : parseInt((object[key] as number / total * 100).toFixed(0));
            }
        }
    }
    return recalculatedData;
}

