import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, BehaviorSubject, combineLatest, Subject } from 'rxjs';

import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { Product } from './product';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  selectedCategorySubject = new BehaviorSubject<number>(0);
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();

  // products$ = this.productService.productsWithCategory$.pipe(
  //   catchError(err => {
  //     this.errorMessage = err;
  //     return EMPTY;
  //     // return of([]); // equivalent to return EMPTY
  //   })
  // );

  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.selectedCategoryAction$]).pipe(
    map(([products, selectedCategoryId ]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
        )),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
          // return of([]); // equivalent to return EMPTY
        })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.selectedCategorySubject.next(+categoryId);
  }
}
