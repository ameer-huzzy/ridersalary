// Mock data store for the application
export interface Employee {
  id: string;
  name: string;
  emiratesId: string;
  phone: string;
  email: string;
  nationality: string;
  dob: string;
  partner: string;
  wpsVendor: string;
  status: "active" | "inactive";
  joinDate: string;
  baseSalary: number;
}

export interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  activeRiders: number;
}

export interface WPSVendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  linkedRiders: number;
}

export interface WeeklyUpload {
  id: string;
  week: string;
  partner: string;
  uploadDate: string;
  totalRecords: number;
  validRecords: number;
  errors: number;
  totalPay: string;
  status: string;
}

// export interface Deduction {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   type: string;
//   amount: string;
//   date: string;
//   status: string;
//   recurring: boolean;
//   periods?: string;
//   notes?: string;
// }
// ======================================================================================================================================
export interface Deduction {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  amount: string;
  date: string;
  status: string;
  recurring: boolean;
  periods?: string;
  notes?: string;
  deductionBreakdown?: {
    trafficFine: string;
    loanDeduction: string;
    advancePayment: string;
    vendorFee: string;
    equipmentDamage: string;
    trainingCharge: string;
    other: string;
  };
}
// =========================================================================================================================================

export interface TrainingCharge {
  id: string;
  employeeId: string;
  employeeName: string;
  chargeAmount: string;
  assignedDate: string;
  status: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Initial data
const initialEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Ahmed Hassan",
    emiratesId: "784-****-****-1",
    phone: "+971 50 123 4567",
    email: "ahmed@riderapp.com",
    nationality: "UAE",
    dob: "1990-05-15",
    partner: "Careem",
    wpsVendor: "ADP",
    status: "active",
    joinDate: "2024-01-15",
    baseSalary: 3000,
  },
  {
    id: "EMP002",
    name: "Mohammed Ali",
    emiratesId: "784-****-****-2",
    phone: "+971 50 234 5678",
    email: "mohammed@riderapp.com",
    nationality: "Pakistan",
    dob: "1988-08-20",
    partner: "Talabat",
    wpsVendor: "ADP",
    status: "active",
    joinDate: "2024-02-20",
    baseSalary: 3000,
  },
  {
    id: "EMP003",
    name: "Saeed Abdullah",
    emiratesId: "784-****-****-3",
    phone: "+971 50 345 6789",
    email: "saeed@riderapp.com",
    nationality: "India",
    dob: "1992-03-10",
    partner: "Careem",
    wpsVendor: "Payroll ME",
    status: "active",
    joinDate: "2024-01-10",
    baseSalary: 3000,
  },
  {
    id: "EMP004",
    name: "Omar Khalid",
    emiratesId: "784-****-****-4",
    phone: "+971 50 456 7890",
    email: "omar@riderapp.com",
    nationality: "Egypt",
    dob: "1991-11-25",
    partner: "Noon",
    wpsVendor: "ADP",
    status: "inactive",
    joinDate: "2023-11-05",
    baseSalary: 3000,
  },
  {
    id: "EMP005",
    name: "Ali Rahman",
    emiratesId: "784-****-****-5",
    phone: "+971 50 567 8901",
    email: "ali@riderapp.com",
    nationality: "Bangladesh",
    dob: "1989-07-18",
    partner: "Talabat",
    wpsVendor: "Payroll ME",
    status: "active",
    joinDate: "2024-03-12",
    baseSalary: 3000,
  },
  {
    id: "EMP006",
    name: "Hassan Yousef",
    emiratesId: "784-****-****-6",
    phone: "+971 50 678 9012",
    email: "hassan@riderapp.com",
    nationality: "Syria",
    dob: "1993-04-22",
    partner: "Keeta",
    wpsVendor: "ADP",
    status: "active",
    joinDate: "2024-03-18",
    baseSalary: 3000,
  },
  {
    id: "EMP007",
    name: "Khalid Ahmed",
    emiratesId: "784-****-****-7",
    phone: "+971 50 789 0123",
    email: "khalid@riderapp.com",
    nationality: "UAE",
    dob: "1990-09-30",
    partner: "Careem",
    wpsVendor: "Payroll ME",
    status: "active",
    joinDate: "2024-04-05",
    baseSalary: 3000,
  },
  {
    id: "EMP008",
    name: "Youssef Ibrahim",
    emiratesId: "784-****-****-8",
    phone: "+971 50 890 1234",
    email: "youssef@riderapp.com",
    nationality: "Jordan",
    dob: "1992-06-14",
    partner: "Noon",
    wpsVendor: "ADP",
    status: "active",
    joinDate: "2024-04-20",
    baseSalary: 3000,
  },
];

const initialPartners: Partner[] = [
  {
    id: "P001",
    name: "Careem",
    contactPerson: "Ali Ahmed",
    phone: "+971 4 123 4567",
    email: "operations@careem.ae",
    activeRiders: 52,
  },
  {
    id: "P002",
    name: "Talabat",
    contactPerson: "Sara Mohammed",
    phone: "+971 4 234 5678",
    email: "partner@talabat.ae",
    activeRiders: 38,
  },
  {
    id: "P003",
    name: "Noon",
    contactPerson: "Omar Hassan",
    phone: "+971 4 345 6789",
    email: "delivery@noon.com",
    activeRiders: 28,
  },
  {
    id: "P004",
    name: "Keeta",
    contactPerson: "Fatima Ali",
    phone: "+971 4 456 7890",
    email: "support@keeta.ae",
    activeRiders: 24,
  },
];

const initialWPSVendors: WPSVendor[] = [
  {
    id: "WPS001",
    name: "ADP",
    contactPerson: "John Smith",
    phone: "+971 4 567 8901",
    email: "uae@adp.com",
    linkedRiders: 82,
  },
  {
    id: "WPS002",
    name: "Payroll ME",
    contactPerson: "Ahmed Khalid",
    phone: "+971 4 678 9012",
    email: "support@payrollme.ae",
    linkedRiders: 45,
  },
  {
    id: "WPS003",
    name: "TASC",
    contactPerson: "Sarah Johnson",
    phone: "+971 4 789 0123",
    email: "info@tasc.ae",
    linkedRiders: 15,
  },
];

const initialUploads: WeeklyUpload[] = [
  {
    id: "UP001",
    week: "Week 40, 2024",
    partner: "Careem",
    uploadDate: "2024-10-02",
    totalRecords: 1240,
    validRecords: 1238,
    errors: 2,
    totalPay: "AED 18,234",
    status: "completed",
  },
  {
    id: "UP002",
    week: "Week 40, 2024",
    partner: "Talabat",
    uploadDate: "2024-10-02",
    totalRecords: 980,
    validRecords: 978,
    errors: 2,
    totalPay: "AED 15,678",
    status: "completed",
  },
  {
    id: "UP003",
    week: "Week 39, 2024",
    partner: "Careem",
    uploadDate: "2024-09-25",
    totalRecords: 1180,
    validRecords: 1175,
    errors: 5,
    totalPay: "AED 17,432",
    status: "completed",
  },
  {
    id: "UP004",
    week: "Week 39, 2024",
    partner: "Noon",
    uploadDate: "2024-09-25",
    totalRecords: 642,
    validRecords: 640,
    errors: 2,
    totalPay: "AED 9,823",
    status: "completed",
  },
];

const initialDeductions: Deduction[] = [
  {
    id: "DED001",
    employeeId: "EMP001",
    employeeName: "Ahmed Hassan",
    type: "Traffic Fine",
    amount: "AED 500",
    date: "2024-09-28",
    status: "pending",
    recurring: false,
  },
  {
    id: "DED002",
    employeeId: "EMP003",
    employeeName: "Saeed Abdullah",
    type: "Loan Deduction",
    amount: "AED 300",
    date: "2024-10-01",
    status: "applied",
    recurring: true,
    periods: "6 months",
  },
  {
    id: "DED003",
    employeeId: "EMP002",
    employeeName: "Mohammed Ali",
    type: "Training Charge",
    amount: "AED 200",
    date: "2024-09-15",
    status: "applied",
    recurring: false,
  },
  {
    id: "DED004",
    employeeId: "EMP001",
    employeeName: "Ahmed Hassan",
    type: "Advance Payment",
    amount: "AED 1000",
    date: "2024-09-20",
    status: "applied",
    recurring: true,
    periods: "3 months",
  },
  {
    id: "DED005",
    employeeId: "EMP004",
    employeeName: "Omar Khalid",
    type: "Vendor Fee",
    amount: "AED 150",
    date: "2024-10-02",
    status: "pending",
    recurring: false,
  },
];

const initialTrainingCharges: TrainingCharge[] = [
  {
    id: "TC001",
    employeeId: "EMP005",
    employeeName: "Ali Rahman",
    chargeAmount: "AED 500",
    assignedDate: "2024-09-20",
    status: "active",
  },
  {
    id: "TC002",
    employeeId: "EMP006",
    employeeName: "Hassan Yousef",
    chargeAmount: "AED 500",
    assignedDate: "2024-09-22",
    status: "active",
  },
];

const initialUsers: User[] = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@riderapp.com",
    role: "Administrator",
    status: "active",
  },
  {
    id: "U002",
    name: "HR Manager",
    email: "hr@riderapp.com",
    role: "Manager",
    status: "active",
  },
  {
    id: "U003",
    name: "Payroll Staff",
    email: "payroll@riderapp.com",
    role: "Staff",
    status: "active",
  },
];

// In-memory data store
export const dataStore = {
  employees: [...initialEmployees],
  partners: [...initialPartners],
  wpsVendors: [...initialWPSVendors],
  weeklyUploads: [...initialUploads],
  deductions: [...initialDeductions],
  trainingCharges: [...initialTrainingCharges],
  users: [...initialUsers],
};

// Helper functions
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}