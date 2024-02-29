import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { User } from '../domain/user';
import { AuthService } from '../auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.less']
})
export class SignupPageComponent implements OnInit, OnDestroy {
  user: User = User.makeEmpty();
  form: FormGroup;
  
  phoneNumberControl: FormControl<string | null>;
  preferredNameControl: FormControl<string | null>;
  canTextControl: FormControl<boolean | null>;
  canEmailControl: FormControl<boolean | null>;

  phoneNumber: string = '';
  preferredName: string = '';
  canText: boolean = true;
  canEmail: boolean = true;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly authService: AuthService, 
    private readonly formBuilder: FormBuilder
  ) {
    this.phoneNumberControl = this.formBuilder.control<string>('', [Validators.required, this.lengthValidator(14)]);
    this.preferredNameControl = this.formBuilder.control<string>('', [this.nameValidator(/[\d{}()\]\[|\"?/@#$%^&*=+_<>,:;]]*/g)]);
    this.canTextControl = this.formBuilder.control<boolean>(false);
    this.canEmailControl = this.formBuilder.control<boolean>(false);

    this.form = this.formBuilder.group({
      'phoneNumber': this.phoneNumberControl,
      'preferredName': this.preferredNameControl,
      'canText': this.canTextControl,
      'canEmail': this.canEmailControl,
    });

    this.canTextControl.setValue(true);
    this.canEmailControl.setValue(true);
  } 

  nameError = false;

  private phoneSub: Subscription | null = null;
  private preferredSub: Subscription | null = null;
  private textSub: Subscription | null  = null;
  private emailSub: Subscription | null  = null;

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user!;
    });

    this.phoneSub = this.phoneNumberControl.valueChanges.subscribe((val) => {
      const ref = this.elementRef.nativeElement.getElementsByClassName('password-field')[0];

      ref.value = /^[(]*[\d]{0,3}[)]*([\d-]{0,4})*$/.test(val!) ? this.formatPhoneNumber(val!) 
        : val!.substring(0, val!.length - 1);
      
      this.phoneNumber = ref.value.replace('(', '').replace(')', '');
    });

    this.preferredSub = this.preferredNameControl.valueChanges.subscribe((val) => {
        this.preferredName = val!;
    });

    this.textSub = this.canTextControl.valueChanges.subscribe((val) => {
      this.canText = val!;
    });

    this.emailSub = this.canEmailControl.valueChanges.subscribe((val) => {
      this.canEmail = val!;
    });
  }

  ngOnDestroy(): void {
    this.phoneSub?.unsubscribe();
    this.preferredSub?.unsubscribe();
    this.textSub?.unsubscribe();
    this.emailSub?.unsubscribe();
  }

  nicknameHasError(): boolean {
    return this.preferredNameControl.hasError('invalid');
  }

  phoneHasError(): boolean {
    return this.phoneNumberControl.hasError('invalid');
  }

  onCancel() {
    this.authService.signOut();
  }

  onSubmit() {
    this.user.phoneNumber = this.phoneNumber;
    this.user.preferredName = this.preferredName === '' ? this.user.firstName : this.preferredName;
    this.user.canEmail = this.canEmail;
    this.user.canText = this.canText;
    console.log(this.phoneNumber);
    this.authService.signup(this.user);
  }

  private formatPhoneNumber(input: string): string {
    input = input.replace(/[(]*/g, '').replace(/[)]*/g, '').replace(/[-]*/g, '');
    let area = '';
    let tel = '';
    let ext = '';
    let formatted = '';


    if (input.length <= 3) {
      area = input;
      formatted = input;
    }

    if (input.length > 3) {
      area = input.substring(0, 3);
      tel = input.substring(3, input.length);
      formatted = `(${area})`;
    }

    if (input.length > 6) {
      tel = input.substring(3, 6);
      ext = input.substring(6, 10);
    }

    if (tel.length > 0) {
      formatted += `-${tel}`;
    }

    if (ext.length > 0) {
      formatted += `-${ext}`;
    }

    return formatted;
  }

  private nameValidator(regex: RegExp): ValidatorFn {
    return (control: AbstractControl) => {
      const invalid = regex.test(control.value);
      return invalid ? {invalid: control} : null;
    };
  }

  private lengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl) => {
      const invalid = length > control.value.length;
      return invalid ? {invalid: control} : null;
    };
  }
}
