interface ColumnMapping {
    columnName: string | null;
    propertyName: string;
}

const PropertyNames = {
    identifier: "Identifier",
    lastName: "LastName",
    firstName: "FirstName",
    cityName: "CityName",
    ballotId: "BallotId",
    streetName: "StreetName",
    houseNumber: "HouseNumber",
    entrance: "Entrance",
    appartment: "Appartment",
    houseLetter: "HouseLetter",
    zipCode: "ZipCode",
    email1: "Email1",
    email2: "Email2",
    phone1: "Phone1",
    phone2: "Phone2",
    supportStatus: "SupportStatus",
};

const EmptyMapping: ColumnMapping[] = [
    { columnName: null, propertyName: PropertyNames.identifier },
    { columnName: null, propertyName: PropertyNames.lastName },
    { columnName: null, propertyName: PropertyNames.firstName },
    { columnName: null, propertyName: PropertyNames.cityName },
    { columnName: null, propertyName: PropertyNames.ballotId },
    { columnName: null, propertyName: PropertyNames.streetName },
    { columnName: null, propertyName: PropertyNames.houseNumber },
    { columnName: null, propertyName: PropertyNames.entrance },
    { columnName: null, propertyName: PropertyNames.appartment },
    { columnName: null, propertyName: PropertyNames.houseLetter },
    { columnName: null, propertyName: PropertyNames.zipCode },
    { columnName: null, propertyName: PropertyNames.email1 },
    { columnName: null, propertyName: PropertyNames.email2 },
    { columnName: null, propertyName: PropertyNames.phone1 },
    { columnName: null, propertyName: PropertyNames.phone2 },
    { columnName: null, propertyName: PropertyNames.supportStatus },
];

export default ColumnMapping;
export { PropertyNames, EmptyMapping };
