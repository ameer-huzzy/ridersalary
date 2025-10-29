import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { apiService } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Upload, FileSpreadsheet, CheckCircle, Eye, FileDown, RefreshCw } from "lucide-react";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface LimoPayment {
  id: string;
  limo_company: string;
  limo_company_id: string;
  captain_name: string;
  captain_id: string;
  payment_date: string;
  payment_id: string;
  payment_method: string;
  total_driver_base_cost: number;
  total_driver_other_cost: number;
  total_driver_payment: number;
  tips: number;
  status: string;
}

export function WeeklyUpload() {
  const [limoPayments, setLimoPayments] = useState<LimoPayment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<LimoPayment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLimoPayments();
  }, []);

  const loadLimoPayments = async () => {
    try {
      setLoading(true);
      const payments = await apiService.getLimoPayments();
      setLimoPayments(payments);
    } catch (error) {
      toast.error("Failed to load payment data");
      console.error("Error loading limo payments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLimoPayments();
    toast.success("Data refreshed successfully");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        toast.success(`Selected file: ${file.name}`);
      } else {
        toast.error("Please select an Excel file (.xlsx or .xls)");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.uploadLimoPayments(selectedFile);
      console.log('Upload response:', response); // Add this


      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(async () => {
        setUploading(false);
        setSelectedFile(null);

        await loadLimoPayments();

        // Check backend response - use the new field names
        if (response.detail === "File already exists") {
          toast.warning("File already exists");
        } else {
          toast.success("Upload completed successfully!");
        }
      }, 1000);

    } catch (error) {
      setUploading(false);
      toast.error("Upload failed");
      console.error("Upload error:", error);
    }
  };

  const handleExportPayment = (payment: LimoPayment) => {
    toast.success(`Exporting ${payment.captain_name} data...`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading payment data...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl">Limo Payments Upload</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Upload and manage limo company payment data</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Payment Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h3>Upload Excel File</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload limo payment data in Excel format (.xlsx, .xls)
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <input
                type="file"
                id="file-upload"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : "Choose File"}
              </Button>
              <Button variant="outline" onClick={() => toast.info("Downloading template...")}>
                Download Template
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-green-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {selectedFile && (
            <Button
              onClick={handleFileUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading and validating...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadProgress === 100 && !uploading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-green-900">Upload Successful</h4>
                  <p className="text-sm text-green-700 mt-1">
                    File processed successfully. Data is now visible in the table below.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Records</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {limoPayments.length} records found
            </span>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Limo Company</TableHead>
                  <TableHead>Company ID</TableHead>
                  <TableHead>Captain Name</TableHead>
                  <TableHead>Captain ID</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Base Cost</TableHead>
                  <TableHead>Other Cost</TableHead>
                  <TableHead>Total Payment</TableHead>
                  <TableHead>Tips</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limoPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                      No payment records found. Upload a file to see data.
                    </TableCell>
                  </TableRow>
                ) : (
                  limoPayments.map((payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell className="max-w-[200px] truncate">{payment.limo_company}</TableCell>
                      <TableCell>{payment.limo_company_id}</TableCell>
                      <TableCell>{payment.captain_name}</TableCell>
                      <TableCell>{payment.captain_id}</TableCell>
                      <TableCell>{payment.payment_date}</TableCell>
                      <TableCell>{payment.payment_id}</TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell>{Number(payment.total_driver_base_cost).toFixed(2)}</TableCell>
                      <TableCell>{Number(payment.total_driver_other_cost).toFixed(2)}</TableCell>
                      <TableCell>{Number(payment.total_driver_payment).toFixed(2)}</TableCell>
                      <TableCell>{Number(payment.tips).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPayment(payment)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExportPayment(payment)}
                            title="Export data"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>View complete payment information.</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Limo Company</p>
                  <p className="mt-1">{selectedPayment.limo_company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company ID</p>
                  <p className="mt-1">{selectedPayment.limo_company_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Captain Name</p>
                  <p className="mt-1">{selectedPayment.captain_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Captain ID</p>
                  <p className="mt-1">{selectedPayment.captain_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p className="mt-1">{selectedPayment.payment_date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="mt-1">{selectedPayment.payment_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="mt-1">{selectedPayment.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Cost</p>
                  <p className="mt-1">{Number(selectedPayment.total_driver_base_cost).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Other Cost</p>
                  <p className="mt-1">{Number(selectedPayment.total_driver_other_cost).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="mt-1">{Number(selectedPayment.total_driver_payment).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tips</p>
                  <p className="mt-1">{Number(selectedPayment.tips).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="mt-1">{selectedPayment.status}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}