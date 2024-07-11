import {IChartDataset} from "./data/dataInterfaces";
import {
    IBarOptionsCustomization, ICombinedOptionsCustomization,
    ILineOptionsCustomization,
    IPieOptionsCustomization
} from "./options/optionsInterface";

/**
 * Provides a structured way to define chart objects with different customization options and data configurations
 */

interface IBasicProps {
    dataset: IChartDataset<number | string>[] | null,
    title?: string,
    description?: string
}

export interface IPieChart extends IBasicProps{
    options: IPieOptionsCustomization,
    keys: [string],
    valueFormat: 'number' | 'euro' | 'percent'
}

export interface ILineChart extends IBasicProps{
    keys: [string] | [string, string] | [string, string, string] | [string, string, string, string] | [string, string, string, string, string] | [string, string, string, string, string, string],
    options: ILineOptionsCustomization,
    yFormat?: 'number' | 'euro' | 'percent',
    //xFormat?: 'number' | 'euro' | 'percent' | 'text'
}

export interface IAreaChart extends ILineChart{
    stackMode?: 'normal' | 'percentage100'
}

export interface IBarChart extends IBasicProps{
    keys: [string] | [string, string] | [string, string, string] | [string, string, string, string] | [string, string, string, string, string] | [string, string, string, string, string, string],
    options: IBarOptionsCustomization,
    yFormat?: 'number' | 'euro' | 'percent',
    //xFormat?: 'number' | 'euro' | 'percent' | 'text',
    stackMode?: 'normal' | 'percentage100',
}

export interface IScatterChart extends IBasicProps{
    keys: [string, string],
    options: ILineOptionsCustomization,
    yFormat?: 'number' | 'euro' | 'percent',
    xFormat?: 'number' | 'euro' | 'percent'
}

export interface IBubbleChart extends IScatterChart {
    keys: [string, string, string],
    rFormat?: 'number' | 'euro' | 'percent'
}

export interface ICombinedChart extends Omit<IBasicProps, 'keys'> {
    options: ICombinedOptionsCustomization
    barKeys: [string] | [string, string] | [string, string, string] | [string, string, string, string] | [string, string, string, string, string] | [string, string, string, string, string, string],
    lineKeys: [string] | [string, string] | [string, string, string] | [string, string, string, string],
    yLeftFormat?: 'number' | 'euro' | 'percent',
    yRightFormat?: 'number' | 'euro' | 'percent'
    //xFormat?: 'number' | 'euro' | 'percent' | 'text',
}
