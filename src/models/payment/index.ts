export interface ICreditCardPayment {
    email: string;
    name: string;
    amount: number;
    token: string;
}

export interface IBankAccountTransfer {
    name: string;
    email: string;
    type: number;
    bank_account: IBankAccount;
}

interface IBankAccount {
    brand: string;
    number: string;
    name: string;
}