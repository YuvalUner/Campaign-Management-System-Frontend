import React from "react";
import TabCommonProps from "./tab-common-props";
import axios from "axios";
import config from "../../../../app-config.json";
import ColumnMapping, {PropertyNames} from "../../../../models/column-mapping";
import CustomVotersLedger from "../../../../models/custom-voters-ledger";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import {Box, Button, Stack, Step, StepLabel, Stepper} from "@mui/material";
import FirstStepChooseAction from "./CreateNewLedgerStepperSteps/FirstStepChooseAction";

function CreateNewLedgerTab(props: TabCommonProps): JSX.Element {

    const [activeStep, setActiveStep] = React.useState(0);
    const steps: JSX.Element[] = [
        <FirstStepChooseAction key={"firstStep"}/>,
        <div key={"test"}>Hello World</div>,
    ];

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

    const adjustActiveStep = (adjustBy: number) => {
        const numSteps: number = steps.length;
        const newActiveStep: number = activeStep + adjustBy;
        if (newActiveStep >= 0 && newActiveStep < numSteps) {
            setActiveStep(activeStep + adjustBy);
        }
    };

    const createLedger = () => {
        const ledger: CustomVotersLedger = {
            ledgerName: "Test Ledger",
        } as CustomVotersLedger;
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.CustomVotersLedger.Base +
            config.ControllerUrls.CustomVotersLedger.Create + props.campaignGuid,
            ledger
        );
    };

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
                    + props.campaignGuid + "/" + ledgerGuid,
                data: data,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json"
                },
                withCredentials: true
            });
        }
    };

    return (
        <Box sx={{
            position: "relative",
            width: "100%",
            height: "100%",
        }}>
            <Stepper activeStep={activeStep} nonLinear={false}>
                <Step key={"step0"}>
                    <StepLabel>Select what you want to do</StepLabel>
                </Step>
                <Step key={"step1"}>
                    <StepLabel>Upload the file</StepLabel>
                </Step>
            </Stepper>
            <Box sx={{
                marginTop: "1rem",
            }}>
                {steps[activeStep]}
            </Box>
            <Stack direction={"row"} display={"flex"} position={"absolute"} sx={{
                width: "100%",
                marginTop: "1rem",
                justifyContent: "space-between",
                bottom: "1rem",
            }}>
                <Button variant={"contained"} onClick={() => adjustActiveStep(-1)}>Back</Button>
                <Button variant={"contained"} onClick={() => adjustActiveStep(1)}>Next</Button>
            </Stack>
        </Box>
    );
}

export default CreateNewLedgerTab;
