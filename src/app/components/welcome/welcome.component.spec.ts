/* tslint:disable:no-unused-variable */
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { WelcomeComponent } from "./welcome.component";

describe("WelcomeComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent, RouterTestingModule],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(WelcomeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
