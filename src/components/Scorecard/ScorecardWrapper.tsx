import {summarizeData} from "./utils";
import React, {useEffect, useState} from "react";
import {IScorecard} from "./interface";
import {checkResponseError, extractError, isDatasetEmpty} from "../common/utils/utils";

function ScorecardWrapper({title, dataset, summaryKey, summaryType = 'sum', valueFormat = 'number'} : IScorecard) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] : [string | null, any] = useState(null);
    const [total, setTotal] : [string, any] = useState('-');

    useEffect((): void => {
        if (!dataset) {
            setIsLoading(true);
        } else {
            if(isDatasetEmpty(dataset)) {
                setError("No data available for your request.");
            } else if(checkResponseError(dataset)){
                setError(extractError(dataset));
            } else {
                setTotal(summarizeData(dataset, summaryKey, summaryType, valueFormat));
                setError(null);
            }
            setIsLoading(false);
        }
    }, [dataset]);

    return (
        <div className={'dashboard-component'}>
            <p>{title}</p>
            {isLoading ? <p>Loading...</p> : error ?
                <p className={'error-msg'}>{error}</p>
                : <h5>{total}</h5>}
        </div>
    );
}
export default ScorecardWrapper;