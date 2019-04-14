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
    <div className="container">
      <div className="item-details ">
        <ul className="collection with-header">
          <li className="collection-item">
            <h4>Item Page</h4>
            <div className="item-page-btns">
              <button
                className="btn blue waves-effect"
                onClick={() => updateItem(item)}
              >
                Update Item
              </button>
              <button
                className="btn blue waves-effect"
                onClick={() => deleteItem(item)}
              >
                Delete Item
              </button>
            </div>
          </li>
          <li className="collection-item">Name: {name}</li>
          <li className="collection-item">Quantity Unit: {quantityUnit}</li>
          <li className="collection-item">Stock Quantity: {stockQuantity}</li>
          <li className="collection-item">Buying Price: {buyingPrice}</li>
          <li className="collection-item">Selling Price: {sellingPrice}</li>
          <li className="collection-item">
            Details: {details ? details : " - "}
          </li>
        </ul>
      </div>
    </div>
  );
}
