import { Component } from '@angular/core';
import { Wave } from "../wave/wave";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-hero',
  imports: [Wave, MatIcon],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

}
