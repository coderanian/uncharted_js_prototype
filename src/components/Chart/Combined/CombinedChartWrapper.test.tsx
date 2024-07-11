import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import React from "react";
import {CombinedChartWrapper} from "../../index";
import {chartDataSetupFactory} from "../utils/data/dataUtils";
import {canvasSetupFactory} from "../utils/options/optionsUtils";
import {formatValue} from "../../common/utils/utils";

describe('<CombinedChartWrapper />', () => {
    const title = 'Test chart';
    const description = 'Chart test.';
    const testData = [
        {"aggregationKey": "1", "a": 1, "b": 1, "c": 1},
        {"aggregationKey": "2", "a": 0, "b": 2, "c": 1},
        {"aggregationKey": "3", "a": 1, "b": 1, "c": 1},
    ];
    it('renders empty message if response data is empty', async () => {
        render(
            <CombinedChartWrapper
                title={title}
                description={description}
                dataset={[]}
                options={{showLegend: true, showGridX: true, showGridY: true, showGridRightY: true}}
                barKeys={["a","b"]}
                lineKeys={["c"]}
                yLeftFormat={"number"}
                yRightFormat={"percent"}
            />
        );
        await waitFor(() => {
            const emptyMsg = screen.getByText('No data available for your request.');
            expect(emptyMsg).toBeInTheDocument();
        });
    });
    it('renders loading', () => {
            render(
                <CombinedChartWrapper
                    title={title}
                    description={description}
                    dataset={null}
                    options={{showLegend: true, showGridX: true, showGridY: true, showGridRightY: true}}
                    barKeys={["a","b"]}
                    lineKeys={["c"]}
                    yLeftFormat={"number"}
                    yRightFormat={"percent"}
                />
            );
            const loadingMsg = screen.getByText('Loading...');
            expect(loadingMsg).toBeInTheDocument();
        }
    );
    it('renders error when dataset does not have allowed keys', () => {
        const error = () => {
            render(
                <CombinedChartWrapper
                    title={title}
                    description={description}
                    dataset={testData}
                    options={{showLegend: true, showGridX: true, showGridY: true, showGridRightY: true}}
                    barKeys={["a","b"]}
                    lineKeys={["d"]}
                    yLeftFormat={"number"}
                    yRightFormat={"percent"}
                />
            );
        }
        expect(error).toThrow('Unknown keys: d');
    });
    it('prepares correct chart dataset by extracting correct labels, data categories and colors', () => {
        let testData = [
            {"aggregationKey": "1", "a": 1, "b": 2, "c": 3},
            {"aggregationKey": "2", "a": '-', "b": 2, "c": 3},
            {"aggregationKey": "3", "a": 1, "b": 2, "c": 3},
        ];
        expect(chartDataSetupFactory(testData, 'combined', ["a", "b"], ["c"]
        )).toStrictEqual({
            "datasets": [
                {
                    "backgroundColor": "#1c3742",
                    "borderColor": "#1c3742",
                    "data": [1, "-", 1],
                    "label": "a",
                    "order": 2,
                    "type": "bar",
                    "yAxisID": "y"
                },
                {
                    "backgroundColor": "#77878e",
                    "borderColor": "#77878e",
                    "data": [2, 2, 2],
                    "label": "b",
                    "order": 2,
                    "type": "bar",
                    "yAxisID": "y"
                },
                {
                    "backgroundColor": "#e63b09",
                    "borderColor": "#e63b09",
                    "data": [3, 3, 3],
                    "label": "c",
                    "order": 1,
                    "type": "line",
                    "yAxisID": "y2"
                }
            ],
            "labels": ["1", "2", "3"]
        });
    });
    it('sets correct canvas settings', () => {
        let options = {
            showLegend: true,
            showGridX: true,
            showGridY: true,
            showGridRightY: false,
            xAxisTitle: "Test X",
            yAxisTitle: "Test Y",
            yRightAxisTitle: "Test Y2"
        }
        const expectedResult = {
            "indexAxis": "x",
            "scales":{
                "x": {
                    "title": {
                        "text": "Test X",
                    },
                    "grid": {
                        "display": true
                    }
                },
                "y": {
                    "title": {
                        "text": "Test Y",
                    },
                    "grid": {
                        "display": true
                    },
                },
                "y2": {
                    "title": {
                        "text": "Test Y2",
                    },
                    "grid": {
                        "display": false
                    },
                }
            }
        };
        const canvasSettings = canvasSetupFactory(options, 'combined', 'percent');
        expect(canvasSettings.indexAxis).toBe(expectedResult.indexAxis);
        // @ts-ignore
        expect(canvasSettings.scales.x.title.text).toBe(expectedResult.scales.x.title.text);
        // @ts-ignore
        expect(canvasSettings.scales.x.grid.display).toBe(expectedResult.scales.x.grid.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.title.text).toBe(expectedResult.scales.y.title.text);
        // @ts-ignore
        expect(canvasSettings.scales.y.grid.display).toBe(expectedResult.scales.y.grid.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.title.text).toBe(expectedResult.scales.y.title.text);
        // @ts-ignore
        expect(canvasSettings.scales.y2.title.text).toBe(expectedResult.scales.y2.title.text);
        // @ts-ignore
        expect(canvasSettings.scales.y2.grid.display).toBe(expectedResult.scales.y2.grid.display);
    });
    it('creates correct tick format', () => {
        let options = {xFormat: 'none', yLeftFormat: 'percent', yRightFormat: 'euro'}
        let testData = [
            {"aggregationKey": "1", "a": 50, "b": 20, "c": 30}
        ];
        expect(formatValue(testData[0].aggregationKey, options.xFormat)).toStrictEqual("1");
        expect(formatValue(testData[0].b, options.yLeftFormat)).toStrictEqual("20%");
        expect(formatValue(testData[0].c, options.yRightFormat)).toStrictEqual("30€");
    })
});