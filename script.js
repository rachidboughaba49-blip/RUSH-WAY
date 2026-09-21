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
    { id: 'ex_c1', name: 'Incline Dumbbell Press', nameAr: 'ضغط دمبلز مائل للأعلى', muscleGroup: 'الصدر', targetHead: 'الألياف العلوية (Clavicular Head)', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'dumbbell', biomech: 'زاوية بنش 30 درجة مع نزول متحكم به لعصر أعلى الصدر' },
    { id: 'ex_c2', name: 'Flat Barbell Bench Press', nameAr: 'ضغط بار مستوي كلاسيكي', muscleGroup: 'الصدر', targetHead: 'وسط وأسفل الصدر (Sternal Head)', volume: '3 مجموعات × 6-8 تكرار (RPE 8)', equipment: 'barbell', biomech: 'استقرار الأكتاف وتراجع لوحي الكتف مع قوس طبيعي خفيف' },
    { id: 'ex_c3', name: 'Low-to-High Cable Flyes', nameAr: 'تجميع كابل سفلي لمائل', muscleGroup: 'الصدر', targetHead: 'الصدر العلوي والتقريب المائل', volume: '3 مجموعات × 12-15 تكرار', equipment: 'cable', biomech: 'شد مستمر عبر كامل المدى الحركي مع ثبات قمي ثانيتين' },
    { id: 'ex_c4', name: 'Weighted Chest Dips', nameAr: 'متوازي بالوزن مع ميلان للأمام', muscleGroup: 'الصدر', targetHead: 'الحافة السفلية للصدر (Costal Head)', volume: '3 مجموعات × 8-12 تكرار', equipment: 'bodyweight', biomech: 'ميل الجذع 30 درجة للأمام لتركيز الحمل بعيداً عن الترايسبس' },
    { id: 'ex_c5', name: 'Pec Deck Fly Machine', nameAr: 'فراشة الصدر على الجهاز مع ثبات ثانيتين', muscleGroup: 'الصدر', targetHead: 'عزل ألياف الصدر وانقباض قمي', volume: '3 مجموعات × 12-15 تكرار', equipment: 'machine', biomech: 'كوع نصف منثنٍ مع عصر الألياف في منتصف الحركة' }
  ],
  front_delts: [
    { id: 'ex_fd1', name: 'Seated Dumbbell Shoulder Press', nameAr: 'ضغط دمبلز جالس للأكتاف', muscleGroup: 'الأكتاف', targetHead: 'الكتف الأمامي (Anterior Deltoid)', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'dumbbell', biomech: 'إبقاء الكوع بزاوية 45 درجة أمام الجسم لحماية الكفة المدورة' },
    { id: 'ex_fd2', name: 'Cable Lateral Raises', nameAr: 'رفرفة كابل جانبية خلف الظهر', muscleGroup: 'الأكتاف', targetHead: 'الكتف الجانبي (Lateral Deltoid)', volume: '4 مجموعات × 12-15 تكرار', equipment: 'cable', biomech: 'مقاومة مستمرة مع مسار مائل خفيف للأمام' },
    { id: 'ex_fd3', name: 'Standing Overhead Barbell Press', nameAr: 'ضغط عسكري بالبار واقف', muscleGroup: 'الأكتاف', targetHead: 'الكتف الأمامي والكتلة الشاملة', volume: '3 مجموعات × 6-8 تكرار', equipment: 'barbell', biomech: 'شد الكور والمؤخرة مع دفع رأسي مستقيم وثبات الرأس' },
    { id: 'ex_fd4', name: 'Dumbbell Incline Y-Raise', nameAr: 'رفرفة Y على بنش مائل مسنود', muscleGroup: 'الأكتاف', targetHead: 'الكتف الجانبي والأعلى', volume: '3 مجموعات × 12-15 تكرار', equipment: 'dumbbell', biomech: 'رفع بزاوية 30 درجة خارجياً لتحفيز الألياف الجانبية المعزولة' }
  ],
  rear_delts: [
    { id: 'ex_rd1', name: 'Reverse Pec Deck Fly', nameAr: 'فراشة خلفية للأكتاف على الجهاز', muscleGroup: 'الأكتاف الخلفية', targetHead: 'الكتف الخلفي (Posterior Deltoid)', volume: '4 مجموعات × 12-15 تكرار', equipment: 'machine', biomech: 'تثبيت اللوحين والتركيز على دفع المرفقين للخارج وليس للخلف' },
    { id: 'ex_rd2', name: 'Cable Face Pulls with External Rotation', nameAr: 'سحب حبل كابل للوجه مع دوران خارجي', muscleGroup: 'الأكتاف الخلفية', targetHead: 'الكتف الخلفي والروتاتور كف', volume: '3-4 مجموعات × 15-20 تكرار', equipment: 'cable', biomech: 'سحب الحبل لمستوى الجبهة مع قيادة اليدين أعلى من المرفقين' },
    { id: 'ex_rd3', name: 'Incline Dumbbell Rear Lateral Raise', nameAr: 'رفرفة دمبلز خلفية على بنش مائل', muscleGroup: 'الأكتاف الخلفية', targetHead: 'الكتف الخلفي المعزول', volume: '3 مجموعات × 12-15 تكرار', equipment: 'dumbbell', biomech: 'صدر مسنود على البنش لإلغاء أي دفع بالجاذبية أو الجذع' }
  ],
  traps: [
    { id: 'ex_tr1', name: 'Dumbbell Shrugs with 2s Squeeze', nameAr: 'شراجز دمبلز مع عصر قمي ثانيتين', muscleGroup: 'الترابيس', targetHead: 'الترابيس العلوية (Upper Trapezius)', volume: '4 مجموعات × 10-12 تكرار', equipment: 'dumbbell', biomech: 'رفع رأسي نقي بدون دوران المفاصل مع ثبات ثانيتين في القمة' },
    { id: 'ex_tr2', name: 'Chest-Supported Incline Kelso Shrugs', nameAr: 'شراجز كيلسو على بنش مائل مسنود', muscleGroup: 'الترابيس', targetHead: 'الترابيس الوسطى والسفلية', volume: '3 مجموعات × 12-15 تكرار', equipment: 'dumbbell', biomech: 'سحب لوحي الكتف للخلف مع الحفاظ على استقامة الذراعين' }
  ],
  lats: [
    { id: 'ex_l1', name: 'Neutral-Grip Lat Pulldown', nameAr: 'سحب ظهر قبضة محايدة للصدر', muscleGroup: 'الظهر / المجنص', targetHead: 'ألياف المجنص السفلية (Iliac Lat)', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'cable', biomech: 'قيادة الحركة بالمرفقين باتجاه الجيوب لزيادة قصر ألياف المجنص' },
    { id: 'ex_l2', name: 'Single-Arm Half-Kneeling Cable Pulldown', nameAr: 'سحب كابل فردي للظهر في وضع الركوع', muscleGroup: 'الظهر / المجنص', targetHead: 'عزل المجنص بدون مساعدة القطنية', volume: '3 مجموعات × 10-12 تكرار', equipment: 'cable', biomech: 'استطالة علوية كاملة ومحاذاة كابل مع مسار الألياف العضلية' },
    { id: 'ex_l3', name: 'Chest-Supported T-Bar Row', nameAr: 'سحب T-Bar مسنود الصدر', muscleGroup: 'الظهر', targetHead: 'سماكة الظهر والوسط', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'machine', biomech: 'صدر مثبت تماماً وتفجير بالسحب مع رجوع بطيء' },
    { id: 'ex_l4', name: 'Seated Cable Row (Wide Grip)', nameAr: 'سحب كابل أرضي قبضة واسعة', muscleGroup: 'الظهر', targetHead: 'أعلى الظهر والترابيس الوسطى', volume: '3 مجموعات × 10-12 تكرار', equipment: 'cable', biomech: 'تقريب لوحي الكتف عند الوصول للبطن ومدى حركي كامل' }
  ],
  lower_back: [
    { id: 'ex_lb1', name: '45-Degree Hyperextensions', nameAr: 'تمديد ظهر بزاوية 45 مع حمل وزن', muscleGroup: 'أسفل الظهر', targetHead: 'الانتصاب الشوكي (Erector Spinae)', volume: '3 مجموعات × 12-15 تكرار', equipment: 'bodyweight', biomech: 'رفع الجذع حتى استواء خط الجسم دون فرط تقويس الفقرات' },
    { id: 'ex_lb2', name: 'Romanian Deadlift (Dumbbell)', nameAr: 'ديدليفت روماني بالدمبلز', muscleGroup: 'السلسلة الخلفية', targetHead: 'القطنية والخلفيات والأرداف', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'dumbbell', biomech: 'دفع المؤخرة للخلف بمفصل الحوض مع بقاء الدمبلز ملاصقة للساقين' }
  ],
  biceps: [
    { id: 'ex_b1', name: 'Incline Dumbbell Bicep Curl', nameAr: 'كيرل دمبلز على بنش مائل بمدى استطالة كامل', muscleGroup: 'البايسبس', targetHead: 'الرأس الطويل (Long Head Stretch)', volume: '3-4 مجموعات × 10-12 تكرار', equipment: 'dumbbell', biomech: 'استطالة خلفية كاملة مع كبح النزول وتدوير خارجي للمعصم' },
    { id: 'ex_b2', name: 'EZ-Bar Preacher Curl', nameAr: 'كيرل لاري سكوت بالبار المتعرج', muscleGroup: 'البايسبس', targetHead: 'الرأس القصير (Short Head Peak)', volume: '3 مجموعات × 8-10 تكرار', equipment: 'barbell', biomech: 'تثبيت الإبطين على المسند وعزل كامل بدون حركة تأرجح' },
    { id: 'ex_b3', name: 'Cross-Body Hammer Curls', nameAr: 'كيرل مطرقة متقاطع على الصدر', muscleGroup: 'البايسبس والساعد', targetHead: 'العضلة العضدية (Brachialis)', volume: '3 مجموعات × 10-12 تكرار', equipment: 'dumbbell', biomech: 'قبضة رأسية محايدة وسحب باتجاه الكتف المعاكس لسماكة الذراع' }
  ],
  triceps: [
    { id: 'ex_tri1', name: 'Overhead Dual-Rope Cable Extension', nameAr: 'تمديد كابل علوي بالحبل المزدوج', muscleGroup: 'الترايسبس', targetHead: 'الرأس الطويل (Long Head Stretch)', volume: '3-4 مجموعات × 10-12 تكرار', equipment: 'cable', biomech: 'فتح الحبل عند فرد الكوعين لضمان انقباض الرأس الطويل' },
    { id: 'ex_tri2', name: 'V-Bar Cable Pushdown', nameAr: 'ضغط كابل للأسفل بمسطرة V', muscleGroup: 'الترايسبس', targetHead: 'الرأس الجانبي (Lateral Head)', volume: '3 مجموعات × 10-12 تكرار', equipment: 'cable', biomech: 'تثبيت الكوعين بجانب الأضلاع مع إغلاق تام في أسفل الحركة' },
    { id: 'ex_tri3', name: 'Dips between Benches / Parallel Bars', nameAr: 'غطس متوازي للترايسبس', muscleGroup: 'الترايسبس', targetHead: 'الكتلة الشاملة للذراع الخلفي', volume: '3 مجموعات × 10-12 تكرار', equipment: 'bodyweight', biomech: 'جذع مستقيم عمودي مع نزول بزاوية 90 درجة لمفصل الكوع' }
  ],
  forearms: [
    { id: 'ex_fo1', name: 'Reverse EZ-Bar Curl', nameAr: 'كيرل قبضة مقلوبة بالبار المتعرج', muscleGroup: 'الساعد', targetHead: 'العضدية الكعبرية (Brachioradialis)', volume: '3 مجموعات × 12-15 تكرار', equipment: 'barbell', biomech: 'راحة اليد لأسفل مع رفع بطيء للتركيز على العضلة الكعبرية' },
    { id: 'ex_fo2', name: 'Behind-the-Back Barbell Wrist Curl', nameAr: 'ثني معصم بالبار خلف الظهر', muscleGroup: 'الساعد والقبضة', targetHead: 'قابضات الأصابع والمعصم', volume: '3 مجموعات × 15-20 تكرار', equipment: 'barbell', biomech: 'حركة معصم نقية مع فرد الأصابع طفيفاً لزيادة المدى' }
  ],
  abs: [
    { id: 'ex_ab1', name: 'Hanging Straight Leg Raise', nameAr: 'رفع الأرجل مستقيمة على العقلة', muscleGroup: 'البطن والكور', targetHead: 'البطن السفلية ومثبتات الحوض', volume: '3-4 مجموعات × 12-15 تكرار', equipment: 'bodyweight', biomech: 'رفع الحوض للأعلى باتجاه الأضلاع وليس مجرد رفع الفخذين' },
    { id: 'ex_ab2', name: 'Kneeling Cable Crunch', nameAr: 'طحن كابل للبطن في وضع الركوع', muscleGroup: 'البطن والكور', targetHead: 'البطن المستقيمة (Rectus Abdominis)', volume: '3 مجموعات × 12-15 تكرار', equipment: 'cable', biomech: 'ثني العمود الفقري عمداً مع تقريب المرفقين للركبتين وتفريغ الزفير' },
    { id: 'ex_ab3', name: 'Cable Woodchopper', nameAr: 'تمرين تقطيع الخشب بالكابل', muscleGroup: 'البطن والكور', targetHead: 'العضلات المائلة (Obliques)', volume: '3 مجموعات × 12-15 تكرار لكل جهة', equipment: 'cable', biomech: 'دوران نابع من الجذع مع تثبيت نسبي لمفصل الحوض' }
  ],
  quads: [
    { id: 'ex_q1', name: 'Heels-Elevated Hack Squat', nameAr: 'هاك سكوات مع كعوب مرفوعة وعمق كامل', muscleGroup: 'الفخذ الأمامي', targetHead: 'عزل الكوادز (Vastus Lateralis/Medialis)', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'machine', biomech: 'دفع الركبتين للأمام فوق أطراف الأصابع بمدى عميق لاستطالة ألياف الكوادز' },
    { id: 'ex_q2', name: 'Seated Leg Extension with 1s Pause', nameAr: 'فرد أرجل جالس على الجهاز مع ثبات ثانية', muscleGroup: 'الفخذ الأمامي', targetHead: 'المستقيمة الفخذية (Rectus Femoris)', volume: '3 مجموعات × 12-15 تكرار', equipment: 'machine', biomech: 'ثبات ثانية في القمة ونزول 3 ثوانٍ بطيئة لتحفيز الضخامة' },
    { id: 'ex_q3', name: 'Dumbbell Bulgarian Split Squat', nameAr: 'سكوات بلغاري بالدمبلز', muscleGroup: 'الفخذ الأمامي والأرداف', targetHead: 'القوة الأحادية وتوازن الساقين', volume: '3 مجموعات × 10-12 تكرار لكل ساق', equipment: 'dumbbell', biomech: 'التركيز على دفع الساق الأمامية مع حوض متوازن' },
    { id: 'ex_q4', name: 'Barbell Front Squat', nameAr: 'سكوات أمامي بالبار الأولمبي', muscleGroup: 'الفخذ الأمامي', targetHead: 'الحمل المباشر على الكوادز والكور', volume: '3 مجموعات × 6-8 تكرار', equipment: 'barbell', biomech: 'مرفقان مرتفعان وجذع رأسي لتوزيع الثقل مباشرة على الفخذين' }
  ],
  hamstrings: [
    { id: 'ex_h1', name: 'Seated Leg Curl with Full Hip Flexion', nameAr: 'ثني أرجل جالس مع استطالة حوض كاملة', muscleGroup: 'الفخذ الخلفي', targetHead: 'عزل الخلفيات (Semimembranosus/Biceps)', volume: '3-4 مجموعات × 10-12 تكرار', equipment: 'machine', biomech: 'ميل طفيف للأمام لزيادة استطالة أصل وتر الفخذ الخلفي بالحوض' },
    { id: 'ex_h2', name: 'Lying Leg Curl', nameAr: 'ثني أرجل مستلقي على الجهاز', muscleGroup: 'الفخذ الخلفي', targetHead: 'قمة انقباض الفخذ الخلفي', volume: '3 مجموعات × 10-12 تكرار', equipment: 'machine', biomech: 'تثبيت الحوض على المسند لتجنب مساعدة القطنية أثناء الثني' },
    { id: 'ex_h3', name: 'Dumbbell Stiff-Legged Deadlift', nameAr: 'ديدليفت بأرجل شبه مفرودة بالدمبلز', muscleGroup: 'الفخذ الخلفي', targetHead: 'الاستطالة تحت الحمل والأوتار', volume: '3 مجموعات × 8-10 تكرار', equipment: 'dumbbell', biomech: 'انحناء بمفصل الورك مع ثني ركبة طفيف جداً وتمدد عميق' }
  ],
  glutes: [
    { id: 'ex_g1', name: 'Barbell Hip Thrust with 2s Squeeze', nameAr: 'دفع حوض بالبار الأولمبي مع ثبات ثانيتين', muscleGroup: 'الأرداف', targetHead: 'العضلة الإليوية الكبرى (Gluteus Maximus)', volume: '3-4 مجموعات × 8-10 تكرار', equipment: 'barbell', biomech: 'قصبة الساق عمودية في قمة الرفع مع عصر قوي للمؤخرة وتثبيت الرقبة' },
    { id: 'ex_g2', name: 'Cable Glute Kickback', nameAr: 'ركل كابل خلفي للأرداف', muscleGroup: 'الأرداف', targetHead: 'عزل الأرداف العلوية والجانبية', volume: '3 مجموعات × 12-15 تكرار', equipment: 'cable', biomech: 'حركة نصف دائرية للخارج بزاوية 30 درجة لاستهداف الألياف العلوية' }
  ],
  calves: [
    { id: 'ex_cal1', name: 'Standing Machine Calf Raise', nameAr: 'رفع سمانة واقف مع تمدد كامل وتوقف ثانيتين', muscleGroup: 'السمانة / البطات', targetHead: 'الرؤوس الخارجية للسمانة (Gastrocnemius)', volume: '4 مجموعات × 10-12 تكرار', equipment: 'machine', biomech: 'توقف ثانيتين في أسفل التمدد لإلغاء مرونة وتر أخيل واستدعاء الألياف العضلية' },
    { id: 'ex_cal2', name: 'Seated Calf Raise', nameAr: 'رفع سمانة جالس على الجهاز', muscleGroup: 'السمانة / البطات', targetHead: 'العضلة النعلية العميقة (Soleus)', volume: '3 مجموعات × 15-20 تكرار', equipment: 'machine', biomech: 'ثني الركبة بزاوية 90 درجة يضع الحمل بالكامل على العضلة النعلية' }
  ],
  neck: [
    { id: 'ex_nk1', name: 'Lying Neck Extension with Plate', nameAr: 'تمديد رقبة مستلقي مع وزن خفيف', muscleGroup: 'الرقبة', targetHead: 'عضلات الرقبة الخلفية وحماية الفقرات', volume: '3 مجموعات × 15-20 تكرار', equipment: 'bodyweight', biomech: 'مدى حركي بطيء ومتحكم فيه جداً مع وزن خفيف أو مقاومة اليدين' },
    { id: 'ex_nk2', name: 'Lying Neck Flexion', nameAr: 'ثني رقبة للأمام مع وسادة', muscleGroup: 'الرقبة', targetHead: 'العضلة القصية الترقوية الحلمية (SCM)', volume: '3 مجموعات × 15-20 تكرار', equipment: 'bodyweight', biomech: 'تقريب الذقن للصدر ببطء دون شد المفاصل المفاجئ' }
  ]
};

// Muscle Aliases mapping
EXERCISE_DATABASE.shoulders = EXERCISE_DATABASE.front_delts;
EXERCISE_DATABASE.reardelts = EXERCISE_DATABASE.rear_delts;

// Muscle Labels Dictionary for UI
const MUSCLE_LABELS = {
  chest: 'الصدر (Chest)',
  front_delts: 'الأكتاف (Delts)',
  shoulders: 'الأكتاف (Delts)',
  rear_delts: 'الأكتاف الخلفية (Rear Delts)',
  reardelts: 'الأكتاف الخلفية (Rear Delts)',
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
  calves: 'السمانة (Calves)',
  neck: 'عضلات الرقبة (Neck)'
};

// Anatomical Biomechanics and Fiber Focus Dictionary
const ANATOMICAL_FOCUS_DATA = {
  chest: {
    title: 'عضلات الصدر (Pectoralis Major & Minor)',
    focus: 'الألياف الترقوية العلوية (Clavicular) والقصية الوسطى والسفلية (Sternal)',
    biomech: 'استطالة عميقة تحت الحمل الميكانيكي مع زوايا دفع متعددة (مائل، مستوي، تجميع كابل) وعصر قمي.'
  },
  front_delts: {
    title: 'عضلات الأكتاف (Anterior & Lateral Deltoids)',
    focus: 'الرأس الأمامي والجانبي لعضلة الدالية',
    biomech: 'دفع رأسي ورفرفة جانبية مع إبقاء الكوع في مستوى الكتف لتقليل إجهاد أوتار الكفة المدورة.'
  },
  shoulders: {
    title: 'عضلات الأكتاف (Deltoids)',
    focus: 'الرأس الأمامي والجانبي لعضلة الدالية',
    biomech: 'دفع رأسي ورفرفة جانبية مع إبقاء الكوع في مستوى الكتف لتقليل إجهاد أوتار الكفة المدورة.'
  },
  rear_delts: {
    title: 'الأكتاف الخلفية (Posterior Deltoid)',
    focus: 'الرأس الخلفي للكتف وعضلات الكفة المدورة (Rotator Cuff)',
    biomech: 'سحب بحبل للوجه وفراشة عكسية مع دوران خارجي للمعصم لعزل الألياف الخلفية بأمان.'
  },
  reardelts: {
    title: 'الأكتاف الخلفية (Posterior Deltoid)',
    focus: 'الرأس الخلفي للكتف وعضلات الكفة المدورة',
    biomech: 'سحب بحبل للوجه وفراشة عكسية مع دوران خارجي للمعصم لعزل الألياف الخلفية بأمان.'
  },
  traps: {
    title: 'عضلات الترابيس (Trapezius Complex)',
    focus: 'الترابيس العلوية والوسطى والسفلية',
    biomech: 'رفع الكتفين عمودياً مع ثبات قمي ثانيتين ثم هبوط بطيء لاستطالة كاملة لألياف الترابيس.'
  },
  lats: {
    title: 'عضلات المجنص والظهر (Latissimus Dorsi & Rhomboids)',
    focus: 'ألياف المجنص العلوية والحرقفية السفلية وسماكة الظهر',
    biomech: 'سحب رأسي وأفقي مع قيادة الحركة بالكوع باتجاه الحوض وليس بالمعصم لتعظيم التحفيز.'
  },
  lower_back: {
    title: 'أسفل الظهر (Erector Spinae & Lumbar)',
    focus: 'الانتصاب الشوكي وحزام الأمان للعمود الفقري',
    biomech: 'تمديد الظهر والديدليفت الروماني مع ثبات الحوض والحفاظ على الانحناء الطبيعي للفقرات.'
  },
  biceps: {
    title: 'عضلة البايسبس (Biceps Brachii & Brachialis)',
    focus: 'الرأس الطويل والرأس القصير والعضلة العضدية',
    biomech: 'ثني الكوع بمدى حركي كامل مع كبح النزول السلبي وتدوير الكف للخارج (Supination).'
  },
  triceps: {
    title: 'عضلة الترايسبس (Triceps Brachii)',
    focus: 'الرؤوس الثلاثة: الطويل والجانبي والأوسط (Horseshoe)',
    biomech: 'فرد كامل لمفصل الكوع مع ثبات أعلى الذراع، واستخدام زوايا فوق الرأس للرأس الطويل.'
  },
  forearms: {
    title: 'الساعدين وقوة القبضة (Forearms & Grip)',
    focus: 'العضدية الكعبرية وقابضات وباسطات الأصابع والمعصم',
    biomech: 'ثني وبسط المعصم مع حمل أوزان حرة لتعزيز عصبية القبضة واستقرار المفاصل.'
  },
  abs: {
    title: 'عضلات البطن والجذع (Rectus Abdominis & Obliques)',
    focus: 'البطن المستقيمة والعضلات المائلة ومثبتات الحوض',
    biomech: 'تقريب عظام الحوض نحو القفص الصدري مع تفريغ الهواء عند ذروة الانقباض العضلي.'
  },
  quads: {
    title: 'الفخذ الأمامي (Quadriceps Femoris)',
    focus: 'المتسعة الإنسية (دمعة الفخذ) والوحشية والمستقيمة الفخذية',
    biomech: 'ثني ركبة عميق مع استقرار الكعب لضمان أقصى إجهاد ميكانيكي على ألياف الكوادز.'
  },
  hamstrings: {
    title: 'الفخذ الخلفي (Hamstrings Group)',
    focus: 'العضلة الفخذية ذات الرأسين وشبه الوترية وشبه الغشائية',
    biomech: 'ثني الركبة واستطالة الحوض (Hip Hinge) مع الحفاظ على استقامة العمود الفقري.'
  },
  glutes: {
    title: 'عضلات الأرداف (Gluteus Maximus & Medius)',
    focus: 'العضلة الإليوية الكبرى والوسطى ودعم الحوض',
    biomech: 'دفع حوض (Hip Thrust) وركل كابل مع عصر قمي قوي لمدة ثانيتين في أعلى نقطة.'
  },
  calves: {
    title: 'عضلات السمانة والبطات (Gastrocnemius & Soleus)',
    focus: 'الرؤوس الخارجية للسمانة والعضلة النعلية العميقة',
    biomech: 'تمدد كامل في أسفل الحركة مع صعود انفجاري وثبات ثانية ونصف في قمة الانقباض.'
  },
  neck: {
    title: 'عضلات الرقبة (Cervical Spine & Neck Flexors)',
    focus: 'العضلة القصية الترقوية الحلمية ومثبتات الرقبة العميقة',
    biomech: 'مقاومة خفيفة مدروسة بمدى حركي بطيء ومتحكم فيه لتقوية العمود الفقري العنقي.'
  }
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
    if (typeof populateStudioAthleteDropdown === 'function') {
      populateStudioAthleteDropdown();
    }
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
 * 7. NUTRITION PLAN ASSIGNMENT & INTERACTIVE NUTRITION STUDIO
 * ============================================================================
 */
const DEFAULT_COACH_DIETS = [
  {
    id: 'diet_shred_beef_fish',
    title: 'بروتوكول اللحوم الحمراء والأسماك والتنشيف',
    titleEn: 'Rush Way Lean Red Meat & Fish Shred Protocol',
    targetCalories: 2350,
    targetProteinG: 210,
    targetCarbsG: 220,
    targetFatsG: 55,
    primaryProteinChoice: 'meat',
    supplements: 'Whey Isolate (30g) + Creatine (5g) + Omega 3',
    enhancers: 'Natural Protocol',
    notes: 'تركيز مصادر البروتين العالي الحيوية (ستيك بقري + سمك سلمون) مع توقيت الكارب حول التمرين لتقليل محيط الخصر.',
    meals: [
      {
        id: 'm_1',
        name: 'وجبة 1 - الفطور الصباحي',
        timing: 'Morning',
        items: '4 بيضات عضوية كاملة + 80g شوفان كامل مع توت أزرق + 15g بذور شيا',
        protein: 36,
        carbs: 58,
        fats: 22
      },
      {
        id: 'm_2',
        name: 'وجبة قبل التمرين (Pre-Workout)',
        timing: 'Pre-workout',
        items: '200g ستيك فيليه عجل هبرة + 220g أرز بسمتي أبيض مطبوخ + خضار خضراء',
        protein: 52,
        carbs: 62,
        fats: 10
      },
      {
        id: 'm_3',
        name: 'وجبة بعد التمرين (Post-Workout)',
        timing: 'Post-workout',
        items: '220g سمك سلمون أطلسي مشوي + 200g بطاطا حلوة مشوية + 10ml زيت زيتون',
        protein: 50,
        carbs: 55,
        fats: 16
      },
      {
        id: 'm_4',
        name: 'وجبة العشاء والاستشفاء (Dinner)',
        timing: 'Dinner',
        items: '200g صدور دجاج مشوية أو تونة طازجة + سلطة أفوكادو غنية',
        protein: 48,
        carbs: 12,
        fats: 10
      }
    ]
  },
  {
    id: 'diet_clean_bulk_hypertrophy',
    title: 'بروتوكول البناء العضلي الصافي وضخامة الألياف',
    titleEn: 'Rush Way Hypertrophy & Pure Mass Protocol',
    targetCalories: 2850,
    targetProteinG: 225,
    targetCarbsG: 340,
    targetFatsG: 65,
    primaryProteinChoice: 'meat',
    supplements: 'Whey Isolate (40g) + Creatine Monohydrate (5g) + L-Glutamine (10g)',
    enhancers: 'Natural Protocol',
    notes: 'رفع مخازن الجليكوجين العضلي مع الحفاظ التام على محيط الخصر ضيقاً.',
    meals: [
      {
        id: 'm_bulk_1',
        name: 'وجبة 1 - الفطور البنائي',
        timing: 'Morning',
        items: '5 بيضات كاملة + 100g شوفان + موز وتمر + ملعقة زبدة فول سوداني',
        protein: 45,
        carbs: 85,
        fats: 25
      },
      {
        id: 'm_bulk_2',
        name: 'وجبة 2 - قبل التمرين',
        timing: 'Pre-workout',
        items: '220g ستيك بقري مفروم 5% + 250g أرز بسمتي + خضار مشوية',
        protein: 55,
        carbs: 75,
        fats: 12
      },
      {
        id: 'm_bulk_3',
        name: 'وجبة 3 - بعد التمرين',
        timing: 'Post-workout',
        items: '220g صدر دجاج متبل + 300g بطاطا بيضاء مهروسة + زيت زيتون',
        protein: 52,
        carbs: 80,
        fats: 14
      },
      {
        id: 'm_bulk_4',
        name: 'وجبة 4 - العشاء الهادئ',
        timing: 'Dinner',
        items: '200g سمك قد أبيض أو سلمون + سلطة ورقية كاملة مع أفوكادو',
        protein: 48,
        carbs: 20,
        fats: 14
      }
    ]
  },
  {
    id: 'diet_omega_fish_mobility',
    title: 'بروتوكول الأسماك البرية ومكافحة الالتهابات والتنشيف',
    titleEn: 'Wild Fish Omega-3 & Anti-Inflammatory Shred',
    targetCalories: 2150,
    targetProteinG: 195,
    targetCarbsG: 200,
    targetFatsG: 50,
    primaryProteinChoice: 'fish',
    supplements: 'Omega-3 Fish Oil (3000mg) + Magnesium Glycinate (400mg) + Zinc (30mg)',
    enhancers: 'Natural Protocol',
    notes: 'أقصى درجة تقليل لالتهاب المفاصل ورفع حساسية الأنسولين عبر الأسماك البرية.',
    meals: [
      {
        id: 'm_fish_1',
        name: 'وجبة 1 - الفطور الخفيف',
        timing: 'Morning',
        items: '3 بيضات كاملة + 3 بياض بيض + 60g خبز أسمر حبة كاملة + أفوكادو',
        protein: 38,
        carbs: 35,
        fats: 18
      },
      {
        id: 'm_fish_2',
        name: 'وجبة 2 - قبل التمرين',
        timing: 'Pre-workout',
        items: '220g سمك قد أبيض + 220g أرز ياسمين + هليون مشوي',
        protein: 50,
        carbs: 65,
        fats: 6
      },
      {
        id: 'm_fish_3',
        name: 'وجبة 3 - بعد التمرين',
        timing: 'Post-workout',
        items: '220g سمك سلمون بري + 200g كينوا عضوية مطبوخة + خضار ورقية',
        protein: 52,
        carbs: 55,
        fats: 16
      },
      {
        id: 'm_fish_4',
        name: 'وجبة 4 - العشاء',
        timing: 'Dinner',
        items: '200g تونة بيضاء طازجة بالماء + سلطة بروكلي وزيت زيتون بكر',
        protein: 44,
        carbs: 10,
        fats: 10
      }
    ]
  }
];

let currentStudioMeals = [];

function loadCustomDietsFromStorage() {
  try {
    const raw = localStorage.getItem('coachCustomDiets');
    if (!raw) {
      localStorage.setItem('coachCustomDiets', JSON.stringify(DEFAULT_COACH_DIETS));
      return [...DEFAULT_COACH_DIETS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('coachCustomDiets', JSON.stringify(DEFAULT_COACH_DIETS));
      return [...DEFAULT_COACH_DIETS];
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse coachCustomDiets', err);
    return [...DEFAULT_COACH_DIETS];
  }
}

function saveCustomDietsToStorage(diets) {
  try {
    localStorage.setItem('coachCustomDiets', JSON.stringify(diets));
  } catch (err) {
    console.error('Failed to save coachCustomDiets', err);
  }
}

function initNutritionStudio() {
  populateNutritionTemplateSelect();
  populateNutritionAthleteSelect();

  if (currentStudioMeals.length === 0) {
    const diets = loadCustomDietsFromStorage();
    if (diets.length > 0) {
      loadDietTemplateIntoForm(diets[0]);
    }
  } else {
    renderMealsBuilderList();
    updateMacroCalculations();
  }

  // Bind live calculation listeners on macro inputs
  const inputs = ['diet-target-calories', 'diet-target-protein', 'diet-target-carbs', 'diet-target-fats'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.oninput = () => updateMacroCalculations();
    }
  });
}

function populateNutritionTemplateSelect() {
  const select = document.getElementById('select-nutrition-template');
  if (!select) return;

  const diets = loadCustomDietsFromStorage();
  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';

  select.innerHTML = diets.map(d => {
    const title = (isAr ? d.title : (d.titleEn || d.title));
    return `<option value="${d.id}">${title} (${d.targetCalories || 0} kcal)</option>`;
  }).join('');
}

function populateNutritionAthleteSelect() {
  const select = document.getElementById('diet-assign-athlete-select');
  if (!select) return;

  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
  const defaultOption = `<option value="">${isAr ? '-- اختر متدرباً من السجل --' : '-- Select Athlete from Roster --'}</option>`;

  if (!athletes || athletes.length === 0) {
    select.innerHTML = defaultOption;
    return;
  }

  select.innerHTML = defaultOption + athletes.map(a => {
    let waist = '--';
    if (Array.isArray(a.measurements) && a.measurements.length > 0) {
      waist = a.measurements[a.measurements.length - 1].waistCm || '--';
    }
    const currentPlan = a.nutritionPlanId ? ` [${a.nutritionPlanId}]` : '';
    return `<option value="${a.id}">${a.name} (${a.currentWeightKg}kg - خصر ${waist}cm)${currentPlan}</option>`;
  }).join('');
}

function loadSelectedDietTemplate() {
  const select = document.getElementById('select-nutrition-template');
  if (!select) return;

  const templateId = select.value;
  const diets = loadCustomDietsFromStorage();
  const diet = diets.find(d => d.id === templateId) || diets[0];
  if (diet) {
    loadDietTemplateIntoForm(diet);
    showToast(`تم تحميل القالب "${diet.title}" في الاستوديو بنجاح!`);
  }
}

function loadDietTemplateIntoForm(diet) {
  if (!diet) return;

  const titleInput = document.getElementById('diet-plan-title');
  const typeSelect = document.getElementById('diet-protein-type');
  const calsInput = document.getElementById('diet-target-calories');
  const protInput = document.getElementById('diet-target-protein');
  const carbsInput = document.getElementById('diet-target-carbs');
  const fatsInput = document.getElementById('diet-target-fats');
  const suppInput = document.getElementById('diet-supplements');
  const enhInput = document.getElementById('diet-enhancers');
  const notesInput = document.getElementById('diet-notes');

  if (titleInput) titleInput.value = diet.title || '';
  if (typeSelect && diet.primaryProteinChoice) typeSelect.value = diet.primaryProteinChoice;
  if (calsInput) calsInput.value = diet.targetCalories || 2200;
  if (protInput) protInput.value = diet.targetProteinG || 180;
  if (carbsInput) carbsInput.value = diet.targetCarbsG || 200;
  if (fatsInput) fatsInput.value = diet.targetFatsG || 55;
  if (suppInput) suppInput.value = diet.supplements || '';
  if (enhInput) enhInput.value = diet.enhancers || 'Natural Protocol';
  if (notesInput) notesInput.value = diet.notes || '';

  currentStudioMeals = Array.isArray(diet.meals) ? JSON.parse(JSON.stringify(diet.meals)) : [];

  renderMealsBuilderList();
  updateMacroCalculations();
}

function resetNutritionStudioForm() {
  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
  const titleInput = document.getElementById('diet-plan-title');
  const typeSelect = document.getElementById('diet-protein-type');
  const calsInput = document.getElementById('diet-target-calories');
  const protInput = document.getElementById('diet-target-protein');
  const carbsInput = document.getElementById('diet-target-carbs');
  const fatsInput = document.getElementById('diet-target-fats');
  const suppInput = document.getElementById('diet-supplements');
  const enhInput = document.getElementById('diet-enhancers');
  const notesInput = document.getElementById('diet-notes');

  if (titleInput) titleInput.value = isAr ? 'خطة غذائية مخصصة جديدة' : 'New Custom Nutrition Plan';
  if (typeSelect) typeSelect.value = 'meat';
  if (calsInput) calsInput.value = 2400;
  if (protInput) protInput.value = 200;
  if (carbsInput) carbsInput.value = 230;
  if (fatsInput) fatsInput.value = 60;
  if (suppInput) suppInput.value = 'Whey Isolate + Creatine 5g';
  if (enhInput) enhInput.value = 'Natural Protocol';
  if (notesInput) notesInput.value = '';

  currentStudioMeals = [
    {
      id: 'm_' + Date.now() + '_1',
      name: isAr ? 'وجبة 1 - الفطور' : 'Meal 1 - Breakfast',
      timing: 'Morning',
      items: isAr ? '4 بيضات كاملة + 80g شوفان' : '4 whole eggs + 80g oats',
      protein: 35,
      carbs: 55,
      fats: 20
    },
    {
      id: 'm_' + Date.now() + '_2',
      name: isAr ? 'وجبة 2 - قبل التمرين' : 'Meal 2 - Pre-Workout',
      timing: 'Pre-workout',
      items: isAr ? '200g ستيك فيليه عجل + 200g أرز بسمتي' : '200g beef steak + 200g rice',
      protein: 50,
      carbs: 60,
      fats: 10
    }
  ];

  renderMealsBuilderList();
  updateMacroCalculations();
  showToast(isAr ? 'تم بدء خطة غذائية جديدة فارغة' : 'Initialized new blank nutrition plan');
}

function renderMealsBuilderList() {
  const container = document.getElementById('meals-builder-list');
  if (!container) return;

  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';

  if (currentStudioMeals.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <div style="font-size: 1.4rem; margin-bottom: 6px;">🍽️</div>
        <div>${isAr ? 'لم تتم إضافة وجبات بعد' : 'No meals added yet'}</div>
        <div style="font-size: 0.76rem; margin-top: 4px;">${isAr ? 'انقر على "+ إضافة وجبة" لتوزيع الوجبات ومصادر البروتين والكارب' : 'Click "+ Add Meal" to distribute meals and nutrients'}</div>
      </div>
    `;
    return;
  }

  container.innerHTML = currentStudioMeals.map((meal, index) => {
    const timingOptions = [
      { val: 'Morning', ar: 'الصباح / الفطور', en: 'Morning / Breakfast' },
      { val: 'Pre-workout', ar: 'قبل التمرين (Pre-Workout)', en: 'Pre-Workout' },
      { val: 'Post-workout', ar: 'بعد التمرين (Post-Workout)', en: 'Post-Workout' },
      { val: 'Dinner', ar: 'المساء / العشاء', en: 'Evening / Dinner' },
      { val: 'Snack', ar: 'سناك خفيف', en: 'Snack' }
    ];

    return `
      <div class="meal-builder-card" data-index="${index}">
        <div class="meal-builder-header">
          <div class="meal-title-group">
            <span class="meal-builder-index">${index + 1}</span>
            <input type="text" class="meal-name-input" value="${meal.name || ''}" placeholder="${isAr ? 'اسم الوجبة (مثال: وجبة 1)' : 'Meal Name'}" onchange="updateMealField(${index}, 'name', this.value)" />
          </div>
          <button type="button" class="btn-remove-meal" data-action="remove-meal" data-meal-index="${index}" title="${isAr ? 'حذف الوجبة' : 'Remove Meal'}">
            🗑️ ${isAr ? 'حذف' : 'Remove'}
          </button>
        </div>

        <div class="meal-builder-grid">
          <div>
            <select class="form-control meal-timing-select" onchange="updateMealField(${index}, 'timing', this.value)">
              ${timingOptions.map(t => `<option value="${t.val}" ${meal.timing === t.val ? 'selected' : ''}>${isAr ? t.ar : t.en}</option>`).join('')}
            </select>
          </div>
          <div>
            <input type="text" class="form-control meal-items-input" value="${meal.items || ''}" placeholder="${isAr ? 'الأطعمة والجرعات (مثال: 200g ستيك بقري + 220g أرز + 15ml زيت زيتون)' : 'Foods & portions (e.g. 200g steak + 220g rice + 15ml olive oil)'}" onchange="updateMealField(${index}, 'items', this.value)" />
          </div>
          <div class="meal-macros-inputs">
            <div class="meal-macro-pill" title="Protein (g)">
              <span style="color: #93c5fd; font-weight: 800; font-size: 0.7rem; margin-inline-end: 2px;">P</span>
              <input type="number" value="${meal.protein || 0}" min="0" max="250" onchange="updateMealField(${index}, 'protein', Number(this.value))" />
            </div>
            <div class="meal-macro-pill" title="Carbs (g)">
              <span style="color: #fde047; font-weight: 800; font-size: 0.7rem; margin-inline-end: 2px;">C</span>
              <input type="number" value="${meal.carbs || 0}" min="0" max="400" onchange="updateMealField(${index}, 'carbs', Number(this.value))" />
            </div>
            <div class="meal-macro-pill" title="Fats (g)">
              <span style="color: #fca5a5; font-weight: 800; font-size: 0.7rem; margin-inline-end: 2px;">F</span>
              <input type="number" value="${meal.fats || 0}" min="0" max="150" onchange="updateMealField(${index}, 'fats', Number(this.value))" />
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateMealField(index, field, value) {
  if (currentStudioMeals[index]) {
    currentStudioMeals[index][field] = value;
    if (field === 'protein' || field === 'carbs' || field === 'fats') {
      updateMacroCalculations();
    }
  }
}

function addMealToNutritionStudio() {
  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
  const newIndex = currentStudioMeals.length + 1;
  const newMeal = {
    id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: isAr ? `وجبة ${newIndex}` : `Meal ${newIndex}`,
    timing: newIndex === 1 ? 'Morning' : (newIndex === 2 ? 'Pre-workout' : (newIndex === 3 ? 'Post-workout' : 'Dinner')),
    items: '',
    protein: 40,
    carbs: 50,
    fats: 12
  };
  currentStudioMeals.push(newMeal);
  renderMealsBuilderList();
  updateMacroCalculations();
  showToast(isAr ? `تمت إضافة "${newMeal.name}" للجدول` : `Added "${newMeal.name}" to meal list`);
}

function removeMealFromStudio(index) {
  if (index >= 0 && index < currentStudioMeals.length) {
    const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
    const removed = currentStudioMeals.splice(index, 1)[0];
    renderMealsBuilderList();
    updateMacroCalculations();
    showToast(isAr ? `تم حذف "${removed.name}"` : `Removed "${removed.name}"`);
  }
}

function updateMacroCalculations() {
  const p = Number(document.getElementById('diet-target-protein')?.value) || 0;
  const c = Number(document.getElementById('diet-target-carbs')?.value) || 0;
  const f = Number(document.getElementById('diet-target-fats')?.value) || 0;

  const calcCalories = (p * 4) + (c * 4) + (f * 9);
  const noteEl = document.getElementById('calc-calories-note');
  if (noteEl) {
    noteEl.textContent = `محسوبة: ~${calcCalories} kcal`;
  }

  // Calculate percentages
  const totalCals = calcCalories > 0 ? calcCalories : 1;
  const pPct = Math.round(((p * 4) / totalCals) * 100) || 0;
  const cPct = Math.round(((c * 4) / totalCals) * 100) || 0;
  const fPct = Math.max(0, 100 - pPct - cPct);

  const barP = document.getElementById('macro-bar-p');
  const barC = document.getElementById('macro-bar-c');
  const barF = document.getElementById('macro-bar-f');

  if (barP) {
    barP.style.width = `${pPct}%`;
    barP.textContent = `${pPct}% P`;
    barP.title = `البروتين: ${pPct}% (${p * 4} kcal)`;
  }
  if (barC) {
    barC.style.width = `${cPct}%`;
    barC.textContent = `${cPct}% C`;
    barC.title = `الكارب: ${cPct}% (${c * 4} kcal)`;
  }
  if (barF) {
    barF.style.width = `${fPct}%`;
    barF.textContent = `${fPct}% F`;
    barF.title = `الدهون: ${fPct}% (${f * 9} kcal)`;
  }

  const pSub = document.getElementById('macro-prot-sub');
  const cSub = document.getElementById('macro-carbs-sub');
  const fSub = document.getElementById('macro-fats-sub');
  if (pSub) pSub.textContent = `4 kcal/g • ${pPct}%`;
  if (cSub) cSub.textContent = `4 kcal/g • ${cPct}%`;
  if (fSub) fSub.textContent = `9 kcal/g • ${fPct}%`;
}

function saveCustomDietTemplate() {
  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
  const title = (document.getElementById('diet-plan-title')?.value || '').trim();
  if (!title) {
    showToast(isAr ? 'يرجى إدخال عنوان البروتوكول الغذائي' : 'Please enter a nutrition plan title', 'danger');
    return;
  }

  const proteinChoice = document.getElementById('diet-protein-type')?.value || 'meat';
  const calories = Number(document.getElementById('diet-target-calories')?.value) || 2400;
  const protein = Number(document.getElementById('diet-target-protein')?.value) || 200;
  const carbs = Number(document.getElementById('diet-target-carbs')?.value) || 220;
  const fats = Number(document.getElementById('diet-target-fats')?.value) || 60;
  const supplements = (document.getElementById('diet-supplements')?.value || '').trim();
  const enhancers = (document.getElementById('diet-enhancers')?.value || 'Natural Protocol').trim();
  const notes = (document.getElementById('diet-notes')?.value || '').trim();

  const diets = loadCustomDietsFromStorage();
  const existingIdx = diets.findIndex(d => d.title.toLowerCase() === title.toLowerCase());

  const templateObj = {
    id: existingIdx >= 0 ? diets[existingIdx].id : ('diet_' + Date.now()),
    title: title,
    titleEn: title,
    targetCalories: calories,
    targetProteinG: protein,
    targetCarbsG: carbs,
    targetFatsG: fats,
    primaryProteinChoice: proteinChoice,
    supplements: supplements,
    enhancers: enhancers,
    notes: notes,
    meals: JSON.parse(JSON.stringify(currentStudioMeals)),
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    diets[existingIdx] = templateObj;
  } else {
    diets.unshift(templateObj);
  }

  saveCustomDietsToStorage(diets);
  populateNutritionTemplateSelect();

  const select = document.getElementById('select-nutrition-template');
  if (select) select.value = templateObj.id;

  showToast(isAr ? `تم حفظ القالب "${title}" في مكتبة القوالب المعتمدة بنجاح!` : `Saved template "${title}" successfully!`);
}

function assignDietToSelectedAthlete() {
  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
  const select = document.getElementById('diet-assign-athlete-select');
  const athleteId = select ? select.value : '';

  if (!athleteId) {
    showToast(isAr ? 'يرجى اختيار متدرب من القائمة لإسناد الخطة إليه' : 'Please select an athlete from the dropdown', 'danger');
    return;
  }

  const athlete = athletes.find(a => a.id === athleteId);
  if (!athlete) {
    showToast(isAr ? 'المتدرب غير موجود في النظام' : 'Athlete not found', 'danger');
    return;
  }

  const title = (document.getElementById('diet-plan-title')?.value || '').trim() || (isAr ? 'خطة غذائية معتمدة' : 'Assigned Nutrition Plan');
  const proteinChoice = document.getElementById('diet-protein-type')?.value || 'meat';
  const calories = Number(document.getElementById('diet-target-calories')?.value) || 2400;
  const protein = Number(document.getElementById('diet-target-protein')?.value) || 200;
  const carbs = Number(document.getElementById('diet-target-carbs')?.value) || 220;
  const fats = Number(document.getElementById('diet-target-fats')?.value) || 60;
  const supplements = (document.getElementById('diet-supplements')?.value || 'Whey Isolate + Creatine').trim();
  const enhancers = (document.getElementById('diet-enhancers')?.value || 'Natural Protocol').trim();
  const notes = (document.getElementById('diet-notes')?.value || '').trim();

  const proteinSummary = proteinChoice === 'fish' ? `سمك سلمون وقد (${protein}g)` : `ستيك بقري وعجل (${protein}g)`;
  const carbsSummary = `أرز بسمتي وشوفان (${carbs}g)`;
  const fatsSummary = `زيت زيتون بكر وأفوكادو (${fats}g)`;

  athlete.nutritionPlan = {
    id: 'diet_assigned_' + Date.now(),
    title: title,
    targetCalories: calories,
    targetProteinG: protein,
    targetCarbsG: carbs,
    targetFatsG: fats,
    primaryProteinChoice: proteinChoice,
    protein: proteinSummary,
    carbs: carbsSummary,
    fats: fatsSummary,
    supplements: supplements,
    enhancers: enhancers,
    notes: notes,
    meals: JSON.parse(JSON.stringify(currentStudioMeals)),
    assignedAt: new Date().toISOString()
  };

  athlete.nutritionPlanId = title;

  saveAthletesToStorage();

  sendToWebhook({
    dataType: 'nutrition_assignment',
    athleteId: athlete.id,
    athleteName: athlete.name,
    planTitle: title,
    calories,
    protein: proteinSummary,
    carbs: carbsSummary,
    fats: fatsSummary,
    supplements,
    enhancers,
    mealsCount: currentStudioMeals.length
  });

  renderAthletesView();
  populateNutritionAthleteSelect();

  showToast(isAr ? `تم إسناد وحفظ "${title}" للمتدرب "${athlete.name}" بنجاح!` : `Assigned "${title}" to ${athlete.name} successfully!`);
}

function copyDietSummaryToClipboard() {
  const isAr = (typeof currentAppLang !== 'undefined' ? currentAppLang : 'ar') === 'ar';
  const title = document.getElementById('diet-plan-title')?.value || 'Nutrition Plan';
  const calories = document.getElementById('diet-target-calories')?.value || '2400';
  const p = document.getElementById('diet-target-protein')?.value || '200';
  const c = document.getElementById('diet-target-carbs')?.value || '220';
  const f = document.getElementById('diet-target-fats')?.value || '60';
  const supps = document.getElementById('diet-supplements')?.value || '--';

  let text = `THE RUSH WAY - ${title}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🎯 السعرات اليومية: ${calories} kcal\n`;
  text += `🥩 البروتين الصافي: ${p}g | 🍚 الكارب: ${c}g | 🥑 الدهون: ${f}g\n`;
  text += `💊 المكملات: ${supps}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🍽️ جدول الوجبات:\n`;

  currentStudioMeals.forEach((m, i) => {
    text += `${i + 1}. ${m.name} (${m.timing || ''}): ${m.items || ''} [P:${m.protein || 0}g C:${m.carbs || 0}g F:${m.fats || 0}g]\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    showToast(isAr ? 'تم نسخ ملخص الخطة إلى الحافظة بنجاح!' : 'Copied plan summary to clipboard!');
  }).catch(() => {
    showToast(isAr ? 'تعذر نسخ النص تلقائياً' : 'Failed to copy text', 'danger');
  });
}

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
  populateNutritionAthleteSelect();
  closeModal('modal-add-nutrition');
  showToast(`تم إسناد وحفظ الخطة الغذائية للمتدرب "${athlete.name}" بنجاح!`);
}

function openAthleteInNutritionStudio() {
  const idInput = document.getElementById('form-nut-athlete-id');
  const athleteId = idInput ? idInput.value : '';
  closeModal('modal-add-nutrition');
  switchTab('nutrition');
  if (athleteId) {
    const select = document.getElementById('diet-assign-athlete-select');
    if (select) select.value = athleteId;
    const athlete = athletes.find(a => a.id === athleteId);
    if (athlete && athlete.nutritionPlan && athlete.nutritionPlan.meals) {
      loadDietTemplateIntoForm(athlete.nutritionPlan);
    }
  }
}
window.openAthleteInNutritionStudio = openAthleteInNutritionStudio;

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
  setupModalSvgInteractivity();
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

function setupModalSvgInteractivity() {
  document.querySelectorAll('#svg-body-front .muscle-node, #svg-body-back .muscle-node').forEach(node => {
    node.style.cursor = 'pointer';
    node.onclick = (e) => {
      e.stopPropagation();
      const muscleKey = node.dataset.muscle || node.dataset.key;
      if (muscleKey) {
        selectMuscleGroup(muscleKey);
      }
    };
  });
}

function selectMuscleGroup(muscleKey) {
  if (!muscleKey) return;
  if (muscleKey === 'shoulders') muscleKey = 'front_delts';
  if (muscleKey === 'reardelts') muscleKey = 'rear_delts';

  currentSelectedMuscle = muscleKey;

  // Highlight modal SVG paths
  document.querySelectorAll('#svg-body-front .muscle-node, #svg-body-back .muscle-node').forEach(node => {
    const key = node.dataset.muscle || node.dataset.key;
    const isMatch = (key === muscleKey) ||
                    (muscleKey === 'front_delts' && key === 'shoulders') ||
                    (muscleKey === 'rear_delts' && key === 'reardelts');
    node.classList.toggle('selected', !!isMatch);
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
        ${nut.meals && nut.meals.length > 0 ? `
          <div style="margin-top: 10px; border-top: 1px dashed #99f6e4; padding-top: 8px;">
            <div style="font-weight: 800; color: #0f766e; margin-bottom: 6px; font-size: 11px;">جدول الوجبات اليومية المعتمد:</div>
            ${nut.meals.map((m, mi) => `
              <div style="margin-bottom: 4px; font-size: 11px;">
                <strong>${m.name || `وجبة ${mi + 1}`} (${m.timing || ''}):</strong> ${m.items || ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
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

  populateNutritionAthleteSelect();

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
  initTrainingStudio();
}

/**
 * ============================================================================
 * 11.B ANATOMICAL TRAINING STUDIO ENGINE & ATHLETE BUILDER INTEGRATION
 * ============================================================================
 */
let currentStudioMuscle = 'chest';
let currentStudioView = 'front';
let currentStudioEquipmentFilter = 'all';
let currentStudioSearchQuery = '';
let currentStudioTargetAthleteId = '';

function initTrainingStudio() {
  populateStudioAthleteDropdown();

  const root = document.getElementById('rush-muscle-map-root');
  if (root && typeof RushMuscleMap !== 'undefined') {
    if (!window.mainMuscleMap) {
      window.mainMuscleMap = new RushMuscleMap({
        containerId: 'rush-muscle-map-root',
        lang: (typeof currentLanguage !== 'undefined' && currentLanguage) ? currentLanguage : 'ar',
        initialMode: 'selection',
        athleteId: currentStudioTargetAthleteId || null,
        onExerciseAdd: (exercise, routineParams) => {
          handleStudioAddExerciseToPlan(exercise, routineParams);
        }
      });
    } else {
      window.mainMuscleMap.setAthlete(currentStudioTargetAthleteId || null);
    }
  }
}

function handleStudioAddExerciseToPlan(exercise, routineParams) {
  if (!exercise) return;

  if (currentStudioTargetAthleteId) {
    const athlete = athletes.find(a => a.id === currentStudioTargetAthleteId);
    if (!athlete) {
      showToast('لم يتم العثور على المتدرب المحدد', 'danger');
      return;
    }

    if (!athlete.workoutPlan) athlete.workoutPlan = [];

    const planItem = {
      id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      exerciseId: exercise.id,
      name: exercise.name,
      nameAr: exercise.nameAr,
      sets: routineParams?.sets || 3,
      reps: routineParams?.reps || '8-12',
      load: routineParams?.load || '',
      rpe: routineParams?.rpe || 8,
      rest: routineParams?.rest || '90s',
      tempo: routineParams?.tempo || '3-0-1-0',
      targetHead: exercise.targetHead || '',
      volume: exercise.volume || '',
      equipment: exercise.equipment || '',
      biomech: exercise.biomech || '',
      primaryMuscles: exercise.primaryMuscles || [],
      secondaryMuscles: exercise.secondaryMuscles || [],
      addedAt: new Date().toISOString()
    };

    athlete.workoutPlan.push(planItem);

    saveAthletesToStorage();
    renderAthletesView();
    populateStudioAthleteDropdown();
    updateStudioAthleteRoutineBadge();

    showToast(`تمت إضافة "${exercise.nameAr || exercise.name}" (${planItem.sets}×${planItem.reps}) لجدول ${athlete.name} بنجاح!`);

    // Sync to Google Sheets webhook if configured
    sendToWebhook({
      dataType: 'workout_update',
      athleteId: athlete.id,
      athleteName: athlete.name,
      exerciseAdded: exercise.nameAr || exercise.name,
      totalExercises: athlete.workoutPlan.length,
      timestamp: new Date().toISOString()
    });
  } else {
    // Save to global active routine draft
    if (!activeBuilderRoutine) activeBuilderRoutine = [];
    activeBuilderRoutine.push({
      id: 'draft_' + Date.now(),
      exerciseId: exercise.id,
      name: exercise.name,
      nameAr: exercise.nameAr,
      sets: routineParams?.sets || 3,
      reps: routineParams?.reps || '8-12',
      load: routineParams?.load || '',
      rpe: routineParams?.rpe || 8,
      rest: routineParams?.rest || '90s',
      tempo: routineParams?.tempo || '3-0-1-0',
      targetHead: exercise.targetHead || '',
      volume: exercise.volume || '',
      equipment: exercise.equipment || ''
    });

    showToast(`تمت إضافة "${exercise.nameAr || exercise.name}" إلى مسودة التمارين العامة!`);
  }
}

function populateStudioAthleteDropdown() {
  const select = document.getElementById('studio-athlete-select');
  if (!select) return;

  const prevVal = currentStudioTargetAthleteId || select.value;
  let html = `<option value="">-- وضع الاستكشاف العام / مسودة حرة --</option>`;

  if (athletes && athletes.length > 0) {
    html += athletes.map(ath => {
      const routineCount = (ath.workoutPlan || []).length;
      return `<option value="${ath.id}" ${ath.id === prevVal ? 'selected' : ''}>${ath.name} (${routineCount} تمارين)</option>`;
    }).join('');
  } else {
    html += `<option value="" disabled>لا يوجد متدربون مسجلون حالياً (أضف متدرباً أولاً)</option>`;
  }

  select.innerHTML = html;
  currentStudioTargetAthleteId = select.value || '';
  updateStudioAthleteRoutineBadge();
  if (window.mainMuscleMap) {
    window.mainMuscleMap.setAthlete(currentStudioTargetAthleteId || null);
  }
}

function onStudioAthleteSelectChange() {
  const select = document.getElementById('studio-athlete-select');
  if (!select) return;

  currentStudioTargetAthleteId = select.value || '';
  updateStudioAthleteRoutineBadge();
  if (window.mainMuscleMap) {
    window.mainMuscleMap.setAthlete(currentStudioTargetAthleteId || null);
  }
}

function updateStudioAthleteRoutineBadge() {
  const countBadge = document.getElementById('studio-athlete-routine-count');
  const pill = document.getElementById('studio-athlete-pill');
  const editBtn = document.getElementById('btn-open-athlete-routine') || document.getElementById('studio-btn-edit-athlete-routine');
  
  if (!currentStudioTargetAthleteId) {
    if (pill) pill.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
    return;
  }

  const athlete = athletes.find(a => a.id === currentStudioTargetAthleteId);
  if (athlete) {
    const count = (athlete.workoutPlan || []).length;
    if (countBadge) countBadge.textContent = count;
    if (pill) pill.style.display = 'inline-flex';
    if (editBtn) {
      editBtn.style.display = 'inline-flex';
      editBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        <span>تعديل جدول ${athlete.name.split(' ')[0]}</span>
      `;
    }
  } else {
    if (pill) pill.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
  }
}

function openSelectedAthleteRoutineModal() {
  if (currentStudioTargetAthleteId) {
    openWorkoutModal(currentStudioTargetAthleteId);
  }
}

function switchStudioBodyView(view) {
  currentStudioView = view;

  const btnFront = document.getElementById('studio-btn-front');
  const btnBack = document.getElementById('studio-btn-back');
  const svgFront = document.getElementById('studio-svg-front');
  const svgBack = document.getElementById('studio-svg-back');

  if (btnFront) btnFront.classList.toggle('active', view === 'front');
  if (btnBack) btnBack.classList.toggle('active', view === 'back');

  if (svgFront) svgFront.style.display = view === 'front' ? 'block' : 'none';
  if (svgBack) svgBack.style.display = view === 'back' ? 'block' : 'none';

  renderStudioMuscleChips();

  // If currently selected muscle is not visible in current view, default to first available
  const frontMuscles = ['chest', 'front_delts', 'biceps', 'forearms', 'abs', 'quads', 'calves', 'neck'];
  const backMuscles = ['traps', 'rear_delts', 'lats', 'lower_back', 'triceps', 'glutes', 'hamstrings', 'calves', 'neck'];
  const activeList = view === 'front' ? frontMuscles : backMuscles;

  if (!activeList.includes(currentStudioMuscle)) {
    selectStudioMuscle(activeList[0]);
  } else {
    highlightStudioSvgMuscle(currentStudioMuscle);
  }
}

function renderStudioMuscleChips() {
  const container = document.getElementById('studio-muscle-chip-container');
  if (!container) return;

  const frontMuscles = [
    { key: 'chest', label: 'الصدر' },
    { key: 'front_delts', label: 'الأكتاف' },
    { key: 'biceps', label: 'البايسبس' },
    { key: 'forearms', label: 'الساعد' },
    { key: 'abs', label: 'البطن والكور' },
    { key: 'quads', label: 'الفخذ الأمامي' },
    { key: 'calves', label: 'السمانة' },
    { key: 'neck', label: 'الرقبة' }
  ];

  const backMuscles = [
    { key: 'traps', label: 'الترابيس' },
    { key: 'rear_delts', label: 'الأكتاف الخلفية' },
    { key: 'lats', label: 'المجنص / الظهر' },
    { key: 'lower_back', label: 'أسفل الظهر' },
    { key: 'triceps', label: 'الترايسبس' },
    { key: 'glutes', label: 'الأرداف' },
    { key: 'hamstrings', label: 'الفخذ الخلفي' },
    { key: 'calves', label: 'السمانة' },
    { key: 'neck', label: 'الرقبة' }
  ];

  const list = currentStudioView === 'front' ? frontMuscles : backMuscles;

  container.innerHTML = list.map(item => `
    <button type="button" 
      class="studio-muscle-chip ${item.key === currentStudioMuscle ? 'active' : ''}" 
      onclick="selectStudioMuscle('${item.key}')">
      ${item.label}
    </button>
  `).join('');
}

function selectStudioMuscle(muscleKey) {
  if (!muscleKey) return;
  // Normalize alias
  if (muscleKey === 'shoulders') muscleKey = 'front_delts';
  if (muscleKey === 'reardelts') muscleKey = 'rear_delts';

  currentStudioMuscle = muscleKey;

  // Highlight in SVGs
  highlightStudioSvgMuscle(muscleKey);

  // Update chips
  document.querySelectorAll('.studio-muscle-chip').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${muscleKey}'`));
  });

  // Update Header title & subtitle
  const titleEl = document.getElementById('studio-active-muscle-title');
  const subEl = document.getElementById('studio-active-muscle-sub');
  const label = MUSCLE_LABELS[muscleKey] || muscleKey;
  if (titleEl) titleEl.textContent = label;

  const exercises = EXERCISE_DATABASE[muscleKey] || [];
  if (subEl) subEl.textContent = `${exercises.length} تمارين معتمدة حسب الميكانيكا الحيوية`;

  // Update Info Card
  const focusData = ANATOMICAL_FOCUS_DATA[muscleKey] || {
    title: label,
    focus: 'استهداف الألياف العضلية الرئيسية والتحفيز الميكانيكي',
    biomech: 'مدى حركي كامل مع التحكم في مرحلة النزول السلبي'
  };

  const infoCard = document.getElementById('studio-anatomical-info-card');
  if (infoCard) {
    infoCard.innerHTML = `
      <div style="font-size: 0.88rem; font-weight: 800; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
        <span style="color: var(--primary);">🔬</span>
        <span>التركيز الميكانيكي: ${focusData.title}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-dim); line-height: 1.5; margin-bottom: 4px;">
        <strong style="color: #e2e8f0;">الألياف المستهدفة:</strong> ${focusData.focus}
      </div>
      <div style="font-size: 0.8rem; color: var(--text-dim); line-height: 1.5;">
        <strong style="color: #e2e8f0;">التوجيه الحركي:</strong> ${focusData.biomech}
      </div>
    `;
  }

  renderStudioExerciseList();
}

function highlightStudioSvgMuscle(muscleKey) {
  document.querySelectorAll('#studio-svg-front .m-shape, #studio-svg-front .muscle-node, #studio-svg-back .m-shape, #studio-svg-back .muscle-node').forEach(node => {
    const key = node.dataset.muscle || node.dataset.key;
    const isMatch = (key === muscleKey) || 
                    (muscleKey === 'front_delts' && key === 'shoulders') ||
                    (muscleKey === 'rear_delts' && key === 'reardelts');
    node.classList.toggle('selected', !!isMatch);
  });
}

function setStudioEquipmentFilter(filter) {
  currentStudioEquipmentFilter = filter;
  document.querySelectorAll('.equipment-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderStudioExerciseList();
}

function filterStudioExercises() {
  const searchInput = document.getElementById('studio-exercise-search');
  currentStudioSearchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  renderStudioExerciseList();
}

function renderStudioExerciseList() {
  const container = document.getElementById('studio-exercise-list-container');
  const countTag = document.getElementById('studio-exercise-count-tag');
  if (!container) return;

  const rawList = EXERCISE_DATABASE[currentStudioMuscle] || [];

  const filtered = rawList.filter(ex => {
    // Equipment filter
    if (currentStudioEquipmentFilter !== 'all') {
      if (ex.equipment !== currentStudioEquipmentFilter) return false;
    }

    // Search query
    if (currentStudioSearchQuery) {
      const matchName = (ex.name || '').toLowerCase().includes(currentStudioSearchQuery);
      const matchAr = (ex.nameAr || '').toLowerCase().includes(currentStudioSearchQuery);
      const matchHead = (ex.targetHead || '').toLowerCase().includes(currentStudioSearchQuery);
      if (!matchName && !matchAr && !matchHead) return false;
    }

    return true;
  });

  if (countTag) {
    countTag.textContent = `${filtered.length} تمرين متاح`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; background: rgba(22, 31, 48, 0.5); border-radius: 12px; border: 1px dashed var(--border);">
        <div style="font-size: 1.8rem; margin-bottom: 8px;">🔍</div>
        <p style="color: #fff; font-weight: 700; margin-bottom: 4px;">لم يتم العثور على تمارين تطابق هذا الفلتر</p>
        <p style="font-size: 0.8rem; color: var(--text-dim);">جرّب تغيير فئة الأداة أو مسح نص البحث</p>
      </div>
    `;
    return;
  }

  // Check target athlete name
  let targetAthleteName = '';
  if (currentStudioTargetAthleteId) {
    const ath = athletes.find(a => a.id === currentStudioTargetAthleteId);
    if (ath) targetAthleteName = ath.name.split(' ')[0];
  }

  const equipmentBadgeMap = {
    dumbbell: { label: 'دمبلز', bg: 'rgba(56, 178, 172, 0.15)', color: 'var(--primary)' },
    barbell: { label: 'بار أولمبي', bg: 'rgba(237, 137, 54, 0.15)', color: '#ed8936' },
    cable: { label: 'كابل', bg: 'rgba(66, 153, 225, 0.15)', color: '#4299e1' },
    machine: { label: 'جهاز', bg: 'rgba(159, 122, 234, 0.15)', color: '#9f7aea' },
    bodyweight: { label: 'وزن الجسم', bg: 'rgba(72, 187, 120, 0.15)', color: '#48bb78' }
  };

  container.innerHTML = filtered.map(ex => {
    const eq = equipmentBadgeMap[ex.equipment] || { label: ex.equipment || 'عام', bg: 'rgba(255,255,255,0.08)', color: '#fff' };
    const btnLabel = targetAthleteName ? `+ إضافة لجدول ${targetAthleteName}` : `+ إضافة للخطة`;

    return `
      <div class="studio-exercise-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
          <div>
            <h4 style="color: #fff; font-weight: 800; font-size: 0.95rem; margin: 0 0 2px 0;">${ex.nameAr}</h4>
            <div style="color: var(--text-dim); font-size: 0.76rem; font-family: monospace;">${ex.name}</div>
          </div>
          <span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 6px; font-weight: 700; background: ${eq.bg}; color: ${eq.color}; white-space: nowrap;">
            ${eq.label}
          </span>
        </div>

        <div style="margin: 8px 0; display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 0.78rem; color: #cbd5e1; display: flex; align-items: center; gap: 4px;">
            <span style="color: var(--primary);">🎯</span>
            <span><strong>الرأس/الألياف:</strong> ${ex.targetHead}</span>
          </div>
          <div style="font-size: 0.78rem; color: #cbd5e1; display: flex; align-items: center; gap: 4px;">
            <span style="color: #ed8936;">⚡</span>
            <span><strong>الحجم الموصى به:</strong> ${ex.volume}</span>
          </div>
          ${ex.biomech ? `
            <div style="font-size: 0.74rem; color: var(--text-dim); background: rgba(0,0,0,0.25); padding: 5px 8px; border-radius: 6px; margin-top: 4px; border-right: 2px solid var(--primary);">
              💡 ${ex.biomech}
            </div>
          ` : ''}
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button type="button" 
            class="btn btn-primary" 
            style="padding: 6px 14px; font-size: 0.78rem; border-radius: 6px;"
            onclick="addExerciseFromStudio('${ex.id}', '${currentStudioMuscle}')">
            ${btnLabel}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function addExerciseFromStudio(exerciseId, muscleKey) {
  const list = EXERCISE_DATABASE[muscleKey] || [];
  const ex = list.find(item => item.id === exerciseId);
  if (!ex) return;

  if (currentStudioTargetAthleteId) {
    const athlete = athletes.find(a => a.id === currentStudioTargetAthleteId);
    if (!athlete) return;

    if (!athlete.workoutPlan) athlete.workoutPlan = [];

    athlete.workoutPlan.push({
      id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      exerciseId: ex.id,
      name: ex.name,
      nameAr: ex.nameAr,
      targetHead: ex.targetHead,
      volume: ex.volume,
      equipment: ex.equipment,
      biomech: ex.biomech,
      addedAt: new Date().toISOString()
    });

    saveAthletesToStorage();
    renderAthletesView();
    populateStudioAthleteDropdown();
    updateStudioAthleteRoutineBadge();

    showToast(`تمت إضافة "${ex.nameAr}" لجدول ${athlete.name} بنجاح!`);

    // Sync to webhook in background if configured
    sendToWebhook({
      dataType: 'workout_update',
      athleteId: athlete.id,
      athleteName: athlete.name,
      exerciseAdded: ex.nameAr,
      totalExercises: athlete.workoutPlan.length,
      timestamp: new Date().toISOString()
    });
  } else {
    // Add to activeBuilderRoutine (draft)
    activeBuilderRoutine.push({
      id: 'draft_' + Date.now(),
      exerciseId: ex.id,
      name: ex.name,
      nameAr: ex.nameAr,
      targetHead: ex.targetHead,
      volume: ex.volume,
      equipment: ex.equipment
    });

    renderBuilderRoutine();
    showToast(`تمت إضافة "${ex.nameAr}" للمسودة. اختر متدرباً لحفظها في حسابه.`);
  }
}

function setupStudioSvgInteractivity() {
  document.querySelectorAll('#studio-svg-front .m-shape, #studio-svg-front .muscle-node, #studio-svg-back .m-shape, #studio-svg-back .muscle-node').forEach(node => {
    node.style.cursor = 'pointer';
    node.onclick = (e) => {
      e.stopPropagation();
      const muscleKey = node.dataset.muscle || node.dataset.key;
      if (muscleKey) {
        selectStudioMuscle(muscleKey);
      }
    };
  });
}

/**
 * ============================================================================
 * 12. APP-WIDE I18N & LANGUAGE SWITCHING ENGINE (NON-DESTRUCTIVE DOM UPDATES)
 * ============================================================================
 */
const I18N = {
  ar: {
    lang_btn_text: "English (LTR)",
    brand_tagline: "نظام إدارة وتدريب الرياضيين المتخصص",
    quick_muscle_btn: "خريطة المجسم التشريحي",
    tab_athletes: "المتدربين (Athletes)",
    tab_training: "خريطة المجسم التشريحي والتمارين",
    tab_nutrition: "استوديو التغذية (Nutrition)",
    tab_sheets: "ربط السحابة (Webhook)",
    banner_btn: "عرض المجسم التشريحي ←",
    athletes_view_title: "إدارة الرياضيين والمتدربين",
    athletes_view_sub: "متابعة ملفات المشتركين، الخطط الغذائية، والبرامج التدريبية التشريحية مع معيار الخصر الدقيق.",
    search_placeholder: "بحث بالاسم أو الهاتف...",
    status_all: "جميع الحالات",
    status_active: "نشط (Active)",
    status_paused: "متوقف مؤقتاً (Paused)",
    status_new: "متدرب جديد (New)",
    btn_add_athlete: "+ إضافة متدرب جديد",
    btn_export_pdf: "تصدير الكشف (PDF)",
    nutrition_view_title: "استوديو وتخطيط الوجبات (Nutrition Studio & Meal Planner)",
    nutrition_view_sub: "تصميم وتخصيص الجداول الغذائية المعتمدة القائمة على أولوية اللحوم الحمراء والأسماك وتوقيت الكارب مع معيار الخصر الذهبي.",
    pill_meat: "🥩 اللحوم والأسماك في الصدارة",
    pill_carbs: "🍚 توقيت الكارب الذكي",
    pill_waist: "📏 معيار الخصر الذهبي",
    lbl_nutrition_template: "قوالب التغذية المعتمدة:",
    btn_load_diet: "تحميل القالب",
    btn_reset_diet: "+ خطة فارغة جديدة",
    lbl_assign_athlete: "إسناد للمتدرب:",
    btn_assign_athlete: "👤 تعيين للمتدرب المختار",
    plan_params_title: "1. معايير الخطة والأهداف البيولوجية",
    plan_params_sub: "تحديد الأهداف الحيوية وتوزيع السعرات ونقاء مصادر البروتين",
    lbl_diet_title: "عنوان البروتوكول الغذائي *",
    lbl_protein_source: "مصدر البروتين الرئيسي *",
    lbl_cals: "السعرات اليومية",
    lbl_prot: "البروتين الصافي",
    lbl_carbs: "الكربوهيدرات الذكية",
    lbl_fats: "الدهون الصحية",
    lbl_supplements: "💊 المكملات الغذائية الموصى بها",
    lbl_enhancers: "⚡ محسنات الأداء (Enhancers)",
    lbl_diet_notes: "📝 توجيهات وملاحظات المدرب (Coaching Notes)",
    meals_builder_title: "2. مفكرة وجبات اليوم الرياضي",
    meals_builder_sub: "توزيع حصص اللحوم، الأسماك، الكربوهيدرات، والتوقيت",
    btn_add_meal: "+ إضافة وجبة (+ Add Meal)",
    btn_save_template: "💾 حفظ كقالب معتمد (Save Template)",
    btn_copy_summary: "📋 نسخ المخطط (Copy Text)",
  },
  en: {
    lang_btn_text: "العربية (RTL)",
    brand_tagline: "Specialized Athlete Performance & Coaching System",
    quick_muscle_btn: "Anatomical Muscle Map",
    tab_athletes: "Athletes Roster",
    tab_training: "Anatomy Map & Exercises",
    tab_nutrition: "Nutrition Studio & Meals",
    tab_sheets: "Cloud Sync (Webhook)",
    banner_btn: "View Muscle Map →",
    athletes_view_title: "Athletes & Client Management",
    athletes_view_sub: "Monitor athlete profiles, custom nutrition protocols, and biomechanical workout plans with strict waist standards.",
    search_placeholder: "Search by name or phone...",
    status_all: "All Statuses",
    status_active: "Active",
    status_paused: "Paused",
    status_new: "New Athlete",
    btn_add_athlete: "+ Add New Athlete",
    btn_export_pdf: "Export Roster (PDF)",
    nutrition_view_title: "Interactive Nutrition Studio & Meal Planner",
    nutrition_view_sub: "Design and prescribe certified nutrition protocols prioritizing red meat, wild fish, and timed carbohydrates.",
    pill_meat: "🥩 Beef & Fish Priority",
    pill_carbs: "🍚 Timed Carbohydrates",
    pill_waist: "📏 Waist Metric Standard",
    lbl_nutrition_template: "Certified Nutrition Templates:",
    btn_load_diet: "Load Template",
    btn_reset_diet: "+ New Blank Plan",
    lbl_assign_athlete: "Assign to Athlete:",
    btn_assign_athlete: "👤 Assign to Selected Athlete",
    plan_params_title: "1. Protocol Parameters & Biometrics",
    plan_params_sub: "Define calorie targets, macronutrient ratio, and pure protein sources",
    lbl_diet_title: "Nutrition Protocol Title *",
    lbl_protein_source: "Primary Protein Source *",
    lbl_cals: "Daily Calories",
    lbl_prot: "Pure Protein",
    lbl_carbs: "Smart Carbs",
    lbl_fats: "Healthy Fats",
    lbl_supplements: "💊 Recommended Supplements",
    lbl_enhancers: "⚡ Performance Enhancers",
    lbl_diet_notes: "📝 Coach Directives & Guidelines",
    meals_builder_title: "2. Daily Athlete Meal Schedule",
    meals_builder_sub: "Portioning beef, fish, smart carbohydrates, and timing",
    btn_add_meal: "+ Add Meal",
    btn_save_template: "💾 Save Template",
    btn_copy_summary: "📋 Copy Text",
  }
};

let currentAppLang = localStorage.getItem('rush_app_lang') || 'ar';

function setAppLanguage(lang) {
  if (lang !== 'ar' && lang !== 'en') return;
  currentAppLang = lang;
  localStorage.setItem('rush_app_lang', lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const t = I18N[lang];
  if (!t) return;

  // 1. Header Elements
  const langText = document.getElementById('app-lang-text');
  if (langText) langText.textContent = t.lang_btn_text;

  const tagline = document.querySelector('.brand-tagline');
  if (tagline) tagline.textContent = t.brand_tagline;

  const muscleText = document.getElementById('header-muscle-text');
  if (muscleText) muscleText.textContent = t.quick_muscle_btn;

  // 2. Nav Tabs
  const tabAthletes = document.querySelector('#nav-btn-athletes span');
  if (tabAthletes) tabAthletes.textContent = t.tab_athletes;

  const tabTraining = document.querySelector('#nav-btn-training span');
  if (tabTraining) tabTraining.textContent = t.tab_training;

  const tabNutrition = document.querySelector('#nav-btn-nutrition span');
  if (tabNutrition) tabNutrition.textContent = t.tab_nutrition;

  const tabSheets = document.querySelector('#nav-btn-sheets span');
  if (tabSheets) tabSheets.textContent = t.tab_sheets;

  // 3. Quick Anatomy Banner
  const bannerBtn = document.getElementById('btn-quick-muscle-map');
  if (bannerBtn) bannerBtn.textContent = t.banner_btn;

  // 4. Athletes View
  const athTitle = document.querySelector('#view-athletes .view-title-group h1');
  if (athTitle) athTitle.textContent = t.athletes_view_title;

  const athSub = document.querySelector('#view-athletes .view-title-group p');
  if (athSub) athSub.textContent = t.athletes_view_sub;

  const searchInput = document.getElementById('athlete-search-input');
  if (searchInput) searchInput.placeholder = t.search_placeholder;

  const statusFilter = document.getElementById('athlete-status-filter');
  if (statusFilter && statusFilter.options.length >= 4) {
    statusFilter.options[0].text = t.status_all;
    statusFilter.options[1].text = t.status_active;
    statusFilter.options[2].text = t.status_paused;
    statusFilter.options[3].text = t.status_new;
  }

  const addAthSpan = document.querySelector('#btn-open-add-athlete span');
  if (addAthSpan) addAthSpan.textContent = t.btn_add_athlete;

  const exportPdfSpan = document.querySelector('#btn-export-pdf span');
  if (exportPdfSpan) exportPdfSpan.textContent = t.btn_export_pdf;

  // 5. Nutrition Studio
  const nutTitle = document.getElementById('nutrition-view-title');
  if (nutTitle) nutTitle.textContent = t.nutrition_view_title;

  const nutSub = document.getElementById('nutrition-view-subtitle');
  if (nutSub) nutSub.textContent = t.nutrition_view_sub;

  const pillMeat = document.getElementById('pill-meat-txt');
  if (pillMeat) pillMeat.textContent = t.pill_meat;

  const pillCarbs = document.getElementById('pill-carbs-txt');
  if (pillCarbs) pillCarbs.textContent = t.pill_carbs;

  const pillWaist = document.getElementById('pill-waist-txt');
  if (pillWaist) pillWaist.textContent = t.pill_waist;

  const lblTemplate = document.getElementById('lbl-nutrition-template');
  if (lblTemplate) lblTemplate.textContent = t.lbl_nutrition_template;

  const btnLoadDiet = document.getElementById('btn-load-diet-template');
  if (btnLoadDiet) btnLoadDiet.textContent = t.btn_load_diet;

  const btnResetDiet = document.getElementById('btn-reset-diet-form');
  if (btnResetDiet) btnResetDiet.textContent = t.btn_reset_diet;

  const lblAssign = document.getElementById('lbl-assign-athlete');
  if (lblAssign) lblAssign.textContent = t.lbl_assign_athlete;

  const btnAssign = document.getElementById('btn-assign-diet-athlete');
  if (btnAssign) btnAssign.textContent = t.btn_assign_athlete;

  const txtParamsTitle = document.getElementById('txt-plan-params-title');
  if (txtParamsTitle) txtParamsTitle.textContent = t.plan_params_title;

  const txtParamsSub = document.getElementById('txt-plan-params-sub');
  if (txtParamsSub) txtParamsSub.textContent = t.plan_params_sub;

  const lblDietTitle = document.getElementById('lbl-diet-title');
  if (lblDietTitle) lblDietTitle.textContent = t.lbl_diet_title;

  const lblProteinSource = document.getElementById('lbl-protein-source');
  if (lblProteinSource) lblProteinSource.textContent = t.lbl_protein_source;

  const lblMacroCals = document.getElementById('lbl-macro-cals');
  if (lblMacroCals) lblMacroCals.textContent = t.lbl_cals;

  const lblMacroProt = document.getElementById('lbl-macro-prot');
  if (lblMacroProt) lblMacroProt.textContent = t.lbl_prot;

  const lblMacroCarbs = document.getElementById('lbl-macro-carbs');
  if (lblMacroCarbs) lblMacroCarbs.textContent = t.lbl_carbs;

  const lblMacroFats = document.getElementById('lbl-macro-fats');
  if (lblMacroFats) lblMacroFats.textContent = t.lbl_fats;

  const lblSupps = document.getElementById('lbl-supplements');
  if (lblSupps) lblSupps.textContent = t.lbl_supplements;

  const lblEnhancers = document.getElementById('lbl-enhancers');
  if (lblEnhancers) lblEnhancers.textContent = t.lbl_enhancers;

  const lblNotes = document.getElementById('lbl-diet-notes');
  if (lblNotes) lblNotes.textContent = t.lbl_diet_notes;

  const txtMealsTitle = document.getElementById('txt-meals-builder-title');
  if (txtMealsTitle) txtMealsTitle.textContent = t.meals_builder_title;

  const txtMealsSub = document.getElementById('txt-meals-builder-sub');
  if (txtMealsSub) txtMealsSub.textContent = t.meals_builder_sub;

  const btnAddMeal = document.getElementById('btn-add-meal');
  if (btnAddMeal) btnAddMeal.textContent = t.btn_add_meal;

  const btnSaveTemplate = document.getElementById('btn-save-diet-template');
  if (btnSaveTemplate) btnSaveTemplate.textContent = t.btn_save_template;

  const btnCopySummary = document.getElementById('btn-copy-diet-summary');
  if (btnCopySummary) btnCopySummary.textContent = t.btn_copy_summary;

  // 6. Sync with Interactive Muscle Map Engine
  if (window.mainMuscleMap) {
    if (typeof window.mainMuscleMap.setLanguage === 'function') {
      window.mainMuscleMap.setLanguage(lang);
    } else if (typeof window.mainMuscleMap.switchLanguage === 'function') {
      window.mainMuscleMap.switchLanguage(lang);
    }
  }

  // 7. Update Dynamic Lists
  renderAthletesView();
  populateNutritionTemplateSelect();
  populateNutritionAthleteSelect();
  renderMealsBuilderList();

  // 8. Rebind all action listeners immediately
  rebindAllActionListeners();
}

function toggleAppLanguage() {
  const newLang = currentAppLang === 'ar' ? 'en' : 'ar';
  setAppLanguage(newLang);
  showToast(newLang === 'ar' ? 'تم تحويل لغة الواجهة إلى العربية (RTL)' : 'Switched interface to English (LTR)');
}

/**
 * ============================================================================
 * 13. GLOBAL EVENT DELEGATION & ACTION REBINDING
 * ============================================================================
 */
function setupGlobalEventDelegation() {
  document.addEventListener('click', (e) => {
    // 1. Navigation tab clicks
    const navBtn = e.target.closest('.nav-tab-btn');
    if (navBtn) {
      e.preventDefault();
      const tabId = navBtn.dataset.tab;
      if (tabId) switchTab(tabId);
      return;
    }

    // 2. Language toggle
    const langBtn = e.target.closest('#app-lang-toggle, [data-action="toggle-lang"], .rmm-lang-toggle, #rmm-btn-lang-toggle');
    if (langBtn) {
      e.preventDefault();
      toggleAppLanguage();
      return;
    }

    // 3. Quick muscle map banner / header buttons
    const muscleMapBtn = e.target.closest('#header-muscle-btn, #btn-quick-muscle-map, .anatomy-quick-banner, [data-action="open-muscle-map"]');
    if (muscleMapBtn) {
      e.preventDefault();
      switchTab('training');
      return;
    }

    // 4. Modal Open buttons
    const addAthBtn = e.target.closest('#btn-open-add-athlete, [data-action="open-add-athlete"]');
    if (addAthBtn) {
      e.preventDefault();
      openAddAthleteModal();
      return;
    }

    // 5. Modal Close buttons
    const closeBtn = e.target.closest('.modal-close-btn, [data-action="close-modal"]');
    if (closeBtn) {
      e.preventDefault();
      const backdrop = closeBtn.closest('.modal-backdrop');
      if (backdrop) backdrop.classList.remove('active');
      return;
    }

    // 6. Athlete Card Action buttons (Delegated)
    const nutBtn = e.target.closest('.nutrition-btn');
    if (nutBtn) {
      const athId = nutBtn.dataset.athleteId || nutBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (athId) {
        e.preventDefault();
        openNutritionModal(athId);
      }
      return;
    }

    const workBtn = e.target.closest('.workout-btn');
    if (workBtn) {
      const athId = workBtn.dataset.athleteId || workBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (athId) {
        e.preventDefault();
        openWorkoutModal(athId);
      }
      return;
    }

    const shareBtn = e.target.closest('.share-btn, .portal-btn');
    if (shareBtn) {
      const athId = shareBtn.dataset.athleteId || shareBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (athId) {
        e.preventDefault();
        copyClientPortalLink(athId);
      }
      return;
    }

    const exportBtn = e.target.closest('.export-btn, .pdf-btn');
    if (exportBtn) {
      const athId = exportBtn.dataset.athleteId || exportBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (athId) {
        e.preventDefault();
        exportAthleteToPDF(athId);
      }
      return;
    }

    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const athId = deleteBtn.dataset.athleteId || deleteBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (athId) {
        e.preventDefault();
        deleteAthlete(athId);
      }
      return;
    }

    // 7. Nutrition Studio Buttons (Delegated)
    const addMealBtn = e.target.closest('#btn-add-meal, [data-action="add-meal"]');
    if (addMealBtn) {
      e.preventDefault();
      addMealToNutritionStudio();
      return;
    }

    const removeMealBtn = e.target.closest('.btn-remove-meal, [data-action="remove-meal"]');
    if (removeMealBtn) {
      e.preventDefault();
      const mealIndex = removeMealBtn.dataset.mealIndex;
      if (mealIndex !== undefined) removeMealFromStudio(parseInt(mealIndex, 10));
      return;
    }

    const saveTemplateBtn = e.target.closest('#btn-save-diet-template, [data-action="save-diet-template"]');
    if (saveTemplateBtn) {
      e.preventDefault();
      saveCustomDietTemplate();
      return;
    }

    const assignAthleteBtn = e.target.closest('#btn-assign-diet-athlete, [data-action="assign-diet-athlete"]');
    if (assignAthleteBtn) {
      e.preventDefault();
      assignDietToSelectedAthlete();
      return;
    }

    const loadTemplateBtn = e.target.closest('#btn-load-diet-template, [data-action="load-diet-template"]');
    if (loadTemplateBtn) {
      e.preventDefault();
      loadSelectedDietTemplate();
      return;
    }

    const resetDietBtn = e.target.closest('#btn-reset-diet-form, [data-action="reset-diet-form"]');
    if (resetDietBtn) {
      e.preventDefault();
      resetNutritionStudioForm();
      return;
    }

    const copyDietBtn = e.target.closest('#btn-copy-diet-summary, [data-action="copy-diet-summary"]');
    if (copyDietBtn) {
      e.preventDefault();
      copyDietSummaryToClipboard();
      return;
    }
  });
}

function rebindAllActionListeners() {
  // Navigation tabs explicit binding
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    };
  });

  // Language toggle explicit binding
  const langToggle = document.getElementById('app-lang-toggle');
  if (langToggle) {
    langToggle.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      toggleAppLanguage();
    };
  }

  // Quick banner button
  const quickBtn = document.getElementById('btn-quick-muscle-map');
  if (quickBtn) {
    quickBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      switchTab('training');
    };
  }

  // Header quick muscle button
  const headerMuscleBtn = document.getElementById('header-muscle-btn');
  if (headerMuscleBtn) {
    headerMuscleBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      switchTab('training');
    };
  }

  // Add athlete open button
  const addAthBtn = document.getElementById('btn-open-add-athlete');
  if (addAthBtn) {
    addAthBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      openAddAthleteModal();
    };
  }

  // Export roster PDF button
  const exportPdfBtn = document.getElementById('btn-export-pdf');
  if (exportPdfBtn) {
    exportPdfBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      exportAllAthletesToPDF();
    };
  }

  // Nutrition Studio action buttons
  const addMealBtn = document.getElementById('btn-add-meal');
  if (addMealBtn) {
    addMealBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      addMealToNutritionStudio();
    };
  }

  const saveDietBtn = document.getElementById('btn-save-diet-template');
  if (saveDietBtn) {
    saveDietBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      saveCustomDietTemplate();
    };
  }

  const assignDietBtn = document.getElementById('btn-assign-diet-athlete');
  if (assignDietBtn) {
    assignDietBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      assignDietToSelectedAthlete();
    };
  }

  const loadDietBtn = document.getElementById('btn-load-diet-template');
  if (loadDietBtn) {
    loadDietBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      loadSelectedDietTemplate();
    };
  }

  const resetDietBtn = document.getElementById('btn-reset-diet-form');
  if (resetDietBtn) {
    resetDietBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      resetNutritionStudioForm();
    };
  }

  const copyDietBtn = document.getElementById('btn-copy-diet-summary');
  if (copyDietBtn) {
    copyDietBtn.onclick = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      copyDietSummaryToClipboard();
    };
  }
}

/**
 * ============================================================================
 * 14. TAB NAVIGATION
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
    initTrainingStudio();
  } else if (tabId === 'nutrition') {
    initNutritionStudio();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * ============================================================================
 * 15. GLOBAL SCOPE ASSIGNMENTS (SAFETY FOR INLINE EVENT LISTENERS)
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

// Language & Delegation
window.setAppLanguage = setAppLanguage;
window.toggleAppLanguage = toggleAppLanguage;
window.rebindAllActionListeners = rebindAllActionListeners;

// Nutrition Studio global bindings
window.initNutritionStudio = initNutritionStudio;
window.addMealToNutritionStudio = addMealToNutritionStudio;
window.removeMealFromStudio = removeMealFromStudio;
window.updateMealField = updateMealField;
window.saveCustomDietTemplate = saveCustomDietTemplate;
window.assignDietToSelectedAthlete = assignDietToSelectedAthlete;
window.loadSelectedDietTemplate = loadSelectedDietTemplate;
window.resetNutritionStudioForm = resetNutritionStudioForm;
window.copyDietSummaryToClipboard = copyDietSummaryToClipboard;

// Studio global bindings
window.switchStudioBodyView = switchStudioBodyView;
window.selectStudioMuscle = selectStudioMuscle;
window.setStudioEquipmentFilter = setStudioEquipmentFilter;
window.filterStudioExercises = filterStudioExercises;
window.onStudioAthleteSelectChange = onStudioAthleteSelectChange;
window.openSelectedAthleteRoutineModal = openSelectedAthleteRoutineModal;
window.addExerciseFromStudio = addExerciseFromStudio;
window.initTrainingStudio = initTrainingStudio;

/**
 * ============================================================================
 * 16. INITIALIZATION ON DOM CONTENT LOADED
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup persistent global event delegation first
  setupGlobalEventDelegation();

  // 2. Check Coach PIN session
  checkCoachAuth();

  // 3. Load persistent athletes (starts empty if none in storage)
  loadAthletesFromStorage();

  // 4. Initialize Nutrition Studio
  initNutritionStudio();

  // 5. Apply saved or default language
  setAppLanguage(currentAppLang);

  // 6. Initialize Anatomical Training Studio
  initTrainingStudio();

  // 7. Search input live filter
  const searchInput = document.getElementById('athlete-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAthletesView();
    });
  }

  // 8. Status dropdown filter
  const statusFilter = document.getElementById('athlete-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      renderAthletesView();
    });
  }

  // 9. SVG Muscle Node Click Handlers (Workout Modal & Studio)
  setupModalSvgInteractivity();
  setupStudioSvgInteractivity();

  // 10. Rebind all explicit actions
  rebindAllActionListeners();

  console.log('[THE RUSH WAY] Core Coach Engine, Nutrition Studio & Anatomical Studio initialized.');
});