# OP Store Handler

A desktop store management system built on electronJS and ReactJS.

## Dependencies/Stack

front end: react, sass, bootstrap?/w3?
backend: electronJS,
db: mysql/sqlite3/PostgreSQL

## Features

- Stock mgmt system (CRUD ITEMs)

  
  - add new supply i.e. ITEM(s) (set of ITEMs, existing or new)
  - read/search ITEMs using (name / price range / quantity range) //~category
  - update an ITEM details (selling price / buying price / name / details)
  - delete ITEM(s)

- Sales mgmt system (CRUD ORDERs) - don't show buying price on order window

  - initiate an order
  - READ/check order history
  - edit order history
  - delete order history

- ~query database using lazy loading (e.g. returning 1st/2nd/... 20 results instead of all of it)
- ~borrower/debtor and lender/creditor mgmt
- ~store Analytics
- ~sort ITEMs by category (hardware, sanitary, electronic, ...)
- delete item(s) with 0 stockQuantity or allow user to decide whether to keep it


### models/tables

- ITEM
  - itemId
	- itemName
  - quantityUnit (e.g. piece/kg/litre/metre/foot/inch/...other)
	- stockQuantity (e.g. 0-10^8 units)
  - buyingPricePerUnit (e.g. 80tk per kg/Ltr/foot/...)
  - sellingPricePerUnit (e.g. 85tk per kg/Ltr/foot/...)
  - ~itemImage
  - ~itemDetails
  - ~itemCompany

- ORDER

	- orderId
	- dateTime
	- totalBill

- OrderItem

	- orderId
	- itemId
	- quantityUnit (e.g. drop down box with all SI units + other for custom units)
	- orderQuantity
  - price (unitPrice * orderQuantity)

- ~supply()
- ~supplier()
- ~user() -> for auth

### Pages && ACTIVITY LIST

<!-- HOME -->
- Dashboard

<!-- STOCK -->
- StockPage
  - add new item(s) aka. supply -> [
    init new supply (~~possible to make a supply entity here),
    enter number of items in supply,
    foreach(item in items): enter item.data,
    ~~choose small imageFile to be uploaded as a blob
    ~~update supply item data after initial entry,
    confirm supply,
    save transaction to db
  ]
  - view items in stock -> [
    handle view stock event,
    goto stock-Table (table of items from ITEMs table in DB),
    ~~goto stock shows abstract item list,
    ~~clicking a particular item shows itemPage,
    ~~search for a particular item by: [ [name], [price-range], [quantity-range] ],
    ~~onClick goto itemPage
  ]
  - update item -> [
    onClick of updateItem() in stock-Table goto updateItem-window,
    show current item.data in input fields,
    allow user to edit,
    confirm edit,
    check if all required data was entered and valid input types were given,
    if all good: save to db,
    else: reject and alert user
  ]
  - delete item -> [
    select "remove/delete amount" particular item from stock-Table,
    goto deleteItem-window,
    show stockQuantity from db,
    allow user to decrease/adjust quantity,
    confirm removal,
    save to db
  ]

<!-- ORDER -->
- OrderPage
  - add new order -> [
    init addNewOrder(),
    add item via itemName, orderQuantity to cart,
    add more item(s),
    update/remove item(s) from cart if needed,
    confirm order,
    save transaction to db
  ]
  - view order history -> [
    click orderHistory,
    orderHistory-window shows table of all orders from db,
    onClick on a particular order item from table, load the particluar Order-window,
    Order-window shows the Order.data,
    ~cannot edit past orders, only delete allowed
  ]
  - delete order history records -> [
    on Order-window, onClick of "delete order",
    ask user to confirm,
    on yes, delete order record from db
  ]
...

<!-- ~~SUPPLY -->
- Supply
  - View supply -> [...]