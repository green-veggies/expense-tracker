import { useState, useContext } from "react";
import { Container, Card, TextField, Button, Typography, CircularProgress, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest";
import { ThemeContext } from "../../context/themeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, firstname, lastname, password } = values;
    setLoading(true);
  
    try {
      const { data } = await axios.post(registerAPI, { username, firstname, lastname, password });
  
      if (data?.message) {  
        toast.success(data.message || "Registration successful!", {
          position: "bottom-right",
          autoClose: 2000,
          theme: mode,  // ✅ NO `type: "success"` needed
        });
  
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: mode,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card sx={{ p: 4, width: "100%", maxWidth: 450, textAlign: "center", borderRadius: 3 }}>
        <IconButton onClick={toggleTheme} sx={{ position: "absolute", top: 16, right: 16 }}>
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>

        <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create an Account
        </Typography>

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
  label="First Name" 
  name="firstname" 
  fullWidth 
  margin="normal" 
  onChange={handleChange} 
  value={values.firstname} 
  InputProps={{
    sx: { 
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none" // Removes the border
      }
    }
  }} 
/>
<TextField 
  label="Last Name" 
  name="lastname" 
  fullWidth 
  margin="normal" 
  onChange={handleChange} 
  value={values.lastname} 
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Register;
