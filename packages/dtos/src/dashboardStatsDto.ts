export interface SharedAdminStatsDto {
  pendingReservations: number,
  passedReservationsNotPaid: number,
  futureReservationsNotPaid: number
}

export interface SharedClientStatsDto {
  passedReservationsNotPaid: number,
  futureReservations: number,
  passedReservations: number
}
