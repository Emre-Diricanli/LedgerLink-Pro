export interface Account {
    AccountId: string; // Guid in C# is string in TypeScript
    ActiveStatus: boolean;
    AccountName: string;
    AccountNumber: number;
    Description: string;
    NormalSide: string;
    Category: string;
    Subcategory: string;
    InitialBalance: number; // decimal in C# is number in TypeScript
    Debit: number;
    Credit: number;
    Balance: number;
    DateAdded: Date; // DateTimeOffset in C# is Date in TypeScript
    UserId: string;
    Order: string;
    Statement: string;
    Comment: string;
}


export interface NewAccount {
    AccountName: string;
    AccountNumber: number;
    Description: string;
    Category: string;
    Subcategory: string;
    InitialBalance: number;
}
