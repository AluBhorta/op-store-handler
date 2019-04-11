let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db/db.sqlite"
  },
  useNullAsDefault: true
});

function initDb() {
  knex.schema
    // create ITEMS table
    .createTable("items", tb => {
      tb.string("name") // insert
        .primary()
        .notNullable();
      tb.string("quantityUnit").notNullable(); // insert
      tb.integer("stockQuantity").notNullable(); // insert
      tb.integer("buyingPrice").notNullable(); // insert
      tb.integer("sellingPrice").notNullable(); // insert
      tb.string("details");
      tb.dateTime("createdAt").defaultTo(knex.fn.now());
    })
    // create ORDERS table
    .createTable("orders", tb => {
      tb.increments("orderId")
        .primary()
        .notNullable();
      tb.dateTime("orderDate")
        .defaultTo(knex.fn.now())
        .notNullable();
      tb.integer("totalBill").notNullable(); // insert
      tb.integer("numberOfItems").notNullable(); // insert
    })
    // create ORDERITEM table
    .createTable("order_items", tb => {
      tb.string("name") // PK-FK
        .primary()
        .notNullable();
      tb.integer("orderId") // PK-FK
        .primary()
        .notNullable();
      tb.string("quantityUnit").notNullable(); // insert
      tb.integer("orderQuantity").notNullable(); // insert
      tb.integer("totalPrice").notNullable(); // insert
    })

    // insert item
    .then(() => {
      return knex("items").insert({
        name: "test",
        quantityUnit: "test",
        stockQuantity: 0,
        buyingPrice: 0,
        sellingPrice: 0,
        details: "test"
      });
    })
    // insert order
    .then(() => {
      return knex("orders").insert({
        totalBill: 0,
        numberOfItems: 0
      });
    })
    // insert order_items
    .then(() => {
      return knex("order_items").insert({
        name: "test",
        orderId: 1,
        quantityUnit: "test",
        orderQuantity: 0,
        totalPrice: 0
      });
    });
}

function searchDb(dbName = "items") {
  console.log(dbName.toUpperCase() + ": ");
  knex
    .select()
    .from(dbName)
    .then(data => console.log(data));
}

function updateItemQuantity(name = "test", addQuantity = 21) {
  knex
    .select("sellingPrice")
    .from("items")
    .where({ name })
    .then(data => {
      return Promise.resolve(data[0].sellingPrice);
    })
    .then(oldQuantity => {
      knex("items")
        .where({ name })
        .update({ sellingPrice: 4201 });
    });
}

function searchItem(name = "test") {
  knex
    .select()
    .from("items")
    .where({ name })
    .then(data => {
      console.log(data);
      return Promise.resolve(data);
    })
    .catch(err => console.log(err));
}

function updateResetStock(name = "test") {
  knex("items")
    .where({ name })
    .update({ stockQuantity: 0 });
}

function deleteItem() {}

//
// MAIN
//

const name = "item3";
const quantityUnit = "tasty";
const stockQuantity = "tasty";
const buyingPrice = "tasty";
const sellingPrice = "tasty";
const details = "tasty";

knex("items")
  .where({ name })
  .update({
    quantityUnit,
    stockQuantity,
    buyingPrice,
    sellingPrice,
    details
  })
  .timeout(300)
  .then(searchDb())
  .catch(err => console.log(err));
