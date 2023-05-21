import React, {useRef, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    TextFieldProps,
} from "@mui/material";
import ServerRequestMaker from "../../utils/helperMethods/server-request-maker";
import config from "../../app-config.json";
import {HttpStatusCode, isAxiosError} from "axios";

interface UpdateNumberDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    fetch:() => Promise<void>;
}

interface DialogInfo {
    waitingForVerification: boolean
    title: string,
    label: string,
    isError: boolean,
    errorMessage: string,
}

function UpdateNumberDialog(props: UpdateNumberDialogProps): JSX.Element {
    const defaultDialogInfo: DialogInfo = {
        waitingForVerification: false,
        title: "Update phone number",
        label: "New phone number",
        isError: false,
        errorMessage: "",
    };
    const inputRef = useRef<TextFieldProps>(null);
    const [dialogInfo, setDialogInfo] = useState<DialogInfo>(defaultDialogInfo);

    const onPhoneNumberSubmit = async () => {
        const newPhoneNumber = inputRef.current?.value;

        if (typeof newPhoneNumber !== "string") {
            console.error("newPhoneNumber is not string");
            return;
        }

        if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(newPhoneNumber)) {
            setDialogInfo((prev) => ({
                ...prev,
                isError: true,
                errorMessage: "this is not a valid phone number",
            }));
            return;
        }

        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.VerificationCode.Base + config.ControllerUrls.VerificationCode.SendVerificationCode,
            {"PhoneNumber": newPhoneNumber},
        );

        if (res.status === HttpStatusCode.Ok) {
            setDialogInfo({
                waitingForVerification: true,
                title: "verification code was sent, pls enter it",
                label: "verification code",
                isError: false,
                errorMessage: "",
            });
            if (inputRef.current !== null) {
                inputRef.current.value = "";
            }
        }
        // TODO: add error handling
    };

    const onVerificationCodeSubmit = async () => {
        const verificationCode = inputRef.current?.value;

        try {
            const res = await ServerRequestMaker.MakePostRequest(
                config.ControllerUrls.VerificationCode.Base + config.ControllerUrls.VerificationCode.VerifyVerificationCode,
                {"VerificationCode": verificationCode},
            );
            if (res.status === HttpStatusCode.Ok) {
                setDialogInfo(defaultDialogInfo);
                await props.fetch();
                props.switchMode();
            }
        } catch (error) {
            // check if the error was thrown from axios
            if (isAxiosError(error)) {
                if (error.response?.status === HttpStatusCode.BadRequest) {
                    setDialogInfo((prev) => ({
                        ...prev,
                        isError: true,
                        errorMessage: "Verification Code is incorrect",
                    }));
                }
            } else {
                throw error;
            }
        }
    };

    const handleSubmit = () => {
        if (dialogInfo.waitingForVerification) {
            onVerificationCodeSubmit();
        } else {
            onPhoneNumberSubmit();
        }
    };

    return (
        <Dialog open={props.isOpen} onClose={props.switchMode}>
            <DialogTitle>{dialogInfo.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={dialogInfo.label}
                        type="text"
                        // value={props.inputValue}
                        inputRef={inputRef}
                        fullWidth
                        error={dialogInfo.isError}
                        helperText={dialogInfo.errorMessage}
                    />
                </DialogContentText>
            </DialogContent>
            {/*dialog buttons, close and update*/}
            <DialogActions>
                <Button onClick={props.switchMode}>Close</Button>
                <Button onClick={handleSubmit}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateNumberDialog;