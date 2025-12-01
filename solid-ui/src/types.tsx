// type ItemMoveFunctionType = (rank: number, x: number, y: number) => void;

export type OrderProps = {
    base: string,
    protein: string,
    dressings: Array<string>
}

export type OrderListState = {
    orders: Array<any>
}