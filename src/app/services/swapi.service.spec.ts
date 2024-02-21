/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { SwapiService } from "./swapi.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("Service: Swapi", () => {
  let service: SwapiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwapiService],
    });

    service = TestBed.inject(SwapiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should return a random person", () => {
    const mockPerson = { name: "Luke Skywalker" };

    service.getRandomPerson().subscribe((person) => {
      expect(person.name).toEqual("Luke Skywalker");
    });

    const req = httpTestingController.expectOne((request) =>
      request.url.includes("people")
    );
    expect(req.request.method).toEqual("GET");
    req.flush({ result: { properties: mockPerson } });
  });

  it("should return a random starship", () => {
    const mockStarship = { name: "Millennium Falcon" };

    service.getRandomStarship().subscribe((starship) => {
      expect(starship.name).toEqual("Millennium Falcon");
    });

    const req = httpTestingController.expectOne((request) =>
      request.url.includes("starships")
    );
    expect(req.request.method).toEqual("GET");
    req.flush({ result: { properties: mockStarship } });
  });

  it("should retry the correct number of times on 404 response", () => {
    const maxRetries = service["MAX_RETRIES"];
    let attempts = 0;

    service.getRandomPerson().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(attempts).toEqual(maxRetries);
      },
    });

    for (let i = 0; i < maxRetries; i++) {
      attempts++;
      const req = httpTestingController.expectOne((request) =>
        request.url.includes("people")
      );
      expect(req.request.method).toEqual("GET");
      req.flush("Not Found", { status: 404, statusText: "Not Found" });
    }
  });
});
