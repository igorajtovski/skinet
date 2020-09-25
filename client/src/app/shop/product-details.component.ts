import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from '../basket/basket.service';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;
  constructor(private shopService: ShopService, private activateRoute: ActivatedRoute, private bcService: BreadcrumbService,
              private basketSerice: BasketService) {
    this.bcService.set('@productDetails', '');
   }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToBasket() {
    this.basketSerice.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity(){
    this.quantity++;
  }

  decrementQuantity(){
    if (this.quantity > 1){
      this.quantity--;
    }
  }

  loadProduct(){
    this.shopService.getProduct(2).subscribe(product => {
    this.product = product;
    this.bcService.set('@productDetails', product.name);
    }, error => {
      console.log(error);
    });
  }

}
