import React, { Component } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Dashoard from "./components/Dashoard";
import Stocks from "./components/Stocks";
import Orders from "./components/Orders";
import Navigation from "./components/Navigation";
import AddNewItemsPage from "./components/stock/AddNewItemsPage";
import ItemPage from "./components/stock/ItemPage";
import UpdateItemPage from "./components/stock/UpdateItemPage";
import ErrorComponent from "./components/ErrorComponent";
import qs from "qs";
import AddNewOrderPage from "./components/order/AddNewOrderPage";
import OrderHistoryPage from "./components/order/OrderHistoryPage";

// const { ipcRenderer } = window.require("electron");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <h2>App</h2>

        <Router>
          <div>
            {/* nav-links */}
            <Navigation />

            {/* routes */}
            <Switch>
              <Route exact path="/" component={Dashoard} />
              <Route path="/stocks" component={Stocks} />
              <Route path="/orders" component={Orders} />
              <Route path="/add-new-supply" component={AddNewItemsPage} />
              <Route
                path="/update-item"
                component={({ location }) => {
                  const item = qs.parse(location.search, {
                    ignoreQueryPrefix: true
                  });
                  return <UpdateItemPage item={item} />;
                }}
              />
              <Route
                path="/itemPage"
                component={({ location }) => {
                  const item = qs.parse(location.search, {
                    ignoreQueryPrefix: true
                  });
                  return <ItemPage item={item} />;
                }}
              />

              <Route path="/add-new-order" component={AddNewOrderPage} />
              <Route
                path="/orderHistoryPage"
                component={({ location }) => {
                  const order = qs.parse(location.search, {
                    ignoreQueryPrefix: true
                  });
                  order.items = JSON.parse(order.items);

                  return <OrderHistoryPage order={order} />;
                }}
              />
              <Route component={ErrorComponent} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
