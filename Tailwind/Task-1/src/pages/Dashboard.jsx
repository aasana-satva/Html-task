import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { kpiData, revenueData } from "../data/dashboardData";

export default function Dashboard(){
    return(
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
          >
            <h3 className="text-gray-500">{item.title}</h3>
            <p className="text-2xl font-bold dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-80">
        <h2 className="mb-4 font-semibold dark:text-white">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
        
      </div>
        </div>
    )
}