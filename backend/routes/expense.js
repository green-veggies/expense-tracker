import express from 'express';
import { expense } from '../db.js';
import { middleware } from '../middleware.js';
import mongoose from 'mongoose';

const expenseRouter = express.Router();

expenseRouter.get('/view',middleware, async (req, res) => {
    const userId = req.userId;  

    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }

    try {
        const foundExpenses = await expense.find({ userId: userId });

        if (foundExpenses.length === 0) {
            return res.status(404).json({ message: 'No expenses made by user yet' });
        }

        res.status(200).json({ expenses: foundExpenses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});
expenseRouter.post('/add', middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }
    const { amount, category, description } = req.body;
    try{
        const newExpense=await expense.create({
            userId:userId,
            amount:amount,
            category:category,
            date:new Date(),
            description:description
        });
        res.status(201).json({
            message:"expense created",
            expense:newExpense})
    }
    catch(error){
        res.send(500).json({message:'Error while adding expense'});
    }






});
expenseRouter.put("/update/:id", middleware, async (req, res) => {
    const id = req.params.id;
    
    

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const objectId = new mongoose.Types.ObjectId(id);  // Correct conversion


        const foundExpense = await expense.findById(objectId);

        if (!foundExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (foundExpense.userId !== req.userId) {
            return res.status(401).json({ message: "Not authorized to update this expense" });
        }

        await expense.updateOne(
            { _id: objectId }, 
            { $set: req.body } 
        );

        const updatedExpense = await expense.findById(objectId);

        res.status(200).json({
            message: "Expense updated",
            expense: updatedExpense 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
expenseRouter.delete("/delete/:id", middleware, async (req, res) => {
    const id = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const objectId = new mongoose.Types.ObjectId(id);  // Correct conversion

        const foundExpense = await expense.findById(objectId);

        if (!foundExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (foundExpense.userId !== req.userId) {
            return res.status(401).json({ message: "Not authorized to delete this expense" });
        }

        await expense.deleteOne({ _id: objectId });

        res.status(200).json({ message: "Expense deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
expenseRouter.get("/total",middleware,async(req,res)=>{
    const userId=req.userId;
    let total=0;
    try{
        const foundExpenses = await expense.find({ userId: userId });
        if (foundExpenses.length === 0) {
           
            return res.status(404).json({ total: 0 });
        }
        foundExpenses.map((expense)=>{

            total+=expense.amount;
        })
        res.status(200).json({total:total});

        
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})
expenseRouter.get("/metrics", middleware, async (req, res) => {
    try {
        const userId = req.userId; 
        const categoryWiseSpending = await expense.aggregate([
            {
                $match: { userId: userId} 
            },
            {
                $group: {
                    _id: "$category",
                    totalSpending: { $sum: "$amount" } 
                }
            },
            {
                $project: {
                    category: "$_id", 
                    totalSpending: 1,
                    _id: 0
                }
            }
        ]);

  
        if (categoryWiseSpending.length === 0) {
            return res.status(404).json({ message: "No spending data found for this user" });
        }

        res.status(200).json({
            
            spending: categoryWiseSpending
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
});
export { expenseRouter };
