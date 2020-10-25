import { Injectable, Type } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import {map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();

  constructor(private http: HttpClient) { }

  getProducts(useCache: boolean){
    let params = new HttpParams(); // two type of naming convention: let and const. Let we use when we want to re-assign the variable

    if (useCache === false)
    {
      this.products = [];
    }

    if (this.products.length > 0 && useCache === true) {
      const pageReceived = Math.ceil(this.products.length / this.shopParams.pageSize);
      if (this.shopParams.pageNumber <= pageReceived) {
        this.pagination.data = this.products.slice((this.shopParams.pageNumber - 1) * this.shopParams.pageSize,
        this.shopParams.pageNumber * this.shopParams.pageSize);
        return of (this.pagination);
      }
    }

    if (this.shopParams.brandId !== 0 )
    {          // 'BrandId'-> query string key we are send; BrandId.ToString();->value
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId !== 0)
    {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if (this.shopParams.search){
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageIndex', this.shopParams.pageSize.toString());

    return this.http.get<Pagination>(this.baseUrl + 'products', {observe: 'response', params})
    .pipe(  // wrapper of any rjsx operators
      map(response => {  // mapping HttpResponse to Pagination data
        this.products = [...this.products, ...response.body.data];
        this.pagination = response.body;
        return this.pagination;
      })
    );
  }

  getShopParams() {
    return this.shopParams;
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }
  getProduct(id: number){
    const product = this.products.find(p => p.id === id);

    if (product) {
      return of (product);
    }
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }


  getBrands(){
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map(response => {
        this.brands = response;
        return response;
      })
    );
  }

  getTypes(){
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map(response => {
        this.types = response;
        return response;
      })
    );
  }
}

// services in angular are singleton, which means its available all time during app is started, but components are
// destroyed and reinitialized as soon as we get away from component
