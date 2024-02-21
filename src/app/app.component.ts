import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { BattleComponent } from "./components/battle/battle.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BattleComponent,
    WelcomeComponent,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {}
