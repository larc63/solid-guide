import { Component } from "react";
import {v4 as uuidv4} from "uuid";

import { OrderListState } from "./types";
import OrderForm from "./OrderForm";
import Order from "./Order";
import './OrderList.css';

// import data
import OrderData from './data/OrderData.json'

class OrderList extends Component {
    state: OrderListState = {
        orders: []
    };
    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        const data = OrderData;
        this.setState({ orders: data });
    };

    addOrder = (base: string, protein: string, dressings: Array<string>) => {
        this.setState({
            orders: [{
                id: uuidv4(),
                base: base,
                protein: protein,
                dressings: dressings
            }, ...this.state.orders]
        });
    }

    render() {
        return (
            <div> <h1>Create Order</h1>
                <OrderForm addOrder={this.addOrder}/>
                <h1>Current Orders</h1>
                <div className="listContainer">
                    {this.state.orders.map((order) => (
                        <Order key={order.id} base={order.base} protein={order.protein} dressings={order.dressings} />
                    ))}
                </div>
            </div>
        )
    }
}

export default OrderList;