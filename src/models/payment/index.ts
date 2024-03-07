export interface ICreditCardPayment {
    email: string;
    name: string;
    amount: number;
    token: string;
}

export interface IBankAccountTransfer {
    name?: string;
    type?: string;
    email: string;
    bank_account: IBankAccount;
}

interface IBankAccount {
    brand: string;
    number: string;
    name: string;
}