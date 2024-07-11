import React, {useEffect, useState} from "react";
import {chartDataSetupFactory, createBubbleChartTooltipDataset} from "../utils/data/dataUtils";
import {canvasSetupFactory} from "../utils/options/optionsUtils";
import {IScatterChart} from "../utils/chartInterfaces";
import {checkResponseError, extractError, isDatasetEmpty} from "../../common/utils/utils";
import {Description, LoadingMsg} from "../../common";
import '../style.css';
import {Chart} from "react-chartjs-2";
import {IChartJSDatasets, ICustomTooltipDataset} from "../utils/data/dataInterfaces";
import {ChartData} from "chart.js";


/**
 * /**
 * Wraps rta, ChartOptions} from "chart.js";
 * import eact-chartjs chart component in provided customization options and data
 * @param dataset API fetch result, JSON with minimum two key-value pairs required (1. pair - x axis)
 * @param options customization settings to change chart appearance
 * @param dataRepresentation defines if data should be recalculated as absolute values or recalculated to relative 100% stack
 * @constructor
 */
function ScatterChartWrapper({
    title,
    description,
    dataset,
    options,
    keys,
    xFormat = 'number',
    yFormat = 'number'
}: IScatterChart) {
    const chartType = 'scatter';
    const [error, setError] : [string | null, any] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [canvasSettings, setCanvasSettings] : [IChartJSDatasets | undefined, any] = useState(undefined);
    const [chartData, setData]  : [IChartJSDatasets, any] = useState<IChartJSDatasets>({ labels: [], datasets: [] });
    const [tooltipData, setTooltipData] : [ICustomTooltipDataset[] | null, any] = useState(null);
    const [isDataLoaded, setIsDataLoaded] : [boolean, any] = useState(false);

    useEffect((): void => {
        if (!dataset) {
            setIsLoading(true);
            setIsDataLoaded(false);
        } else {
            if(isDatasetEmpty(dataset)) {
                setError("No data available for your request.");
            } else if(checkResponseError(dataset)) {
                setError(extractError(dataset));
            } else {
                setData(chartDataSetupFactory(dataset, chartType, keys));
                setIsDataLoaded(true);
                setError(null);
            }
            setIsLoading(false);
        }
    }, [dataset, chartType]);
    useEffect((): void => {
        if(chartData && dataset && isDataLoaded){
            setTooltipData(createBubbleChartTooltipDataset(dataset, chartType, [xFormat, yFormat], keys));
        }
    }, [chartData, isDataLoaded]);
    useEffect((): void => {
        if(tooltipData && isDataLoaded){
            setCanvasSettings(canvasSetupFactory(options, chartType,  [xFormat, yFormat], tooltipData));
        }
    }, [tooltipData]);

    return (
        <div data-testid="chart-mock" className={"dashboard-component"}>
            <Description title={title} description={description} />
            <div className={'chart-component'}>
                {isLoading ? <LoadingMsg/>
                 : error
                    ? <p data-testid="chartData-state" className={"error-msg"}>{error}</p>
                    : <Chart type={chartType} data={chartData as ChartData} options={canvasSettings}/>}
            </div>
        </div>
    )
}

export default ScatterChartWrapper;