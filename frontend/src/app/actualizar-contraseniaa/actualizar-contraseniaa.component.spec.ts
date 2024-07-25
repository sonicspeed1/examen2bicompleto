import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarContraseniaaComponent } from './actualizar-contraseniaa.component';

describe('ActualizarContraseniaaComponent', () => {
  let component: ActualizarContraseniaaComponent;
  let fixture: ComponentFixture<ActualizarContraseniaaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualizarContraseniaaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarContraseniaaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
