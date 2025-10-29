import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./components/Dashboard";
import { EmployeeManagement } from "./components/EmployeeManagement";
import { PartnerManagement } from "./components/PartnerManagement";
import { WeeklyUpload } from "./components/WeeklyUpload";
import { DeductionsCharges } from "./components/DeductionsCharges";
import { SalaryReport } from "./components/SalaryReport";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Menu, UserCircle } from "lucide-react";

function AppLayout({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <EmployeeManagement />;
      case "partners":
        return <PartnerManagement />;
      case "weekly-upload":
        return <WeeklyUpload />;
      case "deductions":
        return <DeductionsCharges />;
      case "salary-report":
        return <SalaryReport />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border h-14">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UserCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base">RiderApp</h2>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setOpenMobile(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <AppSidebar 
        currentPage={currentPage} 
        setCurrentPage={(page) => {
          setCurrentPage(page);
          if (isMobile) {
            setOpenMobile(false);
          }
        }} 
      />

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0">
        <div className={`min-h-screen w-full ${isMobile ? 'pt-14' : ''}`}>
          <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6">
            {renderPage()}
          </div>
        </div>
      </main>
    </>
  );
}

function AppContent() {
  const { user, } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!user) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppLayout currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
