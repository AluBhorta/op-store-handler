import React from "react";
const { ipcRenderer } = window.require("electron");
const { dialog } = window.require("electron").remote;

const updateItem = item => {
  console.log("update Item");

  ipcRenderer.send("showUpdateItemWindow", item);
};

const deleteItem = item => {
  console.log("delete Item", item);
  const options = {
    type: "question",
    buttons: ["Yes", "No"], // {yes: 0, no:1}
    title: "Delete Item?",
    message: "Are you sure you want to delete this Item?",
    detail: `Pressing Yes will permanently delete ${item.name} stock.`
  };
  dialog.showMessageBox(null, options, res => {
    return res === 0 ? ipcRenderer.send("deleteItemFromStock", item) : null;
  });
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
        <button onClick={() => updateItem(item)}>Update</button>
        <button onClick={() => deleteItem(item)}>Delete</button>
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
