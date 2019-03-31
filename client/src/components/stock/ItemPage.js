import React from "react";
const { ipcRenderer } = window.require("electron");
const smalltalk = require("smalltalk");

const updateItem = item => {
  console.log("update Item");

  ipcRenderer.send("showUpdateItemWindow", item);
};

const deleteItem = item => {
  console.log("delete Item?", item);
  smalltalk
    .confirm("Delete Item?", "Are you sure you want to delete this Item?")
    .then(() => ipcRenderer.send("deleteItemFromStock", item))
    .catch(() => console.log("nope"));
};

export default function ItemPage({ item }) {
  const {
    name,
    quantityUnit,
    stockQuantity,
    buyingPrice,
    sellingPrice,
    details
  } = item;

  return (
    <div>
      <h1>Item Page</h1>
      <div className="item-page-btns">
        <button onClick={() => updateItem(item)}>Update Item</button>
        <button onClick={() => deleteItem(item)}>Delete Item</button>
      </div>

      <div className="item-details">
        <p>name: {name}</p>
        <p>Quantity Unit: {quantityUnit}</p>
        <p>Stock Quantity: {stockQuantity}</p>
        <p>Buying Price: {buyingPrice}</p>
        <p>Selling Price: {sellingPrice}</p>
        <p>Details: {details}</p>
      </div>
    </div>
  );
}
