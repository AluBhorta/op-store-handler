# OP Store Handler

A desktop store management system built in electronJS.

## Dependencies/Stack

front end: react, bootstrap?/w3?
backend: electronJS,
db: PostgreSQL

## Features

- Stock mgmt system
  - add new item (details)
  - add new supply (set of items, existing or new)
  - update an item details (selling or buying price/name/...)
- Sales mgmt system
  - initiate an order
  - check order history
  - edit order history
  - delete order history

* ~borrower/debtor and lender/creditor mgmt
* ~store Analytics

### models/tables

- item(
  - item name
  - ~description
  - buying price
  - selling price
  - quantity/amount(2 pieces / 2kg / 2litres / 2metres / ...)
  - ~company
  - ~quality
    )
- order()
- supply()

- ~supplier()
