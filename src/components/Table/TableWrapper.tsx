import React, {useEffect, useState} from "react";
import './style.css';
import {ITable} from "./interface";
import {sortDataByKey, summarizeData, reduceDataset} from "./utils";
import {
    getKeys,
    isDatasetEmpty,
    convertSnakeToLowCase,
    formatValue,
    checkResponseError,
    extractError
} from "../common/utils/utils";
import {Description, LoadingMsg} from "../common";
import {IDataset} from "../Chart/utils/data/dataInterfaces";

/**
 * /**
 * Wraps react-chartjs chart component in provided customization options and data
 * @param dataset API fetch result, JSON with minimum two key-value pairs required (1. pair - x axis)
 * @param options customization settings to change chart appearance
 * @param dataRepresentation defines if data should be recalculated as absolute values or recalculated to relative 100% stack
 * @constructor
 */
function TableWrapper({title, description, dataset, allowedKeys, summaryRow = 'sum', valueFormat = 'none'}: ITable) {
    const [isLoading, setIsLoading] : [boolean, any] = useState(true);
    const [data, setData] : [IDataset<string|number>[], any] = useState([]);
    const [keys, setKeys]: [string[], any] = useState([]);
    const [summaryData, setSummaryData] : [string[], any] = useState([]);
    const [error, setError] : [any | null, any] = useState(null);

    // Unique key for the Table component
    const [tableKey, setTableKey]  : [number, any] = useState(0);
    const [ascOrder, setOrder] : [boolean, any] = useState(true);
    const [sortKey, setSortKey] : [string | null, any] = useState(null);

    const handleSort = (key: string): void => {
        setOrder(!ascOrder);
        setSortKey(key);
    };

    useEffect((): void => {
        if (!dataset) {
            setIsLoading(true);
        } else {
            if(isDatasetEmpty(dataset)) {
                setError("No data available for your request.");
            } else if(checkResponseError(dataset)) {
                setError(extractError(dataset));
            } else {
                setData(reduceDataset(dataset,valueFormat, allowedKeys));
                setError(null);
            }
            setIsLoading(false);
        }
    }, [dataset]);

    useEffect((): void => {
        if(data.length > 0){
            setKeys(getKeys(data));
        }
    }, [data]);

    useEffect((): void => {
        if(data && keys.length > 0 && summaryRow !== 'none'){
            setSummaryData(summarizeData(data, keys, summaryRow, valueFormat));
        }
    }, [keys]);

    useEffect((): void => {
        if(data && sortKey) {
            setData(sortDataByKey(data, sortKey, ascOrder));
            setTableKey(tableKey + 1);
        }
    }, [ascOrder, sortKey]);

    //Use grid instead of table
    return (
        <div className='dashboard-component'>
            <Description title={title} description={description} />
            <div className='table-container'>
                {isLoading
                    ? <LoadingMsg/>
                    : error
                        ? <p className={"error-msg"}>{error}</p>
                        : (
                        <table className="table table-striped table-bordered">
                            <thead className="sticky-header">
                                <tr>
                                    {keys?.map((key: string) => (
                                        <th key={key} onClick={(): void => {setOrder(!ascOrder); handleSort(key)}}>{convertSnakeToLowCase(key)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                            {data?.map((item: any, index: number) => (
                                <tr key={index}>
                                    {keys?.map((key: string, index: number) => (
                                        <td key={key} className="table-cell">
                                            {index > 0 ? formatValue(item[key], valueFormat) : item[key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                            {summaryData.length > 0 &&
                                <tfoot>
                                <tr className="sticky-footer">
                                    {summaryData.map((value: string | number, index: number) => (
                                        <td key={index}>{index > 0 ? formatValue(value, valueFormat) : value}</td>
                                    ))}
                                </tr>
                                </tfoot>
                            }
                        </table>
                    )
                }
            </div>
        </div>
    );
}

export default TableWrapper;