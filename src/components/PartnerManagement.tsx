import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Plus, Edit, Phone, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiService, Partner, PartnerCreate, WPSVendor, WPSVendorCreate } from "../services/api";

export function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [wpsVendors, setWpsVendors] = useState<WPSVendor[]>([]);
  const [showAddPartnerDialog, setShowAddPartnerDialog] = useState(false);
  const [showAddVendorDialog, setShowAddVendorDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingVendor, setEditingVendor] = useState<WPSVendor | null>(null);
  const [loading, setLoading] = useState(true);

  const [partnerForm, setPartnerForm] = useState<PartnerCreate>({
    partner_name: "",
    contact_person: "",
    contact_email: "",
  });

  const [vendorForm, setVendorForm] = useState<WPSVendorCreate>({
    vendor_name: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersData, vendorsData] = await Promise.all([
        apiService.getPartners(),
        apiService.getWPSVendors()
      ]);
      setPartners(partnersData);
      setWpsVendors(vendorsData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async () => {
    if (!partnerForm.partner_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await apiService.createPartner(partnerForm);
      await loadData();
      setShowAddPartnerDialog(false);
      resetPartnerForm();
      toast.success("Partner added successfully!");
    } catch (error) {
      toast.error("Failed to add partner");
      console.error("Error adding partner:", error);
    }
  };

  const handleAddVendor = async () => {
    if (!vendorForm.vendor_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await apiService.createWPSVendor(vendorForm);
      await loadData();
      setShowAddVendorDialog(false);
      resetVendorForm();
      toast.success("WPS Vendor added successfully!");
    } catch (error) {
      toast.error("Failed to add vendor");
      console.error("Error adding vendor:", error);
    }
  };

  const handleEditPartner = async () => {
    if (!editingPartner) return;

    try {
      await apiService.updatePartner(editingPartner.partner_id, {
        partner_name: editingPartner.partner_name,
        contact_person: editingPartner.contact_person,
        contact_email: editingPartner.contact_email,
      });
      await loadData();
      setEditingPartner(null);
      toast.success("Partner updated successfully!");
    } catch (error) {
      toast.error("Failed to update partner");
      console.error("Error updating partner:", error);
    }
  };

  const handleEditVendor = async () => {
    if (!editingVendor) return;

    try {
      await apiService.updateWPSVendor(editingVendor.wps_vendor_id, {
        vendor_name: editingVendor.vendor_name,
      });
      await loadData();
      setEditingVendor(null);
      toast.success("WPS Vendor updated successfully!");
    } catch (error) {
      toast.error("Failed to update vendor");
      console.error("Error updating vendor:", error);
    }
  };

  const handleDeletePartner = async (partner: Partner) => {
    if (!confirm(`Are you sure you want to delete ${partner.partner_name}?`)) {
      return;
    }

    try {
      await apiService.deletePartner(partner.partner_id);
      await loadData();
      toast.success("Partner deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete partner");
      console.error("Error deleting partner:", error);
    }
  };

  const handleDeleteVendor = async (vendor: WPSVendor) => {
    if (!confirm(`Are you sure you want to delete ${vendor.vendor_name}?`)) {
      return;
    }

    try {
      await apiService.deleteWPSVendor(vendor.wps_vendor_id);
      await loadData();
      toast.success("WPS Vendor deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete vendor");
      console.error("Error deleting vendor:", error);
    }
  };

  const resetPartnerForm = () => {
    setPartnerForm({ partner_name: "", contact_person: "", contact_email: "" });
  };

  const resetVendorForm = () => {
    setVendorForm({ vendor_name: "" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl">Partner & Vendor Management</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage delivery partners and WPS vendors</p>
      </div>

      <Tabs defaultValue="partners" className="w-full">
        <TabsList>
          <TabsTrigger value="partners">Delivery Partners</TabsTrigger>
          <TabsTrigger value="vendors">WPS Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Delivery Partners</CardTitle>
                <Button onClick={() => setShowAddPartnerDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner ID</TableHead>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.partner_id}>
                      <TableCell>{partner.partner_id}</TableCell>
                      <TableCell>{partner.partner_name}</TableCell>
                      <TableCell>{partner.contact_person}</TableCell>
                      <TableCell>
                        {partner.contact_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{partner.contact_email}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingPartner(partner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeletePartner(partner)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>WPS Vendors</CardTitle>
                <Button onClick={() => setShowAddVendorDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wpsVendors.map((vendor) => (
                    <TableRow key={vendor.wps_vendor_id}>
                      <TableCell>{vendor.wps_vendor_id}</TableCell>
                      <TableCell>{vendor.vendor_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingVendor(vendor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteVendor(vendor)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Partner Dialog */}
      <Dialog open={showAddPartnerDialog} onOpenChange={setShowAddPartnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Partner</DialogTitle>
            <DialogDescription>Enter the delivery partner's information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partnerName">Partner Name *</Label>
              <Input 
                id="partnerName" 
                placeholder="Enter partner name" 
                value={partnerForm.partner_name}
                onChange={(e) => setPartnerForm({...partnerForm, partner_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input 
                id="contactPerson" 
                placeholder="Enter contact person name" 
                value={partnerForm.contact_person}
                onChange={(e) => setPartnerForm({...partnerForm, contact_person: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerEmail">Email</Label>
              <Input 
                id="partnerEmail" 
                type="email" 
                placeholder="contact@partner.com" 
                value={partnerForm.contact_email}
                onChange={(e) => setPartnerForm({...partnerForm, contact_email: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddPartnerDialog(false); resetPartnerForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddPartner}>Add Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      {editingPartner && (
        <Dialog open={!!editingPartner} onOpenChange={() => setEditingPartner(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Partner</DialogTitle>
              <DialogDescription>Update partner information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Partner Name</Label>
                <Input 
                  value={editingPartner.partner_name}
                  onChange={(e) => setEditingPartner({...editingPartner, partner_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input 
                  value={editingPartner.contact_person || ''}
                  onChange={(e) => setEditingPartner({...editingPartner, contact_person: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={editingPartner.contact_email || ''}
                  onChange={(e) => setEditingPartner({...editingPartner, contact_email: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPartner(null)}>Cancel</Button>
              <Button onClick={handleEditPartner}>Update Partner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add WPS Vendor Dialog */}
      <Dialog open={showAddVendorDialog} onOpenChange={setShowAddVendorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New WPS Vendor</DialogTitle>
            <DialogDescription>Enter the WPS vendor's information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input 
                id="vendorName" 
                placeholder="Enter vendor name" 
                value={vendorForm.vendor_name}
                onChange={(e) => setVendorForm({...vendorForm, vendor_name: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddVendorDialog(false); resetVendorForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddVendor}>Add Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      {editingVendor && (
        <Dialog open={!!editingVendor} onOpenChange={() => setEditingVendor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit WPS Vendor</DialogTitle>
              <DialogDescription>Update vendor information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input 
                  value={editingVendor.vendor_name}
                  onChange={(e) => setEditingVendor({...editingVendor, vendor_name: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingVendor(null)}>Cancel</Button>
              <Button onClick={handleEditVendor}>Update Vendor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}