import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { Starship } from "../models/starship";
import { Person } from "../models/person";

enum ResourceType {
  People = "people",
  Starships = "starships",
}

@Injectable({
  providedIn: "root",
})
export class SwapiService {
  private baseUrl = "https://www.swapi.tech/api";
  private readonly MIN_ID = 1;
  private readonly PEOPLE_MAX_ID = 83;
  private readonly STARSHIP_MAX_ID = 75;
  private readonly MAX_RETRIES = 5;

  constructor(private http: HttpClient) {}

  private getRandomResource(
    resourcePath: string,
    minId: number,
    maxId: number,
    retries = this.MAX_RETRIES
  ): Observable<any> {
    if (retries <= 0) {
      return throwError(() => new Error("Too many failed attempts"));
    }

    const randomId = this.getRandomId(minId, maxId);

    return this.http.get(`${this.baseUrl}/${resourcePath}/${randomId}`).pipe(
      map((response: any) => response.result.properties),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.getRandomResource(
            resourcePath,
            minId,
            maxId,
            retries - 1
          );
        }
        return throwError(() => error);
      })
    );
  }

  getRandomPerson(): Observable<Person> {
    return this.getRandomResource(
      ResourceType.People,
      this.MIN_ID,
      this.PEOPLE_MAX_ID
    );
  }

  getRandomStarship(): Observable<Starship> {
    return this.getRandomResource(
      ResourceType.Starships,
      this.MIN_ID,
      this.STARSHIP_MAX_ID
    );
  }

  private getRandomId(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
