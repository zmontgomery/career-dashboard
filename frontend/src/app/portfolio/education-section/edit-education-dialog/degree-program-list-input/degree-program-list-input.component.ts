import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';

@Component({
  selector: 'degree-program-list-input',
  templateUrl: './degree-program-list-input.component.html',
  styleUrls: ['./degree-program-list-input.component.less'],
})
export class DegreeProgramListInputComponent {
  @Input() label!: string;
  @Input() addText: string = 'Add';
  @Input() formGroup!: FormGroup;
  @Input() formArray!: FormArray<FormControl<DegreeProgramOperation | null>>;
  @Input() formArrayName!: string;
  @Input() defaultValue!: DegreeProgramOperation;
  deleted: Set<number> = new Set();

  constructor(private formBuilder: FormBuilder) {}

  addInput(): void {
    this.formArray.push(
      this.formBuilder.control<DegreeProgramOperation>(
        this.defaultValue,
        Validators.required
      )
    );
  }

  arrayControls(): FormControl<DegreeProgramOperation>[] {
    return this.formArray.controls as FormControl<DegreeProgramOperation>[];
  }

  getValue(operation: DegreeProgramOperation): string {
    return operation.name;
  }

  setValue(control: FormControl<DegreeProgramOperation>, event: Event) {
    const target = event.target as HTMLInputElement;
    const currentValue = control.value;
    currentValue.name = target.value;
    if (currentValue.id) {
      currentValue.operation = 'Edit';
    }
    control.setValue(currentValue);
  }

  delete(control: FormControl<DegreeProgramOperation>, index: number) {
    const currentValue = control.value;
    this.deleted.add(index);
    if (currentValue.operation === 'Create') {
      return;
    }
    currentValue.operation = 'Delete';
    control.setValue(currentValue);
  }
}
