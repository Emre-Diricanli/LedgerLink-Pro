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
    dateRange?: string;
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
    credit: number;
    debit: number;
    beforeTransactionBalance: number;
    afterTransactionBalance: number;
    user: string;
    journalEntries: JournalEntryLineDTO[];
    isAdjustingEntry: boolean;
}

export interface UnapprovedJournalEntry {
    transactionId: string;
    userId: string;
    accountId: string;
    totalAmount: number;
    transactionDescription: string;
    transactionDate: Date;
    journalEntryLines: JournalEntryLineDTO[];
    isAdjustingEntry: boolean;
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
    isAdjustingEntry: boolean;
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
    credit: number;
    debit: number;
    description: string;
}

export interface TrialBalance {
    accounts: Account[];
    totalDebit: number;
    totalCredit: number;
    dateRange: string;
}