import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyNamePage } from './my-name';

@NgModule({
  declarations: [
    MyNamePage,
  ],
  imports: [
    IonicPageModule.forChild(MyNamePage),
  ],
})
export class MyNamePageModule {}
