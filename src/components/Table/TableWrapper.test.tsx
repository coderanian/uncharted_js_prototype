import {render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import React from "react";
import {TableWrapper} from "../index";
import {reduceDataset, sortDataByKey, summarizeData} from "./utils";

describe('<TableWrapper />', () => {
    const title = 'Test chart';
    const description = 'Text description.'
    const testData = [
        {"aggregationKey": "1", "a": 1, "b": 1},
        {"aggregationKey": "2", "a": 0, "b": 2},
        {"aggregationKey": "3", "a": 1, "b": 1},
    ];
    it('renders empty message if response data is empty', async () => {
        render(
            <TableWrapper
                title={title}
                description={description}
                dataset={[]}
                summaryRow={"none"}
                valueFormat={"none"}
            />
        );
        await waitFor(() => {
            const emptyMsg = screen.getByText('No data available for your request.');
            expect(emptyMsg).toBeInTheDocument();
        });
    });
    it('renders table with summary row', async () => {
        const emptyRes = [
            {"aggregationKey" : "1", "a": null},
            {"aggregationKey" : "2", "a": null},
            {"aggregationKey" : "3", "a": null}
        ];
        render(
            <TableWrapper
                title={title}
                description={description}
                dataset={testData}
                summaryRow={"sum"}
                valueFormat={"none"}
            />
        );
        await waitFor(() => {
            const emptyMsg = screen.getByText('Grand sum');
            expect(emptyMsg).toBeInTheDocument();
        });
    });
    it('renders loading', () => {
            render(
                <TableWrapper
                    title={title}
                    description={description}
                    dataset={null}
                    summaryRow={"none"}
                    valueFormat={"none"}
                />
            );
            const loadingMsg = screen.getByText('Loading...');
            expect(loadingMsg).toBeInTheDocument();
        }
    );
    it('renders error when dataset does not have allowed keys', () => {
        const error = () => {
            render(
                <TableWrapper
                    title={title}
                    description={description}
                    dataset={testData}
                    summaryRow={"none"}
                    valueFormat={"none"}
                    allowedKeys={["c"]}
                />
            );
        }
        expect(error).toThrow('Unknown keys: c');
    });
    it('reduces dataset correctly to include only aggregation key + keys from allowedKeys array',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": '-', "c": 3},
                {"aggregationKey": "2", "a": '-', "b": '-', "c": 3},
                {"aggregationKey": "3", "a": 1, "b": '-', "c": 3},
            ];
            expect(reduceDataset(testData, 'euro',['a']
            )).toStrictEqual([
                {"aggregationKey": "1", "a": 1},
                {"aggregationKey": "2", "a": '-'},
                {"aggregationKey": "3", "a": 1},
            ]);
        }
    );
    it('summarizes data correctly by creating total sum and average row for each key values',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": '-', "c": 3},
                {"aggregationKey": "2", "a": '-', "b": '-', "c": 3},
                {"aggregationKey": "3", "a": 1, "b": '-', "c": 3},
            ];
            let keys = ["aggregationKey", "a", "b", "c"]
            expect(summarizeData(testData, keys,"sum", "none")).toStrictEqual([
                "Grand sum", 2, 0, 9
            ]);
            expect(summarizeData(testData, keys,"average","none")).toStrictEqual([
                "Grand average", 1, 0, 3
            ])
        }
    );
    it('sorts data of the selected column correctly', () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": '-', "c": 3},
                {"aggregationKey": "2", "a": '-', "b": '-', "c": 3},
                {"aggregationKey": "3", "a": 2, "b": '-', "c": 3},
                {"aggregationKey": "4", "a": 0, "b": '-', "c": 3},
                {"aggregationKey": "5", "a": -1, "b": '-', "c": 3},
            ];
            expect(sortDataByKey(testData, "a",true)).toStrictEqual([
                {"aggregationKey": "3", "a": 2, "b": "-", "c": 3},
                {"aggregationKey": "1", "a": 1, "b": "-", "c": 3},
                {"aggregationKey": "4", "a": 0, "b": "-", "c": 3},
                {"aggregationKey": "5", "a": -1, "b": "-", "c": 3},
                {"aggregationKey": "2", "a": "-", "b": "-", "c": 3}
            ]);
        }
    );
});