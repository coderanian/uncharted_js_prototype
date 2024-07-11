import React, {useEffect, useMemo, useState} from "react";
import {Chart} from "react-chartjs-2";
import {chartDataSetupFactory, createBubbleChartTooltipDataset} from "../utils/data/dataUtils";
import {IBubbleChart, IScatterChart} from "../utils/chartInterfaces";
import {Description, LoadingMsg} from "../../common";import {canvasSetupFactory} from "../utils/options/optionsUtils";
import {ChartData} from "chart.js";
import {IChartJSDatasets, ICustomTooltipDataset} from "../utils/data/dataInterfaces";
import {checkResponseError, extractError, isDatasetEmpty} from "../../common/utils/utils";

/**
 * /**
 * Wraps react-chartjs chart component in provided customization options and data
 * @param dataset API fetch result, JSON with minimum two key-value pairs required (1. pair - x axis)
 * @param options customization settings to change chart appearance
 * @param dataRepresentation defines if data should be recalculated as absolute values or recalculated to relative 100% stack
 * @constructor
 */
function BubbleChartWrapper({
    title,
    description,
  dataset,
  options,
    keys,
    xFormat = 'number',
    yFormat = 'number',
    rFormat = 'number'
}: IBubbleChart) {
    const chartType = 'bubble';
    const [error, setError] : [string | null, any] = useState(null);
    const [isLoading, setIsLoading] : [boolean, any] = useState(false);
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
            setTooltipData(createBubbleChartTooltipDataset(dataset, chartType, [xFormat, yFormat, rFormat], keys));
        }
    }, [chartData, isDataLoaded]);
    useEffect((): void => {
        if(tooltipData && isDataLoaded){
            setCanvasSettings(canvasSetupFactory(options, chartType,  [xFormat, yFormat, rFormat], tooltipData));
        }
    }, [tooltipData]);

    return (
        <div data-testid="chart-mock" className={"dashboard-component"}>
            <Description title={title} description={description} />
            <div className={'chart-component'}>
                {isLoading ? <LoadingMsg/> :
                    error ? <p className={'error-msg'}>{error}</p> :
                     <Chart type={chartType} data={chartData as ChartData} options={canvasSettings}/>}
            </div>
        </div>
    )
}

export default BubbleChartWrapper;