import React, { Component } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Dashoard from "./components/Dashoard";
import Stocks from "./components/Stocks";
import Orders from "./components/Orders";
import Navigation from "./components/Navigation";
import AddNewItemsPage from "./components/stock/AddNewItemsPage";
import ItemPage from "./components/stock/ItemPage";
import UpdateItemPage from "./components/stock/UpdateItemPage";
const data = require("./components/stock/fakeStockData");
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
                  console.log(location.search);
                  // ###
                  //
                  // pass on the url params to <UpdateItemPage /> as props

                  return <UpdateItemPage />;
                }}
              />
              {/*
               //  ###
               //  
               //  ItemPage to be loaded onClick of stockTable row instead of sample from fakeStockData 
              */}
              <Route
                path="/itemPage"
                component={() => <ItemPage item={data[2]} />}
              />

              {/*               
              // ###
              // 
              // for no match render error 400~... bad request
              */}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
