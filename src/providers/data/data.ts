import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import 'rxjs/add/operator/map'
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Supplier } from '../../models/supplier';
import { Order } from '../../models/order';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  private endpoint: string = `http://vedjserver.mycpnv.ch/api/v1/`
  products: Array<Product> = []
  status: string
  isAdmin: boolean
  suppliers

  constructor(private storage: Storage, private httpClient: HttpClient) {
    this.setStatus()
  }

  async getProducts() {
    this.products = await this.storage.get('products')
    console.log(this.products)
  }

  setProducts() {
    return this.storage.set('products', this.products)
  }

  private getProductsFromApi() {
    let products: Array<Product> = []
    return new Promise<Array<Product>>((resolve, reject) => {
      this.httpClient.get(`${this.endpoint}vegetables`)
      .subscribe(data => {
        Object.keys(data).forEach(key => {
          let suppliers: Array<Supplier> = []
          data[key].suppliers.forEach(supplier => {
            suppliers.push(new Supplier(supplier.id, supplier.firstName, supplier.lastName, '', '', supplier.companyName))
          })
          products.push(new Product(data[key].id, data[key].productName, data[key].price, data[key].unit, data[key].stock,data[key].image64, data[key].low_stock_threshold, suppliers))
        })
        resolve(products)
      },
      error => {
        reject(error)
      })
    })
  }

  private getLastUpdateFromApi() {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(`${this.endpoint}lastupdate`)
      .subscribe(data => {
        resolve(data)
      },
      error => {
        reject(error)
      })
    })
  }

  // On prod must be private
  setLastUpdate(date: Date = new Date()) {
    return this.storage.set('lastUpdate', date)
  }

  getLastUpdate() {
    return this.storage.get('lastUpdate')
  }

  private clear() {
    return this.storage.clear()
  }

  async updateLocal() {
      await this.clear()
      this.products = await this.getProductsFromApi()
      await this.setProducts()

      let lastUpdateApi = await this.getLastUpdateFromApi()
      await this.setLastUpdate(new Date(lastUpdateApi.updated_at))
      await this.setEditInProgress(false)
      return true
  }

  async isUpToDate() {
    if (await this.getEditInProgress()) {
      return false
    }
    let lastUpdateApi = await this.getLastUpdateFromApi()
    lastUpdateApi = new Date(lastUpdateApi.updated_at)

    let lastUpdateLocal = await this.getLastUpdate()
    lastUpdateLocal = new Date(lastUpdateLocal)

    return (lastUpdateApi.getTime() > lastUpdateLocal.getTime())
  }

  updateProducts(changes) {
    return this.httpClient.patch(`${this.endpoint}newstock`, {changes: changes}).toPromise()
  }

  getEditInProgress() {
    return this.storage.get('editInProgress')
  }

  setEditInProgress(state: boolean) {
    return this.storage.set('editInProgress', state)
  }

  // Get info from status user in the storage
  private async getAdmin() {
    return this.storage.get('adminUser')
  }

  // Set the user status
  async setAdmin(userStatus: boolean = false) {
    await this.storage.set('adminUser', userStatus)
    this.setStatus()
  }

  // Set status string
  private async setStatus() {
    if (await this.getAdmin()) {
      this.status = 'Admin'
      this.isAdmin = true
    } else {
      this.status = 'Standard'
      this.isAdmin = false
    }
  }

  /**
   * Return the name set in local storage
   */
  async getName() {
    let name = await this.storage.get('name')
    return name
  }

  /**
   * Set the name of the user in local storage
   * @param name String
   */
  async setName(name) {
    await this.storage.set('name', name)
  }

  /**
   * Submit a new order to the server
   * @param quantity
   * @param supplier
   * @param product
   */
  async sendNewOrder(quantity, supplier, product) {
    // Get the name of the person
    let personName = await this.getName()
    // Send request to the server
    let datas = await this.httpClient.post(
      `${this.endpoint}order`,
      // Playload
      JSON.stringify(
        {
          productid: product.id,
          providerid: supplier.id,
          placedby: personName,
          quantity: quantity
        }
      ),
      // Headers
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With','XMLHttpRequest')
      }
      // Convert the observer to promise for async await treathment
    ).toPromise()
    // Return the datas (http response)
    return datas
  }

  /**
   * Load from the Api all the orders
   */
  async getMyOrders() {
    // Http call
    let datas = await this.httpClient.get(
      `${this.endpoint}orders`
    ).toPromise()
    // Map the json to Order model
    let orders: Array<Order> = []
    Object.keys(datas).forEach(key => {
      orders.push(new Order(
        datas[key].id,
        datas[key].productName,
        datas[key].quantity,
        datas[key].companyName,
        datas[key].placed_by
      ))
    })
    // Return the datas
    return orders
  }

  async deleteOrder(id) {
    // Send request to the server
    let datas = await this.httpClient.post(
      `${this.endpoint}withdraw`,
      // Playload
      JSON.stringify(
        {
          orderid: id
        }
      ),
      // Headers
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With','XMLHttpRequest')
      }
      // Convert the observer to promise for async await treathment
    ).toPromise()
    return datas
  }
}
