import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent {
  @ViewChild('sidena') sidenav!: MatSidenav;

  isSmallScreen: boolean = false;
  // sidenavMode: string = 'side'; // Puedes definir 'over' como valor predeterminado si lo prefieres
  sidenavOpened: boolean = true;
  sidenavMode: MatDrawerMode = 'side'; // o 'over' según tus necesidades

  constructor(private observer: BreakpointObserver, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.observeScreenSize();
  }

  observeScreenSize() {
    this.observer.observe(['(max-width: 800px)']).subscribe((resp: any) => {
      this.isSmallScreen = resp.matches;
      this.updateSidenavProperties();
    });
  }

  updateSidenavProperties() {
    if (this.isSmallScreen) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
    } else {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
    }
    this.cd.detectChanges();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
