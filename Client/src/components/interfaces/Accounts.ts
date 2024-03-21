export interface Account {
    accountId: string;
    activeStatus: boolean;
    accountName: string;
    accountNumber: number;
    description: string;
    normalSide: string;
    category: string;
    subcategory: string;
    initialBalance: number;
    debit: number;
    credit: number;
    balance: number;
    dateAdded: Date;
    userId: string;
    order: string;
    statement: string;
    comment: string;
}

export interface NewAccount {
    accountName: string;
    accountNumber: number;
    description: string;
    category: string;
    subcategory: string;
    initialBalance: number;
}

export interface AccountSearchQuery {
    pageSize: number;
    pageIndex: number;
    activeStatus: number;
    searchString: string;
}

export interface AccountTransaction {
    accountId: string;
    transactionId?: string;
    transactionDate: Date;
    transactionDescription: string;
    transactionAmount: number;
    beforeTransactionBalance : number;
    afterTransactionBalance : number;
    userName: string;
};

export interface AccountLogs {
    logId: string;
    accountId: string;
    action: string;
    date: Date;
    accountBeforeChanges: Account;
    accountAfterChanges: Account;
    userId: string;
    userName: string;
};