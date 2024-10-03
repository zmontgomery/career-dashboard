import { Component, Input, OnInit } from '@angular/core';
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
import { DegreeProgramOperation } from '../../portfolio.service';

export type EditEducationFormValues = {
  universityId: string;
  year: string;
  gpa: string;
  majors: DegreeProgramOperation[];
  minors: DegreeProgramOperation[];
};

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
  @Input() defaultValues?: EditEducationFormValues;

  public constructor(
    private readonly dialogRef: MatDialogRef<EditEducationDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    console.log('hello');
    this.createForm();
    this.dialogRef.addPanelClass('edit-dialog');
    console.log(this.form);
  }

  createForm() {
    this.form = this.formBuilder.group({
      universityId: [
        this.defaultValues?.universityId ?? '',
        this.universityIdValidator(),
      ],
      year: [this.defaultValues?.year ?? null],
      gpa: [this.defaultValues?.gpa ?? '', this.gpaValidator()],
      majors: this.formBuilder.array<FormControl>(
        this.defaultValues?.majors.map((major) =>
          this.formBuilder.control(major)
        ) ?? []
      ),
      minors: this.formBuilder.array<FormControl>(
        this.defaultValues?.minors.map((minor) =>
          this.formBuilder.control(minor)
        ) ?? []
      ),
    });
  }

  universityIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const regex = new RegExp(/^\d+$/);
      if (!regex.test(value)) {
        return { notInteger: true };
      }
      return null;
    };
  }

  gpaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const regex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!regex.test(value)) {
        return { invalidNumber: true };
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
