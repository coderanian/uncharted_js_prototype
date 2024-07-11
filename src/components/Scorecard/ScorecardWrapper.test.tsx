import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import React from "react";
import {ScorecardWrapper} from "../index";
import {summarizeData} from "./utils";

describe('<ScorecardWrapper />', () => {
    const title = 'Test chart';
    const testData = [
        {"aggregationKey": "1", "a": 1, "b": 1},
        {"aggregationKey": "2", "a": 0, "b": 2},
        {"aggregationKey": "3", "a": 1, "b": 1},
    ];
    it('renders empty message if response data is empty', async () => {
        render(
            <ScorecardWrapper
                title={title}
                dataset={[]}
                summaryKey={'shipment_count'}
                summaryType={'sum'}
            />
        );
        await waitFor(() => {
            const emptyMsg = screen.getByText('No data available for your request.');
            expect(emptyMsg).toBeInTheDocument();
        });
    });
    it('renders loading', () => {
            render(
                <ScorecardWrapper
                    title={title}
                    dataset={null}
                    summaryKey={'shipment_count'}
                    summaryType={'sum'}
                />
            );
            const loadingMsg = screen.getByText('Loading...');
            expect(loadingMsg).toBeInTheDocument();
        }
    );
    it('renders error when dataset does not have allowed keys', () => {
        const error = () => {
            render(
                <ScorecardWrapper
                    title={title}
                    dataset={testData}
                    summaryKey={'c'}
                    summaryType={'sum'}
                />
            );
        }
        expect(error).toThrow('Unknown key: c');
    });
    it('prepares correct total sum of category values',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": '-', "c": 3},
                {"aggregationKey": "2", "a": '-', "b": '-', "c": 3},
                {"aggregationKey": "3", "a": 1, "b": '-', "c": 3},
            ];
            expect(summarizeData(testData, 'a', "sum", "euro"
            )).toStrictEqual("2€");
            expect(summarizeData(testData, 'b', "sum", "number"
            )).toStrictEqual("0");
        }
    );
    it('prepares correct average sum of category values',
        () => {
            let testData = [
                {"aggregationKey": "1", "a": 1, "b": '-', "c": 3},
                {"aggregationKey": "2", "a": '-', "b": '-', "c": 3},
                {"aggregationKey": "3", "a": 1, "b": '-', "c": 3},
            ];
            expect(summarizeData(testData, 'a', "average", "number"
            )).toStrictEqual("1");
            expect(summarizeData(testData, 'b', "average", "number"
            )).toStrictEqual("0");
        }
    );
});