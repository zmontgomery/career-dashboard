import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.less'],
})
export class ListInputComponent {
  @Input() label!: string;
  @Input() addText: string = 'Add';
  @Input() formGroup!: FormGroup;
  @Input() formArray!: FormArray<FormControl>;
  @Input() formArrayName!: string;

  constructor(private formBuilder: FormBuilder) {}

  addInput(): void {
    this.formArray.push(this.formBuilder.control('', Validators.required));
  }

  removeInput(index: number): void {
    this.formArray.removeAt(index);
  }
}
