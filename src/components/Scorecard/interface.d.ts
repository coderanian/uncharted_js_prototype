import {IChartDataset} from "../Chart/utils/data/dataInterfaces";

export interface IScorecard {
    title: string,
    dataset: IChartDataset<number | string>[] | null,
    summaryKey: string,
    summaryType: 'average' | 'sum',
    valueFormat?: 'euro' | 'number' | 'percent'
}