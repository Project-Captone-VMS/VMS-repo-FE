import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ExpenseForm from '../../components/Expense/ExpenseForm ';
import toast from 'react-hot-toast';
import { updateExpense } from '../../services/apiRequest';

const EditExpense = ({ isOpen, onClose, expense, onExpenseUpdated }) => {
    const handleSubmit = async (expenseData) => {
        try {
            await updateExpense(expense.expenseId, expenseData);
            toast.success("Expense updated successfully!");
            onExpenseUpdated && onExpenseUpdated(expenseData);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to update expense');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto z-50 border border-gray-200">
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                </DialogHeader>
                <ExpenseForm 
                    onSubmit={handleSubmit} 
                    isEdit={true} 
                    initialData={expense} 
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditExpense;
