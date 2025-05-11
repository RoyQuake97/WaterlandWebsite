
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import Reservations from "@/admin/Reservations";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ReservationsCalendar = () => {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
  const { toast } = useToast();

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#0a4b78] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">Waterland Reservations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/admin" 
                className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Dashboard
              </a>
              <Button 
                variant="secondary"
                size="sm"
                className="text-[#0a4b78] bg-white hover:bg-gray-100"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Reservations />
        </div>
      </main>
    </div>
  );
};

export default ReservationsCalendar;
