import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import React from "react";
import {DoughnutChartWrapper} from "../../index";
import {chartDataSetupFactory} from "../utils/data/dataUtils";
import {canvasSetupFactory} from "../utils/options/optionsUtils";

describe('<DoughnutChartWrapper />', () => {
    const title = 'Test chart';
    const description = 'Chart test.';
    const testData = [
        {"aggregationKey": "1", "a": 1, "b": 1},
        {"aggregationKey": "2", "a": 0, "b": 2},
        {"aggregationKey": "3", "a": 1, "b": 1},
    ];
    it('renders empty message if response data is empty', async () => {
        render(
            <DoughnutChartWrapper
                title={title}
                description={description}
                dataset={[]}
                options={{showLegend: true, halfPieChart: true}}
                valueFormat={"percent"}
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
                <DoughnutChartWrapper
                    title={title}
                    description={description}
                    dataset={null}
                    options={{showLegend: true, halfPieChart: true}}
                    valueFormat={"percent"}
                    keys={["a"]}
                />
            );
            const loadingMsg = screen.getByText('Loading...');
            expect(loadingMsg).toBeInTheDocument();
        }
    );
    it('renders error when dataset does not have allowed keys', () => {
        const error = () => {
            render(
                <DoughnutChartWrapper
                    title={title}
                    description={description}
                    dataset={testData}
                    options={{showLegend: true, halfPieChart: true}}
                    valueFormat={"percent"}
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
            expect(chartDataSetupFactory(testData, 'pie', ["a"]
            )).toStrictEqual({
                "datasets": [{
                    "backgroundColor": ["#1c3742", "#697b82", "#b4bdc1"],
                    "borderColor": ["#1c3742", "#697b82", "#b4bdc1"],
                    "data": [1, '-', 1],
                    "label": "a",
                    "type": "pie"
                }],
                "labels": ["1","2","3"]
            })
        }
    );
    it('sets correct canvas settings', () => {
        let options = {showLegend: true, halfPieChart: false}
        const expectedResult = {
            "plugins": {"legend": {"display": true}},
            "rotation": 0,
            "circumference": 360
        };
        const canvasSettings = canvasSetupFactory(options, 'pie', 'percent');
        expect(canvasSettings.plugins.legend.display).toBe(expectedResult.plugins.legend.display);
        expect(canvasSettings.rotation).toBe(expectedResult.rotation);
        expect(canvasSettings.circumference).toBe(expectedResult.circumference);
    });
});