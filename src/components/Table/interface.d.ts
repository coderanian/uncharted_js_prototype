import {IChartDataset} from "../Chart/utils/data/dataInterfaces";
export interface ITable {
    title?: string,
    description?: string,
    dataset: IChartDataset<number | string>[] | null,
    summaryRow?: 'sum' | 'average' | 'none',
    valueFormat?: 'percent' | 'euro' | 'none',
    allowedKeys?: string[]
}