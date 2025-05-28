import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/models/item';
import { ItemsService } from 'src/app/service/items.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {

    highestPrice: string = '';
    lowestPrice: string = '';

    lastExtractionTimestamp: string = '';
    

  esito: string = '';

  id: string | null = null;

  data: any;

  options: any;

  items : Item[] = [{
    iconID: 0,
    Name: '',
    timestamp: '',
    PricePerUnit: '',
  }]

  constructor(private route: ActivatedRoute, private itemservice: ItemsService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getItemData(this.id);
    
  }

  getItemData(id: string | null) {
    //riempo l'array con i dati dell'oggetto recuperati dall'API
    if (id) {
      this.itemservice.getItemById(id).subscribe((data: Item[]) => {
        this.items = data;
        this.createGraph()
        this.calculateHighestLowestPrice()
        this.calcolaEsito()
      });
    }
  }

  orderArrayByTimestamp(items: Item[]) {
    return items.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateA - dateB; // ascending: oldest first
  });
  }

  createGraph(){
    this.setGraphOptions()
    this.items = this.orderArrayByTimestamp(this.items);
    this.lastExtractionTimestamp = this.items[this.items.length-1].timestamp
        const documentStyle = getComputedStyle(document.documentElement);
        let labels = this.items.map((item) => this.formatDateToggmm(item.timestamp));
        let data = this.items.map((item) => Number(item.PricePerUnit));
        this.data = {
          labels: labels,
          datasets: [
              {
                  label: this.items[0].Name,
                  fill: false,
                  borderColor: documentStyle.getPropertyValue('--blue-500'),
                  yAxisID: 'y',
                  tension: 0.4,
                  data: data
              }
          ]
      };

  }


  formatDateToggmm(dateStr: string) : string {
    const date = new Date(dateStr);

// Ottieni giorno e mese con padding
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const formatted = `${day}/${month}`;
    return formatted;
  }



  setGraphOptions(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder
              }
          },
          y: {
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder
              }
          },
          y1: {
              type: 'linear',
              display: true,
              position: 'right',
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  drawOnChartArea: false,
                  color: surfaceBorder
              }
          }
        }
      };
  }


  calculateHighestLowestPrice(){
    this.lowestPrice = this.items.reduce((min, curr) => 
    curr.PricePerUnit < min.PricePerUnit ? curr : min
    ).PricePerUnit.toString();

    this.highestPrice = this.items.reduce((max, curr) => 
    curr.PricePerUnit > max.PricePerUnit ? curr : max
    ).PricePerUnit.toString();

  }

  calcolaEsito(){
    this.esito = this.getAction(this.items, Number(this.items[this.items.length - 1].PricePerUnit))

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
    return `ACQUISTA ora. Rivendi quando il prezzo arriva a ${bestSellPrice} (es. ${bestSellTime})`;
  }

  if (currentPrice >= thresholdSell) {
    return `VENDI ORA. Prezzo superiore alla media (${avg.toFixed(2)})`;
  }

  return 'ASPETTA. Prezzo nella media, nessuna opportunità chiara.';
}

  //calcolo con media mobile

   

}
