import React, {useRef, useState} from "react";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
} from "@mui/material";
import FinancialData from "../../../models/financialData";
import FinancialType from "../../../models/financialType";

interface UpdateTransactionDialogProps {
    transaction:FinancialData | null;
    closeDialog: () => void;
    transactionTypes: FinancialType[] | null;
    fetch: () => Promise<void>;
}

export const UpdateTransactionDialog = (props: UpdateTransactionDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;
    console.dir(props.transaction);

    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const [titleError, setTitleError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [isExpense, setIsExpense] = useState(props.transaction?.isExpense);
    const [chosenTransactionType, setChosenTransactionType] = useState(props.transaction?.typeGuid);

    const updateTransaction = async () => {
        if (!titleRef.current || !descriptionRef.current || !amountRef.current) {
            return;
        }

        let error = false;
        if (titleRef.current?.value === "" || titleRef.current?.value.length > 100) {
            setTitleError(true);
            error = true;
        } else {
            setTitleError(false);
        }


        if (descriptionRef.current?.value === "") {
            setDescError(true);
            error = true;
        } else {
            setDescError(false);
        }

        if (error) {
            return;
        }

        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.FinancialData.Base + config.ControllerUrls.FinancialData.UpdateFinancialData + campaignGuid,
            {
                IsExpense: isExpense,
                Amount: amountRef.current.value,
                DataTitle: titleRef.current.value,
                DataDescription: descriptionRef.current.value,
                // DateCreated: new Date(),
                TypeGuid: chosenTransactionType,
                DataGuid:props.transaction?.dataGuid,
            },
        );
        await props.fetch();
        props.closeDialog();
    };

    const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsExpense((event.target as HTMLInputElement).value === "true");
    };

    const onSelectChange = (event: SelectChangeEvent) => {
        setChosenTransactionType(event.target.value);
    };

    return (
        <Dialog open={props.transaction !== null} onClose={props.closeDialog}>
            <DialogTitle>Update Transaction</DialogTitle>
            <DialogContent>
                <TextField fullWidth autoFocus margin="dense" label="Title" inputRef={titleRef} error={titleError}
                           helperText={""} defaultValue={props.transaction?.dataTitle}/>
                <TextField fullWidth margin="dense" label="Description" inputRef={descriptionRef} error={descError}
                           helperText={""} defaultValue={props.transaction?.dataDescription}/>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group"
                            onChange={onRadioGroupChange} value={isExpense}>
                    <FormControlLabel value={false} control={<Radio/>} label="Income"/>
                    <FormControlLabel value={true} control={<Radio/>} label="Expense"/>
                </RadioGroup>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Amount</InputLabel>
                    <OutlinedInput
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label="Amount"
                        type="number"
                        inputRef={amountRef}
                        defaultValue={props.transaction?.amount}
                    />
                    <FormHelperText>cannot be more then 300 chars</FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                        label="Transaction Type"
                        value={chosenTransactionType}
                        onChange={onSelectChange}>
                        {props.transactionTypes?.map((transactionType) => (
                            <MenuItem value={transactionType.typeGuid} key={transactionType.typeGuid}>
                                <Tooltip title={transactionType.typeDescription} placement="right-start">
                                    <div style={{width: "100%"}}>
                                        {transactionType.typeName}
                                    </div>
                                </Tooltip>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={props.closeDialog}>Cancel</Button>
                <Button fullWidth onClick={updateTransaction}>Subscribe</Button>
            </DialogActions>
        </Dialog>
    );
};