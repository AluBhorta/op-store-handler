import React from "react";
const { ipcRenderer } = window.require("electron");
const smalltalk = require("smalltalk");

const deleteItem = orderId => {
  console.log("delete order?", orderId);
  smalltalk
    .confirm("Delete Order?", "Are you sure you want to delete this Order?")
    .then(() => ipcRenderer.send("deleteOrderFromStock", orderId))
    .catch(() => console.log("nope"));
};

export default function OrderHistoryPage({ order }) {
  const { orderId, date, totalBill, numberOfItems, items } = order;

  const orderItems = items.map((item, index) => (
    <tr key={index} className="table-row" id={`tr${index}`}>
      <td className="table-data">{item.name}</td>
      <td className="table-data">{item.quantityUnit}</td>
      <td className="table-data">{item.orderQuantity}</td>
      <td className="table-data">{item.sellingPrice}</td>
    </tr>
  ));

  return (
    <div>
      <div className="container">
        <ul className="collection with-header">
          <li className="collection-item">
            <h4>Order Details</h4>
            <span className="right-align">
              <button
                onClick={() => deleteItem(orderId)}
                className="btn blue waves-effect"
              >
                Delete Order
              </button>
            </span>
          </li>
          <li className="collection-item">Order Id: {orderId}</li>
          <li className="collection-item">Date: {date}</li>
          <li className="collection-item">Total Bill: {totalBill}</li>
          <li className="collection-item">Number of Items: {numberOfItems}</li>
        </ul>
      </div>
      <div>
        <div className="order-history-details center">
          <h4>Items</h4>
          <table className="centered red lighten-4">
            <tbody>
              <tr className="table-headers">
                <th className="table-header center-align">Name</th>
                <th className="table-header center-align">Quantity Unit</th>
                <th className="table-header center-align">Order Quantity</th>
                <th className="table-header center-align">Selling Price</th>
              </tr>
              {orderItems}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
