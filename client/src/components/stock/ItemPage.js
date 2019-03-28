import React from "react";
const { ipcRenderer } = window.require("electron");

const updateItem = item => {
  console.log("update Item");

  ipcRenderer.send("showUpdateItemWindow", item);
};

const deleteItem = item => {
  console.log("delete Item", item);
  // ###
  //
  // show confirm dialog

  ipcRenderer.send("deleteItemFromStock", item); // could just send item.name
};

export default function ItemPage({ item }, val) {
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
