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

export type EditEducationRequest = {
  universityId: string;
  year: string;
  gpa: string;
  majors: string[];
  minors: string[];
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
  @Input() defaultValues?: EditEducationRequest;

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
      universityId: [this.defaultValues?.universityId ?? ''],
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
