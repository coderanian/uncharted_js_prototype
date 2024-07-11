import {ChartType} from "chart.js";

/**
 * Provides a structured way to define data used for charts
 * Dataset object keys must be of type string
 */
export interface IDataset<T> {
    [key: string]: T
}

export interface IChartJSDatasets {
    datasets: IBasicChartDataset[] | IPieDataset[] | IScatterBubbleDataset[],
    labels: string[]
}

interface IChartDataset {
    label: string,
    type: ChartType,
    data: (string | number)[] | []
}

interface IChartColor {
    backgroundColor: string,
    borderColor: string
}

export interface IBasicChartDataset extends IChartDataset, IChartColor {
    yAxisID: string,
    order: number,
    fill?: boolean,
    pointRadius?: number
}

export interface IPieDataset extends IChartDataset, IChartColor {
    backgroundColor?: string[],
    borderColor?: string[]
}

export interface IScatterBubbleDataset extends IChartDataset, IChartColor{
    data: { x: string | number, y: string | number }[] | { x: string | number, y: string | number, r: string | number }[] | []
    radius: number,
    pointHoverRadius: number
}

export interface ICustomTooltipDataset {
    title: string,
    label: string | number,
    data: string
}
