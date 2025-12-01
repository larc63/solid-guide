import { Component } from "react";
import { OrderListState } from "./types";
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

    render() {
        return (
            <div className="listContainer">
                {this.state.orders.map((order) => (
                    <Order base={order.base} protein={order.protein} dressings={order.dressings} />
                ))}
            </div>
        )
    }
}

export default OrderList;