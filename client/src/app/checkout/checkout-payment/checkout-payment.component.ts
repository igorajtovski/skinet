
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/Order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
@Input() checkoutForm: FormGroup;
  constructor(private basketService: BasketService,
              private checkoutService: CheckoutService, private route: Router) { }

  ngOnInit(): void {
  }
  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.creatOrder(orderToCreate).subscribe((order: IOrder) => {
      console.log('Order created');
      this.basketService.deleteLocalBasket(basket.id);
      const navigationExtras: NavigationExtras = { state: order};
      this.route.navigate(['checkout/success'], navigationExtras);
    });
  }
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value, // plusot na pocetok e da bide broj
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
