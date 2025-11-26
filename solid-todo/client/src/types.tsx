type ItemMoveFunctionType = (rank: number, x: number, y: number) => void;
type UpdateDataFunctionType = (newData: any) => void;

export type ListItemProps = {
    onItemMove: ItemMoveFunctionType,
    onUpdateData: UpdateDataFunctionType,
    item_id: number,
    done: boolean,
    text: string,
    rank: number
}

export type ListItemState = {
    text: string
}

export type TODOListState = {
    list_id: number,
    title: string,
    items: Array<any>
}