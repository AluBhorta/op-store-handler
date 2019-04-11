import React, { Component } from "react";
import OrderHistoryTable from "./order/OrderHistoryTable";
import { fakeOrders } from "./order/fakeOrderData";
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
    // ###
    //
    // update state.orders via API call to DB
    // this.setState({ orders: [] }); // fakeData

    ipcRenderer.send("getOrders", "retrieve orders from db");

    ipcRenderer.on("reply-getOrders", (e, data) => {
      this.setState({ orders: data });
    });

    // this.setState({ orders: fakeOrders });
  };

  addNewOrder = () => {
    console.log("Open form to add new order");
    ipcRenderer.send("addNewOrder", "open add order window");
  };

  handleTableRowClick = order => {
    const { orderId, date, totalBill, items } = order;
    let stringyItems = JSON.stringify(items);

    const url = `/orderHistoryPage?orderId=${orderId}&date=${date}&totalBill=${totalBill}&items=${stringyItems}`;

    this.state.history.push(url);
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
