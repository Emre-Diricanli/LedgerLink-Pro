export interface DashboardQuickInfo { 
    unapprovedJournalEntries: UnapprovedJournalEntryStats[];
    errorLogs: ErrorLogStats[];
    
}

export interface UnapprovedJournalEntryStats {
    accountNumber: number;
    accountName: string;
    totalAmount: number;
}

export interface ErrorLogStats {
    errorCount: number;
    errorType: string;
}