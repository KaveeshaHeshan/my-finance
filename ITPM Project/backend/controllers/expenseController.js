const Expense = require("../models/Expense");
const PDFDocument = require('pdfkit');

// Download PDF
exports.downloadExpensePDF = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expense_report.pdf');

    doc.pipe(res);

    // ✅ Add EconoMe title
    doc.fontSize(22).font('Helvetica-Bold').text('EconoMe', { align: 'center' });
    doc.moveDown(0.5);

    // ✅ Add subtitle
    doc.fontSize(18).font('Helvetica-Bold').text('Expense Report', { align: 'center' });
    doc.moveDown();

    // Add generation date
    doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleDateString()}`, {
      align: 'right',
    });
    doc.moveDown();

    // Table Headers
    const tableTop = 150;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Date', 50, tableTop);
    doc.text('Category', 150, tableTop);
    doc.text('Amount (Rs.)', 400, tableTop);
    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

    // Table Data
    let yPosition = tableTop + 40;
    let totalAmount = 0;

    doc.font('Helvetica');
    expenses.forEach((expense) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc.text(new Date(expense.date).toLocaleDateString(), 50, yPosition);
      doc.text(expense.category, 150, yPosition);
      doc.text(expense.amount.toFixed(2), 400, yPosition);

      totalAmount += expense.amount;
      yPosition += 30;
    });

    // Total
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 20;
    doc.fontSize(14).font('Helvetica-Bold').text('Total:', 300, yPosition);
    doc.font('Helvetica').text(`Rs. ${totalAmount.toFixed(2)}`, 400, yPosition);

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF report' });
  }
};

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { category, amount, date } = req.body;
    
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      category,
      amount,
      date
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

// Get All Expenses
exports.getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    // Find and delete the expense
    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: req.user.id // Ensure user can only delete their own expenses
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  // Placeholder implementation
  res.status(200).json({ message: 'Excel download (placeholder)' });
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find and update the expense
    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        userId: req.user.id // Ensure user can only update their own expenses
      },
      {
        category,
        amount,
        date
      },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};
