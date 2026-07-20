export interface AuditLog {
  id: string;
  log: string;
  details: string;
  companyId: string;
  company: string;
  createdAt: string;
  incidentId?: string;
}