import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL= 'http://localhost:3000/api'
  

  constructor(private http:HttpClient, private router:Router) { }
  registrar(user:any){
        return this.http.post<any>(this.URL + '/ingresar', user);
  }
  Iniciar(user:any){
    return this.http.post<any>(this.URL + '/iniciar', user);
    
  }
loggedIn(){
 return !!localStorage.getItem('token');
}
getToken(){
return localStorage.getItem('token');
}
logout(){
  localStorage.removeItem('token');
  this.router.navigate(['/iniciar'])
}

checkEmailExists(email: string): Observable<any> {
  const dato='{"email":"'+email+'"}'
  const url = this.URL + '/verify-email';
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(url, dato, { headers });
  }

 checkInicioPass(email: string, password: string): Observable<any> {
    const dato = '{"email":"' + email + '", "password":"' + password + '"}';
    const url = this.URL + '/verify-inicio'; // Cambio de URL para verificar el inicio de sesión
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, dato, { headers });
  }
  
   
   
}
