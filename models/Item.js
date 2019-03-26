module.exports = class Item {
  constructor(
    name,
    quantityUnit,
    quantity = 0,
    buyingPrice,
    sellingPrice,
    details = ""
  ) {
    this.name = name;
    this.quantity = quantity;
    this.quantityUnit = quantityUnit;
    this.buyingPrice = buyingPrice;
    this.sellingPrice = sellingPrice;
    this.details = details;
  }

  addQuantity(amount) {
    this.quantity += amount;
  }

  removeQuantity(amount) {
    if (amount <= this.quantity) return (this.quantity -= amount);
    return new Error("Invalid ampunt Entered!");
  }

  changeSellingPrice(newPrice) {
    this.sellingPrice = newPrice;
  }
};
