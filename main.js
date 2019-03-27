const { app, BrowserWindow, ipcMain } = require("electron");
const Item = require("./models/Item");

// BROWSER-WINDOWS //
let mainWindow, demoWindow, additemWindow;

//
// WINDOW CREATION FUNCTIONS  //
//
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL("http://localhost:3000/stocks");
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => (mainWindow = null));
}

function createAddItemWindow() {
  additemWindow = new BrowserWindow({
    width: 650,
    height: 450,
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow,
    modal: true
  });
  additemWindow.loadURL("http://localhost:3000/add-new-supply");
  // additemWindow.webContents.openDevTools();
  additemWindow.on("closed", () => (additemWindow = null));
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

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createMainWindow();
});

//
// IPC  //
//

ipcMain.on("addNewSupply", (e, msg) => {
  console.log(msg);
  createAddItemWindow();
});

ipcMain.on("closeAddItemWindow", (e, msg) => {
  console.log(msg);
  //  ###
  //
  // ask user again with a dialogBox
  additemWindow.close();
  additemWindow = null;
});

ipcMain.on("submitAddItem", (e, itemData) => {
  console.log("submitting add item:", itemData);

  const NewItem = new Item(
    itemData.name,
    itemData.quantityUnit,
    itemData.quantity,
    itemData.buyingPrice,
    itemData.sellingPrice,
    itemData.details
  );
  console.log(NewItem);
  // ###
  //
  // save the record to DB + let user know results

  // + update stock table accordingly
  // e.sender.send(
  //   "itemAddedToDB",
  //   "new item added to DB, update stock table accordingly"
  // );

  additemWindow.close();
  additemWindow = null;
});

ipcMain.on("searchForOldItem", (e, name) => {
  console.log("searching for pre-existing item: ", name);

  // ###
  //
  // query DB to check if name exists
  const searchedItem = {
    quantityUnit: "kg",
    stockQuantity: "200",
    buyingPrice: "70",
    sellingPrice: "80",
    details: "A very important item."
  };

  e.sender.send("reply-searchForOldItem", searchedItem);
});
