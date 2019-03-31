import React from "react";

export default function OrderHistoryTable({ orders, handleTableRowClick }) {
  const orderHistoryContents = orders.map((order, index) => (
    <tr
      className="table-row"
      id={`tr${index}`}
      onClick={() => handleTableRowClick(order)}
    >
      <td className="table-data">{order.orderId}</td>
      <td className="table-data">{order.date}</td>
      <td className="table-data">{order.totalBill}</td>
      <td className="table-data">{order.items.length}</td>
    </tr>
  ));
  return (
    <div>
      <h1>Order History Table</h1>
      <table>
        <tr className="table-headers">
          <th className="table-header">Order Id</th>
          <th className="table-header">Date</th>
          <th className="table-header">Total Bill</th>
          <th className="table-header">Number Of Items</th>
        </tr>
        {orderHistoryContents}
      </table>
    </div>
  );
}
