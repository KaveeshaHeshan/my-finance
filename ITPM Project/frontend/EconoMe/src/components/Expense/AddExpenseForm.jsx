import React, { useState, useEffect } from "react";
import Input from "../Inputs/input";

const AddExpenseForm = ({ onAddExpense, initialData }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setExpense({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Category */}
      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="e.g. Food, Transport"
        type="text"
      />

      {/* Amount */}
      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />

      {/* Date */}
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder="dd/mm/yyyy"
        type="date"
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onAddExpense(expense)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
