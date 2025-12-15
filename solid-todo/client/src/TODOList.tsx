import { Component } from "react";
import { TODOListState } from "./types";
import TODOListController from "./controllers/TODOListController";
import ListItem from "./ListItem";
import './TODOList.css';

class TODOList extends Component {
    state: TODOListState = {
        list_id: 0,
        title: '',
        items: []
    };
    constructor(props: any) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    async updateData(newItem: any) {

        switch (newItem.action) {
            case 'create':
                const newNote = await TODOListController.createNote(this.state.list_id, newItem.text);
                if (newNote) {
                    // this.setState( (prevState:any) => ({items: prevState.items.concat(newNote)}));
                    this.setState({
                        items: [...this.state.items, newNote]
                    }, () => {
                        // console.log(`after saving: ${JSON.stringify(this.state.items)}`);
                    });
                }
                break;
            case 'update':
                await TODOListController.updateNote(newItem.item_id, newItem.text);
                break;
            case 'delete':
                await TODOListController.deleteNote(newItem.item_id);
                const filteredItems = this.state.items.filter(i => i.item_id != newItem.item_id);
                this.setState({
                    items: [...filteredItems]
                });
                break;
        }

    }

    handleItemMove(rank: number, x: number, y: number) {
        console.log(`item ${rank} moved to x/y ${x}, ${y}`);
    }
    async componentDidMount() {
        const data = await TODOListController.getNotes();
        // console.log(data);
        this.setState({ title: data.title });
        // console.log(`list_id= ${data.list_id}`);
        this.setState({ list_id: data.list_id });
        this.setState({ items: data.items });
    };

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.state.value !== prevState.value) {
    //         console.log('Value changed, new value is:', this.state.value);
    //         // Perform other actions like network requests here
    //     }
    // }

    render() {
        // console.log(`before rendering: ${JSON.stringify(this.state.items)}`);
        const items = this.state.items;

        // hack to avoid double-additions when creating a new item
        const keys: Array<number> = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if(keys.includes(item.item_id)) {
                items.splice(i, 1);
                break;
            } 
            keys.push(item.item_id);
        }
        return (
            <div className="listContainer">
                <div className="listTitle">{this.state.title}</div>
                <div>
                    {items.map((item) => (
                        <ListItem
                            onItemMove={this.handleItemMove}
                            onUpdateData={this.updateData}
                            done={item.done}
                            key={item.item_id}
                            item_id={item.item_id}
                            rank={item.rank}
                            text={item.text} />
                    ))}
                    <ListItem
                        onItemMove={this.handleItemMove}
                        onUpdateData={this.updateData}
                        done={false}
                        key={0}
                        item_id={0}
                        rank={0}
                        text={''} />
                </div>
            </div>
        )
    }
}

export default TODOList;