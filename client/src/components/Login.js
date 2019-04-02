import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

export default class Login extends Component {
  state = {
    username: "admin",
    password: "admin"
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    // ###
    //
    // hash password if needed
    ipcRenderer.send("loginSubmit", this.state);
    ipcRenderer.on("reply-loginSubmit", (e, { isValidUser, username }) => {
      this.props.validateUser(isValidUser, username);
    });
  };
  handleClose = e => {
    e.preventDefault();
    ipcRenderer.send("closeApp", "close app from login");
  };

  render() {
    return (
      <div className="login">
        <h1>Login</h1>
        <form>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <br />
          <label>Password: </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your user password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <br />
          <button onClick={this.handleSubmit}>Submit</button>
          <button onClick={this.handleClose}>Close</button>
        </form>
      </div>
    );
  }
}
