import {
    Component,
    type ReactNode,
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

class ListItem extends Component {

    constructor(props: ListItemPropsType) {
        super(props);
        this.state = {
            text: props.text
        };
    }

    handleTextChange = e => {
        this.setState({ text: e.target.value });
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            this.commitTextChange();
            e.target.blur();
        }
    }

    commitTextChange(): void {
        const trimmedText = this.state.text?.trim();
        if (trimmedText?.length > 0) {
            let action;
            if (this.props.item_id == 0) {
                // save as new item
                console.log(`Will save new row to list ${this.props.list_id} with ${trimmedText} to back end`);
                action = 'create';
            } else {
                action = 'update';
                // save change to existing item_id
                console.log(`Will save ${trimmedText} to item_id: ${this.props.item_id} in back end`);
            }
            this.props.onUpdateData({
                action: action,
                text: trimmedText,
                item_id: this.props.item_id
            });

            if (this.props.item_id == 0) {
                this.setState({ text: this.props.text });
            }
        }
    }

    deleteItem = () => {
        this.props.onUpdateData({
            action: 'delete',
            item_id: this.props.item_id
        });
    }

    render(): ReactNode {
        return (
            <div className="itemContainer">
                <div className="itemHandle">
                    {/* {this.props.item_id} */}
                    |||
                </div>
                <div className="itemCheckbox">
                    <input type="checkbox" name="checked" id="" />
                </div>
                <input className="itemText"
                    onChange={this.handleTextChange}
                    onBlur={this.commitTextChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Enter new item here"
                    value={this.state.text} />
                {this.props.item_id != 0 ? (
                    <div className="itemDelete" onClick={this.deleteItem}> &times;</div>
                ) : (<></>)}
            </div>
        )
    }
}

export default ListItem;