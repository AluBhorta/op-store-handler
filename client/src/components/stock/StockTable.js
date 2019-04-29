import React from "react";

export default function StockTable({ stockItems, handleTableRowClick }) {
  const stockContents = stockItems.map((item, index) => (
    <tr
      key={index}
      className="table-row"
      id={`tr${index}`}
      onClick={() => handleTableRowClick(item)}
    >
      <td className="table-data">{item.name}</td>
      <td className="table-data">{item.quantityUnit}</td>
      <td className="table-data">{item.stockQuantity}</td>
      <td className="table-data">{item.buyingPrice}</td>
      <td className="table-data">{item.sellingPrice}</td>
    </tr>
  ));

  return (
    <div>
      <h4 className="center">Stock Table</h4>
      <div className="container table-container">
        <table className="centered red lighten-4">
          <tbody>
            <tr className="table-headers">
              <th className="table-header center-align">Name</th>
              <th className="table-header center-align">Quantity Unit</th>
              <th className="table-header center-align">Stock Quantity</th>
              <th className="table-header center-align">Buying Price</th>
              <th className="table-header center-align">Selling Price</th>
            </tr>
            {stockContents}
          </tbody>
        </table>
      </div>
    </div>
  );
}
