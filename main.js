const { app, BrowserWindow, ipcMain } = require("electron");
const PORT = process.env.PORT || "3000";

// BROWSER-WINDOWS //
let mainWindow, addItemWindow, updateItemWindow, addOrderWindow;

// DB client
let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db/db.sqlite"
  },
  useNullAsDefault: true
});

//
// WINDOW CREATION FUNCTIONS  //
//
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });

  mainWindow.loadURL(`http://localhost:${PORT}/`);
  // mainWindow.webContents.openDevTools();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.maximize();
}

function createAddItemWindow() {
  addItemWindow = new BrowserWindow({
    width: 768,
    height: 640,
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow,
    modal: true,
    show: false
  });
  addItemWindow.loadURL(`http://localhost:${PORT}/add-new-supply`);
  // addItemWindow.webContents.openDevTools();
  addItemWindow.once("ready-to-show", () => addItemWindow.show());
  addItemWindow.on("closed", () => (addItemWindow = null));
}

function createUpdateItemWindow(item) {
  updateItemWindow = new BrowserWindow({
    width: 768,
    height: 520,
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow,
    modal: true,
    show: false
  });
  const {
    name,
    quantityUnit,
    stockQuantity,
    buyingPrice,
    sellingPrice,
    details
  } = item;
  const url = `http://localhost:${PORT}/update-item?name=${name}&quantityUnit=${quantityUnit}&stockQuantity=${stockQuantity}&buyingPrice=${buyingPrice}&sellingPrice=${sellingPrice}&details=${details}`;
  updateItemWindow.loadURL(url);
  // updateItemWindow.webContents.openDevTools();
  updateItemWindow.once("ready-to-show", () => updateItemWindow.show());
  updateItemWindow.on("closed", () => (updateItemWindow = null));
}

function createAddOrderWindow() {
  addOrderWindow = new BrowserWindow({
    width: 950,
    height: 750,
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow,
    modal: true,
    show: false
  });
  addOrderWindow.loadURL(`http://localhost:${PORT}/add-new-order`);
  // addOrderWindow.webContents.openDevTools();
  addOrderWindow.once("ready-to-show", () => addOrderWindow.show());
  addOrderWindow.on("closed", () => (addOrderWindow = null));
}

//
//  APP "ON" EVENTS //
//
app.on("ready", createMainWindow);

// app.on("ready", createDemoWindow);  // for demo

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createMainWindow();
});

//
// IPC  //
//

// IPC - adding new items

ipcMain.on("addNewSupply", (e, msg) => {
  console.log(msg);
  createAddItemWindow();
});

ipcMain.on("closeAddItemWindow", (e, msg) => {
  console.log(msg);
  addItemWindow.close();
  addItemWindow = null;
});

ipcMain.on("redirectToUpdateItemWindow", (e, item) => {
  console.log("show update window for: ", item);

  addItemWindow.close();
  addItemWindow = null;

  createUpdateItemWindow(item);
});

ipcMain.on("submitAddItem", (e, item) => {
  const {
    name,
    quantityUnit,
    addQuantity,
    buyingPrice,
    sellingPrice,
    details,
    itemStatus
  } = item;

  knex
    .select()
    .from("items")
    .where({ name })
    .then(data => {
      const itemExistsInStock = data.length > 0;
      if (!itemExistsInStock && itemStatus === "new") {
        // if no such item exists in stock
        knex("items")
          .insert({
            name,
            quantityUnit,
            stockQuantity: addQuantity,
            buyingPrice,
            sellingPrice,
            details
          })
          .then(res => console.log(`added new item: ${name}`))
          .then(() => {
            mainWindow.loadURL(`http://localhost:${PORT}/stocks`);
            addItemWindow.close();
            addItemWindow = null;
          })
          .catch(err => console.log(err));
      } else if (!itemExistsInStock && itemStatus === "old") {
        e.sender.send(
          "error-submitAddItem",
          "Wrong Item Status. Select New button."
        );
      } else if (itemExistsInStock && itemStatus === "new") {
        e.sender.send(
          "error-submitAddItem",
          "Item already exists in Stock. Select Old button."
        );
      } else if (itemExistsInStock && itemStatus === "old") {
        knex
          .select()
          .from("items")
          .where({ name })
          .then(data => {
            const oldQuantity = data[0].stockQuantity;

            knex("items")
              .where({ name })
              .update({
                stockQuantity: parseInt(oldQuantity) + parseInt(addQuantity)
              })
              .then(() => {
                mainWindow.loadURL(`http://localhost:${PORT}/stocks`);
                addItemWindow.close();
                addItemWindow = null;
              });
          });
      }
    })
    .catch(err => console.log(err));
});

ipcMain.on("searchForOldItem", (e, name) => {
  console.log("searching for pre-existing item: ", name);

  knex
    .select()
    .from("items")
    .where({ name })
    .then(data => {
      if (data.length === 0) {
        return e.sender.send("reply-searchForOldItem", null);
      } else {
        console.log(data[0]);
        const searchedItem = ({
          quantityUnit,
          buyingPrice,
          sellingPrice,
          details,
          stockQuantity
        } = data[0]);

        e.sender.send("reply-searchForOldItem", searchedItem);
      }
    });
});

// IPC - updating item

ipcMain.on("getStockItems", (e, msg) => {
  console.log(msg);

  knex
    .select()
    .from("items")
    .then(items => {
      e.sender.send("reply-getStockItems", items);
    });
});

ipcMain.on("showUpdateItemWindow", (e, item) => {
  console.log("show update window for: ", item);
  createUpdateItemWindow(item);
});

ipcMain.on("submitUpdateItem", (e, item) => {
  console.log("submitting add item:", item);

  const {
    name,
    quantityUnit,
    stockQuantity,
    buyingPrice,
    sellingPrice,
    details
  } = item;

  knex("items")
    .where({ name })
    .update({
      quantityUnit,
      stockQuantity,
      buyingPrice,
      sellingPrice,
      details
    })
    .then(() => {
      const url = `http://localhost:${PORT}/itemPage?name=${name}&quantityUnit=${quantityUnit}&stockQuantity=${stockQuantity}&buyingPrice=${buyingPrice}&sellingPrice=${sellingPrice}&details=${details}`;

      mainWindow.loadURL(url);
      updateItemWindow.close();
      updateItemWindow = null;
    });
});

ipcMain.on("closeUpdateItemWindow", (e, args) => {
  console.log(args);

  updateItemWindow.close();
  updateItemWindow = null;
});

// IPC - delete item

ipcMain.on("deleteItemFromStock", (e, item) => {
  console.log("bout to delete this bad boy", item);

  knex("items")
    .where({ name: item.name })
    .del()
    .then(mainWindow.loadURL(`http://localhost:${PORT}/stocks`));
});

// IPC - add Orders

ipcMain.on("getOrders", (e, msg) => {
  console.log(msg);

  knex
    .select()
    .from("orders")
    .then(orders => {
      e.sender.send("reply-getOrders", orders);
    });
});

ipcMain.on("addNewOrder", (e, msg) => {
  console.log(msg);
  createAddOrderWindow();
});

ipcMain.on("closeNewOrderWindow", (e, msg) => {
  console.log(msg);
  addOrderWindow.close();
  addOrderWindow = null;
});

ipcMain.on("searchForOrderItems", (e, itemName) => {
  knex
    .select("name", "sellingPrice", "stockQuantity", "quantityUnit")
    .from("items")
    .where("name", "like", `%${itemName}%`)
    .then(results => {
      e.sender.send("reply-searchForOrderItems", results);
    });
});

ipcMain.on("submitNewOrder", (e, orderedItems) => {
  console.log("create new Order for items: ", orderedItems);

  const totalBill = orderedItems.reduce((total, item) => {
    return total + item.orderQuantity * item.sellingPrice;
  }, 0);

  knex("orders")
    .insert({
      totalBill,
      numberOfItems: orderedItems.length
    })
    .then(id => {
      const currentOrderId = id[0];

      const dbItems = orderedItems.map(item => {
        return {
          name: item.name,
          orderId: currentOrderId,
          orderQuantity: item.orderQuantity,
          quantityUnit: item.quantityUnit,
          sellingPrice: item.sellingPrice
        };
      });

      knex("order_items")
        .insert(dbItems)
        .then(res => {
          orderedItems.forEach(item => {
            knex("items")
              .where("name", item.name)
              .update({
                stockQuantity: item.stockQuantity - item.orderQuantity
              })
              .then(res =>
                console.log(
                  `successfully reduced stock quantity for ${item.name}`
                )
              );
          });
        })
        .then(
          console.log(`Successfully recorded order number ${currentOrderId}.`)
        )
        .catch(err => console.log(err));
    })
    .then(() => {
      mainWindow.loadURL(`http://localhost:${PORT}/orders`);
      addOrderWindow.close();
      addOrderWindow = null;
    })
    .catch(err => console.log(err));
});

ipcMain.on("getOrderItemsOfOrder", (e, orderId) => {
  knex("order_items")
    .select()
    .where("orderId", orderId)
    .then(orderedItems => {
      e.sender.send("reply-getOrderItemsOfOrder", orderedItems);
    })
    .catch(err => console.log(err));
});

ipcMain.on("deleteOrderFromStock", (e, orderId) => {
  console.log("bout to delete this bad boy", orderId);

  knex.raw(`delete from 'orders' where orderId = ${orderId}`).then(val => {
    knex
      .raw(`delete from 'order_items' where orderId = ${orderId}`)
      .then(mainWindow.loadURL(`http://localhost:${PORT}/orders`));
  });
});

// SECONDARY
ipcMain.on("loginSubmit", (e, { username, password }) => {
  // ###
  //
  // query DB to check if loginData.username & loginData.password exists ?
  // return bool
  const isValidUser = true;

  e.sender.send("reply-loginSubmit", { isValidUser: isValidUser, username });
});

ipcMain.on("closeApp", (e, msg) => {
  console.log(msg);
  app.quit();
});
