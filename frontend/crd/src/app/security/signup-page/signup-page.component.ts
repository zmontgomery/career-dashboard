import { Component, OnInit } from '@angular/core';
import { User } from '../domain/user';
import { AuthService } from '../auth.service';
import { LangUtils } from 'src/app/util/lang-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.less']
})
export class SignupPageComponent implements OnInit {
  user: User = User.makeEmpty();
  form: FormGroup | null = null;
  

  constructor(
    private readonly authService: AuthService, 
    private readonly formBuilder: FormBuilder
    ) { } 

  ngOnInit(): void {
      this.authService.user$.subscribe((user) => {
        this.user = user!;
      });

      this.form = this.formBuilder.group({
        'phoneNumber': ['']
      });

      this.form
  }

  
}
