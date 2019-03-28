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
    // update state.stockItems via API call

    this.setState({ stockItems: data }); // fakeData
  };

  addNewSupply = () => {
    console.log("Open form to add new supply");
    ipcRenderer.send("addNewSupply", "open add item window");

    // ###
    //
    // reload StockTable
    // ?via ipcRenderer.on("itemAddedToDB", (e, args) => console.log(args));
  };

  handleTableRowClick = item => {
    // console.log(item);
    // ###
    //
    // redirect ROUTE to ItemPage according to item -> figure out
    // ? this.state.history.push("/dashboard");
  };

  render() {
    return (
      <div>
        <h1>Stocks</h1>
        <button onClick={this.addNewSupply}>Add New Suppy (Items)</button>
        <StockTable
          stockItems={this.state.stockItems}
          handleTableRowClick={this.handleTableRowClick}
        />
      </div>
    );
  }
}
