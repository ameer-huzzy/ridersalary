const API_BASE_URL = 'http://localhost:8000';

export interface Employee {
  employee_id: number;
  captain_id?: string;
  name: string;
  person_code?: string;
  card_no?: string;
  wps_vendor_id?: number;
  designation?: string;
  doj?: string;
  partner_id?: number;
  phone_no?: string;
  emirates_id?: string;
  passport_no?: string;
  visa_status?: string;
  training_fee?: number;
  training_fee_deduction?: number;
  status?: string;
}

export interface EmployeeCreate {
  name: string;
  captain_id?: string;
  person_code?: string;
  card_no?: string;
  wps_vendor_id?: number;
  designation?: string;
  doj?: string;
  partner_id?: number;
  phone_no?: string;
  emirates_id?: string;
  passport_no?: string;
  visa_status?: string;
  training_fee?: number;
  training_fee_deduction?: number;
  status?: string;
}

export interface EmployeeUpdate {
  name?: string;
  captain_id?: string;
  person_code?: string;
  card_no?: string;
  wps_vendor_id?: number;
  designation?: string;
  doj?: string;
  partner_id?: number;
  phone_no?: string;
  emirates_id?: string;
  passport_no?: string;
  visa_status?: string;
  training_fee?: number;
  training_fee_deduction?: number;
  status?: string;
}

export interface Partner {
  partner_id: number;
  partner_name: string;
  contact_person?: string;
  contact_email?: string;
}

export interface PartnerCreate {
  partner_name: string;
  contact_person?: string;
  contact_email?: string;
}

export interface PartnerUpdate {
  partner_name?: string;
  contact_person?: string;
  contact_email?: string;
}

export interface WPSVendor {
  wps_vendor_id: number;
  vendor_name: string;
}

export interface WPSVendorCreate {
  vendor_name: string;
}

export interface WPSVendorUpdate {
  vendor_name?: string;
}

export interface WeeklyTrip {
  trip_id: number;
  employee_id: number;
  week_start_date: string;
  week_end_date: string;
  total_working_hours?: number;
  total_orders?: number;
  actual_order_pay?: number;
  excess_pay?: number;
  cod_collected?: number;
  upload_batch_id?: number;
  created_at?: string;
}

export interface WeeklyTripCreate {
  employee_id: number;
  week_start_date: string;
  week_end_date: string;
  total_working_hours?: number;
  total_orders?: number;
  actual_order_pay?: number;
  excess_pay?: number;
  cod_collected?: number;
  upload_batch_id?: number;
}

export interface WeeklyTripUpdate {
  employee_id?: number;
  week_start_date?: string;
  week_end_date?: string;
  total_working_hours?: number;
  total_orders?: number;
  actual_order_pay?: number;
  excess_pay?: number;
  cod_collected?: number;
  upload_batch_id?: number;
}

export interface Deduction {
  deduction_id: number;
  employee_id: number;
  monthstart_date: string;
  vendor_fee?: number;
  traffic_fine?: number;
  loan_fine?: number;
  training_fee?: number;
  others?: number;
  remarks?: string;
}

export interface DeductionCreate {
  employee_id: number;
  monthstart_date: string;
  vendor_fee?: number;
  traffic_fine?: number;
  loan_fine?: number;
  training_fee?: number;
  others?: number;
  remarks?: string;
}

export interface DeductionUpdate {
  employee_id?: number;
  monthstart_date?: string;
  vendor_fee?: number;
  traffic_fine?: number;
  loan_fine?: number;
  training_fee?: number;
  others?: number;
  remarks?: string;
}

export interface DashboardStats {
  total_orders: string;
  active_riders: number;
  employees_this_month: number;
  total_cod: string;
  total_hours: string;
  orders_change: string;
  riders_change: string;
  cod_change: string;
  hours_change: string;
}

export interface PartnerPerformance {
  name: string;
  orders: number;
  cod: number;
  hours: number;
}

export interface OrderDistribution {
  name: string;
  value: number;
  color: string;
}

export interface EmployeeJoins {
  month: string;
  employees: number;
}

export interface WeeklyDeduction {
  week: string;
  Careem: number;
  Talabat: number;
  Noon: number;
  Keeta: number;
}

export interface TopPerformer {
  name: string;
  orders: number;
  earnings: string;
  partner: string;
}

export interface DashboardAlert {
  type: string;
  message: string;
}

export interface MonthlySalaryReport {
  report_id: number;
  careem_captain_id?: string;
  person_code?: string;
  card_no?: string;
  designation?: string;
  doj?: string;
  name?: string;
  total_working_hours: number;
  no_of_days: number;
  total_orders: number;
  actual_order_pay: number;
  total_excess_pay: number;
  gross_pay: number;
  total_cod: number;
  vendor_fee: number;
  traffic_fine: number;
  loan_fine: number;
  training_fee: number;
  net_salary: number;
  remarks?: string;
  month_year?: string;
  generated_date: string;
}

export interface LimoPayment {
  payment_id: string;
  limo_company: string;
  limo_company_id: string;
  captain_name: string;
  captain_id: string;
  payment_date: string;
  payment_method: string;
  total_driver_base_cost: number;
  total_driver_other_cost: number;
  total_driver_payment: number;
  tips: number;
  created_at: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  // Employee endpoints
  async getEmployees(): Promise<Employee[]> {
    return this.request('/employees/');
  }

  async getEmployee(id: number): Promise<Employee> {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(employee: EmployeeCreate): Promise<Employee> {
    return this.request('/employees/', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: number, employee: EmployeeUpdate): Promise<Employee> {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Partner endpoints
  async getPartners(): Promise<Partner[]> {
    return this.request('/partners/');
  }

  async createPartner(partner: PartnerCreate): Promise<Partner> {
    return this.request('/partners/', {
      method: 'POST',
      body: JSON.stringify(partner),
    });
  }

  async updatePartner(id: number, partner: PartnerUpdate): Promise<Partner> {
    return this.request(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner),
    });
  }

  async deletePartner(id: number): Promise<void> {
    return this.request(`/partners/${id}`, {
      method: 'DELETE',
    });
  }

  // WPS Vendor endpoints
  async getWPSVendors(): Promise<WPSVendor[]> {
    return this.request('/wps-vendors/');
  }

  async createWPSVendor(vendor: WPSVendorCreate): Promise<WPSVendor> {
    return this.request('/wps-vendors/', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
  }

  async updateWPSVendor(id: number, vendor: WPSVendorUpdate): Promise<WPSVendor> {
    return this.request(`/wps-vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor),
    });
  }

  async deleteWPSVendor(id: number): Promise<void> {
    return this.request(`/wps-vendors/${id}`, {
      method: 'DELETE',
    });
  }

  // Weekly Trip endpoints
  async getWeeklyTrips(): Promise<WeeklyTrip[]> {
    return this.request('/weekly-trips/');
  }

  async getWeeklyTrip(id: number): Promise<WeeklyTrip> {
    return this.request(`/weekly-trips/${id}`);
  }

  async getWeeklyTripsByEmployee(employeeId: number): Promise<WeeklyTrip[]> {
    return this.request(`/weekly-trips/employee/${employeeId}`);
  }

  async createWeeklyTrip(trip: WeeklyTripCreate): Promise<WeeklyTrip> {
    return this.request('/weekly-trips/', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
  }

  async updateWeeklyTrip(id: number, trip: WeeklyTripUpdate): Promise<WeeklyTrip> {
    return this.request(`/weekly-trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trip),
    });
  }

  async deleteWeeklyTrip(id: number): Promise<void> {
    return this.request(`/weekly-trips/${id}`, {
      method: 'DELETE',
    });
  }

  // Deduction endpoints
  async getDeductions(): Promise<Deduction[]> {
    return this.request('/deductions/');
  }

  async getDeduction(id: number): Promise<Deduction> {
    return this.request(`/deductions/${id}`);
  }

  async getDeductionsByEmployee(employeeId: number): Promise<Deduction[]> {
    return this.request(`/deductions/employee/${employeeId}`);
  }

  async createDeduction(deduction: DeductionCreate): Promise<Deduction> {
    return this.request('/deductions/', {
      method: 'POST',
      body: JSON.stringify(deduction),
    });
  }

  async updateDeduction(id: number, deduction: DeductionUpdate): Promise<Deduction> {
    return this.request(`/deductions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deduction),
    });
  }

  async deleteDeduction(id: number): Promise<void> {
    return this.request(`/deductions/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/dashboard/stats');
  }

  async getPartnerPerformance(): Promise<PartnerPerformance[]> {
    return this.request('/dashboard/partner-performance');
  }

  async getOrderDistribution(): Promise<OrderDistribution[]> {
    return this.request('/dashboard/order-distribution');
  }

  async getEmployeeJoins(): Promise<EmployeeJoins[]> {
    return this.request('/dashboard/employee-joins');
  }

  async getWeeklyDeductions(): Promise<WeeklyDeduction[]> {
    return this.request('/dashboard/weekly-deductions');
  }

  async getTopPerformers(): Promise<TopPerformer[]> {
    return this.request('/dashboard/top-performers');
  }

  async getDashboardAlerts(): Promise<DashboardAlert[]> {
    return this.request('/dashboard/alerts');
  }

  // Monthly Salary Report endpoints
  async getSalaryReports(): Promise<MonthlySalaryReport[]> {
    return this.request('/monthly-salary-reports/');
  }

  async getSalaryReportsByMonth(monthYear: string): Promise<MonthlySalaryReport[]> {
    return this.request(`/monthly-salary-reports/month/${monthYear}`);
  }

  async createSalaryReport(report: any): Promise<MonthlySalaryReport> {
    return this.request('/monthly-salary-reports/', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async updateSalaryReport(reportId: number, report: any): Promise<MonthlySalaryReport> {
    return this.request(`/monthly-salary-reports/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(report),
    });
  }

  async deleteSalaryReport(reportId: number): Promise<void> {
    return this.request(`/monthly-salary-reports/${reportId}`, {
      method: 'DELETE',
    });
  }

  // Limo Payments endpoints
  async getLimoPayments(): Promise<LimoPayment[]> {
    return this.request('/limo-payments/');
  }

  async createLimoPayment(payment: any): Promise<LimoPayment> {
    return this.request('/limo-payments/', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

async uploadLimoPayments(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${this.baseUrl}/limo-payments/upload/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 400) {
      // Return the 400 response data instead of throwing
      return errorData;
    }
    throw new Error(`Upload error: ${response.status}`);
  }

  return response.json();
}
  // Export endpoints - FIXED URL paths
  async exportSalaryPDF(monthYear: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/monthly-salary-reports/export-pdf?month_year=${monthYear}`);
    if (!response.ok) {
      throw new Error(`PDF export failed: ${response.status}`);
    }
    return response.blob();
  }

  async exportSalaryExcel(monthYear: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/monthly-salary-reports/export-excel?month_year=${monthYear}`);
    if (!response.ok) {
      throw new Error(`Excel export failed: ${response.status}`);
    }
    return response.blob();
  }
  // Add this method in the Monthly Salary Report endpoints section
async generateMonthlyReport(monthYear: string): Promise<any> {
  return this.request(`/monthly-salary-reports/generate/${monthYear}`, {
    method: 'POST',
  });
}
}

export const apiService = new ApiService();