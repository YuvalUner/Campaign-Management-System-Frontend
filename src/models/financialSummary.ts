export interface Balance {
    balance: number;
    expenseTotal: number;
    incomeTotal: number;
    typeGuid: string;
    typeName: string;
    
    // for client only
    x:number;
}

export interface FinancialSummary {
    balances: Balance[];
    totalBalance: number;
    totalExpenses: number;
    totalIncome: number;
}

export interface Balance2 {
    date:Date;
    balance:number;
    expenses:number;
    income:number;
}