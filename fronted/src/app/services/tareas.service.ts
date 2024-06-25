import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private URL ='http://localhost:3000/api';
//  private URL ='http://3.142.124.217:3000/api';
  constructor(private http:HttpClient) { }
  getTarea(){
    return this.http.get<any>(this.URL + '/tareas');
      }
  getPrivateTasks(){
        return this.http.get<any>(this.URL + '/privatetasks');
          } 
}
