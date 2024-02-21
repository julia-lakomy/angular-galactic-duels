import { Component, OnDestroy, OnInit } from "@angular/core";
import { SwapiService } from "../../services/swapi.service";
import { CommonModule, UpperCasePipe } from "@angular/common";
import { Subscription, catchError, finalize, forkJoin, map, of } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";

interface BattleResult {
  type: "person" | "starship";
  name: string;
  attribute: number;
  winner: boolean;
}

@Component({
  selector: "app-battle",
  standalone: true,
  imports: [UpperCasePipe, CommonModule],

  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
})
export class BattleComponent implements OnInit, OnDestroy {
  battleResults: BattleResult[] = [];
  isLoading = false;
  type: "person" | "starship" = "person";
  paramsSubscription: Subscription = new Subscription;
  
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

    const contestants$ =
      this.type === "person"
        ? forkJoin({
            contestantOne: this.swapiService.getRandomPerson(),
            contestantTwo: this.swapiService.getRandomPerson(),
          })
        : forkJoin({
            contestantOne: this.swapiService.getRandomStarship(),
            contestantTwo: this.swapiService.getRandomStarship(),
          });

    contestants$
      .pipe(
        map(({ contestantOne, contestantTwo }) => {
          const attributeOne =
            this.type === "person"
              ? parseInt(contestantOne.result.properties.height, 10)
              : parseInt(
                  contestantOne.result.properties.crew.replace(/,/g, ""),
                  10
                );
          const attributeTwo =
            this.type === "person"
              ? parseInt(contestantTwo.result.properties.height, 10)
              : parseInt(
                  contestantTwo.result.properties.crew.replace(/,/g, ""),
                  10
                );

          this.battleResults = [
            {
              type: this.type,
              name: contestantOne.result.properties.name,
              attribute: attributeOne,
              winner: attributeOne > attributeTwo,
            },
            {
              type: this.type,
              name: contestantTwo.result.properties.name,
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
