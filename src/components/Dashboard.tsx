import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Users, Package, DollarSign, Clock, TrendingUp, AlertTriangle, UserPlus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { 
  apiService, 
  DashboardStats, 
  PartnerPerformance, 
  OrderDistribution, 
  EmployeeJoins, 
  WeeklyDeduction, 
  TopPerformer, 
  DashboardAlert 
} from "../services/api";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [partnerData, setPartnerData] = useState<PartnerPerformance[]>([]);
  const [pieData, setPieData] = useState<OrderDistribution[]>([]);
  const [employeeJoinsData, setEmployeeJoinsData] = useState<EmployeeJoins[]>([]);
  const [weeklyDeductions, setWeeklyDeductions] = useState<WeeklyDeduction[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        partnerData,
        pieData,
        employeeJoinsData,
        weeklyDeductionsData,
        topPerformersData,
        alertsData
      ] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getPartnerPerformance(),
        apiService.getOrderDistribution(),
        apiService.getEmployeeJoins(),
        apiService.getWeeklyDeductions(),
        apiService.getTopPerformers(),
        apiService.getDashboardAlerts()
      ]);

      setStats(statsData);
      setPartnerData(partnerData);
      setPieData(pieData);
      
      // Sort employee joins data chronologically
      const sortedEmployeeJoins = [...employeeJoinsData].sort((a, b) => {
        const monthOrder = {
          'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
          'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        
        const getMonthNumber = (monthStr: string) => {
          const month = monthStr.split(' ')[0];
          return monthOrder[month as keyof typeof monthOrder] || 0;
        };
        
        return getMonthNumber(a.month) - getMonthNumber(b.month);
      });
      
      setEmployeeJoinsData(sortedEmployeeJoins);
      setWeeklyDeductions(weeklyDeductionsData);
      setTopPerformers(topPerformersData);
      setAlerts(alertsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: "Total Orders",
      value: stats.total_orders,
      change: stats.orders_change,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Riders",
      value: stats.active_riders.toString(),
      change: stats.riders_change,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Employee Joins This Month",
      value: stats.employees_this_month.toString(),
      change: "new hires",
      icon: UserPlus,
      color: "text-teal-600",
    },
    {
      title: "Total COD",
      value: stats.total_cod,
      change: stats.cod_change,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Working Hours",
      value: stats.total_hours,
      change: stats.hours_change,
      icon: Clock,
      color: "text-orange-600",
    },
  ] : [];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === "warning" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground truncate">{stat.title}</p>
                  <h3 className="mt-1 text-xl sm:text-2xl">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {stat.title === "Employee Joins This Month" ? (
                      <UserPlus className="h-3 w-3 text-teal-600 flex-shrink-0" />
                    ) : (
                      <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {stat.title === "Employee Joins This Month" ? stat.change : `${stat.change} from last month`}
                    </span>
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg bg-muted ${stat.color} flex-shrink-0 ml-2`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Partner Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partnerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Distribution by Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Reports Section */}
      <div>
        <h2 className="mb-4">Analytics & Reports</h2>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Employee Joins Per Month */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Joins Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={employeeJoinsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="employees" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Partner Deductions */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Partner Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyDeductions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Careem" fill="#10b981" stackId="a" />
                    <Bar dataKey="Talabat" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="Noon" fill="#f59e0b" stackId="a" />
                    <Bar dataKey="Keeta" fill="#8b5cf6" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{performer.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{performer.partner}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="whitespace-nowrap">{performer.orders} orders</p>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">{performer.earnings}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}