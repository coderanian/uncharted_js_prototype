import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    PointElement,
    LineElement,
    LinearScale,
    Title,
    Tooltip,
    Filler,
    LineController,
    BarController,
} from "chart.js";
import {
    IBarOptionsCustomization,
    IBasicOptionsCustomization,
    IChartOptions, ICombinedOptionsCustomization,
    ILineOptionsCustomization,
    IPieOptionsCustomization
} from "./optionsInterface";
import '../../style.css';
import {IChartDataset, ICustomTooltipDataset, IDataset} from "../data/dataInterfaces";
import {formatValue} from "../../../common/utils/utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Title,
    Tooltip,
    Filler,
    LineController,
    BarController,
    Colors,
    Legend
);

/**
 * Global styling settings for the chartUtils
 */
ChartJS.defaults.font.size = 14 * 0.87;
ChartJS.defaults.font.family = 'Montserrat';
const fontColor: string = '#1c3742';
const legendLabelPadding: number = 30;
const xAxisLabelPadding: number = 0;
const yAxisLabelPadding: number = 15;

/**
 * Function receives options object and based on its type
 * Decides which chart type is it for
 * @param options typeof IBasicOptions | IGridOptions | IExtendedGridOptions
 * @param {string} type chart type
 * @return chartjs options object
 */
export function canvasSetupFactory(
    options: IPieOptionsCustomization | ILineOptionsCustomization | IBarOptionsCustomization | ICombinedOptionsCustomization,
    type: string,
    valueFormat: string | [string, string] | [string, string, string],
    dataset?: ICustomTooltipDataset[]
): IChartOptions {
    let basicCanvasSetup: IChartOptions = setBasicSettings(options);
    switch (type) {
        case 'pie':
        case 'doughnut':
            return setPieSettings(basicCanvasSetup, options as IPieOptionsCustomization, valueFormat as string);
        case 'line':
        case 'bar':
        case 'area':
            return setLineAreaBarSettings(basicCanvasSetup, options as ILineOptionsCustomization | IBarOptionsCustomization, type, valueFormat as string);
        case 'combined':
            let yLeftSettings: IChartOptions = setLineAreaBarSettings(basicCanvasSetup, options as ILineOptionsCustomization | IBarOptionsCustomization, type, valueFormat[1]);
            return setCombinedSettings(yLeftSettings, options as ICombinedOptionsCustomization, valueFormat[1], valueFormat[2] as string);
        case 'scatter':
        case 'bubble':
            let canvasSettings: IChartOptions = setLineAreaBarSettings(basicCanvasSetup, options as ILineOptionsCustomization, type, valueFormat[1])
            return setScatterAndBubbleSettings(canvasSettings, type, dataset as ICustomTooltipDataset[], valueFormat[0]);
        default:
            throw new Error('Chart type unknown.');
    }
}

function setBasicSettings(options: IBasicOptionsCustomization): IChartOptions{
    return {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: options.showLegend || true,
                position: "bottom",
                labels: { color: fontColor, padding: legendLabelPadding },
                align: "start"
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false
        },
    };
}

/**
 * Customizes pie chart canvas
 * @param options settings provided to the component
 */
function setPieSettings(canvasSetup: IChartOptions, options: IPieOptionsCustomization, valueFormat: string): IChartOptions {
    return {
        ...canvasSetup,
        plugins: {
            legend: canvasSetup.plugins.legend,
            tooltip: {
                titleFont: {weight: 'normal'},
                footerFont: {weight: 'normal'},
                callbacks: {
                    label: (value: any): string => (tooltipFormat(value, valueFormat))
                },
            }
        },
        rotation: options.halfPieChart ? -90 : 0 || 0,
        circumference: options.halfPieChart ? 180 : 360 || 360,
    };
}

/**
 * Extends general ChartJS canvas settings with options unique to bar or line chart
 * @param options current canvas settings
 * @return extended canvas settings to render bar or line chart
 */
function setLineAreaBarSettings(canvasSetup: IChartOptions, options: ILineOptionsCustomization | IBarOptionsCustomization, type: string, yLeftFormat: string): IChartOptions {
    return {
        ...canvasSetup,
        indexAxis: (options as IBarOptionsCustomization).horizontal ? 'y' : 'x',
        plugins: {
            legend: canvasSetup.plugins.legend,
            tooltip: {
                titleFont: {weight: 'normal'},
                footerFont: {weight: 'normal'},
                callbacks: {
                    label: (value: any): string => (tooltipFormat(value, yLeftFormat))
                },
            }
        },
        scales: {
            x: {
                title: {
                    display: !!options.xAxisTitle,
                    align: 'center',
                    text: options.xAxisTitle,
                    padding: xAxisLabelPadding,
                    color: fontColor,
                },
                grid: {
                    display: options.showGridX || true,
                },
                stacked: type === 'area' ? true : (type === 'line' ? false : (options as IBarOptionsCustomization).stack),
                ticks: {
                    maxRotation: 90,
                    minRotation: 0,
                    padding: 5,
                    color: fontColor,
                },
            },
            y: {
                title: {
                    display: !!options.yAxisTitle,
                    align: 'center',
                    text: options.yAxisTitle,
                    padding: yAxisLabelPadding,
                    color: fontColor,
                },
                grid: {
                    display: options.showGridY || true,
                },
                position: 'left',
                stacked: type === 'area' ? true : (type === 'line' ? false : (options as IBarOptionsCustomization).stack),
                min: yLeftFormat === 'percent' ? 0 : undefined,
                max: yLeftFormat === 'percent' ? 100  : undefined,
                ticks: {
                    padding: 5,
                    color: fontColor,
                    stepSize: yLeftFormat === 'percent' ? 20 : undefined,
                    callback: (value: string | number): string | number => (formatValue(value, yLeftFormat))
                },
            },
        },
    };

}

/**
 * Extends general ChartJS canvas settings with options unique to combined bar-line chart
 * @param options current canvas settings
 * @return extended canvas settings to render combined bar-line chart
 */
function setCombinedSettings(canvasSetup: IChartOptions, options: ICombinedOptionsCustomization, yLeftFormat: string, yRightFormat: string): IChartOptions{
    let canvasSetupExtended: IChartOptions = { ...canvasSetup };
    if(canvasSetupExtended.scales) {
        canvasSetupExtended.scales.y2 = {
            title: {
                display: !!options.yRightAxisTitle,
                align: 'center',
                text: options.yRightAxisTitle,
                padding: yAxisLabelPadding,
                color: fontColor,
            },
            grid: {
                display: options.showGridRightY || false,
            },
            position: 'right',
            stacked: false,
            min: yRightFormat === 'percent' ? 0 : undefined,
            max: yRightFormat === 'percent' ? 100  : undefined,
            ticks: {
                padding: 5,
                color: fontColor,
                stepSize: yRightFormat === 'percent' ? 20 : undefined,
                callback: (value: string | number): string | number => (formatValue(value, yRightFormat))
            },
        }
    }
    if(canvasSetupExtended.plugins){
        canvasSetupExtended.plugins.tooltip = {
            titleFont: {weight: 'normal'},
            footerFont: {weight: 'normal'},
            callbacks: {
                label: (value: any): string => {
                    let valFormatted: string = value.dataset.type === 'bar' ? tooltipFormat(value, yLeftFormat) : tooltipFormat(value, yRightFormat);
                    return valFormatted;
                }
            }
        }
    }
    return canvasSetupExtended;
}

/**
 * Extends general ChartJS canvas settings with options unique to scatter or bubble chart
 * @param options current canvas settings
 * @return extended canvas settings to render scatter or bubble chart
 */
function setScatterAndBubbleSettings(canvasSetup: IChartOptions, type: 'scatter' | 'bubble', tooltipData: ICustomTooltipDataset[], xFormat: string): IChartOptions {
    delete canvasSetup.interaction;
    if(canvasSetup.scales){
        canvasSetup.scales.x.ticks.callback = (value: string | number): string | number => (formatValue(value, xFormat));
    }
    return {
        ...canvasSetup,
        plugins: {
            legend: canvasSetup.plugins.legend,
            tooltip: {
                titleFont: {weight: 'normal'},
                footerFont: {weight: 'normal'},
                callbacks: {
                    title: (context: any) => tooltipData[context[0].datasetIndex].title,
                    label: (context: any) => tooltipData[context.datasetIndex].label,
                    footer: (context: any) => tooltipData[context[0].datasetIndex].data.toLocaleString(),
                },
            },
        },
    }
}

/**
 * Formats tooltip content value
 * @param value - tooltip content value
 * @param format - desired tooltip content value format
 * @return formatted tooltip content value
 */
const tooltipFormat = (value: any, format: string): string => {
    switch (format){
        case('percent'):
            return value.dataset.label + ': ' + value.formattedValue + '%';
        case('euro'):
            return value.dataset.label + ': ' + value.formattedValue + '€';
        default:
            return value.dataset.label + ': ' + value.formattedValue;
    }
}