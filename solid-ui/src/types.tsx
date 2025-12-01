type AddOrderFunctionType = (base: string, protein: string, dressings: Array<string>) => void;

export type OrderFormProps = {
    addOrder: AddOrderFunctionType
}

export type OrderFormState = {
    base: string,
    protein: string,
    dressings: Array<string>
}

export type OrderProps = {
    base: string,
    protein: string,
    dressings: Array<string>
}

export type OrderListState = {
    orders: Array<any>
}