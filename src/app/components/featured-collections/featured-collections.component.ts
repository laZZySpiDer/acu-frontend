import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsApiService } from '../../services/products-api.service';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-featured-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-collections.component.html',
  styleUrls: ['./featured-collections.component.css']
})
export class FeaturedCollectionsComponent implements OnInit {
  collections : Category[] = [
    // {
    //   name: 'Handmade Crafts',
    //   image: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    // },
    // {
    //   name: 'Accessories',
    //   image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    // },
    // {
    //   name: 'Apparel',
    //   image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    // },
    // {
    //   name: 'Home Decor',
    //   image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    // }
  ];

  constructor(private _productsApiService: ProductsApiService){}

 ngOnInit(): void {
  //  this.collections
  this._productsApiService.getCategories().subscribe((response:any)=>{
    if(response && response.categories){
      this.collections = response.categories.map((elem:any)=>{
        return {
          ...elem,
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        }
      }).filter((elem:any)=> elem.parent_category_id === null).sort((a:any,b:any)=> a.order - b.order);
    }
  })
 } 
}