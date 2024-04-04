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
    beforeTransactionBalance: number;
    afterTransactionBalance: number;
    user: string;
    journalEntries: JournalEntryLineDTO[];
}

export interface UnapprovedJournalEntry {
    transactionId: string;
    userId: string;
    accountId: string;
    totalAmount: number;
    transactionDescription: string;
    transactionDate: Date;
    journalEntryLines: JournalEntryLineDTO[];
}


export interface RejectedJournalEntry {
    transactionId: string;
    userId: string;
    accountId: string;
    transactionAmount: number;
    transactionDescription: string;
    rejectionReason: string;
    rejectionDate: Date;
    rejectedByFullName: string;
    rejectedById: string;
    transactionDate: Date;
    journalEntries: JournalEntryLineDTO[];
}

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

export interface NewJournalEntryDTO {
    accountId: string;
    entryName: string;
    journalEntryLines: JournalEntryLineDTO[];
}

export interface JournalEntryLineDTO {
    index: number;
    amount: number;
    description: string;
}