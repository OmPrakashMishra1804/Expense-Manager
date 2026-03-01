export async function fetchIncomeCategorySummary(timeframe: 'week' | 'month' | '3months' | 'year' | 'all' = 'month') {
    const token = localStorage.getItem("expToken");
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/income/categories/summary?timeframe=${timeframe}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch income summary');
    return data.data;
}

export async function fetchIncomeMonthlySummary() {
    const token = localStorage.getItem("expToken");
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/income/monthly/summary`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch income monthly summary');
    return data.data;
}