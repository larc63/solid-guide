import { Component } from "react";
import TODOListController from "./controllers/TODOListController";
import ListItem from "./ListItem";
import './TODOList.css';


class TODOList extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            list_id: 0,
            title: '',
            items: []
        };
        this.updateData = this.updateData.bind(this);
    }

    async updateData(newItem: any) {
        const newNote = await TODOListController.createNote(this.state.list_id, newItem.text);
        if (newNote) {
            this.setState({
                items: [...(this.state.items), newNote]
            });
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

    render() {
        console.log(`RENDERING ${this.state.items.length} items`);
        return (
            //ref={listRef}
            <div className="listContainer">
                <div className="listTitle">{this.state.title}</div>
                <div>
                    {this.state.items.map((item) => (
                        <ListItem
                            onItemMove={this.handleItemMove}
                            onUpdateData={this.updateData}
                            key={item.item_id}
                            list_id={this.state.list_id}
                            item_id={item.item_id}
                            rank={item.rank}
                            text={item.text} />
                    ))}
                    <ListItem
                        onItemMove={this.handleItemMove}
                        onUpdateData={this.updateData}
                        key={0}
                        list_id={this.state.list_id}
                        item_id={0}
                        rank={0}
                        text={''} />
                </div>
            </div>
        )
    }
}

export default TODOList;