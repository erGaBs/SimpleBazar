import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { ItemsService } from 'src/app/service/items.service';

@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.scss']
})
export class ListAllComponent {

  constructor(private router: Router, private itemservice: ItemsService) {}

  categorie: Category[] = [
  ]

  ngOnInit(): void {
    this.itemservice.getCategories().subscribe((data: Category[]) => {
      this.categorie = data;
      console.log(this.categorie);
    }
    );
  }

  goTo(id : any){
    this.router.navigate(['/item', id]);
  }
}
