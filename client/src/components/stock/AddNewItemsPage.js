import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

export default class AddNewItemsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemStatus: "new",
      name: "",
      quantityUnit: "",
      addQuantity: "",
      buyingPrice: "",
      sellingPrice: "",
      details: "",
      showCurrentStockQuantity: false,
      stockQuantity: ""
    };
  }

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    type === "checkbox"
      ? this.setState({ [name]: checked })
      : this.setState({ [name]: value });

    if (type === "radio") this.setState({ showCurrentStockQuantity: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("submitted");
    const {
      name,
      quantityUnit,
      addQuantity,
      buyingPrice,
      sellingPrice,
      details
    } = this.state;

    if (
      name === "" ||
      quantityUnit === "" ||
      addQuantity === "" ||
      buyingPrice === "" ||
      sellingPrice === ""
    ) {
      return alert("Please enter all item information correctly.");
    }
    ipcRenderer.send("submitAddItem", {
      name,
      quantityUnit,
      addQuantity,
      buyingPrice,
      sellingPrice,
      details
    });
  };

  handleCancel = e => {
    e.preventDefault();
    console.log("cancel action; may ask user again...");

    ipcRenderer.send("closeAddItemWindow", "Add new Item Cancelled");
  };

  handleSearchItem = e => {
    e.preventDefault();

    const { name } = this.state;
    if (name !== "") {
      ipcRenderer.send("searchForOldItem", name);

      ipcRenderer.on("reply-searchForOldItem", (e, res) => {
        if (res === null) {
          alert(`No item named ${name} found.`);
        } else {
          const {
            quantityUnit,
            buyingPrice,
            sellingPrice,
            details,
            stockQuantity
          } = res;

          this.setState({
            quantityUnit,
            stockQuantity,
            buyingPrice,
            sellingPrice,
            details,
            showCurrentStockQuantity: true
          });

          // ###
          //
          // make the input boxes read only after updating oldItem info
        }
      });
    } else {
      window.alert("Please enter a valid name!");
    }
  };

  render() {
    return (
      <div>
        <h1>Add Items Form</h1>
        <form>
          <div className="form-radio-btns">
            <label>
              <input
                type="radio"
                name="itemStatus"
                value="new"
                onChange={this.handleChange}
                checked={this.state.itemStatus === "new"}
              />{" "}
              New
            </label>
            <label>
              <input
                type="radio"
                name="itemStatus"
                value="old"
                onChange={this.handleChange}
                checked={this.state.itemStatus === "old"}
              />{" "}
              Old
            </label>
          </div>
          <br />

          <div className="form-item-info">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Item Name"
              value={this.state.name}
              onChange={this.handleChange}
            />
            {this.state.itemStatus === "old" ? (
              <button onClick={this.handleSearchItem}>Search for Item</button>
            ) : (
              ""
            )}
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
            <label>Add Quantity: </label>
            <input
              type="text"
              name="addQuantity"
              placeholder="Enter the Quantity to be added"
              value={this.state.addQuantity}
              onChange={this.handleChange}
            />
            <br />
            {this.state.showCurrentStockQuantity ? (
              <div>
                <label>Stock Quantity: </label>
                <input
                  type="text"
                  name="stockQuantity"
                  placeholder="Current Stock Quantity"
                  value={this.state.stockQuantity}
                  readOnly
                />
              </div>
            ) : (
              ""
            )}
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
