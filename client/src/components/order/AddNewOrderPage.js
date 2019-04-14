import React, { Component } from "react";
const smalltalk = require("smalltalk");
const { ipcRenderer } = window.require("electron");

export default class AddNewOrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchItemName: "",
      searchedItems: [],
      cartItems: []
    };
  }

  handleClear = e => {
    smalltalk
      .confirm("Clear Cart?", "Are you sure you want to empty your cart?")
      .then(() =>
        this.setState({
          searchItemName: "",
          searchedItems: [],
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
    const { name, value } = e.target;
    this.setState({ [name]: value });

    if (value === "") {
      this.setState({ searchedItems: [] });
    } else {
      ipcRenderer.send("searchForOrderItems", value);

      ipcRenderer.on("reply-searchForOrderItems", (e, searchedItems) => {
        this.setState({ searchedItems });
      });
    }
  };

  handleSearchResultClick = item => {
    this.setState(ps => {
      const matchedCartItems = ps.cartItems.filter(
        cartItem => cartItem.name === item.name
      );
      if (matchedCartItems.length !== 0) {
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
    this.setState({ searchItemName: "", searchedItems: [] });
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
        .alert("Max limit reached", "Cannot add more quantity as out of stock.")
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
    const listItems = this.state.searchedItems.map((item, index) => (
      <li
        className="collection-item"
        key={index}
        onClick={() => this.handleSearchResultClick(item)}
      >
        {item.name} | Price: {item.sellingPrice}
      </li>
    ));

    const cartItems = this.state.cartItems.map((cartItem, index) => (
      <div key={index} className="cart-item collection-item">
        <span>
          <strong>{cartItem.name}</strong> | Unit Price: {cartItem.sellingPrice}{" "}
          | Stock Quantity: {cartItem.stockQuantity}
        </span>
        <button
          className="btn red"
          onClick={() => this.handleCartItemRemove(index)}
        >
          Remove
        </button>
        <div>
          <span>
            Quantity: {cartItem.orderQuantity} | Total Price:{" "}
            {cartItem.orderQuantity * cartItem.sellingPrice}
          </span>
          <button
            className="btn waves-effect blue lighten-1"
            onClick={() => this.handlePlusQuantity(index)}
          >
            + Quantity
          </button>
          <button
            className="btn waves-effect blue lighten-1"
            onClick={() => this.handleMinusQuantity(index)}
          >
            - Quantity
          </button>
        </div>
      </div>
    ));

    const totalBill =
      this.state.cartItems.length === 0
        ? 0
        : this.state.cartItems.reduce((total, item) => {
            return total + item.orderQuantity * item.sellingPrice;
          }, 0);

    return (
      <div>
        <div className="order-page-container container">
          <div className="order-container-1">
            <h4>Add New Order</h4>
            <form>
              <label>Item Name: </label>
              <input
                type="text"
                name="searchItemName"
                placeholder="Enter Item name"
                value={this.state.searchItemName}
                onChange={this.handleInputChange}
                autoFocus
              />
              <br />
            </form>
            <div className="order-item-search">
              <div className="order-search-results ">
                <button
                  onClick={this.handleClearSearchResults}
                  className="btn waves-effect grey "
                >
                  Clear Search Results
                </button>
                <h6 className="">Search Results.</h6>
                {this.state.searchedItems.length === 0 ? (
                  ""
                ) : (
                  <p>Click on an Item to add to Cart.</p>
                )}

                <ul className="order-search-list collection">{listItems}</ul>
              </div>
            </div>
          </div>

          <div className="order-container-2">
            <div className="order-btns">
              <button
                className="btn waves-effect green lighten-1"
                name="submit"
                onClick={this.handleSubmit}
              >
                Submit Order
              </button>
              <button
                className="btn waves-effect red lighten-1"
                name="cancel"
                onClick={this.handleCancel}
              >
                Cancel Order
              </button>
              <button
                className="btn waves-effect grey"
                name="clear"
                onClick={this.handleClear}
              >
                Clear Cart
              </button>
              <div className="card">
                <h6 className="card-content center">Total Bill: {totalBill}</h6>
              </div>
            </div>

            <div className="order-cart-container">
              <h6 className="center-align">Order Cart</h6>
              <ul className="order-cart collection">{cartItems}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
