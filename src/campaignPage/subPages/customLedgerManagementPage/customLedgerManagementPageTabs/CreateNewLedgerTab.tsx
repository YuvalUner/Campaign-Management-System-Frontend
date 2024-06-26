import React, {useEffect, useRef, useState} from "react";
import TabCommonProps from "./tab-common-props";
import axios, {HttpStatusCode} from "axios";
import config from "../../../../app-config.json";
import ColumnMapping, {EmptyMapping, PropertyNames} from "../../../../models/column-mapping";
import CustomVotersLedger from "../../../../models/custom-voters-ledger";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import {Box, Button, Stack, Step, StepLabel, Stepper} from "@mui/material";
import FirstStepChooseAction, {FirstStepChooseActionEnum} from "./CreateNewLedgerStepperSteps/FirstStepChooseAction";
import Events from "../../../../utils/helperMethods/events";
import SecondStepSelectNewName from "./CreateNewLedgerStepperSteps/SecondStepSelectNewName";
import SecondStepSelectExistingLedger from "./CreateNewLedgerStepperSteps/SecondStepSelectExistingLedger";
import ThirdStepSelectFile from "./CreateNewLedgerStepperSteps/thirdStepSelectFile/ThirdStepSelectFile";
import {FileObject} from "mui-file-dropzone";
import FourthStepMapColumns from "./CreateNewLedgerStepperSteps/FourthStepMapColumns";
import FifthStepConfirmAndUpload from "./CreateNewLedgerStepperSteps/fifthStepConfirm/FifthStepConfirm";
import FinalStepUploadAndFinish from "./CreateNewLedgerStepperSteps/FinalStepUploadAndFinish";
import Constants from "../../../../utils/constantsAndStaticObjects/constants";
import AdditionalStepSelectBehaviorForImportIntoExisting
    from "./CreateNewLedgerStepperSteps/AdditionalStepSelectBehaviorForImportIntoExisting";

function CreateNewLedgerTab(props: TabCommonProps): JSX.Element {

    const [activeStep, setActiveStep] = useState(0);
    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([...EmptyMapping]);
    const [file, setFile] = useState<File | null | FileObject>(null);
    const [ledger, setLedger] = useState<CustomVotersLedger>({} as CustomVotersLedger);
    const [chosenAction, setChosenAction] =
        useState<FirstStepChooseActionEnum>(FirstStepChooseActionEnum.CreateAndImport);
    const [shouldRaisePrompt, setShouldRaisePrompt] = useState(false);
    const [shouldDisplayError, setShouldDisplayError] = useState(false);
    const stepTwoShouldCheckForError = useRef(false);
    const stepThreeShouldCheckForError = useRef(false);
    const stepFourShouldCheckForError = useRef(false);
    const [uploading, setUploading] = useState(false);
    const [shouldDeleteOnUnmatch, setShouldDeleteOnUnmatch] = useState(false);
    /**
     * Creates the labels for the steps in the stepper, based on the chosen action.
     */
    const stepsLabelsDecider = (): string[] => {
        // eslint-disable-next-line default-case
        switch (chosenAction) {
        case FirstStepChooseActionEnum.CreateAndImport:
            return ["Choose action", "Name ledger", "Select file", "Map columns", "Confirm", "Done"];
        case FirstStepChooseActionEnum.Existing:
            return ["Choose action", "Select ledger", "Select file", "Map columns", "Determine behavior",
                "Confirm", "Done"];
        case FirstStepChooseActionEnum.Create:
            return ["Choose action", "Name ledger", "Done"];
        }
    };

    const uploadFile = (ledgerGuid: string) => {
        if (file !== null && file !== undefined) {
            const data = new FormData();
            if (file instanceof File){
                data.append("file", file);
            } else{
                data.append("file", file.file);
            }
            columnMappings.forEach((mapping) => {
                if (mapping.columnName !== null && mapping.columnName !== undefined) {
                    data.append("propertyNames", mapping.propertyName);
                    data.append("columnNames", mapping.columnName);
                }
            });
            // Making the request directly via axios and not via ServerRequestMaker as usual, because for some reason
            // passing the FormData object as a parameter doesn't work.
            axios({
                method: "post",
                url: config.ServerBaseUrl + config.ControllerUrls.CustomVotersLedger.Base
                    + config.ControllerUrls.CustomVotersLedger.Import
                    + props.campaignGuid + "/" + ledgerGuid
                    + `?shouldDeleteOnUnmatch=${shouldDeleteOnUnmatch}`,
                data: data,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json"
                },
                withCredentials: true
            }).then((response) => {
                if (response.status === HttpStatusCode.Ok){
                    setShouldDisplayError(false);
                }
            }).catch(() => {
                setShouldDisplayError(true);
            });
        }
    };

    const createLedger = () => {
        setUploading(true);
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.CustomVotersLedger.Base +
            config.ControllerUrls.CustomVotersLedger.Create + props.campaignGuid,
            ledger
        ).then((response) => {
            if (response.status === HttpStatusCode.Ok) {
                if (chosenAction !== FirstStepChooseActionEnum.Create) {
                    uploadFile(response.data.ledgerGuid);
                } else {
                    setShouldDisplayError(false);
                }
            }
        }).catch(() => {
            setShouldDisplayError(true);
        }).finally(() => {
            setUploading(false);
        });
    };

    const handleFinalStepLogic = () => {
        if (chosenAction !== FirstStepChooseActionEnum.Existing) {
            createLedger();
            Events.dispatch(Events.EventNames.RefreshCustomLedgers);
        } else {
            uploadFile(ledger.ledgerGuid as string);
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
                    shouldCheckForError={stepTwoShouldCheckForError} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError}/>,
                <ThirdStepSelectFile key={"thirdStep"} uploadedFile={file} setUploadedFile={setFile}
                    shouldCheckForError={stepThreeShouldCheckForError} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError}/>,
                <FourthStepMapColumns key={"fourthStep"} columnMappings={columnMappings}
                    setColumnMappings={setColumnMappings} file={file} shouldCheckForError={stepFourShouldCheckForError}
                    shouldDisplayError={shouldDisplayError} setShouldDisplayError={setShouldDisplayError}/>,
                <FifthStepConfirmAndUpload key={"fifthStep"} file={file}
                    columnMappings={columnMappings} ledgerName={ledger.ledgerName as string}/>,
                <FinalStepUploadAndFinish key={"finalStep"} ledgerName={ledger.ledgerName as string}
                    handleLogic={handleFinalStepLogic} uploading={uploading} error={shouldDisplayError}
                />
            ];
        case FirstStepChooseActionEnum.Existing:
            return [
                <FirstStepChooseAction key={"firstStep"}
                    chosenAction={chosenAction} setChosenAction={setChosenAction}/>,
                <SecondStepSelectExistingLedger key={"secondStep"} customLedgers={props.customLedgers}
                    setLedger={setLedger} ledger={ledger} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError} shouldCheckForError={stepTwoShouldCheckForError}
                />,
                <ThirdStepSelectFile key={"thirdStep"} uploadedFile={file} setUploadedFile={setFile}
                    shouldCheckForError={stepThreeShouldCheckForError} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError}/>,
                <FourthStepMapColumns key={"fourthStep"} columnMappings={columnMappings}
                    setColumnMappings={setColumnMappings} file={file} shouldCheckForError={stepFourShouldCheckForError}
                    shouldDisplayError={shouldDisplayError} setShouldDisplayError={setShouldDisplayError}/>,
                <AdditionalStepSelectBehaviorForImportIntoExisting key={"additionalStep"}
                    shouldDeleteOnUnmatch={shouldDeleteOnUnmatch} setShouldDeleteOnUnmatch={setShouldDeleteOnUnmatch}/>,
                <FifthStepConfirmAndUpload key={"fifthStep"} file={file}
                    columnMappings={columnMappings} ledgerName={ledger.ledgerName as string}
                    shouldDeleteOnUnmatch={shouldDeleteOnUnmatch} selectedAction={chosenAction}
                />,
                <FinalStepUploadAndFinish key={"finalStep"} ledgerName={ledger.ledgerName as string}
                    handleLogic={handleFinalStepLogic} uploading={uploading} error={shouldDisplayError}
                />
            ];
        case FirstStepChooseActionEnum.Create:
            return [
                <FirstStepChooseAction key={"firstStep"}
                    chosenAction={chosenAction} setChosenAction={setChosenAction}/>,
                <SecondStepSelectNewName key={"secondStep"} setShouldRaisePrompt={setShouldRaisePrompt}
                    customLedgers={props.customLedgers} setLedger={setLedger} ledger={ledger}
                    shouldCheckForError={stepTwoShouldCheckForError} shouldDisplayError={shouldDisplayError}
                    setShouldDisplayError={setShouldDisplayError}/>,
                <FinalStepUploadAndFinish key={"finalStep"} ledgerName={ledger.ledgerName as string}
                    handleLogic={handleFinalStepLogic} uploading={uploading} error={shouldDisplayError}
                />
            ];
        }
    };

    const adjustActiveStep = (adjustBy: number) => {
        // If the user is trying to go forward when the child component is saying to display a prompt first,
        // then stop the user from going forward and let the child component display the prompt.
        if (shouldRaisePrompt && adjustBy > 0) {
            Events.dispatch(Events.EventNames.RaisePrompt);
            return;
        }
        // Error condition of 2nd step - trying to create a ledger without a name, or not selecting an existing ledger.
        if (stepTwoShouldCheckForError.current
            && (ledger.ledgerName === undefined || ledger.ledgerName === "")
            && (ledger.ledgerGuid === undefined || ledger.ledgerGuid === "")
            && adjustBy > 0) {
            setShouldDisplayError(true);
            return;
        }
        // Error condition of the 3rd step - not uploading a file.
        if (stepThreeShouldCheckForError.current && (file === null || file === undefined) && adjustBy > 0) {
            setShouldDisplayError(true);
            return;
        }
        // Error condition of the 4th step - not mapping the identifier column.
        if (stepFourShouldCheckForError.current && adjustBy > 0) {
            const identifierColumnMapping: ColumnMapping | undefined = columnMappings.find((mapping) => {
                return mapping.propertyName === PropertyNames.identifier;
            });
            if (identifierColumnMapping === undefined ||
                (identifierColumnMapping.columnName === ""
                    || identifierColumnMapping.columnName === undefined
                    || identifierColumnMapping.columnName === null)) {
                setShouldDisplayError(true);
                return;
            }
        }
        const finalItemIndex: number = stepsDecider().length - 1;
        const newActiveStep: number = activeStep + adjustBy;
        if (newActiveStep >= 0 && newActiveStep <= finalItemIndex) {
            setActiveStep(activeStep + adjustBy);
            setShouldRaisePrompt(false);
        }
    };

    const backToStart = () => {
        setActiveStep(0);
        setChosenAction(FirstStepChooseActionEnum.CreateAndImport);
        setShouldRaisePrompt(false);
        setShouldDisplayError(false);
        setFile(null);
        setColumnMappings([]);
        setColumnMappings([...EmptyMapping]);
        setLedger({ledgerGuid: "", ledgerName: ""} as CustomVotersLedger);
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
                width: "100%",
                height: `calc(100% - ${Constants.topMenuHeight}px)`,
            }}>
                {stepsDecider()[activeStep]}
            </Box>
            <Stack direction={"row"} display={"flex"} position={"absolute"} sx={{
                width: "100%",
                marginTop: "1rem",
                justifyContent: "space-between",
                bottom: "-1rem"
            }}>

                {activeStep < stepsLabelsDecider().length - 1
                    && !uploading
                    && <Button variant={"contained"} onClick={() => adjustActiveStep(-1)}>Back</Button>}
                {activeStep === stepsLabelsDecider().length - 1
                    && !uploading
                    && <Button variant={"contained"}
                        onClick={backToStart}>Back to start</Button>}
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
