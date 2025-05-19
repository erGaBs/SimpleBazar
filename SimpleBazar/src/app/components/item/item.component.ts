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
    

  id: string | null = null;

  data: any;

  options: any;

  items : Item[] = []

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
        console.log(this.items);
        this.createGraph()
        this.calculateHighestLowestPrice()
      });
    }
  }

  createGraph(){
    this.setGraphOptions()
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

      console.log(this.data)
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
  }

  //calcolo con media mobile

   

}
