import { Route, RouterModule, Routes } from "@angular/router";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { NgModule } from "@angular/core";
import { BattleComponent } from "./components/battle/battle.component";

const routes: Route[] = [
  {
    path: "",
    component: WelcomeComponent,
  },
  { path: "battle/:mode", component: BattleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
