import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../components/tasks/task.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, password });
  }

  login(username: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/login`, { username, password });
  }

  updateProfile(newUsername?: string, newPassword?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/profile`, { newUsername, newPassword }, { headers: this.getHeaders() });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }

  createTask(title:string, description?: string): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, { title, description }, { headers: this.getHeaders() });
  }

  updateTask(id: number, title?:string, description?: string, completed?: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, { title, description, completed }, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}