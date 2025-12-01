import {
    Component,
    type ReactNode,
} from "react";
import './Order.css'

import { OrderProps } from './types';

class Order extends Component<OrderProps> {
    constructor(props: OrderProps) {
        super(props);
    }
    render(): ReactNode {
        return (
            <div className="itemContainer">
                <div className="row">
                    <span className="label">Base: </span><span className="itemText">{this.props.base}</span>
                </div>
                <div className="row">
                    <span className="label">Protein: </span><span className="itemText">{this.props.protein}</span>
                </div>
                <div className="row">
                    <span className="label">Dressings: </span><span className="itemText">{this.props.dressings.join(', ').trim()}</span>
                </div>
                {/* <div className="itemDelete"> &times;</div> */}
            </div>
        )
    }
}

export default Order;