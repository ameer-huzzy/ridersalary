import {
  LayoutDashboard,
  Users,
  Handshake,
  Upload,
  DollarSign,
  FileText,
  Settings as SettingsIcon,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "./ui/sidebar";

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const menuItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Employee Management", icon: Users, page: "employees" },
      { title: "Partner & Vendors", icon: Handshake, page: "partners" },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Weekly Upload", icon: Upload, page: "weekly-upload" },
      { title: "Deductions & Charges", icon: DollarSign, page: "deductions" },
      { title: "Salary Report", icon: FileText, page: "salary-report" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", icon: SettingsIcon, page: "settings" },
    ],
  },
];

export function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sidebar-foreground">RiderApp</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.page}>
                    <SidebarMenuButton
                      isActive={currentPage === item.page}
                      onClick={() => setCurrentPage(item.page)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
