import React, { Component } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
// const { ipcRenderer } = window.require("electron");

const barData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  datasets: [
    {
      label: "Revenue generated in Hundred Thousand Taka(s)",
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(125, 29, 132, 0.6)",
        "rgba(255, 69, 122, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(245, 216, 26, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(113, 122, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(155, 91, 232, 0.6)"
      ],
      borderColor: "rgb(255, 99, 132)",
      data: [23, 20, 30, 45, 12, 32, 43, 31, 21, 12, 17, 24]
    }
  ],
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    title: {
      display: false,
      text: "Montly Sales",
      fontSize: 25
    }
  }
};
const pieData = {
  labels: ["Item A", "Item B", "Item C", "Item D", "Item E", "Item F"],
  datasets: [
    {
      data: [5, 8, 9, 13, 17, 21],
      label: "Revenue Generated in Hundred Thousand Taka(s)",
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)"
      ]
      // borderColor: "rgb(255, 99, 132)",
    }
  ],
  options: {
    title: {
      display: false,
      text: "Pie Chart Title"
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
};

const lineData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      data: [21, 13, 17, 28, 25, 34, 27],
      label: "Revenue Generated in Thousand Taka(s)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)"
    }
  ],
  options: {
    title: {
      display: false,
      text: "Pie Chart Title"
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
};

export default class Dashoard extends Component {
  render() {
    return (
      <div className="dashboard container">
        <h4 className="center-align">Dashoard</h4>
        <p className="center">
          The data shown here is only for demonstration purposes
        </p>
        <div className="dashboard-wrapper">
          <div className="dashboard-wrapper-left ">
            <div className="card">
              <div className="card-content">
                <h5 className="center-align">Number of Items in Stock</h5>
                <p className="center-align" style={{ fontSize: "20px" }}>
                  {420}
                </p>
              </div>
            </div>
            <div>
              <div className="card">
                <div className="card-content">
                  <h5 className="center-align">
                    Items with Limited Stock Quantity
                  </h5>
                  <table className="centered red lighten-4">
                    <tbody>
                      <tr>
                        <th className="center-align">Item Name</th>
                        <th className="center-align">Stock Quantity</th>
                      </tr>
                      {/* insert rows here */}

                      <tr>
                        <td class="center-align">Item 1</td>
                        <td class="center-align">12</td>
                      </tr>
                      <tr>
                        <td class="center-align">Item 2</td>
                        <td class="center-align">22</td>
                      </tr>
                      <tr>
                        <td class="center-align">Item 3</td>
                        <td class="center-align">32</td>
                      </tr>
                      <tr>
                        <td class="center-align">Item 4</td>
                        <td class="center-align">42</td>
                      </tr>
                      <tr>
                        <td class="center-align">Item 5</td>
                        <td class="center-align">52</td>
                      </tr>

                      {/*  */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="dash-chart-2 card-content">
                <h5 className="center">Weekly Sales</h5>
                <Line data={lineData} />
              </div>
            </div>
          </div>
          <div className="dashboard-wrapper-right">
            <div className="dash-chart-1">
              <h5 className="center">Montly Sales</h5>
              <Bar data={barData} />
            </div>
            <hr />

            <div className="dash-chart-3">
              <h5 className="center">
                Most Profitable Items in the last 12 months
              </h5>
              <p className="center">
                Revenue Generated in Hundred Thousand Taka(s)
              </p>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
