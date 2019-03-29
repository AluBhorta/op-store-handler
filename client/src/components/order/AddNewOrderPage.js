import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

export default class AddNewOrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>Add New Order</h1>
        <form>
          <div>
            <input placeholder="name" />
          </div>
          <div>
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
        </form>
      </div>
    );
  }
}
