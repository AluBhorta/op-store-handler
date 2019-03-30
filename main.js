const { app, BrowserWindow, ipcMain } = require("electron");
const Item = require("./models/Item");
const PORT = "3000";

// BROWSER-WINDOWS //
let demoWindow, mainWindow, addItemWindow, updateItemWindow, addOrderWindow;

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

  mainWindow.loadURL(`http://localhost:${PORT}/orders`);
  // mainWindow.webContents.openDevTools();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => (mainWindow = null));
}

function createAddItemWindow() {
  addItemWindow = new BrowserWindow({
    width: 750,
    height: 550,
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
    width: 750,
    height: 550,
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
  addOrderWindow.webContents.openDevTools();
  addOrderWindow.once("ready-to-show", () => addOrderWindow.show());
  addOrderWindow.on("closed", () => (addOrderWindow = null));
}

function createDemoWindow() {
  demoWindow = new BrowserWindow();
  demoWindow.webContents.openDevTools();
  demoWindow.loadFile(__dirname + "/index.html");
  demoWindow.on("closed", () => (demoWindow = null));
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
  //  ###
  //
  // ask user again with a dialogBox
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
  console.log("submitting add item:", item);

  const {
    name,
    quantityUnit,
    addQuantity,
    buyingPrice,
    sellingPrice,
    details,
    itemStatus
  } = item;

  // ###
  //
  //  save item to DB accordingly
  // + let user know results
  if (itemStatus === "old") {
    // if exists addToStockQuantity() in DB
    // else alert user of false data
  } else {
    // itemStatus === "new"
    // check if item with item.name exists
    // exists ? alert user with error : make new item in DB
  }

  mainWindow.loadURL(`http://localhost:${PORT}/stocks`);
  addItemWindow.close();
  addItemWindow = null;
});

ipcMain.on("searchForOldItem", (e, name) => {
  console.log("searching for pre-existing item: ", name);

  // ###
  //
  // query DB to check if name exists
  // return exists ? oldItem : null
  const searchedItem = {
    quantityUnit: "kg",
    stockQuantity: "200",
    buyingPrice: "70",
    sellingPrice: "80",
    details: "A very important item."
  };

  e.sender.send("reply-searchForOldItem", searchedItem);
});

// IPC - updating item

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
  // ###
  //
  // save updated item record to DB
  // + let user know results

  const url = `http://localhost:${PORT}/itemPage?name=${name}&quantityUnit=${quantityUnit}&stockQuantity=${stockQuantity}&buyingPrice=${buyingPrice}&sellingPrice=${sellingPrice}&details=${details}`;
  mainWindow.loadURL(url);

  updateItemWindow.close();
  updateItemWindow = null;
});

ipcMain.on("closeUpdateItemWindow", (e, args) => {
  console.log(args);

  updateItemWindow.close();
  updateItemWindow = null;
});

// IPC - delete item

ipcMain.on("deleteItemFromStock", (e, item) => {
  console.log("bout to delete this bad boy", item);

  // ###
  //
  // match item.fields with DB items'
  // delete item from DB
  // + let user know results

  mainWindow.loadURL(`http://localhost:${PORT}/stocks`);
});

// IPC - add Orders

ipcMain.on("addNewOrder", (e, msg) => {
  console.log(msg);
  createAddOrderWindow();
});

ipcMain.on("closeNewOrderWindow", (e, msg) => {
  console.log(msg);
  addOrderWindow.close();
  addOrderWindow = null;
});
