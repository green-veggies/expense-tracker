import express from "express"
import {userRouter} from './user.js'
import { expenseRouter } from "./expense.js";
export const mainRouter=express.Router();
mainRouter.use("/user",userRouter);
mainRouter.use("/expense",expenseRouter);

