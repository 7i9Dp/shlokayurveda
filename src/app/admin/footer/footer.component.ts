import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  
  date: any = new Date();
  constructor(private router: Router) {}

  scrollToContact() {
      this.router.navigate(['/admin']).then(() => {
          const element = document.getElementById('contact-us');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      });
  }

  selectPolicy(policy: string): void {
    // Store selected policy in session storage
    sessionStorage.setItem('selectedPolicy', policy);
    // Navigate to the policy display component
    this.router.navigate(['/policy-details']);
  }

}
