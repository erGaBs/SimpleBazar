import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ItemComponent } from './components/item/item.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'item/:id', component: ItemComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
