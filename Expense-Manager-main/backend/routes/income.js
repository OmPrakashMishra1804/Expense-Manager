const Income = require("../models/IncomeSchema")
const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST / - create income (mounted at /income)
// Requires authentication via JWT
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { title, amount, category, description, date } = req.body
    const user = req.user._id;
    const income = Income({
        title,
        user,
        amount,
        category,
        description,
        date
    })
    try {
        // Validate required fields and amount
        if (!title || !category || !description || !date || !user) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        await income.save()
        res.status(201).json({ message: 'Income Added' })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
});


// GET / - list incomes (mounted at /income)
// Requires authentication via JWT
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    const searchQuery = req.query.searchQuery || '';
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    console.log("Search Query:", searchQuery);
    console.log("Current Page:", currentPage);
    try {
        const incomes = await Income.find({
            user: user,
            $expr: {
                $or: [
                    { $regexMatch: { input: "$title", regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: "$category", regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: "$description", regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: { $toString: "$amount" }, regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: { $toString: "$date" }, regex: searchQuery, options: "i" } },
                ]
            },
            limit: itemsPerPage,
            skip: (currentPage - 1) * itemsPerPage
        }).sort({ createdAt: -1 })
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).json({ data: incomes })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
});


// GET /categories/summary - get total income by category for the user
router.get("/categories/summary", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    const timeframe = req.query.timeframe || 'month';

    try {
        // Calculate date cutoff based on timeframe
        const now = new Date();
        let cutoffDate = new Date();

        switch (timeframe) {
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case '3months':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'all':
                cutoffDate = new Date(0); // Beginning of time
                break;
            default:
                cutoffDate.setMonth(now.getMonth() - 1); // Default to last month
        }

        const summary = await Income.aggregate([
            {
                $match: {
                    user: user,
                    date: { $gte: cutoffDate }
                }
            },
            { $group: { _id: "$category", amount: { $sum: "$amount" } } },
            { $project: { _id: 0, category: "$_id", amount: 1 } },
            { $sort: { amount: -1 } }
        ]);
        res.status(200).json({ data: summary });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// GET /monthly/summary - get total income by month for the user
router.get("/monthly/summary", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    try {
        const summary = await Income.aggregate([
            { $match: { user: user } },
            {
                $group: {
                    _id: { $dateToString: { format: "%b", date: "$date" } },
                    amount: { $sum: "$amount" }
                }
            },
            { $project: { _id: 0, month: "$_id", amount: 1 } },
            { $sort: { month: 1 } }
        ]);
        res.status(200).json({ data: summary });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// PUT /:id - update income (mounted at /income)
// Requires authentication via JWT
router.put("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;
    const user = req.user._id;
    const { title, amount, category, description, date } = req.body;

    try {
        // Validate required fields and amount
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }

        // Find and update the income
        const income = await Income.findOne({ _id: id, user: user });

        if (!income) {
            return res.status(404).json({ message: 'Income not found or you do not have permission to update it' });
        }

        income.title = title;
        income.amount = amount;
        income.category = category;
        income.description = description;
        income.date = date;

        await income.save();

        res.status(200).json({ message: 'Income Updated' });
    } catch (err) {
        console.error("Error updating income:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// DELETE /:id - delete income (mounted at /income)
// Requires authentication via JWT
router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const income = await Income.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;