import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.scss']
})
export class ListAllComponent {

  constructor(private router: Router) {}

  categorie: Category[] = [
    { id: 2282, img: "https://www.noshydra.com/static/images/items_icons/2282.png", name: "Piuma d'angelo", actualPrice: "4,397", status: "BUY NOW" },
    { id: 1030, img: "https://www.noshydra.com/static/images/items_icons/1030.png", name: 'Cristallo di luna piena', actualPrice: "21,599", status: "SELL NOW" }
  ]

  goTo(id : any){
    this.router.navigate(['/item', id]);
  }
}
