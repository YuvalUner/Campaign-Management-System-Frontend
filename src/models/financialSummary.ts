export interface Balance {
    balance: number;
    expenseTotal: number;
    incomeTotal: number;
    typeGuid: string;
    typeName: string;
}

export interface FinancialSummary {
    balances: Balance[];
    totalBalance: number;
    totalExpenses: number;
    totalIncome: number;
}

export default FinancialSummary;