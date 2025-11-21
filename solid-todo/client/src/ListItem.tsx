import React, { 
    useState, 
    useRef,
    useCallback,
    useEffect,
    type MouseEventHandler
} from "react";
import './ListItem.css'



type ItemMoveFunctionType = (rank: number, x: number, y:number) => void;

type ListItemPropsType = {
    onItemMove: ItemMoveFunctionType,
    rank: number
}

function ListItem(props: ListItemPropsType) {
    // Set states for dragging on mousedown for the "handle"
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [isDragging, setIsDragging] = useState(false);
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const itemContainerRef = useRef<HTMLElement | null>(null);


    const handleMouseDown = useCallback((e: MouseEvent) => {
        // Prevent default browser drag behavior (e.g., image drag)
        e.preventDefault();

        isDragging.current = true;//setIsDragging(true);

        const element: HTMLElement | null = (e.currentTarget as HTMLElement)?.parentElement;
        itemContainerRef.current = element;

        // Calculate the offset (where the mouse is clicked *inside* the element)
        // This prevents the element from jumping when you start dragging
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        // Change cursor and focus style
        (e.currentTarget as HTMLElement)?.classList.add('itemContainerGrabbing');

        console.log(`before exiting hanlder ${isDragging.current}`);
        setTimeout(() => {
            // Attach the global mouse move/up listeners
            console.log(`in settimeout ${isDragging.current}`);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }, 50);
    }, [itemContainerRef, offset]);

    const handleMouseMove = useCallback((e: Event) => {
        if (!isDragging.current) {
            console.log('isDragging is false');
            return; 
        }
        const me = e as MouseEvent;
        // Calculate the new position based on mouse movement and initial offset
        const rect = itemContainerRef.current?.getBoundingClientRect();
        let newX, newY
        if(rect){
            newX = rect.left - offset.current.x;
            newY = rect.top - offset.current.y;
        }
        // let newX = me.clientX - offset.current.x;
        // let newY = me.clientY - offset.current.y;

        // // **Boundary Check (Optional but recommended):**
        // if (containerRef.current) {
        //     const containerRect = containerRef.current.getBoundingClientRect();
        //     const draggableRect = e.currentTarget.getBoundingClientRect();

        //     // Constrain X position
        //     newX = Math.max(0, newX); // Left boundary
        //     newX = Math.min(newX, containerRect.width - draggableRect.width); // Right boundary

        //     // Constrain Y position
        //     newY = Math.max(0, newY); // Top boundary
        //     newY = Math.min(newY, containerRect.height - draggableRect.height); // Bottom boundary
        // }

        // Update state to trigger re-render and move the element
        setPosition({ x: newX, y: newY });
        console.log(`set position to ${position}`);
    }, [position.x, position.y]);

    const handleMouseUp = useCallback((e: Event) => {

        isDragging.current = false;// setIsDragging(false);
        
        const me = e as MouseEvent;
        // Calculate the new position based on mouse movement and initial offset
        let newX = me.clientX - offset.current.x;
        let newY = me.clientY - offset.current.y;
    
        // // Restore style
        itemContainerRef.current?.classList.remove('itemContainerGrabbing');

        // Remove the global listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        props.onItemMove(props.rank, newX, newY);
    }, [handleMouseMove]);

    useEffect(() => {
        console.log(`isDragging = ${isDragging.current}`);
    }, [isDragging.current]);

    return (
            <div className="itemContainer" 
                style={{
                    left: position.x + 'px',
                    top: position.y + 'px',
                }}  
            >
                <div className="itemHandle" onMouseDown={handleMouseDown} >
                    |||
                </div>
                <div className="itemCheckbox">
                    <input type="checkbox" name="checked" id="" />
                </div>
                <div className="itemText">Start writing to create a new TODO item</div>
            </div>
        )
}

export default ListItem;