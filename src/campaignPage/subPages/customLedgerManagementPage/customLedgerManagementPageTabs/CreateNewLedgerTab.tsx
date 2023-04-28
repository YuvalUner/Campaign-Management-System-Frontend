import React, {useEffect, useRef, useState} from "react";
import TabCommonProps from "./tab-common-props";
import axios from "axios";
import config from "../../../../app-config.json";
import ColumnMapping, {PropertyNames} from "../../../../models/column-mapping";
import CustomVotersLedger from "../../../../models/custom-voters-ledger";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import {Box, Button, Stack, Step, StepLabel, Stepper} from "@mui/material";
import FirstStepChooseAction, {FirstStepChooseActionEnum} from "./CreateNewLedgerStepperSteps/FirstStepChooseAction";
import Events from "../../../../utils/helperMethods/events";
import SecondStepSelectNewName from "./CreateNewLedgerStepperSteps/SecondStepSelectNewName";
import SecondStepSelectExistingLedger from "./CreateNewLedgerStepperSteps/SecondStepSelectExistingLedger";
import ThirdStepSelectFile from "./CreateNewLedgerStepperSteps/thirdStepSelectFile/ThirdStepSelectFile";
import {FileObject} from "mui-file-dropzone";

function CreateNewLedgerTab(props: TabCommonProps): JSX.Element {

    const [activeStep, setActiveStep] = useState(0);
    const columnMappings = useRef<ColumnMapping[]>([]);
    const [file, setFile] = useState<File | null | FileObject>(null);
    const [ledger, setLedger] = useState<CustomVotersLedger>({} as CustomVotersLedger);
    const [chosenAction, setChosenAction] =
        useState<FirstStepChooseActionEnum>(FirstStepChooseActionEnum.CreateAndImport);
    const [shouldRaisePrompt, setShouldRaisePrompt] = useState(false);
    const [shouldDisplayError, setShouldDisplayError] = useState(false);
    const shouldCheckForError = useRef(false);
    /**
     * Creates the labels for the steps in the stepper, based on the chosen action.
     */
    const stepsLabelsDecider = (): string[] => {
        // eslint-disable-next-line default-case
        switch (chosenAction) {
        case FirstStepChooseActionEnum.CreateAndImport:
            return ["Choose action", "Name ledger", "Select file", "Map columns", "Upload", "Done"];
        case FirstStepChooseActionEnum.Existing:
            return ["Choose action", "Select ledger", "Select file", "Map columns", "Upload", "Done"];
        case FirstStepChooseActionEnum.Create:
            return ["Choose action", "Name ledger", "Done"];
        }
    };

    /**
     * Creates the steps components for the stepper, based on the chosen action.
     */
    const stepsDecider = (): JSX.Element[] => {
        // eslint-disable-next-line default-case
        switch (chosenAction) {
        case FirstStepChooseActionEnum.CreateAndImport:
            return [
                <FirstStepChooseAction key={"firstStep"}
                    chosenAction={chosenAction} setChosenAction={setChosenAction}/>,
                <SecondStepSelectNewName key={"secondStep"} setShouldRaisePrompt={setShouldRaisePrompt}
                    customLedgers={props.customLedgers} setLedger={setLedger} ledger={ledger}
                    shouldCheckForError={shouldCheckForError} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError}/>,
                <ThirdStepSelectFile key={"thirdStep"} uploadedFile={file} setUploadedFile={setFile}/>,
            ];
        case FirstStepChooseActionEnum.Existing:
            return [
                <FirstStepChooseAction key={"firstStep"}
                    chosenAction={chosenAction} setChosenAction={setChosenAction}/>,
                <SecondStepSelectExistingLedger key={"secondStep"} customLedgers={props.customLedgers}
                    setLedger={setLedger} ledger={ledger} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError} shouldCheckForError={shouldCheckForError}
                />,
                <ThirdStepSelectFile key={"thirdStep"} uploadedFile={file} setUploadedFile={setFile}/>,
            ];
        case FirstStepChooseActionEnum.Create:
            return [
                <FirstStepChooseAction key={"firstStep"}
                    chosenAction={chosenAction} setChosenAction={setChosenAction}/>,
                <SecondStepSelectNewName key={"secondStep"} setShouldRaisePrompt={setShouldRaisePrompt}
                    customLedgers={props.customLedgers} setLedger={setLedger} ledger={ledger}
                    shouldCheckForError={shouldCheckForError} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError}/>,
            ];
        }
    };

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
        // If the user is trying to go forward when the child component is saying to display a prompt first,
        // then stop the user from going forward and let the child component display the prompt.
        if (shouldRaisePrompt && adjustBy > 0) {
            Events.dispatch(Events.EventNames.RaisePrompt);
            return;
        }
        if (shouldCheckForError.current
            && (ledger.ledgerName === undefined || ledger.ledgerName === "")
            && (ledger.ledgerGuid === undefined || ledger.ledgerGuid === "")
            && adjustBy > 0) {
            setShouldDisplayError(true);
            return;
        }
        const finalItemIndex: number = stepsDecider().length - 1;
        const newActiveStep: number = activeStep + adjustBy;
        if (newActiveStep >= 0 && newActiveStep <= finalItemIndex) {
            setActiveStep(activeStep + adjustBy);
            setShouldRaisePrompt(false);
        }
    };

    const goForward = () => {
        adjustActiveStep(1);
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.GoForward, goForward);
        return () => {
            Events.unsubscribe(Events.EventNames.GoForward, goForward);
        };
    });

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
                {stepsLabelsDecider().map((label, index) => (
                    <Step key={label + index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{
                marginTop: "1rem",
            }}>
                {stepsDecider()[activeStep]}
            </Box>
            <Stack direction={"row"} display={"flex"} position={"absolute"} sx={{
                width: "100%",
                marginTop: "1rem",
                justifyContent: "space-between",
                bottom: "1rem",
            }}>

                <Button variant={"contained"} onClick={() => adjustActiveStep(-1)}>Back</Button>
                {activeStep < (stepsLabelsDecider().length - 2) &&
                    <Button variant={"contained"} onClick={() => adjustActiveStep(1)}>Next</Button>
                }
                {activeStep === (stepsLabelsDecider().length - 2) &&
                    <Button variant={"contained"} onClick={() => adjustActiveStep(1)}>Confirm and finish</Button>
                }
            </Stack>
        </Box>
    );
}

export default CreateNewLedgerTab;
