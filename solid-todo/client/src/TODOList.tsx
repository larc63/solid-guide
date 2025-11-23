import { useState, useEffect, useRef } from "react";
import ListItem from "./ListItem";

import './TODOList.css';

const API_URL = 'http://localhost:3002'

const ENDPOINTS = {
    getNote: `${API_URL}/notes`
}

type ListItemType = {
    text: string,
    rank: number
}

function TODOList() {
    const handleItemMove = (rank: number, x: number, y: number) => {
        console.log(`item ${rank} moved to x/y ${x}, ${y}`);
    }
    const listRef = useRef(null);
    const [title, setTitle] = useState('List Title');
    const [items, setItems] = useState<[ListItemType]>([{ text: '', rank: 0}]);

    const fetchNote = async () => {
        try {
            const response = await fetch(ENDPOINTS.getNote);

            // Check if the request was successful (status in the 200-299 range)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Extract the response body content as JSON
            const data = await response.json();
            console.log(data);
            setTitle(() => data.title);
            setItems(() => data.items);
        } catch (error: any) {
            console.error('Fetch error:', error.message);
        }


    }

    // componentDidMount
    useEffect(() => {
        fetchNote();
    }, []);

    return (<div ref={listRef}>
        <div className="listContainer">
            <div className="listTitle">{title}</div>

            <div>
            {items.map((item) => (
                <ListItem onItemMove={handleItemMove} rank={item.rank} text={item.text} />
            ))}
            </div>
        </div>
    </div>)
}

export default TODOList;