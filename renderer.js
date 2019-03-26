// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require("electron");

const btn = document.getElementById("btn");
const header = document.getElementById("header");

btn.addEventListener("click", () => {
  ipcRenderer.send("ping", "This is a demo.");
});

ipcRenderer.on("pong", (e, args) => {
  console.log("received PONG!");
  console.log(args);

  header.textContent = args;
});
