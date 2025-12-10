
import { getLanguage } from './storage';

export type Lang = 'en' | 'he';

const dictionaries = {
  en: {
    // General
    'app_name': 'BabyLog',
    'greeting_morning': 'Good Morning',
    'greeting_afternoon': 'Good Afternoon',
    'greeting_evening': 'Good Evening',
    'save': 'Save',
    'saved': 'Saved!',
    'notes_placeholder': 'Add a note...',
    'cancel': 'Cancel',
    
    // Navigation
    'nav_home': 'Home',
    'nav_nursing': 'Nurse',
    'nav_bottle': 'Bottle',
    'nav_pump': 'Pump',
    'nav_diaper': 'Diaper',
    'nav_history': 'History',
    'nav_ai': 'Assistant',

    // Home
    'last_feed': 'Feed',
    'last_diaper': 'Diaper',
    'last_sleep': 'Sleep',
    'no_logs': 'No data',
    'overdue': 'Overdue by',
    'next': 'Next',
    'goal': 'GOAL',
    'recent_activity': 'Recent Activity',
    'nursing_timer': 'Timer',
    'bottle_log': 'Log Feed',
    'ai_insights': 'AI Insights',
    'ai_desc': 'Get tips & patterns',
    'reminders': 'Reminders',
    'reminders_desc': 'Set a goal interval for feeding. We\'ll gently notify you if it\'s been too long.',
    'off': 'Off',
    'hours': 'Hours',
    'settings': 'Settings',
    'language': 'Language',

    // Nursing
    'nursing_title': 'Nursing',
    'last_side': 'Last Side',
    'active': 'Active',
    'save_session': 'Save Session',
    'left_initial': 'L',
    'right_initial': 'R',
    'left': 'Left',
    'right': 'Right',
    'session_timer': 'Session Timer',

    // Bottle
    'bottle_title': 'Bottle Feed',
    'formula': 'Formula',
    'breast_milk': 'Breast Milk',
    'ml': 'mL',
    'oz': 'oz',
    'save_log': 'Save Log',
    'quick_add': 'Quick Add',

    // Pump
    'pump_title': 'Pumping',
    'total_output': 'Total Output',

    // Diaper
    'diaper_title': 'Diaper Change',
    'wet': 'WET',
    'dirty': 'DIRTY',
    'both': 'BOTH',
    'wet_desc': 'Just pee',
    'dirty_desc': 'Poop',
    'both_desc': 'The works',
    'diaper_notes': 'Notes (texture, color)...',
    
    // Sleep
    'sleep_title': 'Sleep',
    'sleep_log': 'Log Sleep',
    'fell_asleep': 'Fell Asleep',
    'woke_up': 'Woke Up',
    'duration': 'Duration',
    'invalid_duration': 'End time must be after start time.',

    // History
    'history_title': 'History',
    'activity_log': 'Activity Log',
    'trends_stats': 'Trends & Stats',
    'no_logs_yet': 'No logs yet.',
    'min': 'min',

    // Stats
    'last_7_days': 'Last 7 Days',
    'avg_vol': 'Avg Vol / Day',
    'avg_nurse': 'Avg Nurse / Day',
    'feeding_volume': 'Feeding Volume',
    'nursing_time': 'Nursing Time',
    'diaper_count': 'Diaper Count (7 Days)',

    // Assistant
    'ai_title': 'BabyLog AI',
    'online': 'Online',
    'thinking': 'Thinking...',
    'ask_placeholder': 'Ask anything...',
    'ai_intro': "Hi! I'm BabyLog AI. I can analyze your logs or answer parenting questions.",
    'ai_error_key': "I'm sorry, I can't connect right now (Missing API Key).",
  },
  he: {
    // General
    'app_name': 'BabyLog',
    'greeting_morning': 'בוקר טוב',
    'greeting_afternoon': 'צהריים טובים',
    'greeting_evening': 'ערב טוב',
    'save': 'שמירה',
    'saved': 'נשמר!',
    'notes_placeholder': 'הוסף הערה...',
    'cancel': 'ביטול',
    
    // Navigation
    'nav_home': 'בית',
    'nav_nursing': 'הנקה',
    'nav_bottle': 'בקבוק',
    'nav_pump': 'שאיבה',
    'nav_diaper': 'חיתול',
    'nav_history': 'היסטוריה',
    'nav_ai': 'עוזר',

    // Home
    'last_feed': 'האכלה',
    'last_diaper': 'חיתול',
    'last_sleep': 'שינה',
    'no_logs': 'אין נתונים',
    'overdue': 'איחור של',
    'next': 'הבא',
    'goal': 'יעד',
    'recent_activity': 'פעילות אחרונה',
    'nursing_timer': 'שעון עצר',
    'bottle_log': 'רישום',
    'ai_insights': 'תובנות AI',
    'ai_desc': 'טיפים ודפוסים',
    'reminders': 'תזכורות',
    'reminders_desc': 'הגדירי מרווח זמן רצוי להאכלות. אנחנו נזכיר לך בעדינות אם עבר יותר מדי זמן.',
    'off': 'כבוי',
    'hours': 'שעות',
    'settings': 'הגדרות',
    'language': 'שפה',

    // Nursing
    'nursing_title': 'הנקה',
    'last_side': 'צד אחרון',
    'active': 'פעיל',
    'save_session': 'שמור סשן',
    'left_initial': 'שמאל',
    'right_initial': 'ימין',
    'left': 'שמאל',
    'right': 'ימין',
    'session_timer': 'שעון סשן',

    // Bottle
    'bottle_title': 'האכלה מבקבוק',
    'formula': 'תמ״ל',
    'breast_milk': 'חלב אם',
    'ml': 'מ״ל',
    'oz': 'אונקיות',
    'save_log': 'שמור רישום',
    'quick_add': 'הוספה מהירה',

    // Pump
    'pump_title': 'שאיבה',
    'total_output': 'סה״כ כמות',

    // Diaper
    'diaper_title': 'החלפת חיתול',
    'wet': 'רטוב',
    'dirty': 'מלוכלך',
    'both': 'גם וגם',
    'wet_desc': 'רק פיפי',
    'dirty_desc': 'קקי',
    'both_desc': 'הכל כלול',
    'diaper_notes': 'הערות (מרקם, צבע)...',

    // Sleep
    'sleep_title': 'שינה',
    'sleep_log': 'רישום שינה',
    'fell_asleep': 'נרדם ב',
    'woke_up': 'התעורר ב',
    'duration': 'משך',
    'invalid_duration': 'זמן סיום חייב להיות אחרי זמן התחלה.',

    // History
    'history_title': 'היסטוריה',
    'activity_log': 'יומן פעילות',
    'trends_stats': 'מגמות וסטטיסטיקה',
    'no_logs_yet': 'אין עדיין רישומים.',
    'min': 'דק׳',

    // Stats
    'last_7_days': '7 ימים אחרונים',
    'avg_vol': 'ממוצע נפח / יום',
    'avg_nurse': 'ממוצע הנקה / יום',
    'feeding_volume': 'נפח האכלה',
    'nursing_time': 'זמן הנקה',
    'diaper_count': 'ספירת חיתולים (7 ימים)',

    // Assistant
    'ai_title': 'עוזר חכם',
    'online': 'מחובר',
    'thinking': 'חושב...',
    'ask_placeholder': 'שאל כל דבר...',
    'ai_intro': "היי! אני BabyLog AI. אני יכול לנתח את הנתונים שלך או לענות על שאלות הורות.",
    'ai_error_key': "מצטער, אני לא מצליח להתחבר כרגע (חסר מפתח API).",
  }
};

export const t = (key: string): string => {
  const lang = getLanguage() as Lang;
  const dict = dictionaries[lang] || dictionaries['en'];
  return dict[key as keyof typeof dict] || key;
};

export const isRTL = (): boolean => getLanguage() === 'he';

export const getDir = (): 'rtl' | 'ltr' => isRTL() ? 'rtl' : 'ltr';
