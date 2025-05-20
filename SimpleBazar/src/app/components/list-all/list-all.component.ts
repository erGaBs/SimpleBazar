import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
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
      this.categorie.forEach((category) => {
        this.getItemsOfCategory(category.iconID, category.PricePerUnit).subscribe( element => {
          category.status = element}
        );
        
        });
      });
    }


  //recupero gli items di ogni categoria
  getItemsOfCategory(id: number, currentPrice: string): Observable<string> {
  return this.itemservice.getItemById(id.toString()).pipe(
    map(items => this.getAction(items, Number(currentPrice))),
    catchError(error => {
      console.error('Errore durante il recupero degli elementi:', error);
      return of('Errore nel recupero dei dati');
    })
  );
  }

  goTo(id : any){
    this.router.navigate(['/item', id]);
  }

  getAction(prices: Item[], currentPrice: number): string {
    if (prices.length < 2) return 'DATI INSUFFICIENTI';
  
    const recentPrices = prices.map(p => Number(p.PricePerUnit));
    const avg = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;
  
    const maxPrice = Math.max(...recentPrices);
    const minPrice = Math.min(...recentPrices);
  
    const thresholdBuy = avg * 0.95;
    const thresholdSell = avg * 1.05;
  
    if (currentPrice <= thresholdBuy) {
      const bestSellPrice = maxPrice;
      const bestSellTime = prices.find(p => Number(p.PricePerUnit) === bestSellPrice)?.timestamp;
      return "BUY NOW";
    }
  
    if (currentPrice >= thresholdSell) {
      return "SELL NOW";
    }
  
    return "WAIT FOR A BETTER PRICE";
  }
}
