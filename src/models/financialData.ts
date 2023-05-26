interface FinancialData {
    amount: number;
    campaignGuid: string | null;
    creatorUserId: string;
    dataDescription: string;
    dataGuid: string;
    dataTitle: string;
    dateCreated: string;
    displayNameEng: string;
    email: string;
    firstNameHeb: string;
    isExpense: boolean;
    lastNameHeb: string;
    phoneNumber: string;
    profilePicUrl: string;
    typeDescription: null;
    typeGuid: string;
    typeName: string;
}

export default FinancialData;