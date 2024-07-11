import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import React from "react";
import {AreaChartWrapper} from "../../index";
import {calculateDataPercentage, chartDataSetupFactory} from "../utils/data/dataUtils";
import {canvasSetupFactory} from "../utils/options/optionsUtils";
import {formatValue} from "../../common/utils/utils";

describe('<AreaChartWrapper />', () => {
    const title = 'Test chart';
    const description = 'Chart test.';
    const testData = [
        {"aggregationKey": "1", "a": 1, "b": 1},
        {"aggregationKey": "2", "a": 0, "b": 2},
        {"aggregationKey": "3", "a": 1, "b": 1},
    ];
    it('renders empty message if response data is empty', async () => {
        render(
            <AreaChartWrapper
                title={title}
                description={description}
                dataset={[]}
                options={{showLegend: true, showGridX: true, showGridY: true,}}
                yFormat={'number'}
                //xFormat={"number"}
                keys={["a"]}
            />
        );
        await waitFor(() => {
            const emptyMsg = screen.getByText('No data available for your request.');
            expect(emptyMsg).toBeInTheDocument();
        });
    });
    it('renders loading', () => {
            render(
                <AreaChartWrapper
                    title={title}
                    description={description}
                    dataset={null}
                    options={{
                        showLegend: true,
                        showGridX: true,
                        showGridY: true,
                    }}
                    yFormat={'number'}
                    //xFormat={"number"}
                    keys={["a", "b"]}
                />
            );
            const loadingMsg = screen.getByText('Loading...');
            expect(loadingMsg).toBeInTheDocument();
        }
    );
    it('renders error when dataset does not have allowed keys', () => {
        const error = () => {
            render(
                <AreaChartWrapper
                    title={title}
                    description={description}
                    dataset={testData}
                    options={{
                        showLegend: true,
                        showGridX: true,
                        showGridY: true,
                    }}
                    yFormat={'number'}
                    //xFormat={"number"}
                    keys={["c"]}
                />
            );
        }
        expect(error).toThrow('Unknown keys: c');
    });
    it('prepares correct chart dataset by extracting correct labels, data categories and colors',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": 2, "c": 3},
                {"aggregationKey": "2", "a": '-', "b": 2, "c": 3},
                {"aggregationKey": "3", "a": 1, "b": 2, "c": 3},
            ];
            expect(chartDataSetupFactory(testData, 'bar', ["a", "b", "c"]
            )).toStrictEqual({
                "datasets": [
                    {
                        "backgroundColor": "#1c3742",
                        "borderColor": "#1c3742",
                        "data": [1, '-', 1],
                        "label": "a",
                        "order": 2,
                        "type": "bar",
                        "yAxisID": "y"
                    },
                    {
                        "backgroundColor": "#697b82",
                        "borderColor": "#697b82",
                        "data": [2, 2, 2],
                        "label": "b",
                        "order": 2,
                        "type": "bar",
                        "yAxisID": "y"
                    },
                    {
                        "backgroundColor": "#b4bdc1",
                        "borderColor": "#b4bdc1",
                        "data": [3, 3, 3],
                        "label": "c",
                        "order": 2,
                        "type": "bar",
                        "yAxisID": "y"
                    },
                ],
                "labels": ["1", "2", "3"]
            })
        }
    );
    it('calculates the percentage values for each key in the dataset array, ensuring each dataset sums up to 100%',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": '-', "c": 3},
                {"aggregationKey": "2", "a": '-', "b": 2, "c": 3},
                {"aggregationKey": "3", "a": 1, "b": '-', "c": 3},
            ];
            let keys = ["a","b","c"];
            expect(calculateDataPercentage(testData,keys)).toStrictEqual([
                    {"aggregationKey": "1", "a": 25, "b": "-", "c": 75},
                    {"aggregationKey": "2", "a": "-", "b": 40, "c": 60},
                    {"aggregationKey": "3", "a": 25, "b": "-", "c": 75}
                ]
            )
        }
    );
    it('sets correct canvas settings', () => {
        let options = {showLegend: true, showGridX: false, showGridY: true,}
        const expectedResult = {
            "indexAxis": "x",
            "scales":{
                "x": {
                    "title": {
                        "display": false,
                    },
                    "grid": {
                        "display": true
                    }
                },
                "y": {
                    "title": {
                        "display": false,
                    },
                    "grid": {
                        "display": true
                    },
                    "stacked": true,
                    "min": 0,
                    "max": 100,
                }
            }
        };
        const canvasSettings = canvasSetupFactory(options, 'area', 'percent');
        expect(canvasSettings.indexAxis).toBe(expectedResult.indexAxis);
        // @ts-ignore
        expect(canvasSettings.scales.x.title.display).toBe(expectedResult.scales.x.title.display);
        // @ts-ignore
        expect(canvasSettings.scales.x.grid.display).toBe(expectedResult.scales.x.grid.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.title.display).toBe(expectedResult.scales.y.title.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.stacked).toBe(expectedResult.scales.y.stacked);
        // @ts-ignore
        expect(canvasSettings.scales.y.grid.display).toBe(expectedResult.scales.y.grid.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.max).toBe(expectedResult.scales.y.max);
        // @ts-ignore
        expect(canvasSettings.scales.y.min).toBe(expectedResult.scales.y.min);
    });
    it('creates correct tick format', () => {
        let testData = [
            {"aggregationKey": "1", "a": 50, "b": 20, "c": 30}
        ];
        expect(formatValue(testData[0].aggregationKey, 'none')).toStrictEqual("1");
        expect(formatValue(testData[0].b, 'euro')).toStrictEqual("20€");
        expect(formatValue(testData[0].c, 'percent')).toStrictEqual("30%");
    })
});