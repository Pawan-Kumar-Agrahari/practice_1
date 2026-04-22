import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        title,
        amount: Number(amount),
        category,
        date: date ? date : undefined
      };

      if (editingId) {
        const res = await api.put(`/expenses/${editingId}`, expenseData);
        setExpenses(expenses.map(exp => exp._id === editingId ? res.data : exp));
        setEditingId(null);
      } else {
        const res = await api.post('/expenses', expenseData);
        setExpenses([res.data, ...expenses]);
      }
      
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategory(exp.category);
    setDate(exp.date ? new Date(exp.date).toISOString().split('T')[0] : '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(exp => exp._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Other'];
  
  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(exp => exp.category === filter);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}</h1>
        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="expense-form-card">
          <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="E.g., Groceries"
              />
            </div>
            <div className="form-group">
               <label>Amount ($)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01" step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">{editingId ? 'Update Expense' : 'Add Expense'}</button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setAmount('');
                  setCategory('Food');
                  setDate('');
                }}
                style={{ marginTop: '10px' }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="expense-list-card">
          <div className="filters">
            <h2>Your Expenses</h2>
            <select 
              className="filter-select"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="expense-list">
            {filteredExpenses.length === 0 ? (
              <div className="empty-state">No expenses found for this category.</div>
            ) : (
              filteredExpenses.map(exp => (
                <div key={exp._id} className="expense-item">
                  <div className="expense-info">
                    <p className="title">{exp.title}</p>
                    <span className="category">{exp.category}</span>
                    <p className="date">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                  <div className="expense-amount-actions">
                    <div className="expense-amount">
                      ${parseFloat(exp.amount).toFixed(2)}
                    </div>
                    <div className="expense-actions">
                      <button onClick={() => handleEdit(exp)} className="btn-icon edit-btn" title="Edit">✎</button>
                      <button onClick={() => handleDelete(exp._id)} className="btn-icon delete-btn" title="Delete">🗑</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
