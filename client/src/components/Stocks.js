import React, { Component } from "react";
import StockTable from "./stock/StockTable";
const { ipcRenderer } = window.require("electron");
const data = require("./stock/fakeStockData");

export default class Stocks extends Component {
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

    this.setState({ stockItems: data }); // fakeData
  };

  addNewSupply = () => {
    console.log("Open form to add new supply");
    ipcRenderer.send("addNewSupply", "open add item window");

    // ###
    //
    // reload StockTable
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
