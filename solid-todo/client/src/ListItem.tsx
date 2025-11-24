import React, {
    useState,
} from "react";
import './ListItem.css'



type ItemMoveFunctionType = (rank: number, x: number, y: number) => void;
type UpdateDataFunctionType = (newData: any) => void;

type ListItemPropsType = {
    onItemMove: ItemMoveFunctionType,
    onUpdateData: UpdateDataFunctionType,
    list_id: number,
    item_id: number,
    text: string,
    rank: number
}

function ListItem(props: ListItemPropsType) {
    let item_id = props.item_id;
    const [text, setText] = useState(props.text);

    const handleTextChange = e => {
        setText(() => e.target.value);
    }
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            commitTextChange();
        }
    }

    const commitTextChange = async () => {
        const trimmedText = text.trim();
        if (trimmedText.length > 0) {
            if (props.item_id == 0) {
                // save as new item
                console.log(`Will save new row to list ${props.list_id} with ${trimmedText} to back end`);
                props.onUpdateData({
                    text: trimmedText
                });
            }
            setText(() => props.text);
        } else {
            // save change to existing item_id
            console.log(`Will save ${trimmedText} to item_id: ${props.item_id} in back end`);
        }
    }

    return (
        <div className="itemContainer">
            <div className="itemHandle">
                {/* {item_id} */}
                |||
            </div>
            <div className="itemCheckbox">
                <input type="checkbox" name="checked" id="" />
            </div>
            <input className="itemText"
                onChange={handleTextChange}
                onBlur={commitTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter new item here"
                value={text}></input>
        </div>
    )
}

export default ListItem;