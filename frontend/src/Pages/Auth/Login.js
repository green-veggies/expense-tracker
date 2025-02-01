import { useState, useContext } from "react";
import { Container, Card, TextField, Button, Typography, CircularProgress, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import { ThemeContext } from "../../context/themeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ username: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: mode,
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(loginAPI, values);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: mode === "dark" ? "#121212" : "#f5f5f5" }}>
      <Card sx={{ p: 4, width: "100%", maxWidth: 450, textAlign: "center", borderRadius: 3, backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff", boxShadow: 3 }}>
        <IconButton onClick={toggleTheme} sx={{ position: "absolute", top: 16, right: 16 }}>
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>

        <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>Welcome Back</Typography>
        <Typography variant="h6" fontWeight="bold" color="text.secondary" gutterBottom>Login</Typography>

        <form onSubmit={handleSubmit}>
          <TextField 
            label="Username" 
            name="username" 
            fullWidth 
            margin="normal" 
            onChange={handleChange} 
            value={values.username} 
            InputProps={{
              sx: { 
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none" // Removes the border
                }
              }
            }} 
          />
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            fullWidth 
            margin="normal" 
            onChange={handleChange} 
            value={values.password} 
            InputProps={{
              sx: { 
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none" // Removes the border
                }
              }
            }} 
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Login;

