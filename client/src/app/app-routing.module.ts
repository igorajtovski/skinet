import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailsComponent } from './shop/product-details.component';


const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {path: 'shop', loadChildren: () => import('./shop/shop.module')
  .then(mod => mod.ShopModule), data: {breadcrumb: 'Shop'}}, // Lazy loading; The shop modul will be activated when acces the shop part
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // forRoot() means this is going to be added our root module and that is app-module
  exports: [RouterModule]
})
export class AppRoutingModule { }
