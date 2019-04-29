import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");
const smalltalk = require("smalltalk");

export default class UpdateItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = props.item;
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
      sellingPrice
    } = this.state;

    if (
      name === "" ||
      quantityUnit === "" ||
      stockQuantity === "" ||
      buyingPrice === "" ||
      sellingPrice === ""
    ) {
      return smalltalk
        .alert(
          "Invalid Fields!",
          "Please enter all required item information before sumbission."
        )
        .catch(err => console.log(err));
    }
    smalltalk
      .confirm("Update Item", "Are you sure you want to update this item?")
      .then(() => ipcRenderer.send("submitUpdateItem", this.state))
      .catch(() => console.log("nope"));
  };

  handleCancel = e => {
    e.preventDefault();
    smalltalk
      .confirm("Confirm Cancel", "Are you sure you discard changes?")
      .then(() =>
        ipcRenderer.send("closeUpdateItemWindow", "Add new Item Cancelled")
      )
      .catch(() => console.log("nope"));
  };

  render() {
    return (
      <div className="container">
        <h2>Update Item Form</h2>
        <form>
          <div className="form-item-info">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Item Name"
              value={this.state.name}
              readOnly
            />
            <span> Item name cannot be changed.</span>
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
            <span>
              {" "}
              It is recommended not to change the Stock Quantity here.
            </span>
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
          <button
            className="btn waves-effect green lighten-1"
            name="submit"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn waves-effect red"
            name="cancel"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
}
