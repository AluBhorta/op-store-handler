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
    this.setState({ orders: fakeOrders });
  };

  addNewOrder = () => {
    console.log("Open form to add new order");
    ipcRenderer.send("addNewOrder", "open add order window");
  };

  handleTableRowClick = order => {
    // ###
    //
    // implement the url by learning to implement nested objects

    const { orderId, date, totalBill, items } = order;

    let url = `/orderHistoryPage?`;

    let stringyItems = JSON.stringify(items);

    url += `orderId=${orderId}&date=${date}&totalBill=${totalBill}&items=${stringyItems}`;

    // items.forEach((item, index) => {
    //   url += `name=${item.name}&price=${item.price}&orderQuantity=${
    //     item.orderQuantity
    //   }&quantityUnit=${item.quantityUnit}&`;
    // });

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
