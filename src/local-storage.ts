export interface DailySpending {
    id: number;
    timestamp: string;
    name: string;
    category: string;
    amount: number;
    description: string;
}

type DailySpendingStore = Record<string, DailySpending[]>

export function saveDailySpendingLocal(date: string, spending: DailySpending[]) {
    console.log(`Saving ${date} - ${spending}`)
    const itemsStr = localStorage.getItem("dailySpending")
    const store = itemsStr ? JSON.parse(itemsStr) as DailySpendingStore : {}
    store[date] = spending
    localStorage.setItem("dailySpending", JSON.stringify(store))
}

export function removeDailySpendingLocal(date: string) {
    const itemsStr = localStorage.getItem("dailySpending")
    const store = itemsStr ? JSON.parse(itemsStr) as DailySpendingStore : {}
    delete store[date]
}

export function getDailySpendingLocal(date: string): DailySpending[] {
    const itemsStr = localStorage.getItem("dailySpending")
    if (!itemsStr) return [];
    const store = JSON.parse(itemsStr) as DailySpendingStore
    console.log(store)
    return store[date] || []
}