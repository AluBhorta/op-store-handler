import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

export default class UpdateItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantityUnit: "",
      stockQuantity: "",
      buyingPrice: "",
      sellingPrice: "",
      details: ""
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("updated data submitted");
    const {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    } = this.state;

    if (
      name === "" ||
      quantityUnit === "" ||
      stockQuantity === "" ||
      buyingPrice === "" ||
      sellingPrice === ""
    ) {
      return alert("Please enter all item information correctly.");
    }
    ipcRenderer.send("submitUpdateItem", {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    });
  };

  handleCancel = e => {
    e.preventDefault();
    console.log("cancel action; may ask user again...");

    ipcRenderer.send("closeUpdateItemWindow", "Add new Item Cancelled");
  };

  render() {
    return (
      <div>
        <h1>Update Item Form</h1>
        <form>
          <div className="form-item-info">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Item Name"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <br />

            <label>Quantity Unit: </label>
            <input
              type="text"
              name="quantityUnit"
              placeholder="Enter The Quantity Unit (e.g. Kg/litre/pound/...)"
              value={this.state.quantityUnit}
              onChange={this.handleChange}
            />
            <br />

            <label>Stock Quantity: </label>
            <input
              type="text"
              name="stockQuantity"
              placeholder="Current Stock Quantity"
              value={this.state.stockQuantity}
              onChange={this.handleChange}
            />
            <br />

            <label>Buying Price: </label>
            <input
              type="text"
              name="buyingPrice"
              placeholder="Enter the Buying Price"
              value={this.state.buyingPrice}
              onChange={this.handleChange}
            />
            <br />

            <label>Selling Price: </label>
            <input
              type="text"
              name="sellingPrice"
              placeholder="Enter the Selling price (you can change it later)"
              value={this.state.sellingPrice}
              onChange={this.handleChange}
            />
            <br />

            <label>Details: </label>
            <textarea
              name="details"
              placeholder="Enter Item details (Optional)"
              value={this.state.details}
              onChange={this.handleChange}
            />
            <br />
            <br />
          </div>
          <button name="submit" onClick={this.handleSubmit}>
            Submit
          </button>
          <button name="cancel" onClick={this.handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    );
  }
}
