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
};

export interface UnapprovedTransaction {
    transactionId: string;
    userId: string;
    accountId: string;
    transactionAmount: number;
    transactionDescription: string;
    transactionDate: Date;
}


export interface RejectedAccountTransaction {
    id: string;
    accountId: string;
    transactionId: string;
    rejectionReason: string;
    rejectionDate: Date;
    rejectedByFullName: string;
    rejectedById: string;
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