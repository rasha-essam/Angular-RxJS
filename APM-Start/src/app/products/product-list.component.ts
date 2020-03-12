import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, BehaviorSubject, combineLatest } from 'rxjs';

import { ProductService } from './product.service';
import { catchError, filter, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
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
    this.productService.productsWithCategory$,
    this.selectedCategoryAction$]).pipe(
    map(([products, selectedCategoryId ]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
        )),
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
          // return of([]); // equivalent to return EMPTY
        })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategorySubject.next(+categoryId) ;
  }
}
