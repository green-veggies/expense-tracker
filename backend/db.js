import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MongoDB_URI = process.env.MONGO_DB;

mongoose.connect(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
    userId: { type:String , required: true },
    amount: { type: Number, required: true },
    category: { 
        type: String, 
        
        required: true 
    },
    date: { type: Date, required: true },
    description: { type: String, trim: true }
}, { timestamps: true });

export const user = mongoose.model("User", userSchema);
export const expense = mongoose.model("Expense", expenseSchema);
