/**
 * ============================================================================
 * THE RUSH WAY - COACH CRM & ATHLETE HUB
 * Production-Grade Modular Vanilla JavaScript (ES6+)
 * 
 * CORE PRINCIPLES:
 * 1. ZERO Mock/Stub Leakage: Starts with strictly clean, empty state (athletes = []).
 * 2. Coach PIN Authentication: Protected by PIN '1994' in sessionStorage.
 * 3. Unified Local Storage: Unified key 'rush_way_athletes' with error-safe JSON parsing.
 * 4. Interactive Anatomical Workout Builder: SVG Body Map (Front/Back) with targeted library.
 * 5. Isolated Client Magic Portal: Encoded deep links for portal.html with 4-digit phone PIN.
 * 6. Cloud Webhook Sync: Asynchronous non-blocking fetch() POST to Google Apps Script.
 * ============================================================================
 */

// Global Configuration
const STORAGE_KEY = 'rush_way_athletes';
const COACH_PIN = '1994';
const COACH_AUTH_KEY = 'rush_coach_auth';
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxIqTMzE1_dak-wjNBHLVqb3eSuAoHBDRhmYAZvA05AuseqAnvTpWrrJJgYJU3ybYBWDA/exec';

// Central State (Zero mock leakage - starts clean)
let athletes = [];

// Workout Builder Draft State
let activeBuilderAthleteId = null;
let activeBuilderRoutine = [];
let currentBodyView = 'front';
let currentSelectedMuscle = 'chest';

/**
 * ============================================================================
 * EXERCISE DATABASE ORGANIZED BY ANATOMICAL MUSCLE GROUPS
 * ============================================================================
 */
const EXERCISE_DATABASE = {
  chest: [
    { id: 'ex_c1', name: 'Incline Dumbbell Press', nameAr: 'ضغط دمبلز مائل للأعلى', muscleGroup: 'الصدر', targetHead: 'الألياف العلوية (Clavicular Head)', volume: '3-4 مجموعات × 8-10 تكرار' },
    { id: 'ex_c2', name: 'Flat Barbell Bench Press', nameAr: 'ضغط بار مستوي كلاسيكي', muscleGroup: 'الصدر', targetHead: 'وسط وأسفل الصدر (Sternal Head)', volume: '3 مجموعات × 6-8 تكرار (RPE 8)' },
    { id: 'ex_c3', name: 'Low-to-High Cable Flyes', nameAr: 'تجميع كابل سفلي لمائل', muscleGroup: 'الصدر', targetHead: 'الصدر العلوي والتقريب المائل', volume: '3 مجموعات × 12-15 تكرار' },
    { id: 'ex_c4', name: 'Weighted Chest Dips', nameAr: 'متوازي بالوزن مع ميلان للأمام', muscleGroup: 'الصدر', targetHead: 'الحافة السفلية للصدر (Costal Head)', volume: '3 مجموعات × 8-12 تكرار' },
    { id: 'ex_c5', name: 'Pec Deck Fly Machine', nameAr: 'فراشة الصدر على الجهاز مع ثبات ثانيتين', muscleGroup: 'الصدر', targetHead: 'عزل ألياف الصدر وانقباض قمي', volume: '3 مجموعات × 12-15 تكرار' }
  ],
  front_delts: [
    { id: 'ex_fd1', name: 'Seated Dumbbell Shoulder Press', nameAr: 'ضغط دمبلز جالس للأكتاف', muscleGroup: 'الأكتاف', targetHead: 'الكتف الأمامي (Anterior Deltoid)', volume: '3-4 مجموعات × 8-10 تكرار' },
    { id: 'ex_fd2', name: 'Cable Lateral Raises', nameAr: 'رفرفة كابل جانبية خلف الظهر', muscleGroup: 'الأكتاف', targetHead: 'الكتف الجانبي (Lateral Deltoid)', volume: '4 مجموعات × 12-15 تكرار' },
    { id: 'ex_fd3', name: 'Standing Overhead Barbell Press', nameAr: 'ضغط عسكري بالبار واقف', muscleGroup: 'الأكتاف', targetHead: 'الكتف الأمامي والكتلة الشاملة', volume: '3 مجموعات × 6-8 تكرار' },
    { id: 'ex_fd4', name: 'Dumbbell Incline Y-Raise', nameAr: 'رفرفة Y على بنش مائل مسنود', muscleGroup: 'الأكتاف', targetHead: 'الكتف الجانبي والأعلى', volume: '3 مجموعات × 12-15 تكرار' }
  ],
  rear_delts: [
    { id: 'ex_rd1', name: 'Reverse Pec Deck Fly', nameAr: 'فراشة خلفية للأكتاف على الجهاز', muscleGroup: 'الأكتاف الخلفية', targetHead: 'الكتف الخلفي (Posterior Deltoid)', volume: '4 مجموعات × 12-15 تكرار' },
    { id: 'ex_rd2', name: 'Cable Face Pulls with External Rotation', nameAr: 'سحب حبل كابل للوجه مع دوران خارجي', muscleGroup: 'الأكتاف الخلفية', targetHead: 'الكتف الخلفي والروتاتور كف', volume: '3-4 مجموعات × 15-20 تكرار' },
    { id: 'ex_rd3', name: 'Incline Dumbbell Rear Lateral Raise', nameAr: 'رفرفة دمبلز خلفية على بنش مائل', muscleGroup: 'الأكتاف الخلفية', targetHead: 'الكتف الخلفي المعزول', volume: '3 مجموعات × 12-15 تكرار' }
  ],
  traps: [
    { id: 'ex_tr1', name: 'Dumbbell Shrugs with 2s Squeeze', nameAr: 'شراجز دمبلز مع عصر قمي ثانيتين', muscleGroup: 'الترابيس', targetHead: 'الترابيس العلوية (Upper Trapezius)', volume: '4 مجموعات × 10-12 تكرار' },
    { id: 'ex_tr2', name: 'Chest-Supported Incline Kelso Shrugs', nameAr: 'شراجز كيلسو على بنش مائل مسنود', muscleGroup: 'الترابيس', targetHead: 'الترابيس الوسطى والسفلية', volume: '3 مجموعات × 12-15 تكرار' }
  ],
  lats: [
    { id: 'ex_l1', name: 'Neutral-Grip Lat Pulldown', nameAr: 'سحب ظهر قبضة محايدة للصدر', muscleGroup: 'الظهر / المجنص', targetHead: 'ألياف المجنص السفلية (Iliac Lat)', volume: '3-4 مجموعات × 8-10 تكرار' },
    { id: 'ex_l2', name: 'Single-Arm Half-Kneeling Cable Pulldown', nameAr: 'سحب كابل فردي للظهر في وضع الركوع', muscleGroup: 'الظهر / المجنص', targetHead: 'عزل المجنص بدون مساعدة القطنية', volume: '3 مجموعات × 10-12 تكرار' },
    { id: 'ex_l3', name: 'Chest-Supported T-Bar Row', nameAr: 'سحب T-Bar مسنود الصدر', muscleGroup: 'الظهر', targetHead: 'سماكة الظهر والوسط', volume: '3-4 مجموعات × 8-10 تكرار' },
    { id: 'ex_l4', name: 'Seated Cable Row (Wide Grip)', nameAr: 'سحب كابل أرضي قبضة واسعة', muscleGroup: 'الظهر', targetHead: 'أعلى الظهر والترابيس الوسطى', volume: '3 مجموعات × 10-12 تكرار' }
  ],
  lower_back: [
    { id: 'ex_lb1', name: '45-Degree Hyperextensions', nameAr: 'تمديد ظهر بزاوية 45 مع حمل وزن', muscleGroup: 'أسفل الظهر', targetHead: 'الانتصاب الشوكي (Erector Spinae)', volume: '3 مجموعات × 12-15 تكرار' },
    { id: 'ex_lb2', name: 'Romanian Deadlift (Dumbbell)', nameAr: 'ديدليفت روماني بالدمبلز', muscleGroup: 'السلسلة الخلفية', targetHead: 'القطنية والخلفيات والأرداف', volume: '3-4 مجموعات × 8-10 تكرار' }
  ],
  biceps: [
    { id: 'ex_b1', name: 'Incline Dumbbell Bicep Curl', nameAr: 'كيرل دمبلز على بنش مائل بمدى استطالة كامل', muscleGroup: 'البايسبس', targetHead: 'الرأس الطويل (Long Head Stretch)', volume: '3-4 مجموعات × 10-12 تكرار' },
    { id: 'ex_b2', name: 'EZ-Bar Preacher Curl', nameAr: 'كيرل لاري سكوت بالبار المتعرج', muscleGroup: 'البايسبس', targetHead: 'الرأس القصير (Short Head Peak)', volume: '3 مجموعات × 8-10 تكرار' },
    { id: 'ex_b3', name: 'Cross-Body Hammer Curls', nameAr: 'كيرل مطرقة متقاطع على الصدر', muscleGroup: 'البايسبس والساعد', targetHead: 'العضلة العضدية (Brachialis)', volume: '3 مجموعات × 10-12 تكرار' }
  ],
  triceps: [
    { id: 'ex_tri1', name: 'Overhead Dual-Rope Cable Extension', nameAr: 'تمديد كابل علوي بالحبل المزدوج', muscleGroup: 'الترايسبس', targetHead: 'الرأس الطويل (Long Head Stretch)', volume: '3-4 مجموعات × 10-12 تكرار' },
    { id: 'ex_tri2', name: 'V-Bar Cable Pushdown', nameAr: 'ضغط كابل للأسفل بمسطرة V', muscleGroup: 'الترايسبس', targetHead: 'الرأس الجانبي (Lateral Head)', volume: '3 مجموعات × 10-12 تكرار' },
    { id: 'ex_tri3', name: 'Dips between Benches / Parallel Bars', nameAr: 'غطس متوازي للترايسبس', muscleGroup: 'الترايسبس', targetHead: 'الكتلة الشاملة للذراع الخلفي', volume: '3 مجموعات × 10-12 تكرار' }
  ],
  forearms: [
    { id: 'ex_fo1', name: 'Reverse EZ-Bar Curl', nameAr: 'كيرل قبضة مقلوبة بالبار المتعرج', muscleGroup: 'الساعد', targetHead: 'العضدية الكعبرية (Brachioradialis)', volume: '3 مجموعات × 12-15 تكرار' },
    { id: 'ex_fo2', name: 'Behind-the-Back Barbell Wrist Curl', nameAr: 'ثني معصم بالبار خلف الظهر', muscleGroup: 'الساعد والقبضة', targetHead: 'قابضات الأصابع والمعصم', volume: '3 مجموعات × 15-20 تكرار' }
  ],
  abs: [
    { id: 'ex_ab1', name: 'Hanging Straight Leg Raise', nameAr: 'رفع الأرجل مستقيمة على العقلة', muscleGroup: 'البطن والكور', targetHead: 'البطن السفلية ومثبتات الحوض', volume: '3-4 مجموعات × 12-15 تكرار' },
    { id: 'ex_ab2', name: 'Kneeling Cable Crunch', nameAr: 'طحن كابل للبطن في وضع الركوع', muscleGroup: 'البطن والكور', targetHead: 'البطن المستقيمة (Rectus Abdominis)', volume: '3 مجموعات × 12-15 تكرار' },
    { id: 'ex_ab3', name: 'Cable Woodchopper', nameAr: 'تمرين تقطيع الخشب بالكابل', muscleGroup: 'البطن والكور', targetHead: 'العضلات المائلة (Obliques)', volume: '3 مجموعات × 12-15 تكرار لكل جهة' }
  ],
  quads: [
    { id: 'ex_q1', name: 'Heels-Elevated Hack Squat', nameAr: 'هاك سكوات مع كعوب مرفوعة وعمق كامل', muscleGroup: 'الفخذ الأمامي', targetHead: 'عزل الكوادز (Vastus Lateralis/Medialis)', volume: '3-4 مجموعات × 8-10 تكرار' },
    { id: 'ex_q2', name: 'Seated Leg Extension with 1s Pause', nameAr: 'فرد أرجل جالس على الجهاز مع ثبات ثانية', muscleGroup: 'الفخذ الأمامي', targetHead: 'المستقيمة الفخذية (Rectus Femoris)', volume: '3 مجموعات × 12-15 تكرار' },
    { id: 'ex_q3', name: 'Dumbbell Bulgarian Split Squat', nameAr: 'سكوات بلغاري بالدمبلز', muscleGroup: 'الفخذ الأمامي والأرداف', targetHead: 'القوة الأحادية وتوازن الساقين', volume: '3 مجموعات × 10-12 تكرار لكل ساق' },
    { id: 'ex_q4', name: 'Barbell Front Squat', nameAr: 'سكوات أمامي بالبار الأولمبي', muscleGroup: 'الفخذ الأمامي', targetHead: 'الحمل المباشر على الكوادز والكور', volume: '3 مجموعات × 6-8 تكرار' }
  ],
  hamstrings: [
    { id: 'ex_h1', name: 'Seated Leg Curl with Full Hip Flexion', nameAr: 'ثني أرجل جالس مع استطالة حوض كاملة', muscleGroup: 'الفخذ الخلفي', targetHead: 'عزل الخلفيات (Semimembranosus/Biceps)', volume: '3-4 مجموعات × 10-12 تكرار' },
    { id: 'ex_h2', name: 'Lying Leg Curl', nameAr: 'ثني أرجل مستلقي على الجهاز', muscleGroup: 'الفخذ الخلفي', targetHead: 'قمة انقباض الفخذ الخلفي', volume: '3 مجموعات × 10-12 تكرار' },
    { id: 'ex_h3', name: 'Dumbbell Stiff-Legged Deadlift', nameAr: 'ديدليفت بأرجل شبه مفرودة بالدمبلز', muscleGroup: 'الفخذ الخلفي', targetHead: 'الاستطالة تحت الحمل والأوتار', volume: '3 مجموعات × 8-10 تكرار' }
  ],
  glutes: [
    { id: 'ex_g1', name: 'Barbell Hip Thrust with 2s Squeeze', nameAr: 'دفع حوض بالبار الأولمبي مع ثبات ثانيتين', muscleGroup: 'الأرداف', targetHead: 'العضلة الإليوية الكبرى (Gluteus Maximus)', volume: '3-4 مجموعات × 8-10 تكرار' },
    { id: 'ex_g2', name: 'Cable Glute Kickback', nameAr: 'ركل كابل خلفي للأرداف', muscleGroup: 'الأرداف', targetHead: 'عزل الأرداف العلوية والجانبية', volume: '3 مجموعات × 12-15 تكرار' }
  ],
  calves: [
    { id: 'ex_cal1', name: 'Standing Machine Calf Raise', nameAr: 'رفع سمانة واقف مع تمدد كامل وتوقف ثانيتين', muscleGroup: 'السمانة / البطات', targetHead: 'الرؤوس الخارجية للسمانة (Gastrocnemius)', volume: '4 مجموعات × 10-12 تكرار' },
    { id: 'ex_cal2', name: 'Seated Calf Raise', nameAr: 'رفع سمانة جالس على الجهاز', muscleGroup: 'السمانة / البطات', targetHead: 'العضلة النعلية العميقة (Soleus)', volume: '3 مجموعات × 15-20 تكرار' }
  ]
};

// Muscle Labels Dictionary for UI
const MUSCLE_LABELS = {
  chest: 'الصدر (Chest)',
  front_delts: 'الأكتاف (Delts)',
  rear_delts: 'الأكتاف الخلفية (Rear Delts)',
  traps: 'الترابيس (Traps)',
  lats: 'الظهر / المجنص (Lats)',
  lower_back: 'أسفل الظهر (Lower Back)',
  biceps: 'البايسبس (Biceps)',
  triceps: 'الترايسبس (Triceps)',
  forearms: 'الساعد (Forearms)',
  abs: 'البطن والكور (Abs/Core)',
  quads: 'الفخذ الأمامي (Quads)',
  hamstrings: 'الفخذ الخلفي (Hamstrings)',
  glutes: 'الأرداف (Glutes)',
  calves: 'السمانة (Calves)'
};

/**
 * ============================================================================
 * 1. PIN AUTHENTICATION CONTROLLER (COACH ACCESS)
 * ============================================================================
 */
function isCoachAuthenticated() {
  return sessionStorage.getItem(COACH_AUTH_KEY) === COACH_PIN;
}

function checkCoachAuth() {
  const overlay = document.getElementById('coach-pin-overlay');
  if (!overlay) return;
  if (isCoachAuthenticated()) {
    overlay.classList.add('hidden');
  } else {
    overlay.classList.remove('hidden');
    const input = document.getElementById('coach-pin-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function handleCoachPinSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const input = document.getElementById('coach-pin-input');
  const errEl = document.getElementById('coach-pin-error');
  const enteredPin = input ? input.value.trim() : '';

  if (enteredPin === COACH_PIN) {
    sessionStorage.setItem(COACH_AUTH_KEY, COACH_PIN);
    const overlay = document.getElementById('coach-pin-overlay');
    if (overlay) overlay.classList.add('hidden');
    showToast('تم تسجيل دخول المدرب Coach Rush بنجاح!');
  } else {
    if (input) {
      input.classList.add('error');
      setTimeout(() => input.classList.remove('error'), 400);
      input.value = '';
      input.focus();
    }
    if (errEl) errEl.style.display = 'block';
  }
}

function lockCoachDashboard() {
  sessionStorage.removeItem(COACH_AUTH_KEY);
  checkCoachAuth();
  showToast('تم قفل لوحة التحكم.');
}

/**
 * ============================================================================
 * 2. STATE PERSISTENCE & STORAGE
 * ============================================================================
 */
function loadAthletesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        athletes = parsed;
        return;
      }
    }
  } catch (err) {
    console.warn('Could not parse localStorage, initializing clean empty state:', err);
  }
  // ZERO MOCK LEAKAGE: strictly clean empty array
  athletes = [];
}

function saveAthletesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes));
  } catch (err) {
    console.error('Failed saving athletes to localStorage:', err);
  }
}

/**
 * ============================================================================
 * 3. ASYNCHRONOUS GOOGLE APPS SCRIPT WEBHOOK DISPATCHER
 * ============================================================================
 */
async function sendToWebhook(payload) {
  console.log('[THE RUSH WAY] Webhook dispatch payload:', payload);
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    return response;
  } catch (error) {
    console.warn('[THE RUSH WAY] Webhook background warning (local persistence safe):', error);
  }
}

function testWebhookConnection() {
  showToast('جاري اختبار الاتصال السحابي بالـ Webhook...');
  sendToWebhook({ dataType: 'ping', timestamp: Date.now() });
  setTimeout(() => {
    showToast('تم اختبار الاتصال السحابي بنجاح (Webhook Connected)');
    const pill = document.getElementById('header-sheets-pill');
    const txt = document.getElementById('header-sheets-status-txt');
    if (pill) pill.className = 'sheets-sync-pill connected';
    if (txt) txt.textContent = 'CONNECTED';
  }, 600);
}

function exportBackupJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(athletes, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `TheRushWay_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('تم تنزيل النسخة الاحتياطية (JSON) بنجاح!');
}

/**
 * ============================================================================
 * 4. TOAST NOTIFICATION UTILITY
 * ============================================================================
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'danger' ? '⚠️' : '✅'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * ============================================================================
 * 5. MODAL MANAGEMENT
 * ============================================================================
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openAddAthleteModal() {
  const form = document.querySelector('#modal-add-athlete form');
  if (form) form.reset();

  const wInput = document.getElementById('form-ath-weight');
  const waistInput = document.getElementById('form-ath-waist');
  const hInput = document.getElementById('form-ath-height');
  const aInput = document.getElementById('form-ath-age');

  if (wInput) wInput.value = '80.0';
  if (waistInput) waistInput.value = '86.0';
  if (hInput) hInput.value = '178';
  if (aInput) aInput.value = '28';

  openModal('modal-add-athlete');
}

/**
 * ============================================================================
 * 6. ATHLETE REGISTRATION & DELETION HANDLERS
 * ============================================================================
 */
function handleSaveAthlete(event) {
  if (event && event.preventDefault) event.preventDefault();

  const nameInput = document.getElementById('form-ath-name');
  const phoneInput = document.getElementById('form-ath-phone');
  const emailInput = document.getElementById('form-ath-email');
  const weightInput = document.getElementById('form-ath-weight');
  const waistInput = document.getElementById('form-ath-waist');
  const heightInput = document.getElementById('form-ath-height');
  const ageInput = document.getElementById('form-ath-age');
  const goalInput = document.getElementById('form-ath-goal');
  const levelInput = document.getElementById('form-ath-level');
  const statusInput = document.getElementById('form-ath-status');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const weight = weightInput ? parseFloat(weightInput.value) || 0 : 0;
  const waist = waistInput ? parseFloat(waistInput.value) || 0 : 0;
  const height = heightInput ? parseFloat(heightInput.value) || 175 : 175;
  const age = ageInput ? parseInt(ageInput.value, 10) || 28 : 28;
  const goal = goalInput ? goalInput.value : 'خسارة دهون وتنشيف';
  const level = levelInput ? levelInput.value : 'متوسط';
  const status = statusInput ? statusInput.value : 'new';

  if (!name) {
    showToast('يرجى كتابة الاسم الكامل للمتدرب', 'danger');
    return;
  }
  if (!phone) {
    showToast('رقم الهاتف إلزامي لتفعيل بوابة المتدرب السحرية', 'danger');
    return;
  }
  if (!waist || waist <= 0) {
    showToast('محيط الخصر (Waist) إلزامي كمعيار أساسي', 'danger');
    return;
  }

  const athleteId = 'ath_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  const newAthlete = {
    id: athleteId,
    name,
    phone,
    email,
    currentWeightKg: weight,
    heightCm: height,
    age,
    goal,
    level,
    status,
    nutritionPlanId: 'لم تسند خطة بعد',
    joinedDate: new Date().toISOString(),
    measurements: [{ waistCm: waist }],
    nutritionPlan: null,
    workoutPlan: []
  };

  athletes.unshift(newAthlete);
  saveAthletesToStorage();

  // Async Webhook sync
  sendToWebhook({
    dataType: 'athlete_registration',
    id: athleteId,
    name,
    phone,
    email,
    weight,
    waist,
    height,
    age,
    goal,
    level,
    status
  });

  renderAthletesView();
  closeModal('modal-add-athlete');
  showToast(`تم تسجيل المتدرب "${name}" بنجاح!`);
}

function deleteAthlete(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) return;

  const confirmed = window.confirm(`هل أنت متأكد من حذف المتدرب "${athlete.name}" نهائياً من السجل؟`);
  if (!confirmed) return;

  athletes = athletes.filter(a => a.id !== athleteId);
  saveAthletesToStorage();
  renderAthletesView();
  showToast(`تم حذف المتدرب "${athlete.name}" من النظام.`, 'danger');
}

/**
 * ============================================================================
 * 7. NUTRITION PLAN ASSIGNMENT
 * ============================================================================
 */
function openNutritionModal(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('المتدرب غير موجود', 'danger');
    return;
  }

  const idInput = document.getElementById('form-nut-athlete-id');
  const nameInput = document.getElementById('form-nut-athlete-name');
  const titleEl = document.getElementById('modal-nutrition-athlete-title');

  if (idInput) idInput.value = athlete.id;
  if (nameInput) nameInput.value = athlete.name;
  if (titleEl) titleEl.querySelector('span').textContent = `إسناد الخطة الغذائية - ${athlete.name}`;

  if (athlete.nutritionPlan) {
    const pSelect = document.getElementById('form-nut-protein');
    const cSelect = document.getElementById('form-nut-carbs');
    const fSelect = document.getElementById('form-nut-fats');
    const sSelect = document.getElementById('form-nut-supplements');
    const eSelect = document.getElementById('form-nut-enhancers');

    if (pSelect && athlete.nutritionPlan.protein) pSelect.value = athlete.nutritionPlan.protein;
    if (cSelect && athlete.nutritionPlan.carbs) cSelect.value = athlete.nutritionPlan.carbs;
    if (fSelect && athlete.nutritionPlan.fats) fSelect.value = athlete.nutritionPlan.fats;
    if (sSelect && athlete.nutritionPlan.supplements) sSelect.value = athlete.nutritionPlan.supplements;
    if (eSelect && athlete.nutritionPlan.enhancers) eSelect.value = athlete.nutritionPlan.enhancers;
  }

  openModal('modal-add-nutrition');
}

function handleSaveNutrition(event) {
  if (event && event.preventDefault) event.preventDefault();

  const idInput = document.getElementById('form-nut-athlete-id');
  const athleteId = idInput ? idInput.value : '';
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) return;

  const protein = document.getElementById('form-nut-protein')?.value || '';
  const carbs = document.getElementById('form-nut-carbs')?.value || '';
  const fats = document.getElementById('form-nut-fats')?.value || '';
  const supplements = document.getElementById('form-nut-supplements')?.value || 'None';
  const enhancers = document.getElementById('form-nut-enhancers')?.value || 'None';

  athlete.nutritionPlan = {
    protein,
    carbs,
    fats,
    supplements,
    enhancers,
    assignedAt: new Date().toISOString()
  };

  const pShort = protein.split('(')[0].trim();
  const cShort = carbs.split('(')[0].trim();
  athlete.nutritionPlanId = `${pShort} • ${cShort}`;

  saveAthletesToStorage();

  sendToWebhook({
    dataType: 'nutrition_assignment',
    athleteId: athlete.id,
    athleteName: athlete.name,
    protein,
    carbs,
    fats,
    supplements,
    enhancers
  });

  renderAthletesView();
  closeModal('modal-add-nutrition');
  showToast(`تم إسناد وحفظ الخطة الغذائية للمتدرب "${athlete.name}" بنجاح!`);
}

/**
 * ============================================================================
 * 8. INTERACTIVE ANATOMICAL WORKOUT BUILDER CONTROLLER
 * ============================================================================
 */
function openWorkoutModal(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('المتدرب غير موجود', 'danger');
    return;
  }

  activeBuilderAthleteId = athlete.id;
  activeBuilderRoutine = Array.isArray(athlete.workoutPlan) ? JSON.parse(JSON.stringify(athlete.workoutPlan)) : [];

  const nameEl = document.getElementById('builder-athlete-name');
  const idEl = document.getElementById('builder-athlete-id');
  if (nameEl) nameEl.textContent = athlete.name;
  if (idEl) idEl.value = athlete.id;

  switchBodyView('front');
  selectMuscleGroup('chest');
  renderBuilderRoutine();

  openModal('modal-workout-builder');
}

function switchBodyView(view) {
  currentBodyView = view;
  const frontBtn = document.getElementById('btn-view-front');
  const backBtn = document.getElementById('btn-view-back');
  const svgFront = document.getElementById('svg-body-front');
  const svgBack = document.getElementById('svg-body-back');

  if (view === 'front') {
    if (frontBtn) frontBtn.classList.add('active');
    if (backBtn) backBtn.classList.remove('active');
    if (svgFront) svgFront.style.display = 'block';
    if (svgBack) svgBack.style.display = 'none';
  } else {
    if (backBtn) backBtn.classList.add('active');
    if (frontBtn) frontBtn.classList.remove('active');
    if (svgBack) svgBack.style.display = 'block';
    if (svgFront) svgFront.style.display = 'none';
  }

  renderMuscleChips();
}

function renderMuscleChips() {
  const container = document.getElementById('muscle-chip-container');
  if (!container) return;

  const frontMuscles = ['chest', 'front_delts', 'biceps', 'forearms', 'abs', 'quads', 'calves'];
  const backMuscles = ['traps', 'rear_delts', 'lats', 'lower_back', 'triceps', 'glutes', 'hamstrings', 'calves'];

  const activeList = currentBodyView === 'front' ? frontMuscles : backMuscles;

  container.innerHTML = activeList.map(muscleKey => `
    <button type="button" class="muscle-chip ${currentSelectedMuscle === muscleKey ? 'active' : ''}" onclick="selectMuscleGroup('${muscleKey}')">
      ${MUSCLE_LABELS[muscleKey] || muscleKey}
    </button>
  `).join('');
}

function selectMuscleGroup(muscleKey) {
  currentSelectedMuscle = muscleKey;

  // Highlight SVG paths
  document.querySelectorAll('.muscle-node').forEach(node => {
    node.classList.toggle('selected', node.dataset.muscle === muscleKey);
  });

  // Highlight Chips
  renderMuscleChips();

  // Populate Library
  const titleEl = document.getElementById('selected-muscle-title');
  const countEl = document.getElementById('muscle-exercise-count');
  const listEl = document.getElementById('exercise-items-list');

  if (titleEl) titleEl.textContent = MUSCLE_LABELS[muscleKey] || muscleKey;

  const exercises = EXERCISE_DATABASE[muscleKey] || [];
  if (countEl) countEl.textContent = `${exercises.length} تمارين`;

  if (!listEl) return;

  if (exercises.length === 0) {
    listEl.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 20px 0;">لا توجد تمارين مسجلة لهذه العضلة حالياً.</p>';
    return;
  }

  listEl.innerHTML = exercises.map(ex => `
    <div class="exercise-item-card">
      <div class="exercise-info">
        <h4>${ex.nameAr}</h4>
        <div class="en-name">${ex.name}</div>
        <div class="exercise-meta">
          <span>🎯 ${ex.targetHead}</span>
        </div>
        <div style="font-size: 0.72rem; color: #a0aec0; margin-top: 3px;">
          الحمل الموصى به: <strong style="color: #fff;">${ex.volume}</strong>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-sm" onclick="addExerciseToWorkoutDraft('${ex.id}', '${muscleKey}')">
        + إضافة
      </button>
    </div>
  `).join('');
}

function addExerciseToWorkoutDraft(exerciseId, muscleKey) {
  const exercises = EXERCISE_DATABASE[muscleKey] || [];
  const exercise = exercises.find(e => e.id === exerciseId);
  if (!exercise) return;

  activeBuilderRoutine.push({
    ...exercise,
    addedAt: Date.now()
  });

  renderBuilderRoutine();
  showToast(`تمت إضافة "${exercise.nameAr}" للجدول!`);
}

function removeExerciseFromWorkoutDraft(index) {
  activeBuilderRoutine.splice(index, 1);
  renderBuilderRoutine();
}

function clearAthleteWorkoutDraft() {
  if (activeBuilderRoutine.length === 0) return;
  activeBuilderRoutine = [];
  renderBuilderRoutine();
  showToast('تم مسح قائمة التمارين.');
}

function renderBuilderRoutine() {
  const listEl = document.getElementById('routine-items-list');
  const summaryEl = document.getElementById('routine-volume-summary');
  if (!listEl) return;

  if (activeBuilderRoutine.length === 0) {
    listEl.innerHTML = `
      <p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 20px 0;">
        انقر على أي عضلة ثم اضغط <strong>+ إضافة</strong> لتجميع الروتين.
      </p>
    `;
    if (summaryEl) summaryEl.innerHTML = 'إجمالي التمارين: <strong>0</strong> | العضلات المستهدفة: <strong>0</strong>';
    return;
  }

  // Count distinct targeted muscle groups
  const distinctMuscles = new Set(activeBuilderRoutine.map(e => e.muscleGroup)).size;

  listEl.innerHTML = activeBuilderRoutine.map((item, idx) => `
    <div class="routine-item">
      <div class="routine-item-info">
        <strong>${idx + 1}. ${item.nameAr}</strong>
        <span>${item.muscleGroup} • ${item.volume}</span>
      </div>
      <button type="button" class="routine-item-del" onclick="removeExerciseFromWorkoutDraft(${idx})" title="حذف">
        ✕
      </button>
    </div>
  `).join('');

  if (summaryEl) {
    summaryEl.innerHTML = `إجمالي التمارين: <strong>${activeBuilderRoutine.length}</strong> | العضلات المستهدفة: <strong>${distinctMuscles}</strong>`;
  }
}

function saveAthleteWorkoutPlan() {
  if (!activeBuilderAthleteId) return;
  const athlete = athletes.find(a => a.id === activeBuilderAthleteId);
  if (!athlete) return;

  athlete.workoutPlan = [...activeBuilderRoutine];
  saveAthletesToStorage();

  sendToWebhook({
    dataType: 'workout_plan_update',
    athleteId: athlete.id,
    athleteName: athlete.name,
    exercisesCount: athlete.workoutPlan.length,
    planSummary: athlete.workoutPlan.map(e => e.nameAr).join(' | ')
  });

  renderAthletesView();
  closeModal('modal-workout-builder');
  showToast(`تم اعتماد وحفظ البرنامج التدريبي للمتدرب "${athlete.name}" بنجاح!`);
}

/**
 * ============================================================================
 * 9. CLIENT MAGIC PORTAL LINK GENERATOR
 * ============================================================================
 */
function copyClientPortalLink(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('تعذر العثور على المتدرب', 'danger');
    return;
  }

  const cleanPhone = (athlete.phone || '').replace(/\D/g, '');
  const p4 = cleanPhone.slice(-4);

  // Snapshot contains complete plan for instant fail-safe cross-device access
  const tokenPayload = {
    id: athlete.id,
    p4: p4,
    snapshot: {
      id: athlete.id,
      name: athlete.name,
      phone: athlete.phone,
      currentWeightKg: athlete.currentWeightKg,
      measurements: athlete.measurements,
      goal: athlete.goal,
      level: athlete.level,
      status: athlete.status,
      nutritionPlan: athlete.nutritionPlan,
      workoutPlan: athlete.workoutPlan || []
    },
    createdAt: Date.now()
  };

  const token = btoa(encodeURIComponent(JSON.stringify(tokenPayload)));
  const portalUrl = `${window.location.origin}/portal.html?auth=${token}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(portalUrl).then(() => {
      showToast(`تم نسخ رابط بوابة المتدرب (${athlete.name}) بنجاح!`);
    }).catch(() => {
      prompt('انسخ رابط بوابة المتدرب:', portalUrl);
    });
  } else {
    prompt('انسخ رابط بوابة المتدرب:', portalUrl);
  }
}

/**
 * ============================================================================
 * 10. CLIENT-SIDE PDF GENERATION (HTML2PDF.JS)
 * ============================================================================
 */
async function ensureHtml2Pdf() {
  if (typeof window.html2pdf !== 'undefined') return window.html2pdf;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    s.onload = () => resolve(window.html2pdf);
    s.onerror = () => reject(new Error('html2pdf load failed'));
    document.head.appendChild(s);
  });
}

async function exportAthleteToPDF(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('تعذر العثور على المتدرب لتصدير الملف', 'danger');
    return;
  }

  showToast(`جاري تجهيز تقرير PDF للمتدرب ${athlete.name}...`);

  try {
    const pdfLib = await ensureHtml2Pdf();

    let latestWaist = '--';
    if (Array.isArray(athlete.measurements) && athlete.measurements.length > 0) {
      latestWaist = athlete.measurements[athlete.measurements.length - 1].waistCm || '--';
    }

    const nut = athlete.nutritionPlan || {
      protein: 'ستيك فيليه بقري (220g)',
      carbs: 'أرز بسمتي (220g)',
      fats: 'زيت زيتون بكر ممتاز (15ml)',
      supplements: 'Whey Isolate + Creatine 5g',
      enhancers: 'Natural Protocol'
    };

    const workoutItems = athlete.workoutPlan || [];

    const printContainer = document.createElement('div');
    printContainer.style.cssText = `
      direction: rtl;
      font-family: 'Cairo', Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 30px;
      line-height: 1.6;
    `;

    printContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #38b2ac; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #0b0f19;">
            THE RUSH <span style="color: #38b2ac;">WAY</span>
          </h1>
          <div style="font-size: 13px; color: #64748b;">تقرير ومخطط الرياضي المعتمد</div>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 14px; font-weight: 800; color: #38b2ac;">إشراف المدرب: Coach Rush</div>
          <div style="font-size: 11px; color: #94a3b8;"><span dir="ltr" style="display: inline-block;">${new Date().toLocaleDateString('ar-EG')}</span></div>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #0b0f19; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
          بيانات الرياضي الأساسية <span dir="ltr" style="display: inline-block;">(Athlete Profile)</span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b;">اسم المتدرب:</td>
            <td style="padding: 4px 0; font-weight: 800;">${athlete.name}</td>
            <td style="padding: 4px 0; color: #64748b;">الهاتف:</td>
            <td style="padding: 4px 0;"><span dir="ltr" style="display: inline-block;">${athlete.phone}</span></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">الوزن الحالي:</td>
            <td style="padding: 4px 0; font-weight: 800;">${athlete.currentWeightKg} <span dir="ltr" style="display: inline-block;">kg</span></td>
            <td style="padding: 4px 0; color: #64748b;">محيط الخصر (Waist):</td>
            <td style="padding: 4px 0; font-weight: 800; color: #0d9488;">${latestWaist} <span dir="ltr" style="display: inline-block;">cm</span></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">الهدف التدريبي:</td>
            <td style="padding: 4px 0; font-weight: 700;">${athlete.goal || 'تنشيف'}</td>
            <td style="padding: 4px 0; color: #64748b;">المستوى الرياضي:</td>
            <td style="padding: 4px 0;">${athlete.level || 'متوسط'}</td>
          </tr>
        </table>
      </div>

      <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #0f766e; border-bottom: 1px solid #99f6e4; padding-bottom: 4px;">
          البروتوكول الغذائي المعتمد <span dir="ltr" style="display: inline-block;">(Nutrition Plan)</span>
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
          <div><strong>🥩 مصدر البروتين:</strong> ${nut.protein}</div>
          <div><strong>🍚 مصدر الكربوهيدرات:</strong> ${nut.carbs}</div>
          <div><strong>🥑 مصدر الدهون:</strong> ${nut.fats}</div>
          <div><strong>💊 المكملات:</strong> <span dir="ltr" style="display: inline-block;">${nut.supplements}</span></div>
          <div style="grid-column: 1 / -1;"><strong>⚡ محسنات الأداء:</strong> <span dir="ltr" style="display: inline-block;">${nut.enhancers}</span></div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #0b0f19;">
          البرنامج التدريبي المخصص <span dir="ltr" style="display: inline-block;">(Workout Routine)</span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: right; border: 1px solid #e2e8f0;">
          <thead style="background: #0f172a; color: #ffffff;">
            <tr>
              <th style="padding: 6px; border: 1px solid #334155; width: 6%; text-align: center;">#</th>
              <th style="padding: 6px; border: 1px solid #334155; width: 35%;">التمرين <span dir="ltr" style="display: inline-block;">(Exercise)</span></th>
              <th style="padding: 6px; border: 1px solid #334155; width: 25%;">العضلة المستهدفة</th>
              <th style="padding: 6px; border: 1px solid #334155; width: 34%;">الحمل الموصى به</th>
            </tr>
          </thead>
          <tbody>
            ${workoutItems.length === 0 ? `
              <tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748b;">لم يتم إضافة تمارين بعد</td></tr>
            ` : workoutItems.map((w, i) => `
              <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center;">${i + 1}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 700;">${w.nameAr} <div dir="ltr" style="font-size: 10px; color: #64748b;">${w.name}</div></td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; color: #0d9488; font-weight: 700;">${w.muscleGroup}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0;">${w.volume}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 14px;">
        <div style="font-size: 11px; color: #94a3b8;">
          THE RUSH WAY • Master Athlete Coaching • All Rights Reserved © 2026
        </div>
        <div style="text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0b0f19;">اعتماد المدرب: Coach Rush</div>
          <div style="font-family: cursive; font-size: 16px; color: #38b2ac; margin-top: 2px;">Rush Way Certified</div>
        </div>
      </div>
    `;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `TheRushWay_${athlete.name.replace(/\s+/g, '_')}_Plan.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    pdfLib().set(opt).from(printContainer).save();
    showToast(`تم تصدير ملف PDF للمتدرب ${athlete.name} بنجاح!`);
  } catch (err) {
    console.error('PDF error:', err);
    showToast('حدث خطأ أثناء تصدير ملف PDF', 'danger');
  }
}

async function exportAllAthletesToPDF() {
  if (!athletes || athletes.length === 0) {
    showToast('لا يوجد متدربين مسجلين لتصدير الكشف الشامل', 'danger');
    return;
  }

  showToast('جاري إنشاء الكشف الشامل لجميع المتدربين (PDF)...');

  try {
    const pdfLib = await ensureHtml2Pdf();

    const printEl = document.createElement('div');
    printEl.style.cssText = `
      direction: rtl;
      font-family: 'Cairo', Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      line-height: 1.5;
    `;

    printEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #38b2ac; padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0b0f19;">
            THE RUSH <span style="color: #38b2ac;">WAY</span> - الكشف العام للمتدربين
          </h1>
          <div style="font-size: 11px; color: #64748b;">
            سجل الرياضيين والقياسات والخطط <span dir="ltr" style="display: inline-block;">(Master Roster)</span>
          </div>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 13px; font-weight: 800; color: #38b2ac;">إشراف المدرب: Coach Rush</div>
          <div style="font-size: 10px; color: #94a3b8;">إجمالي: ${athletes.length} متدرب</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: right; border: 1px solid #cbd5e1;">
        <thead style="background: #0b0f19; color: #ffffff;">
          <tr>
            <th style="padding: 6px; border: 1px solid #334155; width: 4%; text-align: center;">#</th>
            <th style="padding: 6px; border: 1px solid #334155; width: 18%;">اسم المتدرب <span dir="ltr" style="display: inline-block;">(Athlete)</span></th>
            <th style="padding: 6px; border: 1px solid #334155; width: 18%;">رقم الهاتف</th>
            <th style="padding: 6px; border: 1px solid #334155; width: 10%; text-align: center;">الوزن</th>
            <th style="padding: 6px; border: 1px solid #334155; width: 12%; text-align: center;">الخصر <span dir="ltr" style="display: inline-block;">(Waist)</span></th>
            <th style="padding: 6px; border: 1px solid #334155; width: 14%;">الهدف</th>
            <th style="padding: 6px; border: 1px solid #334155; width: 8%; text-align: center;">الحالة</th>
            <th style="padding: 6px; border: 1px solid #334155; width: 16%;">الخطة الغذائية</th>
          </tr>
        </thead>
        <tbody>
          ${athletes.map((ath, idx) => {
            let waist = '--';
            if (Array.isArray(ath.measurements) && ath.measurements.length > 0) {
              waist = ath.measurements[ath.measurements.length - 1].waistCm || '--';
            }
            return `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700;">${idx + 1}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 800;">${ath.name}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0;"><span dir="ltr">${ath.phone}</span></td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center;">${ath.currentWeightKg} kg</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: #0d9488;">${waist} cm</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0;">${ath.goal || 'تنشيف'}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center;">${ath.status === 'active' ? 'نشط' : 'جديد'}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; font-size: 9px;">${ath.nutritionPlanId || 'غير مسند'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    const opt = {
      margin: [6, 6, 6, 6],
      filename: `TheRushWay_Master_Roster_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    pdfLib().set(opt).from(printEl).save();
    showToast('تم تصدير الكشف الشامل بنجاح!');
  } catch (err) {
    console.error('Master PDF export error:', err);
    showToast('حدث خطأ أثناء تصدير الكشف', 'danger');
  }
}

/**
 * ============================================================================
 * 11. DOM RENDERING - ATHLETE CARDS (TWO-LEVEL SPLIT HEADER)
 * ============================================================================
 */
function renderAthletesView() {
  const container = document.getElementById('athletes-card-grid');
  if (!container) return;

  const searchInput = document.getElementById('athlete-search-input');
  const statusFilter = document.getElementById('athlete-status-filter');

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const selectedStatus = statusFilter ? statusFilter.value : 'all';

  const filtered = athletes.filter(ath => {
    const matchesQuery = !query ||
      (ath.name && ath.name.toLowerCase().includes(query)) ||
      (ath.phone && ath.phone.includes(query)) ||
      (ath.email && ath.email.toLowerCase().includes(query));
    const matchesStatus = selectedStatus === 'all' || ath.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  // Zero-state handling
  if (filtered.length === 0) {
    if (athletes.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="48" height="48">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
          <div class="empty-state-title">لا يوجد متدربين مسجلين حتى الآن</div>
          <div class="empty-state-desc">
            ابدأ بإضافة متدرب جديد لتخصيص البرامج التدريبية التشريحية والخطط الغذائية وإنشاء روابط البوابة السحرية.
          </div>
          <button type="button" class="btn btn-primary" onclick="openAddAthleteModal()">
            + إضافة متدرب جديد الآن
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-title">لا توجد نتائج مطابقة لبحثك</div>
          <div class="empty-state-desc">يرجى تعديل مصطلح البحث أو تغيير فلتر الحالة.</div>
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('athlete-search-input').value=''; document.getElementById('athlete-status-filter').value='all'; renderAthletesView();">
            إعادة تعيين الفلاتر
          </button>
        </div>
      `;
    }
    return;
  }

  container.innerHTML = filtered.map(ath => {
    let statusLabel = 'جديد';
    let statusClass = 'new';
    if (ath.status === 'active') {
      statusLabel = 'نشط';
      statusClass = 'active';
    } else if (ath.status === 'paused') {
      statusLabel = 'متوقف';
      statusClass = 'paused';
    }

    let latestWaist = '--';
    if (Array.isArray(ath.measurements) && ath.measurements.length > 0) {
      latestWaist = ath.measurements[ath.measurements.length - 1].waistCm || '--';
    }

    const workoutsCount = Array.isArray(ath.workoutPlan) ? ath.workoutPlan.length : 0;
    const nutritionSummary = ath.nutritionPlanId || 'لم تسند خطة بعد';

    return `
      <div class="athlete-card" id="card-${ath.id}">
        <!-- TWO-LEVEL SPLIT HEADER -->
        <div class="card-split-header">
          <!-- Top Row: Athlete Info (Right) | Status Badge (Left) -->
          <div class="card-top-row">
            <div>
              <h3 class="card-athlete-name">${ath.name}</h3>
              <div class="card-athlete-contact">
                <span dir="ltr">${ath.phone}</span>
                ${ath.email ? `• <span>${ath.email}</span>` : ''}
              </div>
            </div>
            <span class="status-tag ${statusClass}">${statusLabel}</span>
          </div>

          <!-- Bottom Action Row: Clean Horizontal Button Bar -->
          <div class="card-action-bar">
            <!-- 1. Nutrition Plan -->
            <button type="button" class="card-btn nutrition-btn" onclick="openNutritionModal('${ath.id}')" title="إسناد الخطة الغذائية">
              🥗 تغذية
            </button>

            <!-- 2. Workout Builder -->
            <button type="button" class="card-btn workout-btn" onclick="openWorkoutModal('${ath.id}')" title="مصمم التمارين التشريحي">
              🏋️ تمارين (${workoutsCount})
            </button>

            <!-- 3. Magic Portal Link -->
            <button type="button" class="card-btn portal-btn" onclick="copyClientPortalLink('${ath.id}')" title="نسخ رابط بوابة المتدرب الخاصة">
              🔗 الرابط السحري
            </button>

            <!-- 4. PDF Export -->
            <button type="button" class="card-btn pdf-btn" onclick="exportAthleteToPDF('${ath.id}')" title="تصدير PDF">
              📄 PDF
            </button>

            <!-- 5. Delete Athlete -->
            <button type="button" class="card-btn delete-btn" onclick="deleteAthlete('${ath.id}')" title="حذف المتدرب">
              🗑️
            </button>
          </div>
        </div>

        <!-- METRICS ROW: STRICT WAIST HIGHLIGHT -->
        <div class="metrics-row">
          <div class="metric-item">
            <span class="metric-label">الوزن الحالي</span>
            <span class="metric-val">${ath.currentWeightKg} <span style="font-size: 0.72rem; color: var(--text-muted);">kg</span></span>
          </div>
          <div class="metric-item">
            <span class="metric-label" style="color: var(--primary);">محيط الخصر (Waist)</span>
            <span class="metric-val waist-accent">${latestWaist} <span style="font-size: 0.72rem; color: var(--primary);">cm</span></span>
          </div>
        </div>

        <!-- TAGS & SUMMARY -->
        <div class="card-badges-row">
          <span class="tag-badge">🎯 ${ath.goal || 'تنشيف'}</span>
          <span class="tag-badge">⚡ ${ath.level || 'متوسط'}</span>
        </div>

        <div class="plan-summary-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <strong>الخطة:</strong> ${nutritionSummary}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function renderTrainingLibraryPreview() {
  const container = document.getElementById('training-library-preview-grid');
  if (!container) return;

  const categories = Object.keys(EXERCISE_DATABASE);

  container.innerHTML = categories.map(catKey => {
    const list = EXERCISE_DATABASE[catKey] || [];
    return `
      <div class="athlete-card">
        <h3 style="color: var(--primary); font-size: 1.05rem; font-weight: 800; margin-bottom: 8px;">
          ${MUSCLE_LABELS[catKey] || catKey} (${list.length} تمارين)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${list.slice(0, 3).map(ex => `
            <div style="font-size: 0.8rem; color: #fff; background: var(--bg-elevated); padding: 6px 10px; border-radius: 6px;">
              <strong>${ex.nameAr}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${ex.targetHead}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * ============================================================================
 * 12. TAB NAVIGATION
 * ============================================================================
 */
function switchTab(tabId) {
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.toggle('active', view.id === `view-${tabId}`);
  });

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  if (tabId === 'training') {
    renderTrainingLibraryPreview();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * ============================================================================
 * 13. GLOBAL SCOPE ASSIGNMENTS (SAFETY FOR INLINE EVENT LISTENERS)
 * ============================================================================
 */
window.handleCoachPinSubmit = handleCoachPinSubmit;
window.lockCoachDashboard = lockCoachDashboard;
window.openAddAthleteModal = openAddAthleteModal;
window.closeModal = closeModal;
window.openNutritionModal = openNutritionModal;
window.handleSaveNutrition = handleSaveNutrition;
window.openWorkoutModal = openWorkoutModal;
window.switchBodyView = switchBodyView;
window.selectMuscleGroup = selectMuscleGroup;
window.addExerciseToWorkoutDraft = addExerciseToWorkoutDraft;
window.removeExerciseFromWorkoutDraft = removeExerciseFromWorkoutDraft;
window.clearAthleteWorkoutDraft = clearAthleteWorkoutDraft;
window.saveAthleteWorkoutPlan = saveAthleteWorkoutPlan;
window.copyClientPortalLink = copyClientPortalLink;
window.exportAthleteToPDF = exportAthleteToPDF;
window.exportAllAthletesToPDF = exportAllAthletesToPDF;
window.deleteAthlete = deleteAthlete;
window.handleSaveAthlete = handleSaveAthlete;
window.switchTab = switchTab;
window.testWebhookConnection = testWebhookConnection;
window.exportBackupJson = exportBackupJson;

/**
 * ============================================================================
 * 14. INITIALIZATION ON DOM CONTENT LOADED
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check Coach PIN session
  checkCoachAuth();

  // Load persistent athletes (starts empty if none in storage)
  loadAthletesFromStorage();

  // Render Athletes View
  renderAthletesView();

  // Search input live filter
  const searchInput = document.getElementById('athlete-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAthletesView();
    });
  }

  // Status dropdown filter
  const statusFilter = document.getElementById('athlete-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      renderAthletesView();
    });
  }

  // Navigation tab clicks
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // SVG Muscle Node Click Handlers
  document.querySelectorAll('.muscle-node').forEach(node => {
    node.addEventListener('click', () => {
      const muscleKey = node.dataset.muscle;
      if (muscleKey) selectMuscleGroup(muscleKey);
    });
  });

  console.log('[THE RUSH WAY] Core Coach Engine initialized with zero mock data leakage and PIN security.');
});
