import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  openDropdowns: Set<string> = new Set();

  constructor(private router: Router) {}
  
  ngOnInit():void{
  }
  
  scrollToContact() {
      this.router.navigate(['/admin']).then(() => {
          const element = document.getElementById('contact-us');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      });
  }

  logOut(){
    this.ngOnInit();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleDropdown(dropdown: string) {
    if (this.openDropdowns.has(dropdown)) {
      this.openDropdowns.delete(dropdown);
    } else {
      this.openDropdowns.add(dropdown);
    }
  }

  isDropdownOpen(dropdown: string): boolean {
    return this.openDropdowns.has(dropdown);
  }

}
