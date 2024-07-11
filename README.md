# Uncharted: React Chart.js Wrapper
A React wrapper package for Chart.js, providing an easy-to-use interface for creating interactive dashboard components in React applications. This is a version 0.1.0 which was created by me during my internship as a full-stack dev. The final version cannot be commited due to copyright reasons.

This wrapper package was bootstrapped with: 
- [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2)
- [Chart.js](https://github.com/chartjs/Chart.js)
- [bootstrap 5](https://github.com/twbs/bootstrap)
- [testing-library](https://github.com/testing-library)
- [storybook](https://github.com/storybookjs/storybook)

## Table of contents:
- [Installation](#installation-wip)
- [Demo and storybook](#demo-and-storybook)
- [Datset requirements](#dataset-requirements)
- [Dashboard components: Charts](#dashboard-components-charts)
  - [Pie & Doughnut chart wrappers](#1-pie--doughnut-chart-wrapper)
  - [Bar chart wrapper](#2-bar-chart-wrapper-)
  - [Line chart wrapper](#3-line-chart-wrapper)
  - [Area chart wrapper](#4-area-chart-wrapper)
  - [Combined chart wrapper](#5-combined-chart-wrapper)
  - [Scatter chart wrapper](#5-scatter-chart-wrapper)
  - [Bubble chart wrapper](#6-bubble-chart-wrapper)
- [Dashboard components: Table & Scorecard](#dashboard-components-table-and-scorecard)
  - [Scorecard wrapper](#1-scorecard-wrapper)
  - [Table wrapper](#2-table-wrapper)

## Installation

You can install the required packages via `npm install` 

## Demo and Storybook:
Run `npm start react` to initialize mockup application located in `mock` folder of the repository.

To use Storybook, run `npm run storybook` to initialize Storybook application with interactive presentation of each library component.

## Dataset requirements
Each chart component receives the data prop along with chart-specific props that are used to configure the Chart.js options and datasets props.

To ensure proper initialization of the dashobard components without errors, it requires a dataset with at least two different keys. Each data object in the provided JSON array represents a data point on the chart or scorecard or table value. For chats, the first key is used as the aggregation factor for the other keys and serves as the x-axis values for the chart.

For example, if the JSON object is as follows:

```
[
    { "date": "2023-01-01", "ftl": 5, "ltl": 2, "cc": 2 },
    { "date": "2023-01-02", "ftl": 6, "ltl": 15, "cc": "-" },
    { "date": "2023-01-03", "ftl": 7, "ltl": 14, "cc": 0 },
...
]
```
The dataset must be of format `[key: string]: number | string`, meaning that null values must reformatted as '-' on server side.
The library considers that SQL query may result in an empty response and renders appropriate error message instead of a graph in this case.
```
[]
```
The library can render specific HTTP error messages if the server response follows the following structure:
```
[{
    error: {
        code: 500 ,
        name: 'requestTimeout',
        message: 'Server unavailable, please retry at a later time.' ,
        header: 'Request timeout',
    }
}]
```
This documentation is using the following exemplary dataset:
```
[{"aggregationKey": "1", "a": 50, "b": 20, "c": 30},{"aggregationKey": "2", "a": 2, "b": 24, "c": 30},{"aggregationKey": "3", "a": 3, "b": 12, "c": 30}]
```

## Dashboard Components: Charts

To use the React Chart.js Wrapper, you can import the necessary components for your dashboard and start creating charts and tables in your React components.
The package provides an easy-to-use API to customize and render multiple chart types with minimal coding effort by providing it JSON responses from database API calls.

In this case, the "date" key is used as the aggregation factor, representing a categorical variable for the x-axis values on the chart.
The other keys, such as "ftl," "ltl," and "cc," represent the associated data for each category.

It's important to ensure that the provided data follows this structure to avoid errors and ensure accurate chart rendering. The server providing the response should <i>coalesce any null data as '-'</i> to avoid issues during chart data preparation.

The factories `canvasSetupFactory` and `chartDataFactory` are then called when initializing the component to prepare correct `dataset` and `options` props for Chart.js canvas.

For more details, refer to the [Chart.js data structures documentation](https://www.chartjs.org/docs/latest/general/data-structures.html).

### 1. Pie & Doughnut Chart Wrapper
#### Usage example::
```
<PieChartWrapper
    title = { 'Test' }
    description = { 'Test description' }
    dataset = { testDataSet }
    options = {{ halfPieChart: true, showLegend: true }}
    valueFormat = { 'number' }
    keys = {['column_a']}
/>
```
![image](https://github.com/instafreight/uncharted-js/assets/89016793/fe0ef6df-acc7-4880-918c-8b20b053ac78)
```
<DoughnutChartWrapper
    title = { 'Test' }
    description = { 'Test description' }
    dataset = { testDataSet }
    options = {{ halfPieChart: true, showLegend: true }}
    valueFormat = { 'number' }
    keys = {['column_a']}
/>
```
![image](https://github.com/instafreight/uncharted-js/assets/89016793/68262c06-784e-462d-a0ff-930e4d4e3f45)

#### Props:

| Prop        | Required                | Type                            | Explanation                                                                                                                                                                                                                  |
|-------------|-------------------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                     | IChartDataset[]                 | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                                            |
| options     | yes                     | IPieOptionsCustomization[]      | ChartJS options prop to customize chart canvas.                                                                                                                                                                              |
| keys        | yes                     | string[]                        | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. Pie and doughnut chart allow maximum one aggregation key and one category key. |  
| title       | no, default = undefined | string                          | Chart title for Description component. Won't be rendered if undefined.                                                                                                                                                       |
| description | no, default = undefined | string                          | Chart description for Description component. Won't be rendered if undefined.                                                                                                                                                 |
| valueFormat | no, default = 'number'  | 'number' or 'euro' or 'percent' | Reformats tooltip dataslice value by appending '%' or '€' at the end. It doesn't recalculate the data itself (e.g. absolute nubmers in relative numbers).                                                                    |
                   
#### Options:

| Option         | Required | Type                     | Explanation                                                                                                               |
|----------------|----------|--------------------------|---------------------------------------------------------------------------------------------------------------------------|
| showLegend     | no       | boolean, default = true  | Render chart legend beneath the chart.                                                                                    |
| halfPieChart   | no       | boolean, default = false | Renders pie / doughnut chart as semi-circle chart by reducing circle circumference to 180° and changing rotation to -90°. |

For more details, refer to the [Chart.js pie chart documentation](https://www.chartjs.org/docs/latest/charts/doughnut.html).

#### Rendering flow:
1. Chart is initialised with null rendering LoadingMsg component.
2. Chart is initialising canvas options with provided options props via `canvasSetupFactory`. As the options don't change between re-renders and are independent of dataset, `useMemo` hook is used in each chart component.
```
{
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "bottom",
            labels: { color: fontColor, padding: legendLabelPadding },
            align: "start"
        },
        tooltip: {
            titleFont: {weight: 'normal'},
            footerFont: {weight: 'normal'},
            callbacks: {
                label: (value: any): string => (tooltipFormat(value, valueFormat))
            },
        }
    },
    rotation: 90,
    circumference: 180,
    interaction: {
        mode: 'index' as const,
        intersect: false
},
```
3. Once dataset is updated, it's content is validated with isDatasetEmpty function. The function checks, if dataset is empty (= []) and renders error message if true by setting `error` state.. It prevents costly calculations with dataset in case, e.g. wrong filters where used on the dashboard.
4. If dataset is correct each chart datapoint (it's data and label) is prepared via `chartDataFactory`. Pie and datachart will use aggregation key of each JSON object in dataset array (= row) as a label. In the example, dataset is reduced to values of category "a" for each aggregation key "aggregationfactor".
```
{
    "datasets": [{
        "label": "a", "type": "pie", "data": [50, 2, 3],
        "backgroundColor": ["#1c3742", "#697b82", "#b4bdc1"],
        "borderColor": ["#1c3742", "#697b82", "#b4bdc1"]
    }],
    "labels": ["1", "2", "3"]
}
```
5. To avoid too many 'slices' making chart difficult to read, chartDataFactory will group every dataset row after initial six as 'Others' by calling function `generateOthersLabelPie` in `dataUtils`. Based on category title (e.g. `average_costs` or `avg_price`) values are either summed or it's average is calculated.
6. Labels are reformatted in low case if the key name follows pattern `snake_case` (`avg_value` -> `avg value`).

### 2. Bar Chart Wrapper                                                                                                                                                                                                                 
#### Usage example:                                                                                                                                                                                                              
```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
<BarChartWrapper
    title={'Test'}
    description={'Test description'}
    dataset={testData}
    keys={["a", "b"]}
    options={{
        showLegend: true, 
        showGridX: true, 
        showGridY: true, 
        xAxisTitle: "Axis for category a",
        yAxisTitle: "Axis for category b",
        horizontal: true,
        stack: false
    }}
    yFormat={"number"}
    xFormat={"number"}
    stackMode={"normal"}
/>                                                                                                                                                                                                                  
```                                                                                                                                                                                                                              
![image](https://github.com/instafreight/uncharted-js/assets/89016793/2b83f19f-0bca-4cfc-bc4c-78e4dbbd1389)

#### Props:

| Prop        | Required                | Type                                  | Explanation                                                                                                                                                                                                    |
|-------------|-------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                     | IChartDataset[]                       | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                              |
| options     | yes                     | IPieOptionsCustomization[]            | ChartJS options prop to customize chart canvas.                                                                                                                                                                |
| keys        | yes                     | [string 1x-6x]                        | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. 1-6 keys allowed.                                                |  
| title       | no, default = undefined | string                                | Chart title for Description component. Won't be rendered if undefined.                                                                                                                                         |
| description | no, default = undefined | string                                | Chart description for Description component. Won't be rendered if undefined.                                                                                                                                   |
| xFormat     | no, default = 'text'    | 'text', 'number', 'euro' or 'percent' | Reformats x-axis ticks by appending '%' or '€' at the end. For text-based ticks (e.g. date string), use 'text' as number would change tick to numeric values (1, 2, 3,...).                                    |
| yFormat     | no, default = 'number'  | 'number', 'euro' or 'percent'         | Reformats y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                                  |
| stackMode   | no, default = 'normal'  | 'normal', 'percentage100'             | Triggers function `calculateDatePercentage`  to recalculate the percentage values for each key in the dataset array, ensuring each dataset sums up to 100%. Will only work for absolute non-percentage values. |

#### Options:

| Option     | Required | Type                     | Explanation                                                                          |
|------------|----------|--------------------------|--------------------------------------------------------------------------------------|
| showLegend | no       | boolean, default = true  | Render chart legend beneath the chart.                                               |
| showGridX  | no       | booelan, default = true  | Show gridline for each of x-axis ticks.                                              |
| showGridY  | no       | booelan, default = true  | Show gridline for each of y-axis ticks.                                              |
| xAxisTitle | no       | string                   | Show x-axis title below the axis.                                                    |
| yAxisTitle | no       | string                   | Show y-axis title on the left of the axis.                                           |
| horizontal | no       | string, default = false  | Flips index axis from x to y if true, resulting in bars being rendered horizontally. |
| stack      | no       | boolean, default = false | Renders different categories on top of each other instead of a group if true.        |
                                           
For more details, refer to the [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/bar.html).                                                                                    

#### Rendering flow:
1. Chart is initialised with null rendering LoadingMsg component.
2. Chart is initialising canvas options with provided options props via `canvasSetupFactory`. As the options don't change between re-renders and are independent of dataset, `useMemo` hook is used in each chart component.
```
{
    "indexAxis": "x",
    "responsive": true,
    "maintainAspectRatio": false,
    "plugins": {
        "legend": {
            "display": true,
            "position": "bottom",
            "labels": {"color": "#1c3742","padding": 30},
            "align": "start"
        },
        "tooltip": {
            "titleFont": {"weight": "normal"},
            "footerFont": {"weight": "normal"},
            "callbacks": {}
        }
    },
    "interaction": {"mode": "index", "intersect": false},
    "scales": {
        "x": {
            "title": {"display": true,"align": "center","text": "Axis for category a","padding": 0,"color": "#1c3742"},
            "grid": {"display": true},
            "stacked": false,
            "ticks": {"maxRotation": 90,"minRotation": 0,"padding": 5,"color": "#1c3742"}
        },
        "y": {
            "title": {"display": true,"align": "center","text": "Axis for category b","padding": 15,"color": "#1c3742"},
            "grid": {"display": true},
            "position": "left",
            "stacked": false,
            "ticks": {"padding": 5, "color": "#1c3742"}
        }
    }
}
```
3. Once dataset is updated, it's content is validated with isDatasetEmpty function. The function checks, if dataset is empty ([]) and renders error message if true by setting `error` state.. It prevents costly calculations with dataset in case, e.g. wrong filters where used on the dashboard.
4. If dataset is not empty, `extractError` function looks for `error` key from response and sets error message with information from the header property.
5. If dataset is correct each chart datapoint (it's data and label) is prepared via `chartDataFactory`.
```
[
    {"aggregationKey": "1","a": 50, "b": 20, "c": 30},
    {"aggregationKey": "2","a": 2, "b": 24, "c": 30},
    {"aggregationKey": "3", "a": 3, "b": 12, "c": 30}
]
```
5. Labels are reformatted in low case if the key name follows pattern `snake_case` (`avg_value` -> `avg value`).

### 3. Line Chart Wrapper
#### Usage example:
```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
<LineChartWrapper
    title={'Test'}
    description={'Test description'}
    dataset={testData}
    keys={["a", "b"]}
    options={{
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Axis for category a",
        yAxisTitle: "Axis for category b",
    }}
    yFormat={"number"}
    xFormat={"number"}
/>                                                                                                                                                                                                                        
```
Empty caregorical values ('-') will result in gap between two line points. Currently, the settings don't connect those datapoints. To change it, add property `spanGaps: true` to return of `dataUtils` function `createBasicChartDataset`. 

In order to change appearence of line from straight to curved and solid to dotted, add following properties to return object of `dataUtils` function `createBasicChartDataset`.
```
if (type === 'line' || type === 'area') {
    dataset.tension = 0.25;
    dataset.borderDash = [5, 5];
}
```

![image](https://github.com/instafreight/uncharted-js/assets/89016793/ad540280-fce0-40d2-93c0-2645a323ec6b)

  
#### Props:

| Prop        | Required                | Type                                  | Explanation                                                                                                                                                                                                    |
|-------------|-------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                     | IChartDataset[]                       | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                              |
| options     | yes                     | IPieOptionsCustomization[]            | ChartJS options prop to customize chart canvas.                                                                                                                                                                |
| keys        | yes                     | [string 1x-6x]                        | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. 1-6 keys allowed.                                                |  
| title       | no, default = undefined | string                                | Chart title for Description component. Won't be rendered if undefined.                                                                                                                                         |
| description | no, default = undefined | string                                | Chart description for Description component. Won't be rendered if undefined.                                                                                                                                   |
| xFormat     | no, default = 'text'    | 'text', 'number', 'euro' or 'percent' | Reformats x-axis ticks by appending '%' or '€' at the end. For text-based ticks (e.g. date string), use 'text' as number would change tick to numeric values (1, 2, 3,...).                                    |
| yFormat     | no, default = 'number'  | 'number', 'euro' or 'percent'         | Reformats y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                                  |

#### Options:

| Option     | Required | Type                    | Explanation                                |
|------------|----------|-------------------------|--------------------------------------------|
| showLegend | no       | boolean, default = true | Render chart legend beneath the chart.     |
| showGridX  | no       | booelan, default = true | Show gridline for each of x-axis ticks.    |
| showGridY  | no       | booelan, default = true | Show gridline for each of y-axis ticks.    |
| xAxisTitle | no       | string                  | Show x-axis title below the axis.          |
| yAxisTitle | no       | string                  | Show y-axis title on the left of the axis. |

For more details, refer to the [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/line.html#line-styling).

#### Rendering flow:
Same as Bar Chart Wrapper with change in step 2:
2. Chart is initialising canvas options with provided options props via `canvasSetupFactory`. As the options don't change between re-renders and are independent of dataset, `useMemo` hook is used in each chart component. Canvas settings are same as for Bar Chart Wrapper, but scales are not stacked (`"stacked": false`),

For more details, refer to the [Chart.js bar chart documentation](https://www.chartjs.org/docs/latest/charts/line.html).

### 4. Area Chart Wrapper
#### Usage example:
```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
<AreaChartWrapper
    title={'Test'}
    description={'Test description'}
    dataset={testData}
    keys={["a", "b"]}
    options={{
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Axis for category a",
        yAxisTitle: "Axis for category b",
    }}
    yFormat={"percent"}
    xFormat={"number"}
    stackMode={"percentage100"}
/>                                                                                                                                                                                                                    
```
Area chart functions the same as a line chart with only difference being the color filling of the area between line and tick / line of another data category.

![image](https://github.com/instafreight/uncharted-js/assets/89016793/101b5f91-a5c2-489e-8d57-fbcdacbf946f)

#### Props:

| Prop        | Required                | Type                                  | Explanation                                                                                                                                                                                                    |
|-------------|-------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                     | IChartDataset[]                       | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                              |
| options     | yes                     | IPieOptionsCustomization[]            | ChartJS options prop to customize chart canvas.                                                                                                                                                                |
| keys        | yes                     | [string 1x-6x]                        | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. 1-6 keys allowed.                                                |  
| title       | no, default = undefined | string                                | Chart title for Description component. Won't be rendered if undefined.                                                                                                                                         |
| description | no, default = undefined | string                                | Chart description for Description component. Won't be rendered if undefined.                                                                                                                                   |
| xFormat     | no, default = 'text'    | 'text', 'number', 'euro' or 'percent' | Reformats x-axis ticks by appending '%' or '€' at the end. For text-based ticks (e.g. date string), use 'text' as number would change tick to numeric values (1, 2, 3,...).                                    |
| yFormat     | no, default = 'number'  | 'number', 'euro' or 'percent'         | Reformats y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                                  |
| stackMode   | no, default = 'normal'  | 'normal', 'percentage100'             | Triggers function `calculateDatePercentage`  to recalculate the percentage values for each key in the dataset array, ensuring each dataset sums up to 100%. Will only work for absolute non-percentage values. |

#### Options:

| Option     | Required | Type                    | Explanation                                |
|------------|----------|-------------------------|--------------------------------------------|
| showLegend | no       | boolean, default = true | Render chart legend beneath the chart.     |
| showGridX  | no       | booelan, default = true | Show gridline for each of x-axis ticks.    |
| showGridY  | no       | booelan, default = true | Show gridline for each of y-axis ticks.    |
| xAxisTitle | no       | string                  | Show x-axis title below the axis.          |
| yAxisTitle | no       | string                  | Show y-axis title on the left of the axis. |

#### Rendering flow:
Same as Line Chart Wrapper.

For more details, refer to the [Chart.js area chart documentation](https://www.chartjs.org/docs/latest/charts/area.html).

### 5. Combined Chart Wrapper
#### Usage example:
```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
<CombinedChartWrapper
    title={'Test'}
    description={'Test description'}
    dataset={testData}
    barKeys={["a", "b"]}
    lineKeys={["c"]}
    options={{
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Axis for category a",
        yAxisTitle: "Axis for category b",
        showGridRightY: true,
        yRightAxisTitle: "Axis for category c"
    }}
    yLeftFormat={"percent"}
    yRightFormat={"number"}
    xFormat={"text"}
/>                                                                                                                                                                                                                 
```

![image](https://github.com/instafreight/uncharted-js/assets/89016793/1806f235-49ef-4479-8e75-4e1b3f9bed8f)

#### Props:

| Prop         | Required                | Type                                  | Explanation                                                                                                                                                                       |
|--------------|-------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset      | yes                     | IChartDataset[]                       | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string. |
| options      | yes                     | IPieOptionsCustomization[]            | ChartJS options prop to customize chart canvas.                                                                                                                                   |
| barKeys      | yes                     | [string 1x-6x]                        | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. 1-6 keys allowed.                   |
| lineKeys     | yes                     | [string 1x-6x]                        | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. 1-6 keys allowed.                   |  
| title        | no, default = undefined | string                                | Chart title for Description component. Won't be rendered if undefined.                                                                                                            |
| description  | no, default = undefined | string                                | Chart description for Description component. Won't be rendered if undefined.                                                                                                      |
| xFormat      | no, default = 'text'    | 'text', 'number', 'euro' or 'percent' | Reformats x-axis ticks by appending '%' or '€' at the end. For text-based ticks (e.g. date string), use 'text' as number would change tick to numeric values (1, 2, 3,...).       |
| yFormat      | no, default = 'number'  | 'number', 'euro' or 'percent'         | Reformats left y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                |
| yRightFormat | no, default = 'normal'  | 'number', 'euro' or 'percent'         | Reformats right y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                               |

#### Options:

| Option          | Required | Type                     | Explanation                                   |
|-----------------|----------|--------------------------|-----------------------------------------------|
| showLegend      | no       | boolean, default = true  | Render chart legend beneath the chart.        |
| showGridX       | no       | booelan, default = true  | Show gridline for each of x-axis ticks.       |
| showGridY       | no       | booelan, default = true  | Show gridline for each of left y-axis ticks.  |
| showGridRightY  | no       | booelan, default = false | Show gridline for each of right y-axis ticks. |
| xAxisTitle      | no       | string                   | Show x-axis title below the axis.             |
| yAxisTitle      | no       | string                   | Show y-axis title on the left of the axis.    |
| yRightAxisTitle | no       | string                   | Show y-axis title on the right of the axis.   |

#### Rendering flow:
1. Chart is initialised with null rendering LoadingMsg component.
2. Chart is initialising canvas options with provided options props via `canvasSetupFactory`. As the options don't change between re-renders and are independent of dataset, `useMemo` hook is used in each chart component.
```
{
    "indexAxis": "x",
    "responsive": true,
    "maintainAspectRatio": false,
    "plugins": {
        "legend": {"display": true,"position": "bottom","labels": {"color": "#1c3742","padding": 30},"align": "start"},
        "tooltip": {
            "titleFont": {"weight": "normal"},
            "footerFont": {"weight": "normal"},
            "callbacks": {}
        }
    },
    "interaction": {"mode": "index","intersect": false},
    "scales": {
        "x": {
            "title": {"display": true,"align": "center","text": "Axis for category a","padding": 0,"color": "#1c3742"},
            "grid": {"display": true},
            "ticks": {"maxRotation": 90,"minRotation": 0,"padding": 5,"color": "#1c3742"}
        },
        "y": {
            "title": {"display": true,"align": "center","text": "Axis for category b","padding": 15,"color": "#1c3742"},
            "grid": {"display": true},
            "position": "left",
            "min": 0,
            "max": 100,
            "ticks": {"padding": 5,"color": "#1c3742","stepSize": 20}
        },
        "y2": {
            "title": {"display": true,"align": "center","text": "Axis for category c","padding": 15,"color": "#1c3742"},
            "grid": {"display": false},
            "position": "right",
            "stacked": false,
            "ticks": {"padding": 5,"color": "#1c3742"}
        }
    }
}
```
3. Once dataset is updated, it's content is validated with isDatasetEmpty function. The function checks, if dataset is empty ([]) and renders error message if true by setting `error` state. It prevents costly calculations with dataset in case, e.g. wrong filters where used on the dashboard.
4. If dataset is not empty, `extractError` function looks for `error` key from response and sets error message with information from the header property.
5. If dataset is correct each chart datapoint (it's data and label) is prepared via `chartDataFactory`. 
```
{
    "datasets": [
        {
            "label": "a",
            "type": "bar",
            "data": [50,2,3],
            "backgroundColor": "#1c3742",
            "borderColor": "#1c3742",
            "yAxisID": "y",
            "order": 2
        },
        {
            "label": "b",
            "type": "bar",
            "data": [ 20, 24, 12],
            "backgroundColor": "#77878e",
            "borderColor": "#77878e",
            "yAxisID": "y",
            "order": 2
        },
        {
            "label": "c",
            "type": "line",
            "data": [30,30,30],
            "backgroundColor": "#e63b09",
            "borderColor": "#e63b09",
            "yAxisID": "y2",
            "order": 1
        }
    ],
    "labels": ["1","2","3"]
}
```
5. Labels are reformatted in low case if the key name follows pattern `snake_case` (`avg_value` -> `avg value`).

For more details, refer to the [Chart.js mixed chart documentation](https://www.chartjs.org/docs/latest/charts/mixed.html).

### 5. Scatter Chart Wrapper
#### Usage example:
```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
<ScatterChartWrapper
    title={'Test'}
    description={'Test description'}
    dataset={testData}
    keys={["a", "b"]}
    options={{
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Axis for category a",
        yAxisTitle: "Axis for category b",
    }}
    yFormat={"number"}
    xFormat={"number"}
/>                                                                                                                                                                                                       
```

![image](https://github.com/instafreight/uncharted-js/assets/89016793/fc483bad-ab6d-4ea1-a41f-db249a345135)

#### Props:

| Prop        | Required                | Type                          | Explanation                                                                                                                                                                                               |
|-------------|-------------------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                     | IChartDataset[]               | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                         |
| options     | yes                     | IPieOptionsCustomization[]    | ChartJS options prop to customize chart canvas.                                                                                                                                                           |
| keys        | yes                     | [string, string]              | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. Scatter chart allows exactly two keys - for x and y values. |
| title       | no, default = undefined | string                        | Chart title for Description component. Won't be rendered if undefined.                                                                                                                                    |
| description | no, default = undefined | string                        | Chart description for Description component. Won't be rendered if undefined.                                                                                                                              |
| xFormat     | no, default = 'number'  | 'number', 'euro' or 'percent' | Reformats x-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                             |
| yFormat     | no, default = 'number'  | 'number', 'euro' or 'percent' | Reformats left y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                        |

#### Options:

| Option          | Required | Type                     | Explanation                                   |
|-----------------|----------|--------------------------|-----------------------------------------------|
| showLegend      | no       | boolean, default = true  | Render chart legend beneath the chart.        |
| showGridX       | no       | booelan, default = true  | Show gridline for each of x-axis ticks.       |
| showGridY       | no       | booelan, default = true  | Show gridline for each of left y-axis ticks.  |
| xAxisTitle      | no       | string                   | Show x-axis title below the axis.             |
| yAxisTitle      | no       | string                   | Show y-axis title on the left of the axis.    |

#### Rendering flow:
1. Chart is initialised with null rendering LoadingMsg component.
2. Once dataset is updated, it's content is validated with isDatasetEmpty function. The function checks, if dataset is empty ([]) and renders error message if true by setting `error` state. It prevents costly calculations with dataset in case, e.g. wrong filters where used on the dashboard.
3. If dataset is correct each chart datapoint (it's data and label) is prepared via `chartDataFactory`. Every value of First key in keys array is then allocated to x-axis, second to y-axis.
4. If dataset is not empty, `extractError` function looks for `error` key from response and sets error message with information from the header property.
5. To avoid too many datapoints making chart difficult to read, chartDataFactory will group every dataset row after initial seven as 'Others' by calling function `generateOthersLabelScatterBubble` in `dataUtils`. Based on category title (e.g. `average_costs` or `avg_price`) values are either summed or it's average is calculated.
```
{
    "datasets": [
        {
            "label": "1",
            "type": "scatter",
            "radius": 10,
            "pointHoverRadius": 12,
            "data": [{"x": 50,"y": 20}],
            "backgroundColor": "#1c3742",
            "borderColor": "#1c3742"
        },
        {
            "label": "2",
            "type": "scatter",
            "radius": 10,
            "pointHoverRadius": 12,
            "data": [{"x": 2, "y": 24}],
            "backgroundColor": "#697b82",
            "borderColor": "#697b82"
        },
        {
            "label": "3",
            "type": "scatter",
            "radius": 10,
            "pointHoverRadius": 12,
            "data": [{"x": 3,"y": 12}],
            "backgroundColor": "#b4bdc1",
            "borderColor": "#b4bdc1"
        }
    ],
    "labels": ["1","2","3"]
}}
```
5. Labels are reformatted in low case if the key name follows pattern `snake_case` (`avg_value` -> `avg value`).
6. By default, ChartJS is treating (x, y) values as one string for the tooltip. In order to achieve the format of 
```
Label 
Category A: value
Category B: value
```
for the tooltip, chart has additional state `tooltipData` which is update on each change of state `chartData` by calling `dataUtil` function `createBubbleChartTooltipDataset`.
7. Once `tooltipData` is updated, `canvasSettings` is reset with new tooltip dataset via `canvasSetupFactory` in `optionsUtils`. Settings have no `interaction` property as otherwise tooltip won't be shown by hovering over individual datapoint.
```
{
    "indexAxis": "x",
    "responsive": true,
    "maintainAspectRatio": false,
    "plugins": {
        "legend": {"display": true,"position": "bottom","labels": {"color": "#1c3742","padding": 30},"align": "start"},
        "tooltip": { "titleFont": {"weight": "normal"},"footerFont": {"weight": "normal"},"callbacks": {}}
    },
    "scales": {
        "x": {
            "title": {"display": true,"align": "center","text": "Axis for category a","padding": 0,"color": "#1c3742"},
            "grid": {"display": true},
            "ticks": {"maxRotation": 90,"minRotation": 0,"padding": 5,"color": "#1c3742"}
        },
        "y": {
            "title": {"display": true,"align": "center","text": "Axis for category b","padding": 15,"color": "#1c3742"},
            "grid": {"display": true},
            "position": "left",
            "ticks": {"padding": 5,"color": "#1c3742"}
        }
    }
}
```

For more details, refer to the [Chart.js scatter chart documentation](https://www.chartjs.org/docs/latest/charts/scatter.html).

### 6. Bubble Chart Wrapper
#### Usage example:
```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
<BubbleChartWrapper
    title={'Test'}
    description={'Test description'}
    dataset={testData}
    keys={["a", "b", "c"]}
    options={{
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Axis for category a",
        yAxisTitle: "Axis for category b",
    }}
    yFormat={"number"}
    xFormat={"number"}
    rFormat={"number"}
/>                                                                                                                                                                                                 
```

![image](https://github.com/instafreight/uncharted-js/assets/89016793/f1ae1a17-b34a-4632-b552-05b1a11cf057)

#### Props:

| Prop        | Required                | Type                                  | Explanation                                                                                                                                                                                              |
|-------------|-------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                     | IChartDataset[]                       | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                        |
| options     | yes                     | IPieOptionsCustomization[]            | ChartJS options prop to customize chart canvas.                                                                                                                                                          |
| keys        | yes                     | [string, string, string]              | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. Bubble chart allows exactly two keys - for x and y values. |
| title       | no, default = undefined | string                                | Chart title for Description component. Won't be rendered if undefined.                                                                                                                                   |
| description | no, default = undefined | string                                | Chart description for Description component. Won't be rendered if undefined.                                                                                                                             |
| xFormat     | no, default = 'text'    | 'text', 'number', 'euro' or 'percent' | Reformats x-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                            |
| yFormat     | no, default = 'number'  | 'number', 'euro' or 'percent'         | Reformats y-axis ticks and tooltip values by appending '%' or '€' at the end.                                                                                                                            |
| rFormat     | no, default = 'number'  | 'number', 'euro' or 'percent'         | Reformats datapoint radius tooltip values by appending '%' or '€' at the end.                                                                                                                            |

#### Options:

| Option          | Required | Type                     | Explanation                                   |
|-----------------|----------|--------------------------|-----------------------------------------------|
| showLegend      | no       | boolean, default = true  | Render chart legend beneath the chart.        |
| showGridX       | no       | booelan, default = true  | Show gridline for each of x-axis ticks.       |
| showGridY       | no       | booelan, default = true  | Show gridline for each of left y-axis ticks.  |
| xAxisTitle      | no       | string                   | Show x-axis title below the axis.             |
| yAxisTitle      | no       | string                   | Show y-axis title on the left of the axis.    |

#### Rendering flow:
1. Chart is initialised with null rendering LoadingMsg component.
2. Once dataset is updated, it's content is validated with isDatasetEmpty function. The function checks, if dataset is empty ([]) and renders error message if true by setting `error` state. It prevents costly calculations with dataset in case, e.g. wrong filters where used on the dashboard.
3. If dataset is not empty, `extractError` function looks for `error` key from response and sets error message with information from the header property.
4. If dataset is correct each chart datapoint (it's data and label) is prepared via `chartDataFactory`. Every value of First key in keys array is then allocated to x-axis, second to y-axis, this to radius size of datapoint.
4To avoid too many data-points making chart difficult to read, chartDataFactory will group every dataset row after initial seven as 'Others' by calling function `generateOthersLabelScatterBubble` in `dataUtils`. Based on category title (e.g. `average_costs` or `avg_price`) values are either summed or it's average is calculated.
5To avoid data-points becoming too big in case of wide range between minimal and maximal radius values, data is normalized by calling `dataUtils` function `normalizeBubbleChartData`. The datapoint radius then is between 5px and 20px.
```
{
    "datasets": [
        {
            "label": "1",
            "type": "bubble",
            "radius": 10,
            "pointHoverRadius": 12,
            "data": [{"x": 50,"y": 20,"r": 5}],
            "backgroundColor": "#1c3742",
            "borderColor": "#1c3742"
        },
        {
            "label": "2",
            "type": "bubble",
            "radius": 10,
            "pointHoverRadius": 12,
            "data": [{"x": 2,"y": 24,"r": 5}],
            "backgroundColor": "#697b82",
            "borderColor": "#697b82"
        },
        {
            "label": "3",
            "type": "bubble",
            "radius": 10,
            "pointHoverRadius": 12,
            "data": [{"x": 3,"y": 12,"r": 5}],
            "backgroundColor": "#b4bdc1",
            "borderColor": "#b4bdc1"
        }
    ],
    "labels": ["1","2","3"]
}
```
6. Continues by following the same flow as Scatter Chart Wrapper.

For more details, refer to the [Chart.js bubble chart documentation](https://www.chartjs.org/docs/latest/charts/bubble.html).

## Dashboard Components: Table and Scorecard

### 1. Scorecard Wrapper
A scorecard is a compact visual representation that displays a single value along with context description. It's typically designed to provide an immediate understanding of a specific metric without the need for complex graphical elements. In current implementation scorecard does not allow comparison between different periods directly (e.g. value of current and previous month).

```
<ScorecardWrapper
    title={'Test'}
    dataset={testData}
    summaryKey={'a'}
    summaryType={'average'}
/>
```

![image](https://github.com/instafreight/uncharted-js/assets/89016793/4a22c455-06a8-4ae6-8df4-6924a1295fc6)

#### Props:

| Prop        | Required               | Type               | Explanation                                                                                                                                                |
|-------------|------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                    | IChartDataset[]    | JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string. |
| title       | no                     | string             | Descriptive scorecard title. Won't be rendered if undefined.                                                                                               |
| summaryKey  | yes                    | string             | Dataset key to use for scorecard value from the dataset. Aggregation key<br/>like 'date' is always included automatically.                                 |
| summaryType | no, default = 'sum'    | 'sum' or 'average' | Sums the key values or calculates average (sum / JSON rows).                                                                                               |
| valueFormat | no, default = 'number' | string             | Reformats summary type value by appending '%' or '€' at the end.                                                                                           |

#### Rendering flow:
1. Scorecard is initialised with null rendering "Loading..." text and title (if provided as prop).
2. Once dataset is updated, it's content is validated with isDatasetEmpty function. The function checks, if dataset is empty ([]) and renders error message if true by setting `error` state. It prevents costly calculations with dataset in case, e.g. wrong filters where used on the dashboard.
3. State `total` is updated with result of `summarizeData` function.

### 2. Table Wrapper
A table is a structured arrangement of data in rows and columns. It's a common way to display detailed information in a tabular format, making it easy to compare values, find specific data, and perform basic calculations. Currently column specific formatting is not supported, meaning that every value will be formatted with the provided `valueFormat` prop.

```
<TableWrapper
    title={'Test'}
    description={'Test description'}
    allowedKeys={["a"]}
    dataset={testData}
    summaryRow={'average'}
    valueFormat={"euro"}
/>
```

![image](https://github.com/instafreight/uncharted-js/assets/89016793/bc60aed0-0a1d-4bce-971b-9f4ae08c3234)

#### Props:

| Prop        | Required             | Type                        | Explanation                                                                                                                                                                                              |
|-------------|----------------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataset     | yes                  | IChartDataset[]             | ChartJS datasets prop. JSON object with at least 2 keys required (see above). <br/> Only key values of type 'string' or 'number' are supported. Key names must be of type string.                        |
| options     | yes                  | IPieOptionsCustomization[]  | ChartJS options prop to customize chart canvas.                                                                                                                                                          |
| allowedKeys | no                   | string[]                    | Dataset keys ( = column titles in table) to use for chart from the dataset. Aggregation key<br/>like 'date' is always included automatically. Bubble chart allows exactly two keys - for x and y values. |
| summaryRow  | no, default = 'sum'  | 'sum', 'average' or 'none'  | If not none, appends fixed summary row to the end of table with either total sum or average for each column.                                                                                             |
| valueFormat | no, default = 'none' | 'none', 'euro' or 'percent' | Reformat body values by appending '%' or '€' at the end.                                                                                                                                                 |

#### Rendering flow:
1. When the component is first rendered, it initializes several pieces of state using the useState hook. These include states for `isLoading`, `data`, `keys`, `summaryData`, `error`, `tableKey`, `ascOrder`, and `sortKey`. These states will manage the loading status, data to be displayed, column keys, summary data, errors, sorting order, sorting key, and a unique key for the table component.
2. The component defines a `handleSort` function that is used to manage column sorting. When a column header is clicked, this function updates the ascOrder state to reverse the sorting order and updates the sortKey state to the selected column's key.
3. As table is initialised with null as dataset, LoadingMsg component is rendering while waiting for the dataset update.
4. If dataset is not empty, `extractError` function looks for `error` key from response and sets error message with information from the header property.
5. The `useEffect` hook is used to fetch and process the data. When the `dataset` prop changes, the first `useEffect` runs. If the `dataset` is null, it sets the `isLoading` state to true. Otherwise, it reduces the dataset using `reduceDataset`, and if the reduced data is not empty, it updates the `data` state with the reduced data and sets the `isLoading` state to `false`.
5. Another `useEffect` hook monitors changes in the `data` state. When `data` is not empty, it extracts the column keys using the `getKeys` function and updates the `keys` state. The state is used for creating of the table header row.
6. A third `useEffect` hook monitors changes in both the `data` and `keys` states. When both are present and `summaryRow` props is not `none`, it generates summary data using the `summarizeData` function and updates the `summaryData` state.
7. The final `useEffect` hook tracks changes in ascOrder and `sortKey`. If both are set, it sorts the data using the `sortDataByKey` function, updates the `data` state with the sorted data, and increments the `tableKey` state to force a re-render of the table.