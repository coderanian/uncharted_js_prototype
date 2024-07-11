import React, {useEffect, useMemo, useState} from "react";
import {Chart} from "react-chartjs-2";
import {canvasSetupFactory} from "../utils/options/optionsUtils";
import {chartDataSetupFactory} from "../utils/data/dataUtils";
import {ILineChart} from "../utils/chartInterfaces";
import {ChartData, ChartOptions} from "chart.js";
import {IChartJSDatasets} from "../utils/data/dataInterfaces";
import {IChartOptions} from "../utils/options/optionsInterface";
import {checkResponseError, extractError, isDatasetEmpty} from "../../common/utils/utils";
import {Description, LoadingMsg} from "../../common";

/**
 * /**
 * Wraps react-chartjs Pie chart component in provided customization options and data
 * @param dataset API fetch result, JSON with minimum two key-value pairs required (1. pair - x axis)
 * @param options customization settings to change chart appearance
 * @param lineType straight or curved line
 * @param lineStyle dashed or solid line
 * @constructor
 */
function LineChartWrapper({title, description, dataset, options, keys, yFormat = 'number'}: ILineChart) {
    const chartType = 'line';

    const [isLoading, setIsLoading] : [boolean, any] = useState(true);
    const [chartData, setData]  : [IChartJSDatasets, any] = useState<IChartJSDatasets>({ labels: [], datasets: [] });
    const [error, setError] : [string | null, any] = useState(null);

    // useMemo for options as it doesn't depend on dataset
    const chartOptions: IChartOptions = useMemo(() => canvasSetupFactory(options, chartType, yFormat), [options]);

    useEffect((): void => {
        if(!dataset){
            setIsLoading(true)
        }else{
            if(isDatasetEmpty(dataset)) {
                setError("No data available for your request.");
            } else if(checkResponseError(dataset)){
                setError(extractError(dataset));
            } else {
                setData(chartDataSetupFactory(dataset, chartType, keys));
                setError(null);
            }
            setIsLoading(false);
        }
    }, [dataset, chartType]);

    return (
        <div data-testid="chart-mock" className={"dashboard-component"}>
            <Description title={title} description={description} />
            <div className={'chart-component'}>
                {isLoading ? <LoadingMsg/> :
                    error ? <p className={'error-msg'}>{error}</p> :
                        <Chart type={chartType} data={chartData as ChartData} options={chartOptions as ChartOptions}/>
                }
            </div>
        </div>
    )
}

export default LineChartWrapper;