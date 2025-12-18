import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
//import { useUserAuth } from '../../hooks/useUserAuth';
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../charts/CustomLineChart'; // Adjust the import path as necessary

const ExpenseOverview = ({ data: transactions = [], loading, onAddClick }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-xl font-semibold text-gray-800">Expense Overview</h5>
          <p className="text-sm text-gray-500 mt-1">
            Track your spending trends over time and gain insights your money goes.
          </p>
        </div>

        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <LuPlus className="text-xl" />
          <span className="font-medium">Add Expense</span>
        </button>
      </div>

      <div className="mt-6">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
}   

export default ExpenseOverview;
