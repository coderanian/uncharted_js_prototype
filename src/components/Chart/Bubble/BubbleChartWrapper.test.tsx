import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import React from "react";
import {BubbleChartWrapper} from "../../index";
import {chartDataSetupFactory, createBubbleChartTooltipDataset} from "../utils/data/dataUtils";
import {canvasSetupFactory} from "../utils/options/optionsUtils";
import {formatValue} from "../../common/utils/utils";

describe('<BubbleChartWrapper />', () => {
    const title = 'Test chart';
    const description = 'Chart test.';
    const testData = [
        {"aggregationKey": "1", "a": 1, "b": 1, "c": 1, "d": 1},
        {"aggregationKey": "2", "a": 0, "b": 2, "c": 1, "d": 1},
        {"aggregationKey": "3", "a": 1, "b": 1, "c": 1, "d": 1},
    ];
    it('renders empty message if response data is empty', async () => {
        render(
            <BubbleChartWrapper
                title={title}
                description={description}
                dataset={[]}
                options={{showGridX: true, showGridY: true, showLegend: true}}
                keys={["a", "b", "c"]}
                xFormat={'number'}
                yFormat={'number'}
                rFormat={'number'}
            />
        );
        await waitFor(() => {
            const emptyMsg = screen.getByText('No data available for your request.');
            expect(emptyMsg).toBeInTheDocument();
        });
    });
    it('renders loading', () => {
            render(
                <BubbleChartWrapper
                    title={title}
                    description={description}
                    dataset={null}
                    options={{showLegend: true, showGridX: true, showGridY: true,}}
                    xFormat={'number'}
                    yFormat={'number'}
                    rFormat={'number'}
                    keys={["a","b","c"]}
                />
            );
            const loadingMsg = screen.getByText('Loading...');
            expect(loadingMsg).toBeInTheDocument();
        }
    );
    it('renders error when dataset does not have allowed keys', () => {
        const error = () => {
            render(
                <BubbleChartWrapper
                    title={title}
                    description={description}
                    dataset={testData}
                    options={{showLegend: true, showGridX: true, showGridY: true,}}
                    xFormat={'number'}
                    yFormat={'number'}
                    rFormat={'number'}
                    keys={["a","b","e"]}
                />
            );
        }
        expect(error).toThrow('Unknown keys: e');
    });
    it('prepares correct chart dataset by extracting correct labels, data categories and colors',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 50, "b": 20, "c": 30},
                {"aggregationKey": "2", "a": 2, "b": 24, "c": 30},
                {"aggregationKey": "3", "a": 3, "b": 12, "c": 30},
            ];
            expect(chartDataSetupFactory(testData, 'bubble', ["a", "b", "c"]
            )).toStrictEqual({
                "datasets": [
                    {
                        "backgroundColor": "#1c3742",
                        "borderColor": "#1c3742",
                        "data": [{"r": 5, "x": 50, "y": 20}],
                        "label": "1",
                        "pointHoverRadius": 12,
                        "radius": 10,
                        "type": "bubble"
                    },
                    {
                        "backgroundColor": "#697b82",
                        "borderColor": "#697b82",
                        "data": [{"r": 5, "x": 2, "y": 24}],
                        "label": "2",
                        "pointHoverRadius": 12,
                        "radius": 10,
                        "type": "bubble"
                    },
                    {
                        "backgroundColor": "#b4bdc1",
                        "borderColor": "#b4bdc1",
                        "data": [{"r": 5, "x": 3, "y": 12}],
                        "label": "3",
                        "pointHoverRadius": 12,
                        "radius": 10,
                        "type": "bubble"
                    }
                ],
                "labels": ["1", "2", "3"]
            })
        }
    );
    it('sets correct canvas settings', () => {
        let options={showLegend: true, showGridX: true, showGridY: true, xAxisTitle: "Test X"}
        const expectedResult = {
            "scales":{
                "x": {
                    "title": {
                        "text": "Test X"
                    },
                    "grid": {
                        "display": true
                    }
                },
                "y": {
                    "title": {
                        "display": false
                    },
                    "grid": {
                        "display": true
                    },
                }
            }
        };
        const canvasSettings = canvasSetupFactory(options, 'bubble', 'percent');
        expect(canvasSettings.interaction).toBeUndefined();
        // @ts-ignore
        expect(canvasSettings.scales.x.title.text).toBe(expectedResult.scales.x.title.text);
        // @ts-ignore
        expect(canvasSettings.scales.x.grid.display).toBe(expectedResult.scales.x.grid.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.title.display).toBe(expectedResult.scales.y.title.display);
        // @ts-ignore
        expect(canvasSettings.scales.y.stacked).toBe(expectedResult.scales.y.stacked);
        // @ts-ignore
        expect(canvasSettings.scales.y.grid.display).toBe(expectedResult.scales.y.grid.display);

    });
    it('creates correct tooltip text',()=>{
        let testData = [
            {"aggregationKey": "1", "a": 50, "b": 20, "c": 30},
            {"aggregationKey": "2", "a": 2, "b": 24, "c": 30},
            {"aggregationKey": "3", "a": 3, "b": 12, "c": 30},
        ];
        expect(createBubbleChartTooltipDataset(testData, 'bubble', ['number', 'percent', 'euro'], ['a','b','c'])
        ).toStrictEqual([
            {"title": "", "label": "1", "data": "a: 50\nb: 20%\nc: 30€"},
            {"title": "", "label": "2", "data": "a: 2\nb: 24%\nc: 30€"},
            {"title": "", "label": "3", "data": "a: 3\nb: 12%\nc: 30€" }
        ])
    })
    it('creates correct tick format', () => {
        let testData = [
            {"aggregationKey": "1", "a": 50, "b": 20, "c": 30}
        ];
        expect(formatValue(testData[0].a, 'percent')).toStrictEqual("50%");
        expect(formatValue(testData[0].b, 'euro')).toStrictEqual("20€");
        expect(formatValue(testData[0].c, 'number')).toStrictEqual("30");
    })
});