import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import { LuDownload } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) setExpenseData(response.data);
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
      toast.error("Failed to fetch expense details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (type) => {
    try {
      setDownloadLoading(true);
      const response = await axiosInstance.get(
        type === "excel"
          ? API_PATHS.EXPENSE.DOWNLOAD_EXPENSE
          : API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_PDF,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `EconoMe_Expense_Report.${type === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type.toUpperCase()} file downloaded successfully!`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(`Failed to download ${type.toUpperCase()} file`);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date } = expense;
    if (!category.trim()) return toast.error("Category is required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Invalid amount.");
    if (!date) return toast.error("Date is required.");

    try {
      const method = editingExpense ? "put" : "post";
      const url = editingExpense
        ? API_PATHS.EXPENSE.UPDATE_EXPENSE(editingExpense._id)
        : API_PATHS.EXPENSE.ADD_EXPENSE;
      const response = await axiosInstance[method](url, { category, amount: Number(amount), date });
      if (response.data) {
        toast.success(`Expense ${editingExpense ? "updated" : "added"} successfully`);
        setOpenAddExpenseModal(false);
        setEditingExpense(null);
        fetchExpenseDetails();
      }
    } catch (error) {
      toast.error(`Failed to ${editingExpense ? "update" : "add"} expense.`);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Expense Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadFile("excel")}
              disabled={downloadLoading || !expenseData.length}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                downloadLoading || !expenseData.length
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <LuDownload className="text-lg" /> Excel
            </button>
            <button
              onClick={() => handleDownloadFile("pdf")}
              disabled={downloadLoading || !expenseData.length}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                downloadLoading || !expenseData.length
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaFilePdf className="text-lg" /> PDF
            </button>
          </div>
        </div>

        <ExpenseOverview
          data={expenseData}
          loading={loading}
          onAddClick={() => setOpenAddExpenseModal(true)}
        />

        <ExpenseList
          transactions={expenseData}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: { _id: id } })}
          onEdit={setEditingExpense}
          loading={loading}
        />

        <Modal
          isOpen={openAddExpenseModal || editingExpense}
          onClose={() => {
            setOpenAddExpenseModal(false);
            setEditingExpense(null);
          }}
          title={editingExpense ? "Edit Expense" : "Add New Expense"}
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            initialData={editingExpense}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <div className="p-6">
            <p className="text-center text-gray-600">
              Are you sure you want to delete this expense?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setOpenDeleteAlert({ show: false, data: null })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axiosInstance.delete(
                      API_PATHS.EXPENSE.DELETE_EXPENSE(openDeleteAlert.data._id)
                    );
                    toast.success("Expense deleted successfully!");
                    fetchExpenseDetails();
                  } catch (error) {
                    toast.error("Failed to delete expense");
                  }
                  setOpenDeleteAlert({ show: false, data: null });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
