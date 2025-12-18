import React from 'react';
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import moment from 'moment';

const ExpenseList = ({ transactions = [], onDelete, onEdit, loading = false }) => {
  // Calculate total expense
  const totalExpense = transactions?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  if (loading) {
    return (
      <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading expenses...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {transactions.map((expense) => (
        <div 
          key={expense._id}
          className="flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{expense.category}</h3>
            <p className="text-sm text-gray-500">
              Rs. {expense.amount.toLocaleString()} | {moment(expense.date).format('M/D/YYYY')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onEdit(expense)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <FiEdit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(expense._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      
      {/* Total Section */}
      <div className="mt-6">
        <div className="text-lg font-semibold text-green-600">
          Total Expense: Rs. {totalExpense.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;