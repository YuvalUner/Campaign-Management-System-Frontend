import React from "react";


function BallotEditDialog(props: any): JSX.Element {

    const data = Object.assign({}, props.data);

    return (
        <div>
            <h1>BallotEditDialog</h1>
            <p>{data.ballotName}</p>
            <p>{data.isAdd}</p>
        </div>
    );
}

export default BallotEditDialog;
