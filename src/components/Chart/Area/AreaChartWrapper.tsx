import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { canvasSetupFactory } from "../utils/options/optionsUtils";
import {
  calculateDataPercentage,
  chartDataSetupFactory,
} from "../utils/data/dataUtils";
import { IAreaChart } from "../utils/chartInterfaces";
import "bootstrap/dist/css/bootstrap.css";
import { IChartJSDatasets, IDataset } from "../utils/data/dataInterfaces";
import { ChartData, ChartOptions } from "chart.js";
import { IChartOptions } from "../utils/options/optionsInterface";
import {
  checkResponseError,
  extractError,
  isDatasetEmpty,
} from "../../common/utils/utils";
import { Description, LoadingMsg } from "../../common";

/**
 * /**
 * Wraps react-chartjs Pie chart component in provided customization options and data
 * @param dataset API fetch result, JSON with minimum two key-value pairs required (1. pair - x axis)
 * @param options customization settings to change chart appearance
 * @param dataRepresentation defines if data should be recalculated as absolute values or recalculated to relative 100% stack
 * @constructor
 */
function AreaChartWrapper({
  title,
  description,
  dataset,
  options,
  keys,
  stackMode = "normal",
  yFormat = "number",
}: IAreaChart) {
  const chartType = "line";
  const chartTypeFlag = "area";

  const [isLoading, setIsLoading]: [boolean, any] = useState(true);
  const [chartData, setData]: [IChartJSDatasets, any] =
    useState<IChartJSDatasets>({ labels: [], datasets: [] });
  const [error, setError]: [string | null, any] = useState(null);

  const chartOptions: IChartOptions = useMemo(() => {
    let yFormat = "";
    if (stackMode === "percentage100") {
      yFormat = "percent";
    }
    return canvasSetupFactory(options, chartTypeFlag, yFormat);
  }, [options, stackMode]);

  useEffect((): void => {
    if (!dataset) {
      setIsLoading(true);
    } else {
      if (isDatasetEmpty(dataset)) {
        setError("No data available for your request.");
      } else if (checkResponseError(dataset)) {
        setError(extractError(dataset));
      } else {
        let dataRecalc: IDataset<string | number>[] =
          stackMode === "percentage100"
            ? calculateDataPercentage(dataset, keys)
            : dataset;
        setData(chartDataSetupFactory(dataRecalc, chartTypeFlag, keys));
        setError(null);
      }
      setIsLoading(false);
    }
  }, [dataset, chartType, keys, stackMode]);

  return (
    <div data-testid="chart-mock" className={"dashboard-component"}>
      <Description title={title} description={description} />
      <div className={"chart-component"}>
        {isLoading ? (
          <LoadingMsg />
        ) : error ? (
          <p className={"error-msg"}>{error}</p>
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

export default AreaChartWrapper;
