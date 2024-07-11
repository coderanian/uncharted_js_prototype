import React, {useMemo} from "react";

function Description({ title, description }: { title: string | undefined; description: string | undefined }): JSX.Element {
    const memoizedDescription: JSX.Element = useMemo(() => {
        return (
            <div>
                {title && <h5>{title}</h5>}
                {description && <p>{description}</p>}
            </div>
        );
    }, [title, description]);
    return memoizedDescription;
}

export default Description;