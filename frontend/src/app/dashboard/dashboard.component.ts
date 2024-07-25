import { Component, OnInit } from '@angular/core';
import { FrutaService } from '../fruta.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public graficoTemperaturaHoraria: any;
  public graficoHumedadHoraria: any;
  public graficoAmoniacoHorario: any;
  public graficoHumoHorario: any;
  public graficoMonoxidoCarbonoHorario: any;

  constructor(private frutaService: FrutaService) {}

  ngOnInit() {
    Chart.register(...registerables);

    // Obtener datos y crear gráficos
    this.frutaService.obtenerTemperaturaHoraria().subscribe(datos => {
      this.crearGraficoTemperaturaHoraria(datos);
    });

    this.frutaService.obtenerHumedadHoraria().subscribe(datos => {
      this.crearGraficoHumedadHoraria(datos);
    });

    this.frutaService.obtenerAmoniacoHoraria().subscribe(datos => {
      this.crearGraficoAmoniacoHoraria(datos);
    });

    this.frutaService.obtenerHumoHoraria().subscribe(datos => {
      this.crearGraficoHumoHorario(datos);
    });

    this.frutaService.obtenerMonoxidoCarbonoHoraria().subscribe(datos => {
      this.crearGraficoMonoxidoCarbonoHorario(datos);
    });
  }

  crearGraficoTemperaturaHoraria(datos: any) {
    const ctx = document.getElementById('graficoTemperaturaHoraria') as HTMLCanvasElement;

    this.graficoTemperaturaHoraria = new Chart(ctx, {
      type: 'line',
      data: {
        labels: datos.map((item: any) => `${item._id.año}-${item._id.mes}-${item._id.día} ${item._id.hora}:00`),
        datasets: [{
          label: 'Temperatura Promedio por Hora',
          data: datos.map((item: any) => item.temperaturaPromedio),
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.3)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        }
      }
    });
  }

  crearGraficoHumedadHoraria(datos: any) {
    const ctx = document.getElementById('graficoHumedadHoraria') as HTMLCanvasElement;

    this.graficoHumedadHoraria = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datos.map((item: any) => `${item._id.año}-${item._id.mes}-${item._id.día} ${item._id.hora}:00`),
        datasets: [{
          label: 'Humedad Promedio por Hora',
          data: datos.map((item: any) => item.humedadPromedio),
          backgroundColor: '#66BB6A'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        }
      }
    });
  }

  crearGraficoAmoniacoHoraria(datos: any) {
    const ctx = document.getElementById('graficoAmoniacoHoraria') as HTMLCanvasElement;

    this.graficoAmoniacoHorario = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: datos.map((item: any) => `${item._id.año}-${item._id.mes}-${item._id.día} ${item._id.hora}:00`),
        datasets: [{
          label: 'Amoniaco Promedio por Hora',
          data: datos.map((item: any) => item.amoniacoPromedio),
          backgroundColor: ['#FF7043', '#FF8A65', '#FFAB91', '#FFCCBC']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      }
    });
  }

  crearGraficoHumoHorario(datos: any) {
    const ctx = document.getElementById('graficoHumoHoraria') as HTMLCanvasElement;

    this.graficoHumoHorario = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datos.map((item: any) => `${item._id.año}-${item._id.mes}-${item._id.día} ${item._id.hora}:00`),
        datasets: [{
          label: 'Humo Promedio por Hora',
          data: datos.map((item: any) => item.humoPromedio),
          backgroundColor: '#AB47BC'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        }
      }
    });
  }

  crearGraficoMonoxidoCarbonoHorario(datos: any) {
    const ctx = document.getElementById('graficoMonoxidoCarbonoHoraria') as HTMLCanvasElement;

    this.graficoMonoxidoCarbonoHorario = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: datos.map((item: any) => `${item._id.año}-${item._id.mes}-${item._id.día} ${item._id.hora}:00`),
        datasets: [{
          label: 'Monóxido de Carbono Promedio por Hora',
          data: datos.map((item: any) => item.monoxidoCarbonoPromedio),
          backgroundColor: ['#FFEB3B', '#FFF176', '#FFEB3B', '#FDD835']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      }
    });
  }
}