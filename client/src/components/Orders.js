import React, { Component } from "react";
import OrderHistoryTable from "./order/OrderHistoryTable";
const { ipcRenderer } = window.require("electron");

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      history: props.history
    };
  }

  componentDidMount = () => {
    ipcRenderer.send("getOrders", "retrieve orders from db");

    ipcRenderer.on("reply-getOrders", (e, data) => {
      this.setState({ orders: data });
    });
  };

  addNewOrder = () => {
    console.log("Open form to add new order");
    ipcRenderer.send("addNewOrder", "open add order window");
  };

  handleTableRowClick = order => {
    const { orderId, orderDate, totalBill, numberOfItems } = order;

    ipcRenderer.send("getOrderItemsOfOrder", orderId);

    ipcRenderer.on("reply-getOrderItemsOfOrder", (e, orderItems) => {
      let stringyItems = JSON.stringify(orderItems);

      const url = `/orderHistoryPage?orderId=${orderId}&date=${orderDate}&totalBill=${totalBill}&numberOfItems=${numberOfItems}&items=${stringyItems}`;
      this.state.history.push(url);
    });
  };

  render() {
    return (
      <div>
        <h1>Orders</h1>
        <button onClick={this.addNewOrder}>Add New Order</button>
        <OrderHistoryTable
          orders={this.state.orders}
          handleTableRowClick={this.handleTableRowClick}
        />
      </div>
    );
  }
}
