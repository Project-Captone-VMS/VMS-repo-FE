import React from 'react';
import { Users, Clock, Calendar } from 'lucide-react';
import Card from './Card';

const Stats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">Total Drivers</p>
          <h3 className="text-2xl font-bold">42</h3>
        </div>
        <Users className="h-8 w-8 text-blue-600" />
      </div>
    </Card>

    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">On Duty</p>
          <h3 className="text-2xl font-bold">28</h3>
        </div>
        <Clock className="h-8 w-8 text-green-600" />
      </div>
    </Card>

    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">On Leave</p>
          <h3 className="text-2xl font-bold">5</h3>
        </div>
        <Calendar className="h-8 w-8 text-orange-500" />
      </div>
    </Card>

    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">Available</p>
          <h3 className="text-2xl font-bold">9</h3>
        </div>
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </Card>
  </div>
);

export default Stats;