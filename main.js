const { app, BrowserWindow, ipcMain } = require("electron");
const Item = require("./models/Item");
const PORT = "3000";

// BROWSER-WINDOWS //
let mainWindow, demoWindow, addItemWindow, updateItemWindow;

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

  mainWindow.loadURL(`http://localhost:${PORT}/stocks`);
  mainWindow.webContents.openDevTools();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => (mainWindow = null));
}

function createAddItemWindow() {
  addItemWindow = new BrowserWindow({
    width: 650,
    height: 450,
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
    width: 650,
    height: 450,
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

function createWindow2() {
  demoWindow = new BrowserWindow();
  demoWindow.webContents.openDevTools();
  demoWindow.loadFile(__dirname + "/index.html");
  demoWindow.on("closed", () => (demoWindow = null));
}

//
//  APP "ON" EVENTS //
//
app.on("ready", createMainWindow);

// app.on("ready", createWindow2);  // for demo

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createMainWindow();
});

//
// IPC  //
//

// adding new items
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

ipcMain.on("submitAddItem", (e, itemData) => {
  console.log("submitting add item:", itemData);

  const {
    name,
    quantityUnit,
    addQuantity,
    buyingPrice,
    sellingPrice,
    details
  } = itemData;

  // ###
  //
  // save the record to DB
  // + let user know results
  // + reload stock table accordingly

  addItemWindow.close();
  addItemWindow = null;
});

ipcMain.on("searchForOldItem", (e, name) => {
  console.log("searching for pre-existing item: ", name);

  // ###
  //
  // query DB to check if name exists
  // + return searched item
  const searchedItem = {
    quantityUnit: "kg",
    stockQuantity: "200",
    buyingPrice: "70",
    sellingPrice: "80",
    details: "A very important item."
  };

  e.sender.send("reply-searchForOldItem", searchedItem);
});

// updating item
ipcMain.on("showUpdateItemWindow", (e, item) => {
  console.log("show update window for: ", item);
  createUpdateItemWindow(item);
});

ipcMain.on("submitUpdateItem", (e, itemData) => {
  console.log("submitting add item:", itemData);

  const {
    name,
    quantityUnit,
    stockQuantity,
    buyingPrice,
    sellingPrice,
    details
  } = itemData;
  // ###
  //
  // save updated item record to DB
  // + let user know results
  // + reload ItemPage with data from DB

  // e.sender.send(
  //   "itemUpdated",
  //   "item updated, update ItemPage accordingly"
  // );

  updateItemWindow.close();
  updateItemWindow = null;
});

ipcMain.on("closeUpdateItemWindow", (e, args) => {
  console.log(args);

  updateItemWindow.close();
  updateItemWindow = null;
});

// delete item
ipcMain.on("deleteItemFromStock", (e, item) => {
  console.log("bout to delete this bad boy", item);

  // ###
  //
  // delete item from DB
  // + let user know results
  // + redirect user to stock table
});
