import { Supplier } from './supplier';

export class Product {
  id: number
  name: string
  unit: string
  price: number
  stock: number
  picture: string
  lowStock: number
  suppliers: Array<Supplier>
  edited: boolean

  constructor(id: number, name: string, price: number, unit: string, stock: number, picture: string, lowStock: number, suppliers: Array<Supplier> = []) {
    this.id = id
    this.name = name
    this.price = price
    this.unit = unit
    this.stock = stock
    this.picture = picture
    this.lowStock = lowStock
    this.suppliers = suppliers
    this.edited = false;
  }

}