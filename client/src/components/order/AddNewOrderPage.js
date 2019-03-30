import React, { Component } from "react";
const smalltalk = require("smalltalk");
const { ipcRenderer } = window.require("electron");
const { itemNames } = require("./fakeOrderData");

export default class AddNewOrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchItemName: "",
      serachedItems: [],
      cartItemNames: [],
      cartItemQuantities: []
    };
  }

  handleClear = e => {
    this.setState({
      searchItemName: "",
      serachedItems: [],
      cartItemNames: [],
      cartItemQuantities: []
    });
  };

  handleCancel = e => {
    console.log("cancel action; may ask user again...");

    ipcRenderer.send("closeNewOrderWindow", "Add new Order cancelled");
  };

  // ###
  //
  // onsubmit - confirm order, submit to db, generate a pdf recepit
  // onCancel - close window

  handleInputChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });

    // ###
    //
    // query DB to find if items match with "value" & return results array

    this.setState({ serachedItems: itemNames });
  };

  handleSearchResultClick = itemName => {
    let showWarning = false;
    this.setState(ps => {
      if (ps.cartItemNames.includes(itemName)) {
        showWarning = true;
        alert("You stupid? Item already in Cart.");
        return ps;
      } else {
        ps.cartItemNames.push(itemName);
        ps.cartItemQuantities.push(1);
        return ps;
      }
    });
    if (showWarning) {
      smalltalk
        .alert("You stupid?", "Item already in Cart.")
        .then(res => console.log(res))
        .catch(err => console.log(err));
      // ###
      //
      // why doesn't this hit?
    }
  };

  handleCartItemRemove = index => {
    this.setState(ps => {
      ps.cartItemNames.splice(index, 1);
      return ps;
    });
  };

  handlePlusQuantity = index => {
    this.setState(ps => ps.cartItemQuantities[index]++);
  };
  handleMinusQuantity = index => {
    this.setState(ps => {
      return ps.cartItemQuantities[index] > 0
        ? ps.cartItemQuantities[index]--
        : ps;
    });
  };

  render() {
    const listItems = this.state.serachedItems.map((itemName, index) => (
      <li key={index} onClick={() => this.handleSearchResultClick(itemName)}>
        {itemName}
      </li>
    ));

    const cartItems = this.state.cartItemNames.map((cartItem, index) => (
      <div key={index} className="cart-item">
        <span>{cartItem}</span>
        <button onClick={() => this.handleCartItemRemove(index)}>Remove</button>
        <div>
          <span>Quantity: {this.state.cartItemQuantities[index]}</span>
          <button onClick={() => this.handlePlusQuantity(index)}>
            {" "}
            + Quantity{" "}
          </button>
          <button onClick={() => this.handleMinusQuantity(index)}>
            {" "}
            - Quantity{" "}
          </button>
        </div>
        <hr />
      </div>
    ));

    return (
      <div>
        <h1>Add New Order</h1>
        <div className="order-page-container">
          <div className="order-item-search">
            <form>
              <label>Item Name: </label>
              <input
                type="text"
                name="searchItemName"
                placeholder="Enter Item name"
                value={this.state.searchItemName}
                onInput={this.handleInputChange}
                autoFocus
              />
              <br />
            </form>
          </div>
          <div className="order-btns">
            <button name="submit" onClick={this.handleSubmit}>
              Submit
            </button>
            <button name="cancel" onClick={this.handleCancel}>
              Cancel
            </button>
            <button name="clear" onClick={this.handleClear}>
              Clear
            </button>
          </div>
          <div className="order-search-results">
            <h4>Search Results.</h4>
            {this.state.serachedItems.length === 0 ? (
              ""
            ) : (
              <p>Click on an Item to add to Cart.</p>
            )}
            <ul className="order-search-list">{listItems}</ul>
          </div>
          <div className="order-cart-container">
            <h2>Order Cart</h2>
            <div className="order-cart">{cartItems}</div>
          </div>
        </div>
      </div>
    );
  }
}
