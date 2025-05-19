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
    this.createGraph()
  }

  getItemData(id: string | null) {
    //riempo l'array con i dati dell'oggetto recuperati dall'API
    if (id) {
      this.itemservice.getItemById(id).subscribe((data: Item[]) => {
        this.items = data;
        console.log(this.items);
      });
    }
  }

  createGraph(){
    this.setGraphOptions()
        const documentStyle = getComputedStyle(document.documentElement);

        this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'Piume d\'angelo',
                  fill: false,
                  borderColor: documentStyle.getPropertyValue('--blue-500'),
                  yAxisID: 'y',
                  tension: 0.4,
                  data: [65, 59, 80, 81, 56, 55, 10]
              }
          ]
      };

    
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
    
  }

}
