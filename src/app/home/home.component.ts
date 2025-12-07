import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected count = signal(0);

  increment() {
    this.count.update(value => value + 1);
  }
}
