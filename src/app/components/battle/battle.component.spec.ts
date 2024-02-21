/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BattleComponent } from "./battle.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("BattleComponent", () => {
  let fixture: ComponentFixture<BattleComponent>;
  let component: BattleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleComponent, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(BattleComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(BattleComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should unsubscribe on destroy", () => {
    const spy = spyOn(component.paramsSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
