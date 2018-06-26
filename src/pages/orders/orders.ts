import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Order } from '../../models/order';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  orders: Array<Order>
  name

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    private toastCtrl: ToastController
  ) {
    // Get the name of the current user
    this.dataProvider.getName().then(name => this.name = name)
    this.getOrders().then(orders => {
      this.orders = orders
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

  /**
   * Get the orders from the dataprovider
   */
  async getOrders() {
    return await this.dataProvider.getMyOrders()
  }

  /**
   * Call the dataprovider to remove the order and display toast
   * @param id
   */
  remoweOrder(id) {
    // Cal the dataprovider
    this.dataProvider.deleteOrder(id).then(datas => {
      // If the http response is success
      if (datas == "ok") {
        // Remove the order form the current list of orders
        let newOrders = this.orders.filter(el => el.id != id)
        this.orders = newOrders
        // Display little toast
        let toast = this.toastCtrl.create({
          message: "Commande correctement suprimée",
          duration: 3000,
        });
        toast.present()
      } else {
        // If the http request fails, display error message
        let toast = this.toastCtrl.create({
          message: "Un erreur est survenue",
          duration: 3000,
        });
        toast.present()
      }
    })
  }

}
