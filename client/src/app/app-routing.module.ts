import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailsComponent } from './shop/product-details.component';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {path: 'shop', loadChildren: () => import('./shop/shop.module')
  .then(mod => mod.ShopModule), data: {breadcrumb: 'Shop'}}, // Lazy loading; The shop module will be activated when acces the shop part
  { path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule), data: { breadcrumb: 'Basket' } },
  { path: 'checkout',
    canActivate: [AuthGuard],
   loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule), data: { breadcrumb: 'Checkout' } },
  { path: 'account', loadChildren: () => import('./account/account.module')
  .then(mod => mod.AccountModule), data: { breadcrumb: {skip: true} } },

  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // forRoot() means this is going to be added our root module and that is app-module
  exports: [RouterModule]
})
export class AppRoutingModule { }
