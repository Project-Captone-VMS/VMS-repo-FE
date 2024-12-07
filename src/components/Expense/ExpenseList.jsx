import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseList = ({ onEdit, onDelete }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get('/api/expenses')
            .then(response => {
                // Ensure response.data is an array before setting it
                if (Array.isArray(response.data)) {
                    setExpenses(response.data);
                } else {
                    console.error('Expected an array of expenses, but got:', response.data);
                    setExpenses([]);  // Fallback to an empty array
                }
            })
            .catch(error => {
                console.error("Error fetching expenses", error);
                setExpenses([]);  // Fallback to an empty array in case of an error
            });
    }, []);

    const handleDelete = (expenseId) => {
        axios.delete(`/api/expenses/${expenseId}`)
            .then(() => {
                setExpenses(expenses.filter(expense => expense.expenseId !== expenseId));
            })
            .catch(error => {
                console.error("Error deleting expense", error);
            });
    };

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Expense List</h2>
            <table className="w-full mt-4 table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border text-left">Description</th>
                        <th className="px-4 py-2 border text-left">Amount</th>
                        <th className="px-4 py-2 border text-left">Date</th>
                        <th className="px-4 py-2 border text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(expenses) && expenses.length > 0 ? (
                        expenses.map(expense => (
                            <tr key={expense.expenseId} className="border-b">
                                <td className="px-4 py-2">{expense.description}</td>
                                <td className="px-4 py-2">{expense.amount}</td>
                                <td className="px-4 py-2">{expense.date}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => onEdit(expense.expenseId)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Edit</button>
                                    <button onClick={() => handleDelete(expense.expenseId)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-2 text-center">No expenses available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
