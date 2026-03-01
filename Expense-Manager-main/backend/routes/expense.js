const Expense = require("../models/ExpenseSchema")
const express = require('express');
const router = express.Router();
const passport = require('passport');


// POST / - create expense (mounted at /expense)
// Requires authentication via JWT
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    const { title, amount, category, description, date } = req.body;
    const expense = Expense({
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
        await expense.save()
        res.status(201).json({ message: 'Expense Added' })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
});


// GET / - list expenses (mounted at /expense)
// Requires authentication via JWT
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    const searchQuery = req.query.searchQuery || '';
    const currPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    try {
        const expenses = await Expense.find({
            user: user,
            $expr: {
                $or: [
                    { $regexMatch: { input: "$title", regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: "$category", regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: "$description", regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: { $toString: "$amount" }, regex: searchQuery, options: "i" } },
                    { $regexMatch: { input: { $toString: "$date" }, regex: searchQuery, options: "i" } },
                ]
            }
        }).sort({ createdAt: -1 })
            .skip((currPage - 1) * itemsPerPage)
            .limit(itemsPerPage);
        res.status(200).json({ data: expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// GET /categories/summary - get total expenses by category for the user
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

        const summary = await Expense.aggregate([
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

// GET /monthly/summary - get total expenses by month for the user
router.get("/monthly/summary", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    try {
        const summary = await Expense.aggregate([
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

// GET /recent - get recent expense transactions for the user
router.get("/recent", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const user = req.user._id;
    try {
        const recent = await Expense.find({ user: user })
            .sort({ date: -1 })
            .limit(10);
        res.status(200).json({ data: recent });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// DELETE /:id - delete expense (mounted at /expense)
// Requires authentication via JWT
router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /:id - update expense (mounted at /expense)
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

        // Find and update the expense
        const expense = await Expense.findOne({ _id: id, user: user });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or you do not have permission to update it' });
        }

        expense.title = title;
        expense.amount = amount;
        expense.category = category;
        expense.description = description;
        expense.date = date;

        await expense.save();

        res.status(200).json({ message: 'Expense Updated' });
    } catch (err) {
        console.error("Error updating expense:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;