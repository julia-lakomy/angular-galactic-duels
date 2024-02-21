import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { SwapiService } from "../../services/swapi.service";
import { CommonModule, UpperCasePipe } from "@angular/common";
import {
  Observable,
  Subscription,
  catchError,
  finalize,
  forkJoin,
  map,
  of,
} from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { BattleResult } from "../../models/battle-result";
import { Starship } from "../../models/starship";
import { Person } from "../../models/person";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-battle",
  standalone: true,
  imports: [UpperCasePipe, CommonModule, MatCardModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
})
export class BattleComponent implements OnInit, OnDestroy {
  battleResults: BattleResult[] = [];
  isLoading = false;
  type: "person" | "starship" = "person";
  paramsSubscription: Subscription = new Subscription();
  contestants$: Observable<{
    contestantOne: Person | Starship;
    contestantTwo: Person | Starship;
  }> = new Observable();

  constructor(
    private swapiService: SwapiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.type = params["mode"];
      this.playGame();
    });
  }

  playGame(): void {
    this.isLoading = true;

    this.contestants$ =
      this.type === "person"
        ? forkJoin({
            contestantOne: this.swapiService.getRandomPerson(),
            contestantTwo: this.swapiService.getRandomPerson(),
          })
        : forkJoin({
            contestantOne: this.swapiService.getRandomStarship(),
            contestantTwo: this.swapiService.getRandomStarship(),
          });

    this.contestants$
      .pipe(
        map(({ contestantOne, contestantTwo }) => {
          const attributeOne =
            this.type === "person"
              ? parseInt((contestantOne as Person).height, 10)
              : parseInt(
                  (contestantOne as Starship).crew.replace(/,/g, ""),
                  10
                );
          const attributeTwo =
            this.type === "person"
              ? parseInt((contestantTwo as Person).height, 10)
              : parseInt(
                  (contestantTwo as Starship).crew.replace(/,/g, ""),
                  10
                );

          this.battleResults = [
            {
              type: this.type,
              name: contestantOne.name,
              attribute: attributeOne,
              winner: attributeOne > attributeTwo,
            },
            {
              type: this.type,
              name: contestantTwo.name,
              attribute: attributeTwo,
              winner: attributeTwo > attributeOne,
            },
          ];
        }),
        catchError((error) => {
          console.error("Error during battle setup:", error);
          return of([]);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
