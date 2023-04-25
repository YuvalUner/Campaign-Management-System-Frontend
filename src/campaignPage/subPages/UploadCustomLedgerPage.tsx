import React from "react";
import SubPageWithPermissionBaseProps from "../utils/sub-page-with-permission-base-props";
import ColumnMapping, {PropertyNames} from "../../models/column-mapping";
import ServerRequestMaker from "../../utils/server-request-maker";
import config from "../../app-config.json";
import CustomVotersLedger from "../../models/custom-voters-ledger";
import {useParams} from "react-router-dom";
import axios from "axios";

const testMappings: ColumnMapping[] = [
    {
        columnName: "Id Number",
        propertyName: PropertyNames.identifier
    },
    {
        columnName: "First Name",
        propertyName: PropertyNames.firstName
    }
];

function UploadCustomLedgerPage(props: SubPageWithPermissionBaseProps): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const ledgerGuid = "75de4573-4d35-404e-899d-3ba78f163288";

    const testSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const file: File = event.target.files[0];
            const data = new FormData();
            data.append("file", file);
            // const propertyNames: string[] = [];
            // const columnNames: string[] = [];
            testMappings.forEach((mapping) => {
                data.append("propertyNames", mapping.propertyName);
                data.append("columnNames", mapping.columnName);
            });
            // Making the request directly via axios and not via ServerRequestMaker as usual, because for some reason
            // passing the FormData object as a parameter doesn't work.
            axios({
                method: "post",
                url: config.ServerBaseUrl + config.ControllerUrls.CustomVotersLedger.Base
                    + config.ControllerUrls.CustomVotersLedger.Import
                    + campaignGuid + "/" + ledgerGuid,
                data: data,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json"
                },
                withCredentials: true
            });
        }
    };

    const createLedger = () => {
        const ledger: CustomVotersLedger = {
            ledgerName: "Test Ledger",
        } as CustomVotersLedger;
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.CustomVotersLedger.Base +
            config.ControllerUrls.CustomVotersLedger.Create + campaignGuid,
            ledger
        );
    };

    return (<>
        <h1>Upload Custom Ledger</h1>
        <input type={"file"} onChange={testSubmit}/>
    </>);
}

export default UploadCustomLedgerPage;
