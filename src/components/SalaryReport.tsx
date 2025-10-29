import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { FileDown, FileText, CheckCircle, Search } from "lucide-react";
import { apiService, MonthlySalaryReport } from "../services/api";

export function SalaryReport() {
  const [fromDate, setFromDate] = useState("2024-10-01");
  const [toDate, setToDate] = useState("2024-10-31");
  const [searchTerm, setSearchTerm] = useState("");
  const [salaryData, setSalaryData] = useState<MonthlySalaryReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalaryData();
  }, []);

  const loadSalaryData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSalaryReports();
      setSalaryData(data);
    } catch (error) {
      console.error("Error loading salary data:", error);
      toast.error("Failed to load salary data");
    } finally {
      setLoading(false);
    }
  };

  const filteredSalaryData = salaryData.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.careem_captain_id?.toString().includes(searchTerm) ||
    employee.person_code?.toString().includes(searchTerm)
  );

  const handleExportPDF = async () => {
    try {
      const monthYear = fromDate.substring(0, 7);
      const blob = await apiService.exportSalaryPDF(monthYear);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-report-${monthYear}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error("PDF export error:", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const monthYear = fromDate.substring(0, 7);
      const blob = await apiService.exportSalaryExcel(monthYear);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salary-report-${monthYear}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Excel exported successfully!");
    } catch (error) {
      toast.error("Failed to export Excel");
      console.error("Excel export error:", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both from and to dates");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From date must be before to date");
      return;
    }

    try {
      setLoading(true);
      const monthYear = fromDate.substring(0, 7);

      // Generate new report first
      await apiService.generateMonthlyReport(monthYear);

      // Then load the generated data
      const reports = await apiService.getSalaryReportsByMonth(monthYear);
      setSalaryData(reports);
      toast.success(`Salary report generated for ${fromDate} to ${toDate}`);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate salary report");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics - FIXED: Proper addition
  const totalEmployees = salaryData.length;
  const netPayout = salaryData.reduce((sum, emp) => {
    const netSalary = emp.net_salary || 0;
    return sum + netSalary;
  }, 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading salary reports...</div>;
  }

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null || value === 0) return "-";
    return value.toLocaleString();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl">Monthly Salary Report</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Generate and review monthly salary reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="sm:size-default" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span> PDF
          </Button>
          <Button variant="outline" size="sm" className="sm:size-default" onClick={handleExportExcel}>
            <FileText className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span> Excel
          </Button>
        </div>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Salary Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="opacity-0">Action</Label>
              <Button onClick={handleGenerateReport} className="w-full">Generate Report</Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-900">October 2024 Report Ready</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Period: {fromDate} to {toDate} • {totalEmployees} employees • Total net salary: {netPayout}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <h3 className="mt-1">{totalEmployees}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Net Salary</p>
            <h3 className="mt-1 text-green-600">{netPayout}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Salary Details Table */}
      {/* Salary Details Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-4">
            <CardTitle className="whitespace-nowrap">Salary Details - October 2024</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSalaryData}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">S.No</TableHead>
                  <TableHead className="whitespace-nowrap">Careem Captain ID</TableHead>
                  <TableHead className="whitespace-nowrap">Person Code</TableHead>
                  <TableHead className="whitespace-nowrap">Card No</TableHead>
                  <TableHead className="whitespace-nowrap">Designation</TableHead>
                  <TableHead className="whitespace-nowrap">DOJ</TableHead>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Total Working Hours</TableHead>
                  <TableHead className="whitespace-nowrap">No. of days</TableHead>
                  <TableHead className="whitespace-nowrap">Total orders</TableHead>
                  <TableHead className="whitespace-nowrap">Actual Order pay</TableHead>
                  <TableHead className="whitespace-nowrap">Total Excess pay</TableHead>
                  <TableHead className="whitespace-nowrap">Gross Pay</TableHead>
                  <TableHead className="whitespace-nowrap">Total COD</TableHead>
                  <TableHead className="whitespace-nowrap">Vendor Fee</TableHead>
                  <TableHead className="whitespace-nowrap">Traffic fine</TableHead>
                  <TableHead className="whitespace-nowrap">Loan/Sal.Adv/OS fine</TableHead>
                  <TableHead className="whitespace-nowrap">Training Fee</TableHead>
                  <TableHead className="whitespace-nowrap">Net Salary</TableHead>
                  <TableHead className="whitespace-nowrap">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalaryData.map((employee, index) => (
                  <TableRow key={employee.report_id}>
                    <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {employee.careem_captain_id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{employee.person_code}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.card_no || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.designation}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.doj}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.total_working_hours}h</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.no_of_days}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.total_orders}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(employee.actual_order_pay)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(employee.total_excess_pay)}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{formatCurrency(employee.gross_pay)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(employee.total_cod)}</TableCell>
                    <TableCell className="whitespace-nowrap text-red-600">{formatCurrency(employee.vendor_fee)}</TableCell>
                    <TableCell className="whitespace-nowrap text-red-600">{formatCurrency(employee.traffic_fine)}</TableCell>
                    <TableCell className="whitespace-nowrap text-red-600">{formatCurrency(employee.loan_fine)}</TableCell>
                    <TableCell className="whitespace-nowrap text-red-600">{formatCurrency(employee.training_fee)}</TableCell>
                    <TableCell className="whitespace-nowrap font-bold text-green-600">
                      {formatCurrency(employee.net_salary)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-xs">
                      <div className="text-sm text-orange-600">
                        {employee.remarks || 'No remarks'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}