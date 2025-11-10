import React from "react";
import './ListItem.css'

function handleDrag(): void {
    console.log(`dragging ${event}`);
}

function ListItem() {
    return (<div className="itemContainer">
        <div className="handle" onDrag={handleDrag}>
            |||
        </div>
        <div className="itemCheckbox">
            <input type="checkbox" name="checked" id="" />
        </div>
        <div className="itemText">Start writing to create a new TODO item</div>
    </div>)
}

export default ListItem;