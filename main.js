const { app, BrowserWindow, ipcMain } = require("electron");
const Item = require("./models/Item");

// BROWSER-WINDOWS //
let mainWindow, win2, additemWindow;

// WINDOW CREATION FUNCTIONS  //
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL("http://localhost:3000/stocks");
  // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => (mainWindow = null));
}

function createAddItemWindow() {
  additemWindow = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow,
    modal: true
  });
  additemWindow.loadURL("http://localhost:3000/add-new-supply");
  additemWindow.webContents.openDevTools();
  additemWindow.on("closed", () => (additemWindow = null));
}

function createWindow2() {
  win2 = new BrowserWindow();
  win2.webContents.openDevTools();
  win2.loadFile(__dirname + "/index.html");
  win2.on("closed", () => (win2 = null));
}

//  APP "ON" EVENTS //
app.on("ready", createMainWindow);
// app.on("ready", createWindow2);  // for demo

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createMainWindow();
});

// IPC
ipcMain.on("ping", (e, args) => {
  console.log("received PING! args: ", args);
  const data = { payload: "very important data." };
  e.sender.send("pong", data);
});

ipcMain.on("addNewSupply", createAddItemWindow);

ipcMain.on("closeAddItemWindow", (e, args) => {
  console.log(args);
  // ask user again with a dialogBox
  additemWindow.close();
  additemWindow = null;
});

ipcMain.on("submitAddItem", (e, itemData) => {
  console.log(itemData);

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
  // save the record to DB

  additemWindow.close();
  additemWindow = null;
});

ipcMain.on("searchForOldItem", (e, name) => {
  console.log(name);

  // ###
  //
  // query DB to check if name exists
  const searchedItem = {
    quantityUnit: "kg",
    buyingPrice: "70",
    sellingPrice: "80",
    details: "A very important item."
  };

  e.sender.send("reply-searchForOldItem", searchedItem);
});
