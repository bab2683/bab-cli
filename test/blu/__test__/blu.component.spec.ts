import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BluComponent } from '../blu.component';

describe('BluComponent', () => {
	let component: BluComponent;
	let fixture: ComponentFixture<BluComponent>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ BluComponent ]
	})
	.compileComponents();
	}));

	beforeEach(() => {
	fixture = TestBed.createComponent(BluComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
	});

	it('should create', () => {
	expect(component).toBeTruthy();
	});
});