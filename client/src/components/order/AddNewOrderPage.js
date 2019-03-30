import React, { Component } from "react";
const smalltalk = require("smalltalk");
const { ipcRenderer } = window.require("electron");
const { items } = require("./fakeOrderData");

export default class AddNewOrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchItemName: "",
      serachedItems: [],
      cartItems: []
    };
  }

  handleClear = e => {
    smalltalk
      .confirm("Clear Cart?", "Are you sure you want to empty your cart?")
      .then(() =>
        this.setState({
          searchItemName: "",
          serachedItems: [],
          cartItems: []
        })
      )
      .catch(() => console.log("nope"));
  };

  handleCancel = e => {
    smalltalk
      .confirm("Close Order?", "Are you sure you want to close this Order?")
      .then(() =>
        ipcRenderer.send("closeNewOrderWindow", "Add new Order cancelled")
      )
      .catch(() => console.log("nope"));
  };

  handleSubmit = e => {
    if (this.state.cartItems.length !== 0) {
      smalltalk
        .confirm(
          "Comfirm Order?",
          "Are you sure you want to submit this Order?"
        )
        .then(() => ipcRenderer.send("submitNewOrder", this.state.cartItems))
        .catch(() => console.log("nope"));
    } else {
      smalltalk
        .alert("Cart Empty!", "Add items to the Cart before submitting.")
        .catch(err => console.log(err));
    }
  };

  handleInputChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });

    // ###
    //
    // query DB to find if item.name with "value"
    //  return results array of [name, price, stockQuantity]

    this.setState({ serachedItems: items });
  };

  handleSearchResultClick = item => {
    this.setState(ps => {
      if (ps.cartItems.includes(item)) {
        smalltalk
          .alert("You stupid?", "Item already in Cart.")
          .catch(err => console.log(err));
        return ps;
      } else {
        item.orderQuantity = 1;
        ps.cartItems.push(item);
        return ps;
      }
    });
  };

  handleClearSearchResults = e => {
    this.setState({ searchItemName: "", serachedItems: [] });
  };

  handleCartItemRemove = index => {
    this.setState(ps => {
      ps.cartItems.splice(index, 1);
      return ps;
    });
  };

  handlePlusQuantity = index => {
    this.setState(ps => {
      if (
        ps.cartItems[index].orderQuantity < ps.cartItems[index].stockQuantity
      ) {
        return ps.cartItems[index].orderQuantity++;
      }
      smalltalk
        .alert(
          "Max limit reached",
          "Cannot add more order quantity as no more items in stock."
        )
        .catch(err => console.log(err));
      return ps;
    });
  };

  handleMinusQuantity = index => {
    this.setState(ps => {
      return ps.cartItems[index].orderQuantity > 1
        ? ps.cartItems[index].orderQuantity--
        : ps;
    });
  };

  render() {
    const listItems = this.state.serachedItems.map((item, index) => (
      <li key={index} onClick={() => this.handleSearchResultClick(item)}>
        {item.name} | Price: {item.price}
      </li>
    ));

    const cartItems = this.state.cartItems.map((cartItem, index) => (
      <div key={index} className="cart-item">
        <span>
          {cartItem.name} | Unit Price: {cartItem.price}
        </span>
        <button onClick={() => this.handleCartItemRemove(index)}>Remove</button>
        <div>
          <span>
            Quantity: {cartItem.orderQuantity} | Total Price:{" "}
            {cartItem.orderQuantity * cartItem.price}
          </span>
          <button onClick={() => this.handlePlusQuantity(index)}>
            + Quantity
          </button>
          <button onClick={() => this.handleMinusQuantity(index)}>
            - Quantity
          </button>
        </div>
        <hr />
      </div>
    ));

    const totalBill =
      this.state.cartItems.length === 0
        ? 0
        : this.state.cartItems.reduce((total, item) => {
            return total + item.orderQuantity * item.price;
          }, 0);

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
              Submit Order
            </button>
            <button name="cancel" onClick={this.handleCancel}>
              Cancel Order
            </button>
            <button name="clear" onClick={this.handleClear}>
              Clear Cart
            </button>
            <div>
              <p>Total Bill: {totalBill}</p>
            </div>
          </div>
          <div className="order-search-results">
            <h4>Search Results.</h4>
            <button onClick={this.handleClearSearchResults}>
              Clear Search Results
            </button>
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
