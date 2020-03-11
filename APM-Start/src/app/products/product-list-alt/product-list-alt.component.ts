import { Component, OnInit, OnDestroy } from '@angular/core';

import { EMPTY } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId;

  products$ = this.productService.products$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
     // return of([]); // equivalent to return EMPTY
    })
  );

  constructor(private productService: ProductService) { }


  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
