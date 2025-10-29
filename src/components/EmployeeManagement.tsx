import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { Plus, Search, FileDown, Upload, Eye, Edit, FileText } from "lucide-react";
import { toast } from "sonner";
import { apiService, Employee, EmployeeCreate } from "../services/api";
import { Trash2 } from "lucide-react";

export function EmployeeManagement() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state - Updated to match backend schema
  const [formData, setFormData] = useState<EmployeeCreate>({
    name: "",
    captain_id: "",
    person_code: "",
    card_no: "",
    phone_no: "",
    emirates_id: "",
    designation: "",
    doj: "",
    partner_id: undefined,
    wps_vendor_id: undefined,
    status: "Active",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to load employees");
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (!isAdmin() && user?.employeeId && emp.employee_id !== user.employeeId) {
      return false;
    }
    return emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.captain_id?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddEmployee = async () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await apiService.createEmployee(formData);
      await loadEmployees();
      setShowAddDialog(false);
      resetForm();
      toast.success("Employee added successfully!");
    } catch (error) {
      toast.error("Failed to add employee");
      console.error("Error adding employee:", error);
    }
  };

const handleEditEmployee = async () => {
  if (!editingEmployee) return;

  try {
    await apiService.updateEmployee(editingEmployee.employee_id, {
      name: editingEmployee.name,
      captain_id: editingEmployee.captain_id,
      person_code: editingEmployee.person_code,
      card_no: editingEmployee.card_no,
      designation: editingEmployee.designation,
      doj: editingEmployee.doj,
      partner_id: editingEmployee.partner_id,
      phone_no: editingEmployee.phone_no,
      emirates_id: editingEmployee.emirates_id,
      passport_no: editingEmployee.passport_no,
      visa_status: editingEmployee.visa_status,
      training_fee: editingEmployee.training_fee,
      training_fee_deduction: editingEmployee.training_fee_deduction,
      status: editingEmployee.status,
      wps_vendor_id: editingEmployee.wps_vendor_id,
    });
    await loadEmployees();
    setEditingEmployee(null);
    toast.success("Employee updated successfully!");
  } catch (error) {
    toast.error("Failed to update employee");
    console.error("Error updating employee:", error);
  }
};
  const resetForm = () => {
    setFormData({
      name: "",
      captain_id: "",
      person_code: "",
      card_no: "",
      phone_no: "",
      emirates_id: "",
      designation: "",
      doj: "",
      partner_id: undefined,
      wps_vendor_id: undefined,
      status: "Active",
    });
  };

  const handleImport = () => {
    toast.info("Import functionality: Please upload an Excel file with employee data");
  };

  const handleExport = () => {
    toast.success("Exporting employee list...");
  };

  if (loading) {
    return <div>Loading employees...</div>;
  }

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return;
    }

    try {
      await apiService.deleteEmployee(employee.employee_id);
      await loadEmployees();
      toast.success("Employee deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl">Employee Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage rider information and profiles</p>
        </div>
        {isAdmin() && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="sm:size-default" onClick={handleImport}>
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Import List</span>
            </Button>
            <Button size="sm" className="sm:size-default" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add</span> Employee
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle>All Employees</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Captain ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Emirates ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.employee_id}>
                    <TableCell className="whitespace-nowrap">{employee.employee_id}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.captain_id}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.emirates_id}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.phone_no}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedEmployee(employee)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEmployee(employee)}
                          title="Delete employee"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {isAdmin() && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingEmployee(employee)}
                              title="Edit employee"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View documents"
                              onClick={() => toast.info("Document management coming soon")}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter the rider's information to create their profile.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="work">Work Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captain_id">Captain ID</Label>
                  <Input
                    id="captain_id"
                    placeholder="Captain ID"
                    value={formData.captain_id}
                    onChange={(e) => setFormData({ ...formData, captain_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emirates_id">Emirates ID</Label>
                  <Input
                    id="emirates_id"
                    placeholder="784-XXXX-XXXXXXX-X"
                    value={formData.emirates_id}
                    onChange={(e) => setFormData({ ...formData, emirates_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_no">Phone Number</Label>
                  <Input
                    id="phone_no"
                    placeholder="+971 XX XXX XXXX"
                    value={formData.phone_no}
                    onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person_code">Person Code</Label>
                  <Input
                    id="person_code"
                    placeholder="Person Code"
                    value={formData.person_code}
                    onChange={(e) => setFormData({ ...formData, person_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card_no">Card No</Label>
                  <Input
                    id="card_no"
                    placeholder="Card Number"
                    value={formData.card_no}
                    onChange={(e) => setFormData({ ...formData, card_no: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="work" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doj">Date of Joining</Label>
                  <Input
                    id="doj"
                    type="date"
                    value={formData.doj}
                    onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emiratesIdDoc">Emirates ID Copy</Label>
                  <Input id="emiratesIdDoc" type="file" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport">Passport Copy</Label>
                  <Input id="passport" type="file" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visa">Visa Copy</Label>
                  <Input id="visa" type="file" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee}>Save Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
{editingEmployee && (
  <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
      <DialogHeader>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogDescription>Update the rider's information and profile.</DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="work">Work Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-captain_id">Captain ID</Label>
              <Input
                id="edit-captain_id"
                placeholder="Captain ID"
                value={editingEmployee.captain_id || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, captain_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-emirates_id">Emirates ID</Label>
              <Input
                id="edit-emirates_id"
                placeholder="784-XXXX-XXXXXXX-X"
                value={editingEmployee.emirates_id || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, emirates_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone_no">Phone Number</Label>
              <Input
                id="edit-phone_no"
                placeholder="+971 XX XXX XXXX"
                value={editingEmployee.phone_no || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, phone_no: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-person_code">Person Code</Label>
              <Input
                id="edit-person_code"
                placeholder="Person Code"
                value={editingEmployee.person_code || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, person_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-card_no">Card No</Label>
              <Input
                id="edit-card_no"
                placeholder="Card Number"
                value={editingEmployee.card_no || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, card_no: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="work" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-designation">Designation</Label>
              <Input
                id="edit-designation"
                placeholder="Designation"
                value={editingEmployee.designation || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, designation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-doj">Date of Joining</Label>
              <Input
                id="edit-doj"
                type="date"
                value={editingEmployee.doj || ''}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, doj: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editingEmployee.status} onValueChange={(value) => setEditingEmployee({ ...editingEmployee, status: value })}>
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-emiratesIdDoc">Emirates ID Copy</Label>
              <Input id="edit-emiratesIdDoc" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-passport">Passport Copy</Label>
              <Input id="edit-passport" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-visa">Visa Copy</Label>
              <Input id="edit-visa" type="file" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button variant="outline" onClick={() => setEditingEmployee(null)}>
          Cancel
        </Button>
        <Button onClick={handleEditEmployee}>Update Employee</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

      {/* View Employee Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
            <DialogDescription>View complete employee information and details.</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee ID</Label>
                  <p className="mt-1">{selectedEmployee.employee_id}</p>
                </div>
                <div>
                  <Label>Captain ID</Label>
                  <p className="mt-1">{selectedEmployee.captain_id}</p>
                </div>
                <div>
                  <Label>Full Name</Label>
                  <p className="mt-1">{selectedEmployee.name}</p>
                </div>
                <div>
                  <Label>Emirates ID</Label>
                  <p className="mt-1">{selectedEmployee.emirates_id}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="mt-1">{selectedEmployee.phone_no}</p>
                </div>
                <div>
                  <Label>Person Code</Label>
                  <p className="mt-1">{selectedEmployee.person_code}</p>
                </div>
                <div>
                  <Label>Card No</Label>
                  <p className="mt-1">{selectedEmployee.card_no}</p>
                </div>
                <div>
                  <Label>Designation</Label>
                  <p className="mt-1">{selectedEmployee.designation}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className="mt-1" variant={selectedEmployee.status === "Active" ? "default" : "secondary"}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
                <div>
                  <Label>Date of Joining</Label>
                  <p className="mt-1">{selectedEmployee.doj}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}