export type AccountOutput = {
    id: string
    credit: number
    minimumCredit: number
    name: string
    mail: string
    username: string
    accountNumber: string
    permission: string
    receivesMonthlyReport: boolean
    allowNfcRegistration: boolean
}

export type TransactionOutput = {
    id: string
    total: number
    beforeCredit: number
    afterCredit: number
    date: number
    products: {
        product: {
            id: string,
            name: string,
        },
        amount: number
    }[]
}
