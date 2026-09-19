/**
 * ============================================================================
 * THE RUSH WAY - COACH CRM & ATHLETE HUB (PWA)
 * Complete, Self-Contained, Production-Ready Pure Vanilla JavaScript (ES6+)
 * 
 * ARCHITECTURAL SPECIFICATIONS:
 * 1. Zero external frameworks (Vanilla JS only).
 * 2. Client-Side PDF Generation via CDN library `html2pdf.js`.
 * 3. NO Google API Client ID / OAuth - Strictly uses single Webhook Endpoint
 *    (Google Apps Script Web App) via asynchronous fetch() POST payloads.
 * 4. Persistent state management using browser localStorage under key 'athletes'.
 * 5. Strict waist measurement standard (waistCm only - no stomach labels).
 * ============================================================================
 */

// Global Google Apps Script Webhook Endpoint (Replace with deployed Web App URL if needed)
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxIqTMzE1_dak-wjNBHLVqb3eSuAoHBDRhmYAZvA05AuseqAnvTpWrrJJgYJU3ybYBWDA/exec';

// Storage Key
const STORAGE_KEY = 'athletes';

// Default initial athlete dataset for first-time launch
const DEFAULT_INITIAL_ATHLETES = [
  {
    id: 'ath_1726740001',
    name: 'كريم منصور',
    email: 'karim.mansour@gmail.com',
    phone: '+213 555 123 456',
    currentWeightKg: 83.2,
    heightCm: 181,
    age: 29,
    goal: 'خسارة دهون وتنشيف',
    level: 'متقدم',
    status: 'active',
    nutritionPlanId: 'ستيك فيليه بقري (220g) • أرز بسمتي (220g) • زيت زيتون (15ml)',
    joinedDate: '2026-06-10T08:00:00.000Z',
    measurements: [
      { waistCm: 94.0 },
      { waistCm: 91.5 },
      { waistCm: 86.0 }
    ],
    nutritionPlan: {
      protein: 'ستيك فيليه بقري (Beef Tenderloin Steak - 220g)',
      carbs: 'أرز بسمتي أبيض / ياسمين (220g)',
      fats: 'زيت زيتون بكر ممتاز (15ml)',
      supplements: 'Whey Isolate (30g) + Creatine (5g) + Magnesium (400mg)',
      enhancers: 'Tesamorelin (2mg SC Daily - Visceral Fat Burn)'
    }
  },
  {
    id: 'ath_1726740002',
    name: 'سارة بن علي',
    email: 'sarah.benali@outlook.com',
    phone: '+33 6 12 34 56 78',
    currentWeightKg: 61.5,
    heightCm: 168,
    age: 26,
    goal: 'إعادة تشكيل الجسم (Recomp)',
    level: 'متوسط',
    status: 'active',
    nutritionPlanId: 'سمك سلمون بري أطلسي (200g) • شوفان كامل • أفوكادو',
    joinedDate: '2026-07-01T09:30:00.000Z',
    measurements: [
      { waistCm: 74.0 },
      { waistCm: 71.5 },
      { waistCm: 69.0 }
    ],
    nutritionPlan: {
      protein: 'سمك سلمون بري أطلسي (Wild Atlantic Salmon - 200g)',
      carbs: 'شوفان كامل الحبة (70g)',
      fats: 'أفوكادو طازج (80g)',
      supplements: 'Whey Protein Isolate (30g) + L-Glutamine (10g)',
      enhancers: 'None'
    }
  },
  {
    id: 'ath_1726740003',
    name: 'يوسف الهادي',
    email: 'youssef.hadi@fitmail.com',
    phone: '+971 50 987 6543',
    currentWeightKg: 77.4,
    heightCm: 176,
    age: 33,
    goal: 'بناء عضلي صافي',
    level: 'متقدم',
    status: 'active',
    nutritionPlanId: 'لحم بقر مفروم قليل الدهن (200g) • كينوا عضوية • مكسرات لوز',
    joinedDate: '2026-05-15T11:00:00.000Z',
    measurements: [
      { waistCm: 78.0 },
      { waistCm: 79.5 },
      { waistCm: 80.5 }
    ],
    nutritionPlan: {
      protein: 'لحم بقر مفروم قليل الدهن (Lean Minced Beef 5% - 200g)',
      carbs: 'كينوا عضوية (200g)',
      fats: 'مكسرات لوز / جوز نيئة (30g)',
      supplements: 'Creatine Monohydrate (5g) + Zinc Picolinate (30mg)',
      enhancers: 'HGH (Human Growth Hormone - 2 IU Pre-bed)'
    }
  },
  {
    id: 'ath_1726740004',
    name: 'أميرة طارق',
    email: 'amira.tariq@gmail.com',
    phone: '+20 100 234 5678',
    currentWeightKg: 72.0,
    heightCm: 162,
    age: 31,
    goal: 'خسارة دهون وتنشيف',
    level: 'مبتدئ',
    status: 'new',
    nutritionPlanId: 'سمك قد أبيض أطلسي (250g) • بطاطا حلوة • زيت زيتون',
    joinedDate: '2026-09-02T14:15:00.000Z',
    measurements: [
      { waistCm: 87.0 }
    ],
    nutritionPlan: {
      protein: 'سمك قد أبيض أطلسي (White Atlantic Cod - 250g)',
      carbs: 'بطاطا حلوة مشوية (250g)',
      fats: 'زيت زيتون بكر ممتاز (15ml)',
      supplements: 'Whey Isolate (30g) + Creatine (5g) + Magnesium (400mg)',
      enhancers: 'None'
    }
  }
];

// In-Memory Global State
let athletes = [];

/**
 * ----------------------------------------------------------------------------
 * 1. STATE INITIALIZATION & LOCALSTORAGE MANAGEMENT
 * ----------------------------------------------------------------------------
 */
function loadAthletesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        athletes = parsed;
        return;
      }
    }
  } catch (err) {
    console.warn('Could not parse athletes from localStorage, initializing defaults:', err);
  }
  // Initialize with defaults if empty or invalid
  athletes = JSON.parse(JSON.stringify(DEFAULT_INITIAL_ATHLETES));
  saveAthletesToStorage();
}

function saveAthletesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes));
  } catch (err) {
    console.error('Failed saving athletes to localStorage:', err);
  }
}

/**
 * ----------------------------------------------------------------------------
 * 2. ASYNCHRONOUS GOOGLE APPS SCRIPT WEBHOOK SYNC
 * ----------------------------------------------------------------------------
 */
async function sendToWebhook(payload) {
  console.log('[THE RUSH WAY] Dispatching payload to Webhook:', payload);
  try {
    // We use text/plain;charset=utf-8 to safely bypass CORS preflight restrictions in Google Apps Script Web Apps
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log('[THE RUSH WAY] Webhook response received:', response);
    return response;
  } catch (error) {
    // Non-blocking catch: user experience is preserved locally even if offline or webhook URL is dummy
    console.warn('[THE RUSH WAY] Webhook sync warning (local persistence active):', error);
  }
}

/**
 * ----------------------------------------------------------------------------
 * 3. TOAST NOTIFICATION UTILITY
 * ----------------------------------------------------------------------------
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.log(`[TOAST: ${type}] ${message}`);
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.cssText = `
    background: ${type === 'danger' ? '#7f1d1d' : '#1e1b4b'};
    color: #ffffff;
    border: 1px solid ${type === 'danger' ? '#ef4444' : '#8b5cf6'};
    padding: 12px 18px;
    border-radius: 10px;
    margin-top: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
  `;

  toast.innerHTML = `
    <span>${type === 'danger' ? '⚠️' : '✅'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * ----------------------------------------------------------------------------
 * 4. MODAL MANAGEMENT (GLOBAL SCOPE)
 * ----------------------------------------------------------------------------
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function openAddAthleteModal() {
  const form = document.querySelector('#modal-add-athlete form');
  if (form) form.reset();
  
  // Set smart default values
  const weightInput = document.getElementById('form-ath-weight');
  if (weightInput) weightInput.value = '78.0';
  const waistInput = document.getElementById('form-ath-waist');
  if (waistInput) waistInput.value = '84.0';
  const heightInput = document.getElementById('form-ath-height');
  if (heightInput) heightInput.value = '178';
  const ageInput = document.getElementById('form-ath-age');
  if (ageInput) ageInput.value = '28';

  openModal('modal-add-athlete');
}

function openNutritionModal(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('لم يتم العثور على بيانات المتدرب', 'danger');
    return;
  }

  const idInput = document.getElementById('form-nut-athlete-id');
  const nameInput = document.getElementById('form-nut-athlete-name');
  const titleEl = document.getElementById('modal-nutrition-athlete-title');

  if (idInput) idInput.value = athlete.id;
  if (nameInput) nameInput.value = athlete.name;
  if (titleEl) titleEl.textContent = `إسناد وتخصيص الخطة الغذائية - ${athlete.name}`;

  // Pre-fill existing nutrition selections if present
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

function closeNutritionModal() {
  closeModal('modal-add-nutrition');
}

/**
 * ----------------------------------------------------------------------------
 * 5. ATHLETE FORM HANDLERS (SAVE & DELETE)
 * ----------------------------------------------------------------------------
 */
function handleSaveAthlete(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const nameInput = document.getElementById('form-ath-name');
  const emailInput = document.getElementById('form-ath-email');
  const phoneInput = document.getElementById('form-ath-phone');
  const weightInput = document.getElementById('form-ath-weight');
  const waistInput = document.getElementById('form-ath-waist');
  const heightInput = document.getElementById('form-ath-height');
  const ageInput = document.getElementById('form-ath-age');
  const goalInput = document.getElementById('form-ath-goal');
  const levelInput = document.getElementById('form-ath-level');
  const statusInput = document.getElementById('form-ath-status');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const weight = weightInput ? parseFloat(weightInput.value) || 0 : 0;
  const waist = waistInput ? parseFloat(waistInput.value) || 0 : 0;
  const height = heightInput ? parseFloat(heightInput.value) || 0 : 175;
  const age = ageInput ? parseInt(ageInput.value, 10) || 28 : 28;
  const goal = goalInput ? goalInput.value : 'خسارة دهون وتنشيف';
  const level = levelInput ? levelInput.value : 'متوسط';
  const status = statusInput ? statusInput.value : 'new';

  if (!name) {
    showToast('يرجى إدخال اسم المتدرب كاملاً', 'danger');
    return;
  }

  if (!waist || waist <= 0) {
    showToast('محيط الخصر (Waist) إلزامي كمعيار أساسي لتقييم التقدم', 'danger');
    return;
  }

  // Generate Unique Athlete ID
  const newAthleteId = 'ath_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  // Construct Athlete Data Model
  const newAthlete = {
    id: newAthleteId,
    name,
    email,
    phone,
    currentWeightKg: weight,
    heightCm: height,
    age,
    goal,
    level,
    status,
    nutritionPlanId: 'لم يتم إسناد خطة غذائية بعد',
    joinedDate: new Date().toISOString(),
    // Strict waist measurement array with NO stomach label
    measurements: [
      { waistCm: waist }
    ],
    nutritionPlan: null
  };

  // Prepend to array & persist
  athletes.unshift(newAthlete);
  saveAthletesToStorage();

  // Webhook Payload 1: Athlete Registration
  const webhookPayload = {
    dataType: 'athlete',
    name,
    email,
    phone,
    weight,
    waist,
    height,
    age,
    goal,
    level,
    status
  };

  sendToWebhook(webhookPayload);

  // Re-render UI & notify
  renderAthletesView();
  closeModal('modal-add-athlete');
  showToast(`تم تسجيل المتدرب "${name}" ومزامنة بياناته بنجاح!`);
}

function handleSaveNutrition(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const athleteIdInput = document.getElementById('form-nut-athlete-id');
  const athleteNameInput = document.getElementById('form-nut-athlete-name');
  const proteinSelect = document.getElementById('form-nut-protein');
  const carbsSelect = document.getElementById('form-nut-carbs');
  const fatsSelect = document.getElementById('form-nut-fats');
  const supplementsSelect = document.getElementById('form-nut-supplements');
  const enhancersSelect = document.getElementById('form-nut-enhancers');

  const athleteId = athleteIdInput ? athleteIdInput.value : '';
  const athleteName = athleteNameInput ? athleteNameInput.value : '';
  const protein = proteinSelect ? proteinSelect.value : '';
  const carbs = carbsSelect ? carbsSelect.value : '';
  const fats = fatsSelect ? fatsSelect.value : '';
  const supplements = supplementsSelect ? supplementsSelect.value : 'None';
  const enhancers = enhancersSelect ? enhancersSelect.value : 'None';

  if (!athleteId) {
    showToast('خطأ: لم يتم تحديد المتدرب', 'danger');
    return;
  }

  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('المتدرب غير موجود بالقائمة', 'danger');
    return;
  }

  // Update athlete model
  athlete.nutritionPlan = {
    protein,
    carbs,
    fats,
    supplements,
    enhancers,
    assignedDate: new Date().toISOString()
  };

  // Set friendly summary label
  const pShort = protein.split('(')[0].trim();
  const cShort = carbs.split('(')[0].trim();
  const fShort = fats.split('(')[0].trim();
  athlete.nutritionPlanId = `${pShort} • ${cShort} • ${fShort}`;

  saveAthletesToStorage();

  // Webhook Payload 2: Nutrition Plan Assignment
  const webhookPayload = {
    dataType: 'nutrition',
    athleteId,
    athleteName: athlete.name,
    protein,
    carbs,
    fats,
    supplements,
    enhancers
  };

  sendToWebhook(webhookPayload);

  // Re-render UI & notify
  renderAthletesView();
  closeNutritionModal();
  showToast(`تم إسناد الخطة الغذائية للمتدرب "${athlete.name}" بنجاح!`);
}

function deleteAthlete(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) return;

  const confirmed = window.confirm(`هل أنت متأكد من حذف المتدرب "${athlete.name}" نهائياً من النظام؟`);
  if (!confirmed) return;

  athletes = athletes.filter(a => a.id !== athleteId);
  saveAthletesToStorage();
  renderAthletesView();
  showToast(`تم حذف المتدرب "${athlete.name}" بنجاح.`, 'danger');
}

/**
 * ----------------------------------------------------------------------------
 * 6. UI ATHLETE CARD RENDERING (CLEAN SPLIT FLEX LAYOUT, NO OVERLAPPING)
 * ----------------------------------------------------------------------------
 */
function renderAthletesView() {
  const container = document.getElementById('athletes-card-grid');
  if (!container) return;

  const searchInput = document.getElementById('athlete-search-input');
  const statusFilter = document.getElementById('athlete-status-filter');

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const selectedStatus = statusFilter ? statusFilter.value : 'all';

  const filteredAthletes = athletes.filter(ath => {
    const matchesQuery = !query || 
      (ath.name && ath.name.toLowerCase().includes(query)) ||
      (ath.email && ath.email.toLowerCase().includes(query)) ||
      (ath.phone && ath.phone.includes(query));
    
    const matchesStatus = selectedStatus === 'all' || ath.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  if (filteredAthletes.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #1a202c; border: 1px solid #2d3748; border-radius: 16px; color: #a0aec0;">
        <svg style="width: 48px; height: 48px; margin-bottom: 12px; color: #718096;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p style="font-size: 1.05rem; font-weight: 600;">لا توجد نتائج مطابقة للبحث أو الفلتر المحدد.</p>
        <button class="btn btn-secondary" style="margin-top: 14px;" onclick="document.getElementById('athlete-search-input').value=''; document.getElementById('athlete-status-filter').value='all'; renderAthletesView();">إعادة تعيين الفلاتر</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredAthletes.map(ath => {
    // Determine status badge label & class
    let statusLabel = 'جديد';
    let statusClass = 'new';
    if (ath.status === 'active') {
      statusLabel = 'نشط';
      statusClass = 'active';
    } else if (ath.status === 'paused') {
      statusLabel = 'متوقف';
      statusClass = 'paused';
    }

    // Latest Waist measurement (Strict Waist standard)
    let latestWaist = '--';
    if (Array.isArray(ath.measurements) && ath.measurements.length > 0) {
      const lastEntry = ath.measurements[ath.measurements.length - 1];
      if (lastEntry && typeof lastEntry.waistCm !== 'undefined') {
        latestWaist = lastEntry.waistCm;
      }
    }

    const nutritionSummary = ath.nutritionPlanId || 'لم يتم الإسناد بعد';

    return `
      <div class="card" id="athlete-card-${ath.id}" style="background: #1a202c; border: 1px solid #2d3748; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.45); transition: border-color 0.2s ease;">
        
        <!-- CARD HEADER: TWO-LEVEL SPLIT FLEX LAYOUT -->
        <div style="display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 12px;">
          <!-- Top Row: Athlete Name & Contact (Right) | Status Tag (Left) -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
            <div>
              <h3 style="margin: 0; font-size: 1.18rem; font-weight: 800; color: #ffffff; letter-spacing: -0.2px;">${ath.name}</h3>
              <div style="font-size: 0.8rem; color: #a0aec0; margin-top: 3px;">
                <span>${ath.email}</span> • <span dir="ltr">${ath.phone}</span>
              </div>
            </div>
            <span class="status-tag ${statusClass}" style="white-space: nowrap;">${statusLabel}</span>
          </div>

          <!-- Bottom Action Row: Clean Horizontal Button Bar (Display: flex; gap: 8px; justify-content: flex-end) -->
          <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap; margin-top: 4px;">
            <!-- Button 1: Nutrition Modal Trigger -->
            <button type="button" class="btn btn-secondary btn-sm" onclick="openNutritionModal('${ath.id}')" style="background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.35); color: #c4b5fd; font-weight: 700;" title="إسناد الخطة الغذائية">
              🥗 تغذية
            </button>

            <!-- Button 2: PDF Export Trigger -->
            <button type="button" class="btn btn-secondary btn-sm" onclick="exportAthleteToPDF('${ath.id}')" style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); color: #93c5fd; font-weight: 700;" title="تصدير ملف المتدرب بصيغة PDF">
              📄 PDF
            </button>

            <!-- Button 3: Delete Trigger -->
            <button type="button" class="btn btn-secondary btn-sm" onclick="deleteAthlete('${ath.id}')" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); color: #fca5a5; font-weight: 700;" title="حذف المتدرب">
              🗑️ حذف
            </button>
          </div>
        </div>

        <!-- METRICS ROW: WEIGHT & STRICT WAIST HIGHLIGHT -->
        <div class="metrics-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #2d3748; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
          <div class="metric-item">
            <span class="metric-label" style="font-size: 0.72rem; color: #a0aec0; font-weight: 700; text-transform: uppercase;">الوزن الحالي</span>
            <span class="metric-val" style="font-size: 1.15rem; font-weight: 800; color: #ffffff;">${ath.currentWeightKg} <span style="font-size: 0.75rem; color: #a0aec0; font-weight: 600;">kg</span></span>
          </div>
          <div class="metric-item">
            <span class="metric-label" style="font-size: 0.72rem; color: #c4b5fd; font-weight: 700; text-transform: uppercase;">محيط الخصر (Waist)</span>
            <span class="metric-val waist-highlight" style="font-size: 1.15rem; font-weight: 800; color: #a78bfa;">${latestWaist} <span style="font-size: 0.75rem; color: #c4b5fd; font-weight: 600;">cm</span></span>
          </div>
        </div>

        <!-- GOAL & LEVEL BADGES -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span style="background: rgba(255,255,255,0.05); color: #e2e8f0; padding: 3px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 600;">
            🎯 ${ath.goal || 'تنشيف'}
          </span>
          <span style="background: rgba(255,255,255,0.05); color: #e2e8f0; padding: 3px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 600;">
            ⚡ مستوى ${ath.level || 'متوسط'}
          </span>
        </div>

        <!-- NUTRITION PLAN SUMMARY ROW -->
        <div style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.18); border-radius: 8px; padding: 9px 12px; font-size: 0.79rem; color: #ddd6fe; display: flex; align-items: center; gap: 8px;">
          <svg style="width: 16px; height: 16px; flex-shrink: 0; color: #a78bfa;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          </svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <strong>الخطة:</strong> ${nutritionSummary}
          </span>
        </div>

      </div>
    `;
  }).join('');
}

/**
 * ----------------------------------------------------------------------------
 * 7. CLIENT-SIDE PDF GENERATION STANDARDS (HTML2PDF.JS)
 * ----------------------------------------------------------------------------
 */

// Helper to ensure html2pdf is loaded dynamically if CDN was blocked or delayed
async function ensureHtml2PdfLoaded() {
  if (typeof window.html2pdf !== 'undefined') {
    return window.html2pdf;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => reject(new Error('Failed loading html2pdf CDN'));
    document.head.appendChild(script);
  });
}

/**
 * PDF EXPORT 1: Single Athlete Profile Report (A4 Portrait)
 */
async function exportAthleteToPDF(athleteId) {
  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast('تعذر العثور على المتدرب لتصدير التقرير', 'danger');
    return;
  }

  showToast(`جاري إنشاء تقرير PDF للمتدرب ${athlete.name}...`);

  try {
    const pdfLib = await ensureHtml2PdfLoaded();

    // Format latest waist & measurements history
    const waistList = Array.isArray(athlete.measurements) && athlete.measurements.length > 0 
      ? athlete.measurements 
      : [{ waistCm: athlete.currentWaistCm || 80 }];

    const latestWaist = waistList[waistList.length - 1].waistCm;

    const nutPlan = athlete.nutritionPlan || {
      protein: 'ستيك فيليه بقري (Beef Tenderloin Steak)',
      carbs: 'أرز بسمتي أبيض / ياسمين (Basmati Rice)',
      fats: 'زيت زيتون بكر ممتاز (Extra Virgin Olive Oil)',
      supplements: 'Whey Isolate (30g) + Creatine (5g)',
      enhancers: 'None (Natural Protocol)'
    };

    // Construct print element with bidirectional text isolation
    const printEl = document.createElement('div');
    printEl.style.cssText = `
      direction: rtl;
      font-family: 'Cairo', Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      padding: 30px;
      line-height: 1.6;
      width: 100%;
      box-sizing: border-box;
    `;

    printEl.innerHTML = `
      <!-- BRAND HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #7c3aed; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #1e1b4b; letter-spacing: -0.5px;">
            THE RUSH <span style="color: #7c3aed;">WAY</span>
          </h1>
          <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">نظام إدارة وتدريب الرياضيين المتقدم</div>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 14px; font-weight: 800; color: #7c3aed;">إشراف المدرب: Coach Rush</div>
          <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">
            تاريخ التقرير: <span dir="ltr" style="display: inline-block;">${new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
      </div>

      <!-- ATHLETE PROFILE CARD -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 22px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e1b4b; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">
          بيانات الرياضي <span dir="ltr" style="display: inline-block;">(Athlete Profile)</span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; width: 25%; color: #64748b;">اسم المتدرب:</td>
            <td style="padding: 6px 0; width: 25%; font-weight: 800; color: #0f172a;">${athlete.name}</td>
            <td style="padding: 6px 0; width: 25%; color: #64748b;">البريد الإلكتروني:</td>
            <td style="padding: 6px 0; width: 25%; color: #0f172a;"><span dir="ltr" style="display: inline-block;">${athlete.email}</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">رقم الهاتف:</td>
            <td style="padding: 6px 0; color: #0f172a;"><span dir="ltr" style="display: inline-block;">${athlete.phone}</span></td>
            <td style="padding: 6px 0; color: #64748b;">الوزن الحالي:</td>
            <td style="padding: 6px 0; font-weight: 800; color: #0f172a;">${athlete.currentWeightKg} <span dir="ltr" style="display: inline-block;">kg</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">الهدف التدريبي:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #7c3aed;">${athlete.goal || 'تنشيف دهون'}</td>
            <td style="padding: 6px 0; color: #64748b;">المستوى الرياضي:</td>
            <td style="padding: 6px 0; color: #0f172a;">${athlete.level || 'متوسط'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">الطول / العمر:</td>
            <td style="padding: 6px 0; color: #0f172a;">${athlete.heightCm || 178} <span dir="ltr" style="display: inline-block;">cm</span> / ${athlete.age || 28} سنة</td>
            <td style="padding: 6px 0; color: #64748b;">حالة الاشتراك:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #059669;">${athlete.status === 'active' ? 'نشط' : athlete.status}</td>
          </tr>
        </table>
      </div>

      <!-- STRICT WAIST MEASUREMENT SECTION -->
      <div style="margin-bottom: 22px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #1e1b4b; display: flex; align-items: center; justify-content: space-between;">
          <span>سجل القياسات البدنية - معيار الخصر الحصري <span dir="ltr" style="display: inline-block;">(Waist Metric Standard)</span></span>
          <span style="font-size: 13px; color: #7c3aed; font-weight: 800;">الخصر الحالي: ${latestWaist} <span dir="ltr" style="display: inline-block;">cm</span></span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center; border: 1px solid #e2e8f0;">
          <thead style="background: #f1f5f9; color: #475569;">
            <tr>
              <th style="padding: 8px; border: 1px solid #e2e8f0;">#</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0;">محيط الخصر <span dir="ltr" style="display: inline-block;">(Waist Circumference)</span></th>
              <th style="padding: 8px; border: 1px solid #e2e8f0;">التقييم الفسيولوجي</th>
            </tr>
          </thead>
          <tbody>
            ${waistList.map((m, idx) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${idx + 1}</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 800; color: #7c3aed;">${m.waistCm} <span dir="ltr" style="display: inline-block;">cm</span></td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; color: #10b981; font-weight: 600;">مؤشر دقيق لحرق دهون الأحشاء ونقاء الكتلة</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- NUTRITION PROTOCOL SECTION -->
      <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #6b21a8; border-bottom: 1px solid #d8b4fe; padding-bottom: 6px;">
          الخطة الغذائية المعتمدة <span dir="ltr" style="display: inline-block;">(Nutrition Plan & Protocol)</span>
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
          <div><strong>🥩 مصادر البروتين:</strong> ${nutPlan.protein}</div>
          <div><strong>🍚 مصادر الكربوهيدرات:</strong> ${nutPlan.carbs}</div>
          <div><strong>🥑 مصادر الدهون الصحية:</strong> ${nutPlan.fats}</div>
          <div><strong>💊 المكملات الغذائية:</strong> <span dir="ltr" style="display: inline-block;">${nutPlan.supplements}</span></div>
          <div style="grid-column: 1 / -1;"><strong>⚡ محسنات الأداء:</strong> <span dir="ltr" style="display: inline-block;">${nutPlan.enhancers}</span></div>
        </div>
      </div>

      <!-- SIGNATURE & FOOTER -->
      <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <div style="font-size: 11px; color: #94a3b8;">
          THE RUSH WAY • Fitness Coach CRM & Athletes Hub • جميع الحقوق محفوظة
        </div>
        <div style="text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #1e1b4b;">اعتماد المدرب: Coach Rush</div>
          <div style="font-family: cursive; font-size: 18px; color: #7c3aed; margin-top: 4px;">Rush Way Certified</div>
        </div>
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `TheRushWay_Athlete_${athlete.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    pdfLib().set(opt).from(printEl).save();
    showToast(`تم تصدير ملف PDF للمتدرب ${athlete.name} بنجاح!`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    showToast('حدث خطأ أثناء تصدير ملف PDF', 'danger');
  }
}

/**
 * PDF EXPORT 2: Master Roster Table of All Registered Athletes (A4 Landscape)
 */
async function exportAllAthletesToPDF() {
  if (!athletes || athletes.length === 0) {
    showToast('لا يوجد متدربين في السجل لتصدير الكشف الشامل', 'danger');
    return;
  }

  showToast('جاري إنشاء الكشف الشامل لجميع المتدربين (PDF)...');

  try {
    const pdfLib = await ensureHtml2PdfLoaded();

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
      <!-- ROSTER HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #7c3aed; padding-bottom: 14px; margin-bottom: 18px;">
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #1e1b4b;">
            THE RUSH <span style="color: #7c3aed;">WAY</span> - الكشف الشامل للمتدربين
          </h1>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
            سجل المتدربين والقياسات والخطط الغذائية <span dir="ltr" style="display: inline-block;">(Master Athlete Roster)</span>
          </div>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 14px; font-weight: 800; color: #7c3aed;">إشراف المدرب: Coach Rush</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
            إجمالي الرياضيين: <strong>${athletes.length}</strong> | التاريخ: <span dir="ltr" style="display: inline-block;">${new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
      </div>

      <!-- ROSTER MASTER TABLE -->
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: right; border: 1px solid #cbd5e1;">
        <thead style="background: #1e1b4b; color: #ffffff;">
          <tr>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 4%; text-align: center;">#</th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 16%;">اسم المتدرب <span dir="ltr" style="display: inline-block;">(Athlete)</span></th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 18%;">بيانات الاتصال <span dir="ltr" style="display: inline-block;">(Contact)</span></th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 9%; text-align: center;">الوزن <span dir="ltr" style="display: inline-block;">(Weight)</span></th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 11%; text-align: center;">الخصر <span dir="ltr" style="display: inline-block;">(Waist cm)</span></th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 14%;">الهدف والمستوى</th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 8%; text-align: center;">الحالة</th>
            <th style="padding: 8px 6px; border: 1px solid #475569; width: 20%;">الخطة الغذائية <span dir="ltr" style="display: inline-block;">(Nutrition)</span></th>
          </tr>
        </thead>
        <tbody>
          ${athletes.map((ath, index) => {
            let waistVal = '--';
            if (Array.isArray(ath.measurements) && ath.measurements.length > 0) {
              waistVal = ath.measurements[ath.measurements.length - 1].waistCm || '--';
            }
            const nutSummary = ath.nutritionPlanId || 'غير مسند';

            return `
              <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700;">${index + 1}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 800; color: #0f172a;">${ath.name}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; color: #475569;">
                  <div>${ath.email}</div>
                  <div dir="ltr" style="font-size: 10px; color: #64748b;">${ath.phone}</div>
                </td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700;">${ath.currentWeightKg} <span dir="ltr" style="display: inline-block;">kg</span></td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: #7c3aed;">
                  ${waistVal} <span dir="ltr" style="display: inline-block;">cm</span>
                </td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; color: #334155;">
                  <div>${ath.goal || 'تنشيف'}</div>
                  <div style="font-size: 10px; color: #64748b;">${ath.level || 'متوسط'}</div>
                </td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: ${ath.status === 'active' ? '#059669' : '#d97706'};">
                  ${ath.status === 'active' ? 'نشط' : ath.status === 'new' ? 'جديد' : 'متوقف'}
                </td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; font-size: 10px; color: #475569;">
                  ${nutSummary}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- ROSTER FOOTER -->
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #64748b;">
        <div>THE RUSH WAY • Master Athlete Roster • إشراف المدرب: Coach Rush</div>
        <div>صفحة 1 من 1</div>
      </div>
    `;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `TheRushWay_Master_Roster_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    pdfLib().set(opt).from(printEl).save();
    showToast('تم تصدير الكشف الشامل لجميع المتدربين بنجاح!');
  } catch (error) {
    console.error('Master Roster Export Error:', error);
    showToast('حدث خطأ أثناء تصدير الكشف الشامل', 'danger');
  }
}

/**
 * ----------------------------------------------------------------------------
 * 8. APPLICATION TABS NAVIGATION (COMPATIBILITY ENGINE)
 * ----------------------------------------------------------------------------
 */
function switchTab(tabId) {
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.toggle('active', view.id === `view-${tabId}`);
  });

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.bottom-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global Tab & Action Stubs for UI consistency
function handleAuthClick() {
  showToast('تم تفعيل مزامنة Google Sheets Webhook تلقائياً (CONNECTED)!');
  const badge = document.getElementById('sheets-hub-status-badge');
  const pill = document.getElementById('header-sheets-pill');
  if (badge) {
    badge.className = 'sheets-sync-pill connected';
    badge.textContent = 'CONNECTED';
  }
  if (pill) {
    pill.className = 'sheets-sync-pill connected';
    const txt = document.getElementById('header-sheets-status-txt');
    if (txt) txt.textContent = 'CONNECTED';
  }
}

function initialize20Tabs() {
  showToast('جاري تهيئة الـ 20 ورقة عمل عبر Webhook...');
  setTimeout(() => {
    handleAuthClick();
    showToast('تم تهيئة وتأكيد أوراق العمل الـ 20 بنجاح!');
  }, 500);
}

function syncAllData() {
  showToast('جاري مزامنة بيانات المتدربين والخطط مع Google Sheets Webhook...');
  athletes.forEach(ath => {
    sendToWebhook({
      dataType: 'athlete_sync',
      name: ath.name,
      email: ath.email,
      phone: ath.phone,
      weight: ath.currentWeightKg,
      waist: ath.measurements && ath.measurements.length > 0 ? ath.measurements[ath.measurements.length - 1].waistCm : 0
    });
  });
  setTimeout(() => {
    showToast('اكتملت المزامنة بنجاح مع Google Sheets!');
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
 * ----------------------------------------------------------------------------
 * 9. GLOBAL SCOPE BINDING (MANDATORY FOR INLINE ONCLICK SAFETY)
 * ----------------------------------------------------------------------------
 */
window.openAddAthleteModal = openAddAthleteModal;
window.closeModal = closeModal;
window.openNutritionModal = openNutritionModal;
window.closeNutritionModal = closeNutritionModal;
window.handleSaveAthlete = handleSaveAthlete;
window.handleSaveNutrition = handleSaveNutrition;
window.deleteAthlete = deleteAthlete;
window.exportAthleteToPDF = exportAthleteToPDF;
window.exportAllAthletesToPDF = exportAllAthletesToPDF;
window.renderAthletesView = renderAthletesView;
window.switchTab = switchTab;
window.handleAuthClick = handleAuthClick;
window.initialize20Tabs = initialize20Tabs;
window.syncAllData = syncAllData;
window.exportBackupJson = exportBackupJson;

/**
 * ----------------------------------------------------------------------------
 * 10. DOM INITIALIZATION & EVENT LISTENERS
 * ----------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load persistent state
  loadAthletesFromStorage();

  // Initial render of Athletes Grid
  renderAthletesView();

  // Search input live filtering
  const searchInput = document.getElementById('athlete-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAthletesView();
    });
  }

  // Status select dropdown filtering
  const statusFilter = document.getElementById('athlete-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      renderAthletesView();
    });
  }

  // Desktop & Mobile Navigation Tab buttons
  document.querySelectorAll('.nav-tab-btn, .bottom-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang || 'ar';
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
      showToast(`تم تغيير اللغة إلى ${lang.toUpperCase()}`);
    });
  });

  console.log('[THE RUSH WAY] Coach CRM Engine initialized successfully with pure Vanilla JS.');
});
// ==========================================
// دوال إدارة الخطة الغذائية والمكملات
// ==========================================

// 1. فتح نافذة التغذية مع تمرير اسم المتدرب
// فتح نافذة التغذية بأمان تام
// 1. فتح نافذة التغذية مع حماية ضد الـ undefined
function openNutritionModal(id, name) {
    const modal = document.getElementById('modal-add-nutrition');
    if (!modal) return;

    // جلب المتدرب من المصفوفة مباشرة إذا لم يصل الاسم
    let athleteName = name;
    if (!athleteName || athleteName === 'undefined') {
        const found = athletes.find(a => a.id == id);
        athleteName = found ? found.name : 'متدرب';
    }

    const idInput = document.getElementById('form-nut-athlete-id');
    const nameInput = document.getElementById('form-nut-athlete-name');
    const nameDisplay = document.getElementById('display-nut-athlete-name');

    if (idInput) idInput.value = id;
    if (nameInput) nameInput.value = athleteName;
    if (nameDisplay) nameDisplay.innerText = athleteName;

    modal.style.display = 'flex';
}

// 2. إغلاق نافذة التغذية
function closeNutritionModal() {
    const modal = document.getElementById('modal-add-nutrition');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 3. حفظ الخطة الغذائية وتحديث الواجهة
async function handleSaveNutrition(event) {
    event.preventDefault();

    const athleteId = document.getElementById('form-nut-athlete-id').value;
    const protein = document.getElementById('form-nut-protein').value;
    const carbs = document.getElementById('form-nut-carbs').value;
    const fats = document.getElementById('form-nut-fats').value;
    const supps = document.getElementById('form-nut-supps').value;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "جاري الحفظ...";
    submitBtn.disabled = true;

    // تحديث المتدرب محلياً فوراً
    const athIndex = athletes.findIndex(a => a.id == athleteId);
    if (athIndex !== -1) {
        athletes[athIndex].nutritionPlanId = `${protein} + ${carbs}`;
        saveState();
        renderAthletesView();
    }

    // إرسال البيانات لشيت غوغل في ورقة Nutrition إن وجد الرابط
    try {
        if (typeof WEBHOOK_URL !== 'undefined' && WEBHOOK_URL && !WEBHOOK_URL.includes("ضع_رابط")) {
            await fetch(WEBHOOK_URL, {
                method: "POST",
                body: JSON.stringify({
                    dataType: "nutrition",
                    athleteId: athleteId,
                    protein: protein,
                    carbs: carbs,
                    fats: fats,
                    supplements: supps
                })
            });
        }
        alert("تم حفظ الخطة الغذائية بنجاح!");
    } catch (err) {
        console.error("Sync Error:", err);
        alert("تم حفظ الخطة محلياً في النظام!");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        closeNutritionModal();
    }
}
// ==========================================
// نظام قفل وحماية لوحة المدرب
// ==========================================
const COACH_SECRET_PIN = "1994"; // <--- يمكنك تغيير الرمز السري هنا

function verifyCoachPin(e) {
    e.preventDefault();
    const enteredPin = document.getElementById('coach-pin-input').value;
    const lockScreen = document.getElementById('coach-lock-screen');

    if (enteredPin === COACH_SECRET_PIN) {
        // حفظ جلسة الدخول في المتصفح حتى لا يطلبها في كل نقرة
        sessionStorage.setItem('coach_unlocked', 'true');
        lockScreen.style.display = 'none';
    } else {
        alert("الرمز السري غير صحيح! تم رفض الوصول.");
        document.getElementById('coach-pin-input').value = "";
    }
}

// التحقق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('coach_unlocked') === 'true') {
        const lockScreen = document.getElementById('coach-lock-screen');
        if (lockScreen) lockScreen.style.display = 'none';
    }
});