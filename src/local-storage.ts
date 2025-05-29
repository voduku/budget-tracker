export interface DailySpending {
  id: number;
  timestamp: string;
  name: string;
  category: string;
  amount: number;
  description: string;
}

export interface BudgetGoal {
  name: string;
  description: string;
  amount: number;
  startDate: string;
  completionDate: string;
}

type DailySpendingStore = Record<string, DailySpending[]>;
export type BudgetGoalStore = Record<string, BudgetGoal>;

export function saveDailySpendingLocal(date: string, spending: DailySpending[]) {
  const itemsStr = localStorage.getItem("dailySpending");
  const store = itemsStr ? (JSON.parse(itemsStr) as DailySpendingStore) : {};
  store[date] = spending;
  localStorage.setItem("dailySpending", JSON.stringify(store));
}

export function removeDailySpendingLocal(date: string) {
  const itemsStr = localStorage.getItem("dailySpending");
  const store = itemsStr ? (JSON.parse(itemsStr) as DailySpendingStore) : {};
  delete store[date];
}

export function getDailySpendingLocal(date: string): DailySpending[] {
  const itemsStr = localStorage.getItem("dailySpending");
  if (!itemsStr) return [];
  const store = JSON.parse(itemsStr) as DailySpendingStore;
  return store[date] || [];
}

export function saveAllBudgetGoalLocal(store: BudgetGoalStore) {
  localStorage.setItem("budgetGoal", JSON.stringify(store));
}

export function removeBudgetGoalLocal(name: string) {
  // const itemsStr = localStorage.getItem("budgetGoal");
  // const store = itemsStr ? (JSON.parse(itemsStr) as BudgetGoalStore) : {};
  // delete store[name];
  localStorage.removeItem("budgetGoal");
}

export function getBudgetGoalLocal(name: string): BudgetGoal | undefined {
  const itemsStr = localStorage.getItem("budgetGoal");
  if (!itemsStr) return undefined;
  const store = JSON.parse(itemsStr) as BudgetGoalStore;
  return store[name];
}

export function getAllBudgetGoalLocal(): BudgetGoalStore {
  const itemsStr = localStorage.getItem("budgetGoal");
  if (!itemsStr) return {
    default: {
      name: "default",
      description: "",
      amount: 0,
      startDate: "",
      completionDate: ""
    }
  };
  return JSON.parse(itemsStr) as BudgetGoalStore;
}
