export class Order {

  id: number
  productName: string
  quantity: number
  companyName: string
  placedBy: string

  /**
   * build a new order
   * @param id
   * @param productName
   * @param quantity
   * @param companyName
   * @param placedBy
   */
  constructor(
    id: number,
    productName: string,
    quantity: number,
    companyName: string,
    placedBy: string
  ) {
    this.id = id
    this.productName = productName
    this.quantity = quantity
    this.companyName = companyName
    this.placedBy = placedBy
  }

}