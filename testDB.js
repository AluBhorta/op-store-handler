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

function queryDb() {
  knex
    .select()
    .from("items")
    .then(data => console.log("items: ", data));
  knex
    .select()
    .from("orders")
    .then(data => console.log("orders: ", data));
  knex
    .select()
    .from("order_items")
    .then(data => console.log("order_items: ", data));
}

// initDb();
queryDb();
