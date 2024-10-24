import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  
  constructor(private router: Router) {}

  scrollToContact() {
      this.router.navigate(['/admin']).then(() => {
          const element = document.getElementById('contact-us');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      });
  }

}
