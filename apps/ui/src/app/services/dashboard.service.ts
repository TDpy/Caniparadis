import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {SharedAdminStatsDto, SharedClientStatsDto} from '@caniparadis/dtos/dist/dashboardStatsDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  getAdminDashboardStats(): Observable<SharedAdminStatsDto> {
    return this.http.get<SharedAdminStatsDto>('/dashboard-stats/admin');
  }

  getClientDashboardStats(userId: number): Observable<SharedClientStatsDto> {
    return this.http.get<SharedClientStatsDto>(`/dashboard-stats/client/${userId}`);
  }
}
