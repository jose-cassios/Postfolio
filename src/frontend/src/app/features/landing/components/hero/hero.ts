import { Component } from '@angular/core';
import { Wave } from "../wave/wave";
import { MatIcon } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-hero',
  imports: [Wave, MatIcon, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

}
