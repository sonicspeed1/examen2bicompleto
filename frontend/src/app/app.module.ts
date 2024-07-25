import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { ConsultarUsuariosComponent } from './consultar-usuarios/consultar-usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GenerarReporteComponent } from './generar-reporte/generar-reporte.component';
import { ActualizarContraseniaaComponent } from './actualizar-contraseniaa/actualizar-contraseniaa.component';

import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { AuthService } from './auth.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'crear-usuarios', component: CrearUsuariosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'administrador' } },
  { path: 'consultar-usuarios', component: ConsultarUsuariosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'administrador' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'operador' } },
  { path: 'generar-reporte', component: GenerarReporteComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'operador' } },
  { path: 'actualizar-contrasenia', component: ActualizarContraseniaaComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    LoginComponent,
    CrearUsuariosComponent,
    ConsultarUsuariosComponent,
    DashboardComponent,
    GenerarReporteComponent,
    ActualizarContraseniaaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService, AuthGuard, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }