/**
 * Provides a structured way to define canvas settings tailored to ChartJS library
 */
export interface IChartOptions {
    indexAxis: string,
    responsive: boolean,
    maintainAspectRatio: boolean,
    plugins: {
        legend: {
            display: boolean,
            position: string,
            labels: { color: string, padding: number },
            align: string
        },
        tooltip?: {
            footerFont: {weight: 'bold' | 'normal'}
            titleFont: {weight: 'bold' | 'normal'},
            callbacks?: { title?: function, label?: function, footer?: function },
        },
    },
    interaction?: { mode: string, intersect: boolean },
    rotation?: number,
    circumference?: number,
    scales?: {
        x: {
            title: { display: boolean, align: string, text?: string, padding: number, color: string },
            grid: { display: boolean },
            stacked: boolean | undefined,
            ticks: { maxRotation: number, minRotation: number, padding: number, color: string, callback?: function }
        },
        y: {
            title: { display: boolean, align: string, text?: string, padding: number, color: string },
            grid: { display: boolean },
            stacked: boolean | undefined,
            position: string,
            min: number | undefined,
            max: number | undefined,
            ticks: { padding: number, color: string, stepSize: number | undefined, callback: function }
        },
        y2?: {
            title: { display: boolean, align: string, text?: string, padding: number, color: string },
            grid: { display: boolean },
            stacked: boolean | undefined,
            position: string,
            min: number | undefined,
            max: number | undefined,
            ticks: { padding: number, color: string, stepSize: number | undefined, callback: function }
        }
    },
}

export interface IBasicOptionsCustomization {
    showLegend?: boolean,
}

export interface IPieOptionsCustomization extends IBasicOptionsCustomization{
    halfPieChart?: boolean
}

export interface ILineOptionsCustomization extends IBasicOptionsCustomization {
    showGridX?: boolean,
    showGridY?: boolean,
    xAxisTitle?: string | undefined,
    yAxisTitle?: string | undefined,
}

export interface IBarOptionsCustomization extends ILineOptionsCustomization {
    stack?: boolean
    horizontal?: boolean
}

export interface ICombinedOptionsCustomization extends IBarOptionsCustomization {
    showGridRightY?: boolean,
    yRightAxisTitle?: string
}