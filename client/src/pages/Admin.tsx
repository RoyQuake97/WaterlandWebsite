
import { useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import Dashboard from "@/admin/Dashboard";
import Reservations from "@/admin/Reservations";
import Settings from "@/admin/Settings";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import waterlandLogo from "@/assets/optimized/waterland-logo-small.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Admin = () => {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, toast]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      navigate("/login");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto px-6">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <img 
                src={waterlandLogo} 
                alt="Waterland Admin" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => navigate("/admin")}
                className={`text-gray-600 hover:text-gray-900 ${location === '/admin' ? 'bg-gray-100' : ''}`}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            <a 
              href="/admin" 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${location === '/admin' ? 'bg-[#0a4b78] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              <span>Dashboard</span>
            </a>
            <a 
              href="/admin/reservations" 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${location === '/admin/reservations' ? 'bg-[#0a4b78] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <i className="fas fa-book mr-3"></i>
              <span>Reservations</span>
            </a>
            <a 
              href="/admin/settings" 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${location === '/admin/settings' ? 'bg-[#0a4b78] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <i className="fas fa-cog mr-3"></i>
              <span>Settings</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Switch>
              <Route path="/admin" component={Dashboard} />
              <Route path="/admin/reservations" component={Reservations} />
              <Route path="/admin/settings" component={Settings} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
