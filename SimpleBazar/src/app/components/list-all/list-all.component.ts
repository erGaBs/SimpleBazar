import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { ItemsService } from 'src/app/service/items.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.scss']
})
export class ListAllComponent {


  constructor(private router: Router, private itemservice: ItemsService,
  ) { }
  showOnlyFavorites: boolean = false;

favorites: Set<string> = new Set();
searchTerm: string = '';
  private updateSubscription!: Subscription
  categorie: Category[] = [
  ]

  ngOnInit(): void {
    this.refreshData()
      this.loadFavorites();
    this.updateSubscription = interval(100000).subscribe(() => {
      this.refreshData();
    });
  }



  private sortCategorieByStatus(): void {
    const priority: { [key: string]: number } = {
      'BUY NOW': 1,
      'SELL NOW': 2
    };

    this.categorie.sort((a, b) => {
      const aPriority = priority[a.status ?? ''] ?? 3;
      const bPriority = priority[b.status ?? ''] ?? 3;
      return aPriority - bPriority;
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

  goTo(id: any) {
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

  refreshData(): void {
    this.itemservice.getCategories().subscribe((data: Category[]) => {
      this.categorie = data;

      let pending = this.categorie.length;

      this.categorie.forEach((category) => {
        this.getItemsOfCategory(category.iconID, category.PricePerUnit).subscribe((status) => {
          category.status = status;

          // Quando tutti gli status sono stati assegnati, ordina
          pending--;
          if (pending === 0) {
            this.sortCategorieByStatus();
          }
        });
      });
    });
  }


  loadFavorites(): void {
  const saved = localStorage.getItem('favorites');
  if (saved) {
    this.favorites = new Set(JSON.parse(saved));
  }
}

saveFavorites(): void {
  localStorage.setItem('favorites', JSON.stringify(Array.from(this.favorites)));
}

toggleFavorite(id: string | number): void {
  const key = String(id);
  if (this.favorites.has(key)) {
    this.favorites.delete(key);
  } else {
    this.favorites.add(key);
  }
  this.saveFavorites();
}

isFavorite(id: string | number): boolean {
  return this.favorites.has(String(id));
}


filteredCategorie(): Category[] {
  let result = this.categorie;

  if (this.searchTerm) {
    result = result.filter(item =>
      item.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  if (this.showOnlyFavorites) {
   result = result.filter(item => this.isFavorite(String(item.iconID)));

  }

  return result;
}




}




