import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router) {
    this.loadScripts();
  }

  ngOnInit(): void {
  }

  logOut() {
    this.ngOnInit();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loadScripts() {
    const dynamicScripts = [
      '../../assets/vendor/libs/jquery/jquery.js',
      '../../assets/vendor/libs/popper/popper.js',
      '../../assets/vendor/js/bootstrap.js',
      '../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
      '../../assets/vendor/js/menu.js',
      '../../assets/js/main.js'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }
}
