import { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

// Different statuses for fetch operation
export enum FetchStatus {
    Success,            // Successfully fetched data with expected data fields
    Failure,            // Received malformed data from the backend
    InProgress          // Fetch operation still in progress
}

// Interface for successful fetch state
interface FetchSuccess<Model> {
    status: FetchStatus.Success,
    payload: Model
}

// Interface for failed fetch state
interface FetchFailure {
    status: FetchStatus.Failure,
    reason: string
}

// Interface for in-progress fetch state
interface FetchInProgress {
    status: FetchStatus.InProgress
}

// Full type for the fetch result state
export type FetchResult<Model> = FetchSuccess<Model> | FetchFailure | FetchInProgress;

const useFetch = function<Model>(request: RequestInfo, validate: (data: any) => Model | undefined, deps: any[]) {
    // Create a stateful variable fetchResult of type FetchResult<Model>, with default value as FetchInProgress (it hasn't fetched the question yet!)
    const [fetchResult, setFetchResult] = useState<FetchResult<Model>>({status: FetchStatus.InProgress});

    // Fetch the data using an effect
    useDeepCompareEffect(
        () => {
            // Since we're fetching, set state to InProgress
            setFetchResult({status: FetchStatus.InProgress});

            fetch(request)
                .then(response => response.json())
                .then(json => {
                    console.log(json);

                    // Validate/clean the data; if it's successful, then update state appropriately
                    const validated = validate(json);
                    if (validated !== undefined) {
                        setFetchResult({
                            status: FetchStatus.Success,
                            payload: validated
                        });
                    } else {
                        setFetchResult({
                            status: FetchStatus.Failure,
                            reason: "Unexpected JSON format"
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    setFetchResult({
                        status: FetchStatus.Failure,
                        reason: "Fetch error; check Console for details"
                    });
                });
        },
        [deps]
    );

    return fetchResult;
}

export default useFetch;