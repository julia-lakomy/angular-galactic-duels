import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-welcome",
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent {
  startGame() {}
}
