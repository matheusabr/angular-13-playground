import { Component, OnInit } from '@angular/core';

interface BaseSection {
  key: string;
  data: Record<string, any>; // Using a more generic type for data
}

// Assuming Section1Data and Section2Data structures for demonstration
// No strict typing for section data due to the dynamic requirement

type Section = BaseSection; // Direct use of BaseSection for simplicity

interface RequiredProps {
  [sectionName: string]: string[][]; // Array of arrays to represent property depth
}

@Component({
  selector: 'm-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {
  sections: Section[] = [
    {
      key: 'section1',
      data: {
        property1: 'Some string',
        property2: 123,
        property3: [{ test: 2 }],
        property4: [
          {
            text: 'Text 1',
            property4_1: [{ test: 5 }], // Nested
          },
        ],
      },
    },
    {
      key: 'section2',
      data: {
        differentProperty1: 'Another string',
        differentProperty2: [456, 789],
        differentProperty3: {
          subProperty: 'SubString',
        },
      },
    },
  ];

  requiredProps: RequiredProps = {
    'section1': [['property1'], ['property2'], ['property3'], ['property4', 'property4_1']],
    'section2': [['differentProperty1'], ['differentProperty2'], ['differentProperty3', 'subProperty']],
  };

  constructor() { }

  ngOnInit(): void {
    const allPropsFilled = this.areRequiredPropsFilled(this.sections, this.requiredProps);
    console.log(allPropsFilled); // true or false  
  }
  
  areRequiredPropsFilled(sections: Section[], requiredProps: RequiredProps): boolean {
    return sections.every(section => {
      const sectionRequiredProps = requiredProps[section.key];
      if (!sectionRequiredProps) return false;
  
      return sectionRequiredProps.every(propsPath => {
        let currentValue: any = section.data;
        for (const prop of propsPath) {
          if (currentValue === undefined || currentValue === null) {
            return false; // If any parent in the path is undefined or null, stop checking
          }
          currentValue = currentValue[prop];
        }
        if (Array.isArray(currentValue)) {
          return currentValue.length > 0; // Check arrays are not empty
        }
        // For non-array, just check it's not undefined or null
        return currentValue !== undefined && currentValue !== null;
      });
    });
  }
}
