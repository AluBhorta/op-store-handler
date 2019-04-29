import React from "react";

export default function OrderHistoryTable({ orders, handleTableRowClick }) {
  const orderHistoryContents = orders.map((order, index) => (
    <tr
      key={index}
      className="table-row"
      id={`tr${index}`}
      onClick={() => handleTableRowClick(order)}
    >
      <td className="table-data">{order.orderId}</td>
      <td className="table-data">{order.orderDate}</td>
      <td className="table-data">{order.totalBill}</td>
      <td className="table-data">{order.numberOfItems}</td>
    </tr>
  ));
  return (
    <div>
      <h4 className="center">Order History Table</h4>
      <div className="container table-container">
        <table className="centered red lighten-4">
          <tbody>
            <tr className="table-headers">
              <th className="table-header center-align">Order Id</th>
              <th className="table-header center-align">Date</th>
              <th className="table-header center-align">Total Bill</th>
              <th className="table-header center-align">Number Of Items</th>
            </tr>
            {orderHistoryContents}
          </tbody>
        </table>
      </div>
    </div>
  );
}
