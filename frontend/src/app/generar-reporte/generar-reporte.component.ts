import { Component, OnInit } from '@angular/core';
import { FrutaService } from '../fruta.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-generar-reporte',
  templateUrl: './generar-reporte.component.html',
  styleUrls: ['./generar-reporte.component.css']
})
export class GenerarReporteComponent implements OnInit {
  datos: any[] = [];

  constructor(private frutaService: FrutaService) {}

  ngOnInit(): void {
    this.frutaService.getDatos().subscribe(data => {
      this.datos = data;
    });
  }

  esTemperaturaAdecuada(temp: number): boolean {
    return temp >= 10 && temp <= 25;
  }

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datos);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'Reporte.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    const col = ["Fecha", "Temperatura", "Humedad", "Calidad del Aire", "Amoníaco (NH3)", "Monóxido de Carbono (CO)", "Humo (ppm)"];
    const rows: any[] = [];

    this.datos.forEach(dato => {
      const tempAdecuada = this.esTemperaturaAdecuada(dato.temperatura) ? 'Adecuada' : 'No Adecuada';
      const temp = `${dato.temperatura} °C`;
      const hum = `${dato.humedad} %`;
      const nh3 = `${dato.amoniaco} ppm`;
      const co = `${dato.monoxidoCarbono} ppm`;
      const humo = `${dato.humo} ppm`;

      rows.push([dato.fecha, temp, hum, tempAdecuada, nh3, co, humo]);
    });

    (doc as any).autoTable(col, rows);
    doc.save('Reporte.pdf');
  }
}