import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");
const smalltalk = require("smalltalk");

export default class AddNewItemsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantityUnit: "",
      addQuantity: "",
      buyingPrice: "",
      sellingPrice: "",
      details: "",
      itemStatus: "new",
      showCurrentStockQuantity: false,
      stockQuantity: "",
      inputIsEditable: true
    };
  }

  redirectToUpdateWindow = e => {
    e.preventDefault();
    console.log("red");
    const {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    } = this.state;

    ipcRenderer.send("redirectToUpdateItemWindow", {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    });
  };

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    type === "checkbox"
      ? this.setState({ [name]: checked })
      : this.setState({ [name]: value });

    if (type === "radio") {
      this.setState({ showCurrentStockQuantity: false, inputIsEditable: true });
    }
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
      details,
      itemStatus
    } = this.state;

    if (
      name === "" ||
      quantityUnit === "" ||
      addQuantity === "" ||
      buyingPrice === "" ||
      sellingPrice === ""
    ) {
      return smalltalk
        .alert(
          "Missing information",
          "Please enter all item information correctly."
        )
        .catch(err => console.log(err));
    }

    smalltalk
      .confirm("Confirm New Item", "Are you sure you save this Item?")
      .then(() =>
        ipcRenderer.send("submitAddItem", {
          name,
          quantityUnit,
          addQuantity,
          buyingPrice,
          sellingPrice,
          details,
          itemStatus
        })
      )
      .catch(() => console.log("nope"));

    ipcRenderer.on("error-submitAddItem", (e, msg) => {
      smalltalk.alert("Submission Error!", msg).catch(err => console.log(err));
    });
  };

  handleCancel = e => {
    e.preventDefault();
    smalltalk
      .confirm("Confirm Cancel", "Are you sure you discard changes?")
      .then(() =>
        ipcRenderer.send("closeAddItemWindow", "Add new Item Cancelled")
      )
      .catch(() => console.log("nope"));
  };

  handleClear = e => {
    e.preventDefault();

    smalltalk
      .confirm(
        "Confirm Clear",
        "Are you sure you want to clear entered information?"
      )
      .then(() =>
        this.setState({
          name: "",
          quantityUnit: "",
          addQuantity: "",
          buyingPrice: "",
          sellingPrice: "",
          details: "",
          itemStatus: "new",
          showCurrentStockQuantity: false,
          stockQuantity: "",
          inputIsEditable: true
        })
      )
      .catch(() => console.log("nope"));
  };

  handleSearchItem = e => {
    e.preventDefault();

    const { name } = this.state;
    if (name !== "") {
      ipcRenderer.send("searchForOldItem", name);

      ipcRenderer.on("reply-searchForOldItem", (e, res) => {
        if (res === null) {
          smalltalk
            .alert("Incorrect Item Name", `No such item found.`)
            .catch(err => console.log(err));
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
            showCurrentStockQuantity: true,
            inputIsEditable: false
          });
        }
      });
    } else {
      // smalltalk
      //   .alert("Invalid name", `Please enter a valid name!`)
      //   .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <div className="container">
        <form>
          <h5>Add Items Form</h5>
          <div className="form-radio-btns">
            <p>
              If the Item already exists in Stock, select <strong>Old</strong>.
              <br />
              If it is a new Item select <strong>New</strong>.
            </p>
            <p>
              <label>
                <input
                  type="radio"
                  name="itemStatus"
                  value="new"
                  onChange={this.handleChange}
                  checked={this.state.itemStatus === "new"}
                />{" "}
                <span>New</span>
              </label>
            </p>
            <p>
              <label>
                <input
                  type="radio"
                  name="itemStatus"
                  value="old"
                  onChange={this.handleChange}
                  checked={this.state.itemStatus === "old"}
                />{" "}
                <span>Old</span>
              </label>
            </p>
          </div>
          {this.state.inputIsEditable ? (
            ""
          ) : (
            <p>
              You can only <strong>Add Quantity</strong> to an old Item here. To
              update this item information, click below.
              <br />
              <button
                className="btn waves-effect blue lighten-1"
                onClick={this.redirectToUpdateWindow}
              >
                Update Old Item
              </button>
            </p>
          )}
          <br />

          <div className="form-item-info">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Item Name"
              value={this.state.name}
              onChange={this.state.inputIsEditable ? this.handleChange : null}
            />
            {this.state.itemStatus === "old" ? (
              <button
                className="btn waves-effect blue lighten-1"
                onClick={this.handleSearchItem}
              >
                Search for Item
              </button>
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
              onChange={this.state.inputIsEditable ? this.handleChange : null}
            />
            <br />
            <label>Add Quantity (to Stock): </label>
            <input
              type="text"
              name="addQuantity"
              placeholder="Enter the Quantity to be added to Stock"
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
              onChange={this.state.inputIsEditable ? this.handleChange : null}
            />
            <br />
            <label>Selling Price: </label>
            <input
              type="text"
              name="sellingPrice"
              placeholder="Enter the Selling price (you can change it later)"
              value={this.state.sellingPrice}
              onChange={this.state.inputIsEditable ? this.handleChange : null}
            />
            <br />
            <label>Details: </label>
            <textarea
              name="details"
              placeholder="Enter Item details (Optional)"
              value={this.state.details}
              onChange={this.state.inputIsEditable ? this.handleChange : null}
            />
            <br />
            <br />
          </div>
          <div className="form-btn">
            <button
              className="btn waves-effect green"
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
            <button
              className="btn waves-effect grey"
              name="clear"
              onClick={this.handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  }
}
