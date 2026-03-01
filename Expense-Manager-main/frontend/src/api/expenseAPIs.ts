export async function fetchExpenseCategorySummary(timeframe: 'week' | 'month' | '3months' | 'year' | 'all' = 'month') {
    const token = localStorage.getItem("expToken");
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/categories/summary?timeframe=${timeframe}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch expense summary');
    return data.data;
}

export async function fetchExpenseMonthlySummary() {
    const token = localStorage.getItem("expToken");
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/monthly/summary`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch expense monthly summary');
    return data.data;
}

export async function fetchRecentExpenses() {
    const token = localStorage.getItem("expToken");
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/recent`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch recent expenses');
    return data.data;
}