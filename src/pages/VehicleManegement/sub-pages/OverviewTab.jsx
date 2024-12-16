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
      <CardContent className="w-full">
        <div className="flex items-center justify-between py-4">
          <div className="rounded-lg bg-blue-300 p-4">
            <Icon className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex flex-col justify-between text-end">
            <p className="text-sm text-text-Comment">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <p
                className={`mt-2 text-sm ${
                  trend.type === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.value}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusItem = ({ icon: Icon, color, title, description }) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
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
  <div className="space-y-5">
    <div className="grid grid-cols-2 gap-7 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Vehicles" value="15" icon={Car} />
      <StatCard title="Vehicles in Maintenance" value="3" icon={Settings} />
      <StatCard title="Vehicles in incident" value="5" icon={Car} />
      <StatCard title="Total Distance" value="125,000 km" icon={Car} />
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
