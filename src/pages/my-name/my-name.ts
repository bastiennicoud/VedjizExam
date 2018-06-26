import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the MyNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-name',
  templateUrl: 'my-name.html',
})
export class MyNamePage {

  nameForm: FormGroup
  name

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private formBuilder: FormBuilder,
      private dataProvider: DataProvider,
      private toastCtrl: ToastController
    ) {
    this.initForm()
    this.dataProvider.getName().then(name => {
      this.nameForm.controls.name.setValue(name)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyNamePage')
  }

  initForm() {
    this.nameForm = this.formBuilder.group({
      name: [name],
    })
  }

  save() {
    this.dataProvider.setName(this.nameForm.controls.name.value).then(data => {
      let toast = this.toastCtrl.create({
        message: 'Nom bien sauvegardé',
        duration: 3000,
      });
      toast.present()
    })
  }

}
