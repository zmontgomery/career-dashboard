import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

/**
 * Service used for authentication and checking if the user is authenticated
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean;

  constructor(
  ) { 
    this.isAuthenticated = false;
  }

  signIn() {
    
  }

  signOut() {

  }
}
