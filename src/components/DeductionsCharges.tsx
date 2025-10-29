import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, Download, FileText, Info, CheckCircle, Edit, Save, X, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { apiService, Deduction, DeductionCreate, Employee } from "../services/api";

interface EmployeeDeductions {
  employee_id: number;
  employee_name: string;
  deductions: Deduction[];
  totalAmount: number;
}

export function DeductionsCharges() {
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddDeductionDialog, setShowAddDeductionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEmployees, setOpenEmployees] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDeduction, setEditingDeduction] = useState<Deduction | null>(null);

  const [deductionForm, setDeductionForm] = useState<DeductionCreate>({
    employee_id: 0,
    monthstart_date: "",
    vendor_fee: 0,
    traffic_fine: 0,
    loan_fine: 0,
    training_fee: 0,
    others: 0,
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deductionsData, employeesData] = await Promise.all([
        apiService.getDeductions(),
        apiService.getEmployees()
      ]);
      setDeductions(deductionsData);
      setEmployees(employeesData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployee = (employeeId: number) => {
    setOpenEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAddDeduction = async () => {
    if (!deductionForm.employee_id || !deductionForm.monthstart_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const hasAmount =
      deductionForm.vendor_fee ||
      deductionForm.traffic_fine ||
      deductionForm.loan_fine ||
      deductionForm.training_fee ||
      deductionForm.others;

    if (!hasAmount) {
      toast.error("Please enter amount for at least one deduction type");
      return;
    }

    try {
      await apiService.createDeduction(deductionForm);
      await loadData();
      setShowAddDeductionDialog(false);
      resetDeductionForm();
      toast.success("Deduction added successfully!");
    } catch (error) {
      toast.error("Failed to add deduction");
      console.error("Error adding deduction:", error);
    }
  };

  const handleEditDeduction = (deduction: Deduction) => {
    setEditingDeduction(deduction);
  };

  const handleUpdateDeduction = async () => {
    if (!editingDeduction) return;

    const hasAmount =
      editingDeduction.vendor_fee ||
      editingDeduction.traffic_fine ||
      editingDeduction.loan_fine ||
      editingDeduction.training_fee ||
      editingDeduction.others;

    if (!hasAmount) {
      toast.error("Please enter amount for at least one deduction type");
      return;
    }

    try {
      await apiService.updateDeduction(editingDeduction.deduction_id, {
        employee_id: editingDeduction.employee_id,
        monthstart_date: editingDeduction.monthstart_date,
        vendor_fee: editingDeduction.vendor_fee,
        traffic_fine: editingDeduction.traffic_fine,
        loan_fine: editingDeduction.loan_fine,
        training_fee: editingDeduction.training_fee,
        others: editingDeduction.others,
        remarks: editingDeduction.remarks,
      });

      await loadData();
      setEditingDeduction(null);
      toast.success("Deduction updated successfully!");
    } catch (error) {
      toast.error("Failed to update deduction");
      console.error("Error updating deduction:", error);
    }
  };

  const cancelEdit = () => {
    setEditingDeduction(null);
  };

  const resetDeductionForm = () => {
    setDeductionForm({
      employee_id: 0,
      monthstart_date: "",
      vendor_fee: 0,
      traffic_fine: 0,
      loan_fine: 0,
      training_fee: 0,
      others: 0,
      remarks: "",
    });
  };

  const calculateDeductionTotal = (deduction: Deduction): number => {
    return (
      Number(deduction.vendor_fee || 0) +
      Number(deduction.traffic_fine || 0) +
      Number(deduction.loan_fine || 0) +
      Number(deduction.training_fee || 0) +
      Number(deduction.others || 0)
    );
  };

  const groupedDeductions = deductions.reduce((acc, deduction) => {
    const employee = employees.find(e => e.employee_id === deduction.employee_id);
    if (!employee) return acc;

    if (!acc[deduction.employee_id]) {
      acc[deduction.employee_id] = {
        employee_id: deduction.employee_id,
        employee_name: employee.name,
        deductions: [],
        totalAmount: 0,
      };
    }
    acc[deduction.employee_id].deductions.push(deduction);
    const totalDeduction = calculateDeductionTotal(deduction);
    acc[deduction.employee_id].totalAmount += totalDeduction;
    return acc;
  }, {} as Record<number, EmployeeDeductions>);

  const employeeDeductionsList = Object.values(groupedDeductions).filter(emp =>
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id.toString().includes(searchQuery)
  );

  const AmountBadge = ({ amount }: { amount: number }) => {
    if (!amount || amount === 0) {
      return <span className="text-slate-400">-</span>;
    }

    return (
      <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded text-sm">
        AED {amount.toLocaleString()}
      </span>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleDeleteDeduction = async (deductionId: number) => {
    if (!confirm("Are you sure you want to delete this deduction?")) {
      return;
    }

    try {
      await apiService.deleteDeduction(deductionId);
      await loadData();
      toast.success("Deduction deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete deduction");
      console.error("Error deleting deduction:", error);
    }
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl">Deductions & Charges</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage salary deductions and training charges</p>
      </div>

      <Tabs defaultValue="deductions" className="w-full">
        <TabsList>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="training">Training Charges</TabsTrigger>
        </TabsList>

        <TabsContent value="deductions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle>Deductions by Employee</CardTitle>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-[250px]"
                    />
                  </div>
                  <Button size="sm" className="sm:size-default" onClick={() => setShowAddDeductionDialog(true)}>
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {employeeDeductionsList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No deductions found
                </div>
              ) : (
                employeeDeductionsList.map((employeeData) => (
                  <Collapsible
                    key={employeeData.employee_id}
                    open={openEmployees.includes(employeeData.employee_id)}
                    onOpenChange={() => toggleEmployee(employeeData.employee_id)}
                  >
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div>
                                  <h3>{employeeData.employee_name}</h3>
                                  <p className="text-sm text-muted-foreground">ID: {employeeData.employee_id}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total Deductions</p>
                                <p className="text-red-600">AED {employeeData.totalAmount.toLocaleString()}</p>
                              </div>
                              <Badge variant="secondary">{employeeData.deductions.length} deductions</Badge>
                              {openEmployees.includes(employeeData.employee_id) ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-slate-50 rounded-lg p-3 border">
                                <div className="text-xs text-slate-500 font-medium">Total Deductions</div>
                                <div className="text-lg font-bold text-red-600">
                                  AED {employeeData.deductions.reduce((sum, d) => sum + calculateDeductionTotal(d), 0).toLocaleString()}
                                </div>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3 border">
                                <div className="text-xs text-slate-500 font-medium">Monthly Avg.</div>
                                <div className="text-lg font-semibold text-slate-700">
                                  AED {Math.round(employeeData.deductions.reduce((sum, d) => sum + calculateDeductionTotal(d), 0) / employeeData.deductions.length).toLocaleString()}
                                </div>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3 border">
                                <div className="text-xs text-slate-500 font-medium">Most Common</div>
                                <div className="text-sm font-medium text-slate-700 truncate">
                                  {(() => {
                                    const types = employeeData.deductions.flatMap(d => [
                                      d.vendor_fee > 0 && 'Vendor',
                                      d.traffic_fine > 0 && 'Traffic',
                                      d.loan_fine > 0 && 'Loan',
                                      d.training_fee > 0 && 'Training',
                                      d.others > 0 && 'Others'
                                    ].filter(Boolean));
                                    const mostCommon = types.sort((a, b) =>
                                      types.filter(v => v === a).length -
                                      types.filter(v => v === b).length
                                    ).pop();
                                    return mostCommon || 'None';
                                  })()}
                                </div>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3 border">
                                <div className="text-xs text-slate-500 font-medium">Records</div>
                                <div className="text-lg font-semibold text-slate-700">
                                  {employeeData.deductions.length}
                                </div>
                              </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                                    <TableRow className="border-b border-slate-200">
                                      <TableHead className="font-semibold text-slate-700 py-3">Deduction ID</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3">Month</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3 text-right">Vendor Fee</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3 text-right">Traffic Fine</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3 text-right">Loan Fine</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3 text-right">Training Fee</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3 text-right">Others</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3">Remarks</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3 text-right">Total</TableHead>
                                      <TableHead className="font-semibold text-slate-700 py-3">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {employeeData.deductions.map((deduction, index) => {
                                      const total = calculateDeductionTotal(deduction);
                                      const isEditing = editingDeduction?.deduction_id === deduction.deduction_id;

                                      return (
                                        <TableRow
                                          key={deduction.deduction_id}
                                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                            }`}
                                        >
                                          <TableCell className="py-3 font-medium text-slate-900">
                                            #{deduction.deduction_id}
                                          </TableCell>

                                          <TableCell className="py-3">
                                            {isEditing ? (
                                              <Input
                                                type="date"
                                                value={editingDeduction.monthstart_date}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, monthstart_date: e.target.value })}
                                                className="w-32"
                                              />
                                            ) : (
                                              <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span className="text-slate-700">{deduction.monthstart_date}</span>
                                              </div>
                                            )}
                                          </TableCell>

                                          <TableCell className="py-3 text-right">
                                            {isEditing ? (
                                              <Input
                                                type="number"
                                                value={editingDeduction.vendor_fee || ""}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, vendor_fee: Number(e.target.value) || 0 })}
                                                className="w-20 text-right"
                                              />
                                            ) : (
                                              <AmountBadge amount={Number(deduction.vendor_fee || 0)} />
                                            )}
                                          </TableCell>

                                          <TableCell className="py-3 text-right">
                                            {isEditing ? (
                                              <Input
                                                type="number"
                                                value={editingDeduction.traffic_fine || ""}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, traffic_fine: Number(e.target.value) || 0 })}
                                                className="w-20 text-right"
                                              />
                                            ) : (
                                              <AmountBadge amount={Number(deduction.traffic_fine || 0)} />
                                            )}
                                          </TableCell>

                                          <TableCell className="py-3 text-right">
                                            {isEditing ? (
                                              <Input
                                                type="number"
                                                value={editingDeduction.loan_fine || ""}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, loan_fine: Number(e.target.value) || 0 })}
                                                className="w-20 text-right"
                                              />
                                            ) : (
                                              <AmountBadge amount={Number(deduction.loan_fine || 0)} />
                                            )}
                                          </TableCell>

                                          <TableCell className="py-3 text-right">
                                            {isEditing ? (
                                              <Input
                                                type="number"
                                                value={editingDeduction.training_fee || ""}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, training_fee: Number(e.target.value) || 0 })}
                                                className="w-20 text-right"
                                              />
                                            ) : (
                                              <AmountBadge amount={Number(deduction.training_fee || 0)} />
                                            )}
                                          </TableCell>

                                          <TableCell className="py-3 text-right">
                                            {isEditing ? (
                                              <Input
                                                type="number"
                                                value={editingDeduction.others || ""}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, others: Number(e.target.value) || 0 })}
                                                className="w-20 text-right"
                                              />
                                            ) : (
                                              <AmountBadge amount={Number(deduction.others || 0)} />
                                            )}
                                          </TableCell>
                                          <TableCell className="py-3">
                                            {isEditing ? (
                                              <Input
                                                value={editingDeduction.remarks || ""}
                                                onChange={(e) => setEditingDeduction({ ...editingDeduction, remarks: e.target.value })}
                                                placeholder="Enter remarks"
                                                className="w-32"
                                              />
                                            ) : (
                                              <div className="text-slate-700 max-w-[200px] truncate">
                                                {deduction.remarks || "-"}
                                              </div>
                                            )}
                                          </TableCell>

                                          <TableCell className="py-3 text-right">
                                            <div className="font-semibold text-red-700 bg-red-50 px-2 py-1 rounded-md inline-block min-w-[80px]">
                                              AED {isEditing ? calculateDeductionTotal(editingDeduction).toLocaleString() : total.toLocaleString()}
                                            </div>
                                          </TableCell>
                                          {/* <TableCell className="py-3">
                                            {isEditing ? (
                                              <div className="flex gap-1">
                                                <Button
                                                  size="sm"
                                                  onClick={handleUpdateDeduction}
                                                  className="h-8 w-8 p-0"
                                                >
                                                  <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={cancelEdit}
                                                  className="h-8 w-8 p-0"
                                                >
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ) : (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditDeduction(deduction)}
                                                className="h-8 w-8 p-0"
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </TableCell> */}
                                          <TableCell className="py-3">
                                            {isEditing ? (
                                              <div className="flex gap-1">
                                                <Button
                                                  size="sm"
                                                  onClick={handleUpdateDeduction}
                                                  className="h-8 w-8 p-0"
                                                >
                                                  <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={cancelEdit}
                                                  className="h-8 w-8 p-0"
                                                >
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ) : (
                                              <div className="flex gap-1">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => handleEditDeduction(deduction)}
                                                  className="h-8 w-8 p-0"
                                                >
                                                  <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => handleDeleteDeduction(deduction.deduction_id)}
                                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>

                              {employeeData.deductions.length === 0 && (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Deductions</h3>
                                  <p className="text-slate-500 max-w-sm mx-auto">
                                    No deductions found for this period. All payments are clear and up to date.
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between items-center text-sm text-slate-600">
                              <div>
                                Showing {employeeData.deductions.length} deduction records
                              </div>
                              <div className="flex items-center gap-4">
                                <span>Export:</span>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="h-8">
                                    <Download className="h-4 w-4 mr-2" />
                                    CSV
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8">
                                    <FileText className="h-4 w-4 mr-2" />
                                    PDF
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Training Charges</CardTitle>
                <Button onClick={() => toast.info("Training charges feature coming soon")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Training Charge
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Training charges management will be available soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddDeductionDialog} onOpenChange={setShowAddDeductionDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Deduction</DialogTitle>
            <DialogDescription>Create a new deduction for an employee.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={deductionForm.employee_id.toString()}
                onValueChange={(value) => setDeductionForm({ ...deductionForm, employee_id: parseInt(value) })}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(e => e.status === "Active").map(emp => (
                    <SelectItem key={emp.employee_id} value={emp.employee_id.toString()}>
                      {emp.name} (ID: {emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthstart_date">Month Start Date *</Label>
              <Input
                id="monthstart_date"
                type="date"
                value={deductionForm.monthstart_date}
                onChange={(e) => setDeductionForm({ ...deductionForm, monthstart_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Deduction Types *</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor_fee" className="text-sm">Vendor Fee</Label>
                  <Input
                    id="vendor_fee"
                    type="number"
                    placeholder="0"
                    value={deductionForm.vendor_fee || ""}
                    onChange={(e) => setDeductionForm({ ...deductionForm, vendor_fee: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="traffic_fine" className="text-sm">Traffic Fine</Label>
                  <Input
                    id="traffic_fine"
                    type="number"
                    placeholder="0"
                    value={deductionForm.traffic_fine || ""}
                    onChange={(e) => setDeductionForm({ ...deductionForm, traffic_fine: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan_fine" className="text-sm">Loan Fine</Label>
                  <Input
                    id="loan_fine"
                    type="number"
                    placeholder="0"
                    value={deductionForm.loan_fine || ""}
                    onChange={(e) => setDeductionForm({ ...deductionForm, loan_fine: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="training_fee" className="text-sm">Training Fee</Label>
                  <Input
                    id="training_fee"
                    type="number"
                    placeholder="0"
                    value={deductionForm.training_fee || ""}
                    onChange={(e) => setDeductionForm({ ...deductionForm, training_fee: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="others" className="text-sm">Other Charges</Label>
                  <Input
                    id="others"
                    type="number"
                    placeholder="0"
                    value={deductionForm.others || ""}
                    onChange={(e) => setDeductionForm({ ...deductionForm, others: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter any additional remarks"
                value={deductionForm.remarks}
                onChange={(e) => setDeductionForm({ ...deductionForm, remarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDeductionDialog(false); resetDeductionForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddDeduction}>Add Deduction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}