export const FINANCE_TYPES = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export const INCOME_CATEGORIES = [
  "মাসিক বেতন",
  "ভর্তি ফি",
  "পরীক্ষার ফি",
  "বই/নোট বিক্রি",
  "ডোনেশন",
  "Opening Balance",
  "অন্যান্য আয়",
] as const;

export const EXPENSE_CATEGORIES = [
  "বিদ্যুৎ বিল",
  "বাড়ি ভাড়া",
  "বেতন",
  "স্টেশনারি/বই",
  "ইন্টারনেট বিল",
  "পরিষ্কার/রক্ষণাবেক্ষণ",
  "Opening Balance",
  "অন্যান্য খরচ",
] as const;
