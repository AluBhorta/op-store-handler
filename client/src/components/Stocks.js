import React, { Component } from "react";
import StockTable from "./stock/StockTable";
const { ipcRenderer } = window.require("electron");

export default class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockItems: [],
      history: props.history
    };
  }

  componentDidMount = () => {
    ipcRenderer.send("getStockItems", "retrieve stock items from db");

    ipcRenderer.on("reply-getStockItems", (e, data) => {
      this.setState({ stockItems: data });
    });
  };

  addNewSupply = () => {
    console.log("Open form to add new supply");
    ipcRenderer.send("addNewSupply", "open add item window");
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
        <h1>Stocks</h1>
        <button onClick={this.addNewSupply}>Add Item Suppy</button>
        <StockTable
          stockItems={this.state.stockItems}
          handleTableRowClick={this.handleTableRowClick}
        />
      </div>
    );
  }
}
