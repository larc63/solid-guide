import {
    ChangeEvent,
    KeyboardEvent,
    Component,
    type ReactNode,
} from "react";
import './ListItem.css'

import {ListItemProps, ListItemState} from './types';
import TODOListController from "./controllers/TODOListController";

class ListItem extends Component<ListItemProps> {
    state: ListItemState = {
        text: ''
    };
    constructor(props: ListItemProps) {
        super(props);
    }
    
    componentDidMount(): void {
        this.setState({text: this.props.text});
    }

    handleCheck = () => {
        TODOListController.toggleListState(this.props.item_id);
    };

    handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ text: e.target.value });
    }

    handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // this.commitTextChange();
            const target = e.target as HTMLElement;
            target.blur();
        }
    }

    commitTextChange = async () => {
        const trimmedText = this.state.text?.trim();
        if (trimmedText?.length > 0) {
            let action;
            if (this.props.item_id == 0) {
                // save as new item
                console.log(`Will save new row with ${trimmedText}`);
                action = 'create';
            } else {
                action = 'update';
                // save change to existing item_id
                console.log(`Will save ${trimmedText} to item_id: ${this.props.item_id}`);
            }
            await this.props.onUpdateData({
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
                    <input type="checkbox" defaultChecked={this.props.done} onChange={this.handleCheck} />
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