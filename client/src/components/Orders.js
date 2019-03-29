import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockItems: [],
      history: props.history
    };
  }

  componentDidMount = () => {
    // ###
    //
    // update state.stockItems via API call to DB
    // this.setState({ stockItems: [] }); // fakeData
  };

  addNewOrder = () => {
    console.log("Open form to add new order");
    ipcRenderer.send("addNewOrder", "open add item window");

    // ###
    //
    // reload OrderHistory
  };

  handleTableRowClick = item => {
    const {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    } = item;
    const url = `/itemPage?name=${name}&quantityUnit=${quantityUnit}&stockQuantity=${stockQuantity}&buyingPrice=${buyingPrice}&sellingPrice=${sellingPrice}&details=${details}`;

    this.state.history.push(url);
  };

  render() {
    return (
      <div>
        <h1>Orders</h1>
        <button onClick={this.addNewOrder}>Add New Order</button>
        <p>Table containing orders Data</p>
      </div>
    );
  }
}
