import React from "react";
const { ipcRenderer } = window.require("electron");
const smalltalk = require("smalltalk");

const deleteItem = order => {
  console.log("delete order?", order);
  smalltalk
    .confirm("Delete Order?", "Are you sure you want to delete this Order?")
    .then(() => ipcRenderer.send("deleteOrderFromStock", order))
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
      <div>
        <h1>Order History Page</h1>
        <div className="order-history-page-btns">
          <button onClick={() => deleteItem(order)}>Delete Order</button>
        </div>

        <div className="order-history-details">
          <p>Order Id: {orderId}</p>
          <p>Date: {date}</p>
          <p>Total Bill: {totalBill}</p>
          <p>Number of Items: {numberOfItems}</p>

          <div>
            <h3>Items</h3>
            <table>
              <tbody>
                <tr className="table-headers">
                  <th className="table-header">Name</th>
                  <th className="table-header">Quantity Unit</th>
                  <th className="table-header">Order Quantity</th>
                  <th className="table-header">Selling Price</th>
                </tr>
                {orderItems}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
