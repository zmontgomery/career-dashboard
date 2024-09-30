import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  type FormArray,
  type FormGroup,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-education-dialog',
  templateUrl: './edit-education-dialog.component.html',
  styleUrls: [
    './edit-education-dialog.component.less',
    '../../portfolio.component.less',
    '../education-section.component.less',
    '../../../../common.less',
  ],
})
export class EditEducationDialogComponent implements OnInit {
  protected title = 'Education';
  protected form!: FormGroup;
  protected readonly yearLevels = [
    null,
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
  ];

  public constructor(
    private readonly dialogRef: MatDialogRef<EditEducationDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.dialogRef.addPanelClass('edit-dialog');
  }

  createForm() {
    this.form = this.formBuilder.group({
      universityId: [''],
      year: [null],
      gpa: ['', this.gpaValidator()],
      majors: this.formBuilder.array<FormControl>([]),
      minors: this.formBuilder.array<FormControl>([]),
    });
  }

  gpaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const regex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!regex.test(value)) {
        return { invalidGpa: true };
      }
      return null;
    };
  }

  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  get majors(): FormArray<FormControl> {
    return this.form?.controls['majors'] as FormArray<FormControl>;
  }

  get minors(): FormArray<FormControl> {
    return this.form?.controls['minors'] as FormArray<FormControl>;
  }
}
