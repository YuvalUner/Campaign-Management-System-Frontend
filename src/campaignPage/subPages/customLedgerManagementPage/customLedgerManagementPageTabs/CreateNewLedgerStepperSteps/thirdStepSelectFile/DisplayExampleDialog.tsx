import React from "react";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {ColumnDirective, ColumnsDirective, GridComponent} from "@syncfusion/ej2-react-grids";
import CustomVotersLedgerContent from "../../../../../../models/custom-voters-ledger-content";

interface DisplayExampleDialogProps {
    openDialog: boolean;
    setOpenDialog: (openDialog: boolean) => void;
}

function DisplayExampleDialog(props: DisplayExampleDialogProps): JSX.Element {

    const sample: CustomVotersLedgerContent[] = [
        {
            "identifier": 1,
            "firstName": "John",
            "lastName": "Doe",
            "cityName": "New York",
            "ballotId": 12.5,
            "streetName": "Main Street",
            "houseNumber": 12,
            "entrance": "A",
            "appartment": "12",
            "houseLetter": "A",
            "zipCode": 12345,
            "email1": "johndoe@email1.com",
            "email2": "johndoe@email2.com",
            "phone1": "123456789",
            "phone2": "987654321",
            "supportStatus": true,
            "supportStatusString": "Supporting"
        },
        {
            "identifier": 2,
            "firstName": "Jane",
            "lastName": "Doe",
            "cityName": "New York",
            "ballotId": 12.5,
            "streetName": "Main Street",
            "houseNumber": 12,
            "entrance": "A",
            "appartment": "12",
            "houseLetter": "A",
            "zipCode": 12345,
            "email1": "janedoe@email1.com",
            "email2": "",
            "phone1": "123456789",
            "phone2": "",
            "supportStatus": false,
            "supportStatusString": "Opposing"
        }
    ];

    const closeDialog = () => {
        props.setOpenDialog(false);
    };

    return (
        <Dialog open={props.openDialog} onClose={closeDialog}>
            <DialogContent>
                <GridComponent
                    dataSource={sample}
                    allowResizing={true}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="identifier"
                            headerText="Identifier" width="150" textAlign="Right"/>
                        <ColumnDirective field="firstName"
                            headerText={"First Name"} width="150" textAlign="Right"/>
                        <ColumnDirective field="lastName"
                            headerText={"Last Name"} width="150" textAlign="Right"/>
                        <ColumnDirective field="email1"
                            headerText={"Email 1"} width="250" textAlign="Right"/>
                        <ColumnDirective field="email2"
                            headerText={"Email 2"} width="250" textAlign="Right"/>
                        <ColumnDirective field="phone1"
                            headerText={"Phone 1"} width="150" textAlign="Right"/>
                        <ColumnDirective field="phone2"
                            headerText={"Phone 2"} width="150" textAlign="Right"/>
                        <ColumnDirective field="cityName"
                            headerText={"City"} width="150" textAlign="Right"/>
                        <ColumnDirective field="streetName"
                            headerText={"Street"} width="150" textAlign="Right"/>
                        <ColumnDirective field="houseNumber"
                            headerText={"House Number"} width="150" textAlign="Right"/>
                        <ColumnDirective field="appartment"
                            headerText={"Apartment"} width="150" textAlign="Right"/>
                        <ColumnDirective field="houseLetter"
                            headerText={"House Letter"} width="150" textAlign="Right"/>
                        <ColumnDirective field="zipCode"
                            headerText={"Zip Code"} width="150" textAlign="Right"/>
                        <ColumnDirective field="supportStatusString"
                            headerText={"Support status"} width="150" textAlign="Right"/>
                    </ColumnsDirective>
                </GridComponent>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DisplayExampleDialog;
