import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const LTOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  signOut(): void {
    localStorage.clear();
    window.sessionStorage.clear();
  }
  public saveToken(token: string): void {
    // window.sessionStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(LTOKEN_KEY);
    // window.sessionStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(LTOKEN_KEY, token);
  }
  public getToken(): string | null {
    // return window.sessionStorage.getItem(LTOKEN_KEY);
    return window.localStorage.getItem(LTOKEN_KEY);
  }
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
