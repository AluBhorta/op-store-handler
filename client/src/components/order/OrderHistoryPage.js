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
  const { orderId, date, totalBill, items } = order;
  // const orderItems = items.map((item, index) => (
  //   <li key={index}>{item.name}</li>
  // ));

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
          <p>name: {totalBill}</p>
          <div>
            <h3>Items</h3>
            {/* <ul>{orderItems}</ul> */}
          </div>
        </div>
      </div>
    </div>
  );
}
