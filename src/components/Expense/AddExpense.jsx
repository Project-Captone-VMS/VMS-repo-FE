import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ExpenseForm from '../../components/Expense/ExpenseForm ';
import toast from 'react-hot-toast';
import { createExpense } from '../../services/apiRequest';

const AddExpense = ({ isOpen, onClose, onExpenseAdded }) => {
    const handleSubmit = async (expenseData) => {
        try {
            await createExpense(expenseData);
            toast.success("Expense added successfully!");
            onExpenseAdded && onExpenseAdded(expenseData);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to add expense');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto z-50 border border-gray-200">

                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <ExpenseForm onSubmit={handleSubmit} isEdit={false} />
            </DialogContent>
        </Dialog>
    );
};

export default AddExpense;
