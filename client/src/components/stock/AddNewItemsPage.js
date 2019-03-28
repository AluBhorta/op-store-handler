import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

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
    e.preventDefault()
    console.log("red");
    const {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    } = this.state
    
    ipcRenderer.send("redirectToUpdateItemWindow", {
      name,
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    });
  }

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    type === "checkbox"
      ? this.setState({ [name]: checked })
      : this.setState({ [name]: value });

    if (type === "radio") {
      this.setState({ showCurrentStockQuantity: false, inputIsEditable: true })
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
      return alert("Please enter all item information correctly.");
    }
    ipcRenderer.send("submitAddItem", {
      name,
      quantityUnit,
      addQuantity,
      buyingPrice,
      sellingPrice,
      details,
      itemStatus
    });
  };

  handleCancel = e => {
    e.preventDefault();
    console.log("cancel action; may ask user again...");

    ipcRenderer.send("closeAddItemWindow", "Add new Item Cancelled");
  };
  
  handleClear = e => {
    e.preventDefault();
    
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
            showCurrentStockQuantity: true,
            inputIsEditable: false
          });
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
            <p>
              If the item already exists in Stock select <strong>Old</strong> Otherwise select <strong>New</strong>.
            </p>
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
          {this.state.inputIsEditable ? "" : (
            <p>
              You can only <strong>Add Quantity</strong> to an old Item here. To update this item information, click below.
              <br/>
              <button onClick={this.redirectToUpdateWindow}>Update Old Item</button>
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
              onChange={this.state.inputIsEditable ? this.handleChange : null}
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
          <button name="submit" onClick={this.handleSubmit}>
            Submit
          </button>
          <button name="cancel" onClick={this.handleCancel}>
            Cancel
          </button>
          <button name="clear" onClick={this.handleClear}>
            Clear
          </button>
        </form>
      </div>
    );
  }
}
