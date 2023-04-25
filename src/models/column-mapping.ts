interface ColumnMapping {
    columnName: string;
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

export default ColumnMapping;
export { PropertyNames };
