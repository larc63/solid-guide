import {useRef} from "react";
import ListItem from "./ListItem";

function TODOList() {
    const handleItemMove = (rank: number, x: number, y: number) => {
        console.log(`item ${rank} moved to x/y ${x}, ${y}`);
    }
    const listRef = useRef(null);
    return (<div ref={listRef}>
        <ListItem onItemMove={handleItemMove} rank={0} />
    </div>)
}

export default TODOList;