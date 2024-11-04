import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  selectedPolicy: string | null = null;

  ngOnInit(): void {
    this.selectedPolicy = sessionStorage.getItem('selectedPolicy');
  }
}
