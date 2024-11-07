import React, { useEffect, useMemo, useState } from "react";
import {
  calculateDataPercentage,
  chartDataSetupFactory,
} from "../utils/data/dataUtils";
import { canvasSetupFactory } from "../utils/options/optionsUtils";
import { IBarChart } from "../utils/chartInterfaces";
import {
  checkResponseError,
  extractError,
  isDatasetEmpty,
} from "../../common/utils/utils";
import { Description, LoadingMsg } from "../../common";
import "../style.css";
import { Chart } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { IChartJSDatasets } from "../utils/data/dataInterfaces";
import { IChartOptions } from "../utils/options/optionsInterface";
//import { setDatasetLoading, setApiError } from './redux/actions'; // Adjust the import path
//import { RootState } from './redux/store';
/**
 * /**
 * Wraps react-chartjs chart component in provided customization options and data
 * @param dataset API fetch result, JSON with minimum two key-value pairs required (1. pair - x axis)
 * @param options customization settings to change chart appearance
 * @param dataRepresentation defines if data should be recalculated as absolute values or recalculated to relative 100% stack
 * @constructor
 */
function BarChartWrapper({
  title,
  description,
  dataset,
  options,
  keys,
  stackMode = "normal",
  yFormat = "number",
}: IBarChart) {
  const chartType = "bar";

  const [isLoading, setIsLoading]: [boolean, any] = useState(true);
  const [chartData, setData]: [IChartJSDatasets, any] =
    useState<IChartJSDatasets>({ labels: [], datasets: [] });
  const [error, setError]: [string | null, any] = useState(null);
  const chartOptions: IChartOptions = useMemo(() => {
    let yFormat = "number";
    if (stackMode === "percentage100") {
      options.stack = true;
      yFormat = "percent";
    }
    return canvasSetupFactory(options, chartType, yFormat);
  }, [options, keys, stackMode]);

  useEffect((): void => {
    if (!dataset) {
      setIsLoading(true);
    } else {
      if (isDatasetEmpty(dataset)) {
        setError("No data available for your request.");
      } else if (checkResponseError(dataset)) {
        setError(extractError(dataset));
      } else {
        let dataRecalc =
          stackMode === "percentage100"
            ? calculateDataPercentage(dataset, keys)
            : dataset;
        setData(chartDataSetupFactory(dataRecalc, chartType, keys));
        setError(null);
      }
      setIsLoading(false);
    }
  }, [dataset, chartType]);

  return (
    <div data-testid="chart-mock" className={"dashboard-component"}>
      <Description title={title} description={description} />
      <div className={"chart-component"}>
        {isLoading ? (
          <LoadingMsg />
        ) : error ? (
          <p data-testid="chartData-state" className={"error-msg"}>
            {error}
          </p>
        ) : (
          <Chart
            type={chartType}
            data={chartData as ChartData}
            options={chartOptions as ChartOptions}
          />
        )}
      </div>
    </div>
  );
}

export default BarChartWrapper;
