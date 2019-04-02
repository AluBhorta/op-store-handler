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
      <td className="table-data">{item.details}</td>
    </tr>
  ));

  return (
    <div>
      <h1>Stock Table</h1>
      <div>
        <table>
          <tbody>
            {/* 
            ### 
            
            Fix error in console regarding th, tr, table,...
          */}
            <tr className="table-headers">
              <th className="table-header">Name</th>
              <th className="table-header">Quantity Unit</th>
              <th className="table-header">Stock Quantity</th>
              <th className="table-header">Buying Price</th>
              <th className="table-header">Selling Price</th>
              <th className="table-header">Details</th>
            </tr>
            {stockContents}
          </tbody>
        </table>
      </div>
    </div>
  );
}
