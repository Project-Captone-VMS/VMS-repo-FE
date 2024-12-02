import React from "react";
import { Car, Settings, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
              <p
                className={`text-sm mt-2 ${
                  trend.type === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.value}
              </p>
            )}
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusItem = ({ icon: Icon, color, title, description }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Button variant="outline">View Details</Button>
    </div>
  );
};

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Vehicles"
        value="15"
        icon={Car}
        trend={{ type: "up", value: "+2 from last month" }}
      />
      <StatCard
        title="Vehicles in Maintenance"
        value="3"
        icon={Settings}
        trend={{ type: "down", value: "-1 from last week" }}
      />
      <StatCard
        title="Scheduled Maintenance"
        value="5"
        icon={Calendar}
        trend={{ type: "up", value: "+3 upcoming" }}
      />
      <StatCard
        title="Total Distance"
        value="125,000 km"
        icon={Car}
        trend={{ type: "up", value: "+12% this month" }}
      />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Vehicle Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusItem
            icon={Car}
            color="green"
            title="Active Vehicles"
            description="12 vehicles ready for operation"
          />
          <StatusItem
            icon={Settings}
            color="yellow"
            title="Under Maintenance"
            description="3 vehicles currently being serviced"
          />
          <StatusItem
            icon={Car}
            color="red"
            title="Out of Service"
            description="1 vehicle requires immediate attention"
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default OverviewTab;
