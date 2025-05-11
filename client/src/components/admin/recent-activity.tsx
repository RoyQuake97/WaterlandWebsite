import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, MailIcon, UsersIcon, MessageSquare } from "lucide-react";

interface Activity {
  id: number;
  type: "reservation" | "contact" | "inquiry" | "job";
  title: string;
  person: string;
  timestamp: Date;
  status: "success" | "warning" | "error" | "info";
  details?: string;
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

// Helper to get icon based on activity type
const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "reservation":
      return <CalendarIcon className="h-4 w-4" />;
    case "contact":
      return <MessageSquare className="h-4 w-4" />;
    case "inquiry":
      return <MailIcon className="h-4 w-4" />;
    case "job":
      return <UsersIcon className="h-4 w-4" />;
  }
};

// Helper to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <CardDescription>Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No recent activity</div>
          ) : (
            activities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-9 w-9 bg-gray-100 text-gray-800">
                  <span>{getInitials(activity.person)}</span>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <StatusBadge variant={activity.status}>
                      {activity.type === "reservation" 
                        ? activity.status === "success" ? "Paid" : "Pending" 
                        : activity.type === "contact" 
                          ? activity.status === "info" ? "New" : "Replied"
                          : activity.status === "warning" ? "Waiting" : "Processed"}
                    </StatusBadge>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {activity.person} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                  
                  {activity.details && (
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}