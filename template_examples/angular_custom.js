/*
This is a custom version of Angular's component creation using the angular-cli

As you can see, each template is a function that returns an object with the following properties:

- filename { string } : the name of the file it creates
- content { string } : the content of the file at the moment of creation
- test { boolean } : if set to true, this file will be created in the test folder ( if the configuration permits it )

The file needs to return an array of all the templates needed to create the desired element

*/

function indexTemplate(name, formattedName) {
	return {
		filename: "index.ts",
		content: `export * from './${name}.component';`
	};
}

function tsTemplate(name, formattedName) {
	return {
		filename: `${name}.component.ts`,
		content: `import { 
	Component,
	OnInit,
	ChangeDetectionStrategy
} from "@angular/core";

@Component({
	selector: "${name}",
	templateUrl: "./${name}.component.html",
	styleUrls: ["./${name}.component.scss"]
})
export class ${formattedName}Component implements OnInit {
	
	constructor() {
	}	
	ngOnInit() {
	}
}`
	};
}
function htmlTemplate(name, formattedName) {
	return {
		filename: `${name}.component.html`,
		content: `<p>
	${name} works!
</p>`
	};
}
function scssTemplate(name, formattedName) {
	return {
		filename: `${name}.component.scss`,
		content: ""
	};
}
function testTemplate(name, formattedName) {
	return {
		filename: `${name}.component.spec.ts`,
		content: `import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ${formattedName}Component } from '../${name}.component';

describe('${formattedName}Component', () => {
	let component: ${formattedName}Component;
	let fixture: ComponentFixture<${formattedName}Component>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ ${formattedName}Component ]
	})
	.compileComponents();
	}));

	beforeEach(() => {
	fixture = TestBed.createComponent(${formattedName}Component);
	component = fixture.componentInstance;
	fixture.detectChanges();
	});

	it('should create', () => {
	expect(component).toBeTruthy();
	});
});`,
		test: true
	};
}

module.exports = [indexTemplate, tsTemplate, htmlTemplate, scssTemplate, testTemplate];
