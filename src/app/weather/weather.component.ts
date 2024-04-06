import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../weather.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, AfterViewInit {
  chart: Chart | undefined;
  forecastData: any;
  forecastLocation: string = '';

  constructor(private route: ActivatedRoute, private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const location = params.get('location');
      if (location) {
        if (location === 'LWX') {
          this.forecastLocation = 'COLUMBIA';
        } else if (location === 'TOP') {
          this.forecastLocation = 'KANSAS';
        } else {
          this.forecastLocation = 'Unknown';
        }
        this.weatherService.getForecast(location).subscribe(data => {
          this.forecastData = data;
          this.generateChart();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.generateChart();
  }

  generateChart(): void {
    if (!this.forecastData) return;

    const labels: string[] = [];
    const temperatures: number[] = [];

    this.forecastData.properties.periods.forEach((period: any) => {
      labels.push(period.name);
      temperatures.push(period.temperature);
    });

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature (°F)',
            data: temperatures,
            fill: false,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(230, 192, 102, 0.2)', 
              pointBackgroundColor: 'rgb(75, 192, 192)', 
              pointBorderColor: 'rgb(75, 192, 192)', 
              pointHoverBackgroundColor: 'rgb(75, 192, 192)', 
              pointHoverBorderColor: 'rgb(75, 192, 192)' 
          }
        ]
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)' 
            },
            ticks: {
              color: 'rgb(0, 0, 0)' 
            }
          },
          x: {
            grid: {
              display: false 
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            bodyColor: 'rgb(255, 255, 255)', 
            titleColor: 'rgb(255, 255, 20)', 
            padding: 10 
          }
        }
      }
    });
  }
}
