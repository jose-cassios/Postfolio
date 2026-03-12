import { Component } from '@angular/core';
import { WaveComponent } from "../wave/wave.component";
import { MatIcon } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-hero',
  imports: [WaveComponent, MatIcon, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {

}
