# RiderApp Management System

A comprehensive web-based management system for managing delivery riders, partners, weekly trip uploads, deductions, and salary reports.

## Login Credentials

### Admin Account
- **Email:** admin@riderapp.com
- **Password:** admin123
- **Access:** Full access to all modules and settings

### User Account (Employee)
- **Email:** ahmed@riderapp.com
- **Password:** user123
- **Access:** Limited to viewing own employee data and reports

### Additional Admin Account
- **Email:** hr@riderapp.com
- **Password:** admin123
- **Access:** Full admin access

## Features

### 1. Employee Management
- ✅ Add new employees with personal and work details
- ✅ Edit existing employee information
- ✅ View employee profiles
- ✅ Import employee list (bulk upload)
- ✅ Export employee data
- ✅ Manage employee status (active/inactive)
- ✅ Link employees to delivery partners and WPS vendors

### 2. Partner & Vendor Management
- ✅ Add and edit delivery partners (Careem, Talabat, Noon, Keeta)
- ✅ Add and edit WPS vendors (ADP, Payroll ME, TASC)
- ✅ Track active riders per partner
- ✅ Manage contact information

### 3. Weekly Trip Upload
- ✅ Upload weekly trip data (Excel format)
- ✅ Auto-validation of uploaded data
- ✅ View upload history
- ✅ Export uploaded data
- ✅ Track upload errors and statistics

### 4. Deductions & Charges
- ✅ Add one-time deductions (traffic fines, equipment damage)
- ✅ Add recurring deductions (loan repayments)
- ✅ Assign training charges to employees
- ✅ Track deduction status
- ✅ View deduction history

### 5. Monthly Salary Report
- ✅ Generate monthly salary reports
- ✅ Export to PDF and Excel
- ✅ View report history
- ✅ Download historical reports
- ✅ Track salary breakdowns (base pay, COD, deductions)

### 6. Analytics & Reports
- 📊 Weekly performance trends
- 📊 Partner performance comparison
- 📊 Deduction analysis
- 📊 Top performers tracking

### 7. Dashboard
- 📈 Real-time statistics (orders, riders, COD, working hours)
- 📈 Partner performance charts
- 📈 Order distribution visualization
- 📈 Top performers list
- 📈 System alerts and notifications

### 8. Settings
- ✅ Add and manage users
- ✅ Configure system settings
- ✅ Set training fees and salary cut-off dates
- ✅ Enable/disable email notifications
- ✅ View audit trail
- ✅ Manage role-based permissions

## User Roles & Permissions

### Administrator
- Full access to all modules
- Can add, edit, and delete all data
- Can manage users and system settings
- Can view all employees and reports

### User (Employee)
- Limited access to view own data only
- Cannot modify employee records
- Cannot access system settings
- Can view own salary reports

## Technology Stack

- **Frontend:** React with TypeScript
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Notifications:** Sonner
- **State Management:** React Context API
- **Data Storage:** In-memory data store (mock database)

## Getting Started

1. The application loads with a login screen
2. Use one of the provided credentials to log in
3. Navigate through modules using the sidebar
4. Admins can perform all CRUD operations
5. Regular users have read-only access to their own data

## Data Persistence

Currently, the application uses an in-memory data store. All changes are temporary and will reset on page reload. For production use, integrate with a backend API or database like Supabase.

## Future Enhancements

- Real backend integration with Supabase
- File upload for documents (Emirates ID, Passport, Visa)
- Real-time notifications
- Advanced analytics and reporting
- Mobile responsive improvements
- Multi-language support
- Email notification system
- Automated salary calculations
