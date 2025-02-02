import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../context/themeContext";
import {
  Container,
  Card,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { DarkMode, LightMode, Delete, Edit, Logout } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API_URL = "https://expense-tracker-backend-7xlf.onrender.com" + "/api/v1";
console.log(API_URL)


const Home = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [chartData, setChartData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openInsightsDialog, setOpenInsightsDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });
  const [editExpense, setEditExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    id: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const categories = ["Food", "Travel", "Entertainment", "Utilities", "Health", "Education", "Other"];

  useEffect(() => {
    fetchTransactions();
    fetchMetrics();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/expense/view`, getAuthHeaders());
      setTransactions(response.data.expenses || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/expense/metrics`, getAuthHeaders());
      if (response.data && response.data.spending) {
        setChartData(response.data.spending);
      } else {
        setChartData([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch spending metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/user/logout`, {}, getAuthHeaders());
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewExpense({
      amount: "",
      category: "",
      date: "",
      description: "",
    });
  };

  const handleOpenEditDialog = (expense) => {
    setEditExpense({
      ...expense,
      date: expense.date.split("T")[0],
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditExpense({
      amount: "",
      category: "",
      date: "",
      description: "",
      id: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateExpense = async () => {
    if (!newExpense.amount || !newExpense.date || !newExpense.category) {
      toast.error("Amount, Category, and Date are required.");
      return;
    }
    
    try {
      await axios.post(`${API_URL}/expense/add`, newExpense, getAuthHeaders());
      toast.success("Expense added successfully!");
      fetchTransactions();
      fetchMetrics();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleEditExpense = async () => {
    try {
      await axios.put(`${API_URL}/expense/update/${editExpense.id}`, editExpense, getAuthHeaders());
      toast.success("Expense updated successfully!");
      fetchTransactions();
      fetchMetrics();
      handleCloseEditDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/expense/delete/${id}`, getAuthHeaders());
      toast.success("Expense deleted successfully!");
      fetchTransactions();
      fetchMetrics();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    setCurrentPage(1);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      (filterCategory ? transaction.category === filterCategory : true) &&
      (filterDate ? transaction.date.split("T")[0] === filterDate : true)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total spending and percentage distribution
  const totalSpending = chartData.reduce((total, item) => total + (item.totalSpending || 0), 0);
  const spendingInsights = chartData.map((item) => ({
    category: item.category,
    totalSpending: item.totalSpending || 0,
    percentage: totalSpending > 0 ? ((item.totalSpending / totalSpending) * 100).toFixed(2) : 0,
  }));

  // Transform the data for the BarChart
  const formattedChartData = chartData.map((item) => ({
    category: item.category,
    "Total Spending": item.totalSpending,
  }));

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <IconButton onClick={toggleTheme}>{mode === "dark" ? <LightMode /> : <DarkMode />}</IconButton>
        <IconButton onClick={handleLogout}><Logout /></IconButton>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="contained" onClick={handleOpenDialog}>New Expense</Button>
        <Button variant="contained" onClick={() => setOpenInsightsDialog(true)}>View Insights</Button>
      </Box>

      <Card sx={{ mt: 2 }}>
        <Typography variant="h6" p={2}>Recent Transactions</Typography>

        {/* Filter Controls */}
        <Box display="flex" gap={2} p={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={handleFilterCategoryChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={filterDate}
            onChange={handleFilterDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>₹{transaction.amount}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEditDialog(transaction)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExpense(transaction._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={Math.ceil(filteredTransactions.length / itemsPerPage)}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
          />
        </Box>
      </Card>

      {/* Dialog for New Expense */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            required
            name="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Category"
            select
            fullWidth
            required
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            fullWidth
            required
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateExpense} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit Expense */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            required
            name="amount"
            value={editExpense.amount}
            onChange={handleEditInputChange}
            margin="normal"
          />
          <TextField
            label="Category"
            select
            fullWidth
            required
            name="category"
            value={editExpense.category}
            onChange={handleEditInputChange}
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            fullWidth
            required
            name="date"
            value={editExpense.date}
            onChange={handleEditInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={editExpense.description}
            onChange={handleEditInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditExpense} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Insights */}
      <Dialog open={openInsightsDialog} onClose={() => setOpenInsightsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Spending Insights</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <BarChart width={500} height={300} data={formattedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total Spending" fill="#8884d8" />
              </BarChart>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Spending Breakdown</Typography>
              <Box mt={2}>
                {spendingInsights.map((insight) => (
                  <Box key={insight.category} display="flex" justifyContent="space-between" mt={1}>
                    <Typography>{insight.category}</Typography>
                    <Typography>₹{insight.totalSpending} ({insight.percentage}%)</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsightsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default Home;