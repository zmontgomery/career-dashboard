import { TestBed } from "@angular/core/testing";
import { AuthInterceptor } from "./auth-interceptor";

describe('AuthInterceptor', () => {
    let CuT: AuthInterceptor;
  
    beforeEach(() => {
      CuT = new AuthInterceptor();
    });
  
    it('should be created', () => {
      expect(CuT).toBeTruthy();
    });

    it('should add key to session storage')
  });