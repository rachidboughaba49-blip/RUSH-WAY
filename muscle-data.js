/**
 * ============================================================================
 * THE RUSH WAY - MUSCLE DATA MODEL & EXERCISE RELATIONSHIP DATABASE
 * Production-ready, sports-science grounded anatomical dictionary & relationship graph.
 * Fully extensible for Google Sheets, Supabase, Firebase or REST APIs.
 * ============================================================================
 */

(function (root, factory) {
  const data = factory();
  if (typeof define === 'function' && define.amd) {
    define([], function () { return data; });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = data;
  }
  if (typeof root !== 'undefined') root.RushMuscleData = data;
  if (typeof window !== 'undefined') window.RushMuscleData = data;
  if (typeof globalThis !== 'undefined') globalThis.RushMuscleData = data;
  if (typeof self !== 'undefined') self.RushMuscleData = data;
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this)), function () {
  'use strict';

  // 1. ANATOMICAL REGIONS
  const REGIONS = {
    chest: { id: 'chest', en: 'Chest', ar: 'عضلات الصدر' },
    shoulders: { id: 'shoulders', en: 'Shoulders', ar: 'عضلات الأكتاف' },
    arms: { id: 'arms', en: 'Arms', ar: 'عضلات الذراعين' },
    back: { id: 'back', en: 'Back', ar: 'عضلات الظهر' },
    core: { id: 'core', en: 'Core & Abdominals', ar: 'عضلات البطن والجذع' },
    legs: { id: 'legs', en: 'Legs & Calves', ar: 'عضلات الأرجل والسمانة' }
  };

  // 2. COMPREHENSIVE MUSCLE DICTIONARY
  // Each muscle has unique stable ID, left/right support, anatomical actions, and bilingual labels
  const MUSCLES = [
    // --- FRONT: CHEST ---
    {
      id: 'pectoralis_major_upper_l',
      groupKey: 'pectoralis_major_upper',
      name: 'Pectoralis Major — Clavicular Head (Left)',
      displayName: 'Upper Chest (Left)',
      nameAr: 'العضلة الصدرية الكبرى - الحزمة الترقوية العلوية (يسار)',
      displayNameAr: 'الصدر العلوي (يسار)',
      region: 'chest',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'pectoralis_major_upper_r',
      jointActions: ['Shoulder flexion', 'Horizontal adduction', 'Internal rotation'],
      functionEn: 'Shoulder flexion (lifting arm upwards) and horizontal adduction with high clavicular fiber recruitment.',
      functionAr: 'ثني مفصل الكتف للأعلى وتقريب الذراع أفقياً مع تركيز الحمل الميكانيكي على الألياف الترقوية العلوية.',
      aliases: ['incline chest', 'clavicular head', 'upper pec']
    },
    {
      id: 'pectoralis_major_upper_r',
      groupKey: 'pectoralis_major_upper',
      name: 'Pectoralis Major — Clavicular Head (Right)',
      displayName: 'Upper Chest (Right)',
      nameAr: 'العضلة الصدرية الكبرى - الحزمة الترقوية العلوية (يمين)',
      displayNameAr: 'الصدر العلوي (يمين)',
      region: 'chest',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'pectoralis_major_upper_l',
      jointActions: ['Shoulder flexion', 'Horizontal adduction', 'Internal rotation'],
      functionEn: 'Shoulder flexion and horizontal adduction with high clavicular fiber recruitment.',
      functionAr: 'ثني مفصل الكتف للأعلى وتقريب الذراع أفقياً مع تركيز الحمل الميكانيكي على الألياف الترقوية العلوية.',
      aliases: ['incline chest', 'clavicular head', 'upper pec']
    },
    {
      id: 'pectoralis_major_mid_l',
      groupKey: 'pectoralis_major_mid',
      name: 'Pectoralis Major — Sternal Head (Left)',
      displayName: 'Middle Chest (Left)',
      nameAr: 'العضلة الصدرية الكبرى - الحزمة القصية الوسطى (يسار)',
      displayNameAr: 'الصدر الأوسط (يسار)',
      region: 'chest',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'pectoralis_major_mid_r',
      jointActions: ['Horizontal adduction', 'Internal rotation'],
      functionEn: 'Horizontal adduction of the humerus across the ribcage, primary driver of flat pressing.',
      functionAr: 'تقريب العضد أفقياً باتجاه القفص الصدري، وهي المحرك الأساسي في تمارين الضغط المستوي.',
      aliases: ['sternal head', 'mid chest', 'flat chest']
    },
    {
      id: 'pectoralis_major_mid_r',
      groupKey: 'pectoralis_major_mid',
      name: 'Pectoralis Major — Sternal Head (Right)',
      displayName: 'Middle Chest (Right)',
      nameAr: 'العضلة الصدرية الكبرى - الحزمة القصية الوسطى (يمين)',
      displayNameAr: 'الصدر الأوسط (يمين)',
      region: 'chest',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'pectoralis_major_mid_l',
      jointActions: ['Horizontal adduction', 'Internal rotation'],
      functionEn: 'Horizontal adduction of the humerus across the ribcage, primary driver of flat pressing.',
      functionAr: 'تقريب العضد أفقياً باتجاه القفص الصدري، وهي المحرك الأساسي في تمارين الضغط المستوي.',
      aliases: ['sternal head', 'mid chest', 'flat chest']
    },
    {
      id: 'pectoralis_major_lower_l',
      groupKey: 'pectoralis_major_lower',
      name: 'Pectoralis Major — Costal Head (Left)',
      displayName: 'Lower Chest (Left)',
      nameAr: 'العضلة الصدرية الكبرى - الحزمة البطنية السفلية (يسار)',
      displayNameAr: 'الصدر السفلي (يسار)',
      region: 'chest',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'pectoralis_major_lower_r',
      jointActions: ['Shoulder depression', 'Horizontal adduction', 'Shoulder extension from flexed position'],
      functionEn: 'Adduction and depression of the arm downward toward the hips, active in dips and decline press.',
      functionAr: 'سحب الذراع وتنزيلها لأسفل باتجاه الحوض، وتنشط بقوة في تمارين المتوازي والضغط المائل لأسفل.',
      aliases: ['costal head', 'decline chest', 'lower pec']
    },
    {
      id: 'pectoralis_major_lower_r',
      groupKey: 'pectoralis_major_lower',
      name: 'Pectoralis Major — Costal Head (Right)',
      displayName: 'Lower Chest (Right)',
      nameAr: 'العضلة الصدرية الكبرى - الحزمة البطنية السفلية (يمين)',
      displayNameAr: 'الصدر السفلي (يمين)',
      region: 'chest',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'pectoralis_major_lower_l',
      jointActions: ['Shoulder depression', 'Horizontal adduction', 'Shoulder extension from flexed position'],
      functionEn: 'Adduction and depression of the arm downward toward the hips, active in dips and decline press.',
      functionAr: 'سحب الذراع وتنزيلها لأسفل باتجاه الحوض، وتنشط بقوة في تمارين المتوازي والضغط المائل لأسفل.',
      aliases: ['costal head', 'decline chest', 'lower pec']
    },

    // --- FRONT: SHOULDERS ---
    {
      id: 'anterior_deltoid_l',
      groupKey: 'anterior_deltoid',
      name: 'Anterior Deltoid (Left)',
      displayName: 'Front Deltoid (Left)',
      nameAr: 'العضلة الدالية الأمامية (يسار)',
      displayNameAr: 'الكتف الأمامي (يسار)',
      region: 'shoulders',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'anterior_deltoid_r',
      jointActions: ['Shoulder flexion', 'Internal rotation', 'Horizontal adduction'],
      functionEn: 'Arm flexion in sagittal plane and horizontal adduction, major synergist in all chest presses.',
      functionAr: 'رفع الذراع للأمام وتقريبها للداخل، مساهم رئيسي في كل حركات الضغط العلوي والمستوي.',
      aliases: ['front delt', 'clavicular delt']
    },
    {
      id: 'anterior_deltoid_r',
      groupKey: 'anterior_deltoid',
      name: 'Anterior Deltoid (Right)',
      displayName: 'Front Deltoid (Right)',
      nameAr: 'العضلة الدالية الأمامية (يمين)',
      displayNameAr: 'الكتف الأمامي (يمين)',
      region: 'shoulders',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'anterior_deltoid_l',
      jointActions: ['Shoulder flexion', 'Internal rotation', 'Horizontal adduction'],
      functionEn: 'Arm flexion in sagittal plane and horizontal adduction, major synergist in all chest presses.',
      functionAr: 'رفع الذراع للأمام وتقريبها للداخل، مساهم رئيسي في كل حركات الضغط العلوي والمستوي.',
      aliases: ['front delt', 'clavicular delt']
    },
    {
      id: 'lateral_deltoid_l',
      groupKey: 'lateral_deltoid',
      name: 'Lateral Deltoid (Left)',
      displayName: 'Side Deltoid (Left)',
      nameAr: 'العضلة الدالية الجانبية (يسار)',
      displayNameAr: 'الكتف الجانبي (يسار)',
      region: 'shoulders',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'lateral_deltoid_r',
      jointActions: ['Shoulder abduction'],
      functionEn: 'Primary abductor of the arm between 15° and 90° in the scapular plane.',
      functionAr: 'تبعيد الذراع جانبياً عن الجسم من زاوية 15 إلى 90 درجة، المسؤولة عن المظهر العريض للكتفين.',
      aliases: ['side delt', 'medial delt']
    },
    {
      id: 'lateral_deltoid_r',
      groupKey: 'lateral_deltoid',
      name: 'Lateral Deltoid (Right)',
      displayName: 'Side Deltoid (Right)',
      nameAr: 'العضلة الدالية الجانبية (يمين)',
      displayNameAr: 'الكتف الجانبي (يمين)',
      region: 'shoulders',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'lateral_deltoid_l',
      jointActions: ['Shoulder abduction'],
      functionEn: 'Primary abductor of the arm between 15° and 90° in the scapular plane.',
      functionAr: 'تبعيد الذراع جانبياً عن الجسم من زاوية 15 إلى 90 درجة، المسؤولة عن المظهر العريض للكتفين.',
      aliases: ['side delt', 'medial delt']
    },

    // --- FRONT: ARMS ---
    {
      id: 'biceps_brachii_l',
      groupKey: 'biceps_brachii',
      name: 'Biceps Brachii (Left)',
      displayName: 'Biceps (Left)',
      nameAr: 'العضلة ذات الرأسين العضدية (يسار)',
      displayNameAr: 'البايسبس (يسار)',
      region: 'arms',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'biceps_brachii_r',
      jointActions: ['Elbow flexion', 'Forearm supination', 'Weak shoulder flexion'],
      functionEn: 'Primary flexor of the elbow when forearm is supinated, and powerful supinator of the forearm.',
      functionAr: 'ثني مفصل المرفق عندما يكون الساعد ملتفاً للأعلى (Supinated) وتدوير الساعد خارجياً.',
      aliases: ['biceps', 'long head biceps', 'short head biceps']
    },
    {
      id: 'biceps_brachii_r',
      groupKey: 'biceps_brachii',
      name: 'Biceps Brachii (Right)',
      displayName: 'Biceps (Right)',
      nameAr: 'العضلة ذات الرأسين العضدية (يمين)',
      displayNameAr: 'البايسبس (يمين)',
      region: 'arms',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'biceps_brachii_l',
      jointActions: ['Elbow flexion', 'Forearm supination', 'Weak shoulder flexion'],
      functionEn: 'Primary flexor of the elbow when forearm is supinated, and powerful supinator of the forearm.',
      functionAr: 'ثني مفصل المرفق عندما يكون الساعد ملتفاً للأعلى (Supinated) وتدوير الساعد خارجياً.',
      aliases: ['biceps', 'long head biceps', 'short head biceps']
    },
    {
      id: 'brachialis_l',
      groupKey: 'brachialis',
      name: 'Brachialis (Left)',
      displayName: 'Brachialis (Left)',
      nameAr: 'العضلة العضدية العميقة (يسار)',
      displayNameAr: 'البراكيلس (يسار)',
      region: 'arms',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'brachialis_r',
      jointActions: ['Elbow flexion'],
      functionEn: 'Pure elbow flexor regardless of forearm pronation/supination state, pushes biceps upward for arm thickness.',
      functionAr: 'ثني مفصل المرفق بغض النظر عن زاوية دوران الساعد، تدفع البايسبس للأعلى لمنح الذراع سمكاً وعرضاً.',
      aliases: ['deep arm flexor', 'hammer muscle']
    },
    {
      id: 'brachialis_r',
      groupKey: 'brachialis',
      name: 'Brachialis (Right)',
      displayName: 'Brachialis (Right)',
      nameAr: 'العضلة العضدية العميقة (يمين)',
      displayNameAr: 'البراكيلس (يمين)',
      region: 'arms',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'brachialis_l',
      jointActions: ['Elbow flexion'],
      functionEn: 'Pure elbow flexor regardless of forearm pronation/supination state, pushes biceps upward for arm thickness.',
      functionAr: 'ثني مفصل المرفق بغض النظر عن زاوية دوران الساعد، تدفع البايسبس للأعلى لمنح الذراع سمكاً وعرضاً.',
      aliases: ['deep arm flexor', 'hammer muscle']
    },
    {
      id: 'forearms_ant_l',
      groupKey: 'forearms',
      name: 'Forearm Flexors & Brachioradialis (Left)',
      displayName: 'Forearm Flexors (Left)',
      nameAr: 'عضلات الساعد القابضة والعضدية الكعبرية (يسار)',
      displayNameAr: 'الساعد الأمامي والقبضة (يسار)',
      region: 'arms',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'forearms_ant_r',
      jointActions: ['Wrist flexion', 'Finger flexion (grip)', 'Elbow flexion in neutral grip'],
      functionEn: 'Wrist flexion, isometric grip clamping strength, and elbow flexion in neutral grip via brachioradialis.',
      functionAr: 'ثني المعصم والتحكم في قوة قبضة اليد وسحب الأوزان، وثني المرفق في القبضة المحايدة (Neutral).',
      aliases: ['wrist flexors', 'grip muscles', 'brachioradialis']
    },
    {
      id: 'forearms_ant_r',
      groupKey: 'forearms',
      name: 'Forearm Flexors & Brachioradialis (Right)',
      displayName: 'Forearm Flexors (Right)',
      nameAr: 'عضلات الساعد القابضة والعضدية الكعبرية (يمين)',
      displayNameAr: 'الساعد الأمامي والقبضة (يمين)',
      region: 'arms',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'forearms_ant_l',
      jointActions: ['Wrist flexion', 'Finger flexion (grip)', 'Elbow flexion in neutral grip'],
      functionEn: 'Wrist flexion, isometric grip clamping strength, and elbow flexion in neutral grip via brachioradialis.',
      functionAr: 'ثني المعصم والتحكم في قوة قبضة اليد وسحب الأوزان، وثني المرفق في القبضة المحايدة (Neutral).',
      aliases: ['wrist flexors', 'grip muscles', 'brachioradialis']
    },

    // --- FRONT: CORE ---
    {
      id: 'rectus_abdominis_upper',
      groupKey: 'rectus_abdominis',
      name: 'Rectus Abdominis — Upper Region',
      displayName: 'Upper Abs',
      nameAr: 'العضلة المستقيمة البطنية - القسم العلوي',
      displayNameAr: 'عضلات البطن العلوية',
      region: 'core',
      view: 'front',
      side: 'bilateral',
      category: 'primary',
      jointActions: ['Spinal flexion', 'Posterior pelvic tilt compression'],
      functionEn: 'Flexes thoracic spine downward toward pelvis and controls intra-abdominal pressure.',
      functionAr: 'ثني العمود الفقري الصدري لأسفل باتجاه الحوض وتوليد الضغط البطني الحامي للعمود الفقري.',
      aliases: ['six pack upper', 'upper core']
    },
    {
      id: 'rectus_abdominis_lower',
      groupKey: 'rectus_abdominis',
      name: 'Rectus Abdominis — Lower Region',
      displayName: 'Lower Abs',
      nameAr: 'العضلة المستقيمة البطنية - القسم السفلي',
      displayNameAr: 'عضلات البطن السفلية',
      region: 'core',
      view: 'front',
      side: 'bilateral',
      category: 'primary',
      jointActions: ['Posterior pelvic tilt', 'Spinal flexion'],
      functionEn: 'Draws pelvis upward toward ribcage and stabilizes lumbar spine during leg elevation.',
      functionAr: 'سحب الحوض للأعلى وتثبيت الفقرات القطنية أثناء رفع الساقين أو مقاومة التمدد الزائد.',
      aliases: ['six pack lower', 'lower core']
    },
    {
      id: 'external_obliques_l',
      groupKey: 'external_obliques',
      name: 'External Oblique (Left)',
      displayName: 'Obliques (Left)',
      nameAr: 'العضلة المائلة الخارجية (يسار)',
      displayNameAr: 'الخواصر (يسار)',
      region: 'core',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'external_obliques_r',
      jointActions: ['Contralateral trunk rotation', 'Lateral flexion', 'Spinal stabilization'],
      functionEn: 'Rotates torso to opposite side, flexes spine laterally, resists rotational shear forces.',
      functionAr: 'تدوير الجذع للجهة المقابلة والثني الجانبي ومقاومة القوى الدورانية لحماية الظهر.',
      aliases: ['obliques', 'waist stabilizers', 'side abs']
    },
    {
      id: 'external_obliques_r',
      groupKey: 'external_obliques',
      name: 'External Oblique (Right)',
      displayName: 'Obliques (Right)',
      nameAr: 'العضلة المائلة الخارجية (يمين)',
      displayNameAr: 'الخواصر (يمين)',
      region: 'core',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'external_obliques_l',
      jointActions: ['Contralateral trunk rotation', 'Lateral flexion', 'Spinal stabilization'],
      functionEn: 'Rotates torso to opposite side, flexes spine laterally, resists rotational shear forces.',
      functionAr: 'تدوير الجذع للجهة المقابلة والثني الجانبي ومقاومة القوى الدورانية لحماية الظهر.',
      aliases: ['obliques', 'waist stabilizers', 'side abs']
    },
    {
      id: 'serratus_anterior_l',
      groupKey: 'serratus_anterior',
      name: 'Serratus Anterior (Left)',
      displayName: 'Serratus (Left)',
      nameAr: 'العضلة المنشارية الأمامية (يسار)',
      displayNameAr: 'المنشارية (يسار)',
      region: 'core',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'serratus_anterior_r',
      jointActions: ['Scapular protraction', 'Scapular upward rotation'],
      functionEn: 'Protracts the scapula forward around ribcage, essential for shoulder health and bench lockout.',
      functionAr: 'تقديم لوح الكتف للأمام وتدويره للأعلى، حاسمة لصحة مفصل الكتف وقفل الضغط.',
      aliases: ['boxer muscle', 'rib muscle']
    },
    {
      id: 'serratus_anterior_r',
      groupKey: 'serratus_anterior',
      name: 'Serratus Anterior (Right)',
      displayName: 'Serratus (Right)',
      nameAr: 'العضلة المنشارية الأمامية (يمين)',
      displayNameAr: 'المنشارية (يمين)',
      region: 'core',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'serratus_anterior_l',
      jointActions: ['Scapular protraction', 'Scapular upward rotation'],
      functionEn: 'Protracts the scapula forward around ribcage, essential for shoulder health and bench lockout.',
      functionAr: 'تقديم لوح الكتف للأمام وتدويره للأعلى، حاسمة لصحة مفصل الكتف وقفل الضغط.',
      aliases: ['boxer muscle', 'rib muscle']
    },

    // --- FRONT: LEGS ---
    {
      id: 'adductors_l',
      groupKey: 'adductors',
      name: 'Hip Adductors (Left)',
      displayName: 'Adductors (Left)',
      nameAr: 'العضلات المقربة للفخذ (يسار)',
      displayNameAr: 'الضامة الداخلية (يسار)',
      region: 'legs',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'adductors_r',
      jointActions: ['Hip adduction', 'Hip flexion/extension contribution'],
      functionEn: 'Adducts the thigh toward midline and stabilizes pelvis during deep squatting.',
      functionAr: 'تقريب الفخذ باتجاه منتصف الجسم وتثبيت قاع الحوض أثناء النزول العميق في السكوات.',
      aliases: ['inner thigh', 'groin muscles']
    },
    {
      id: 'adductors_r',
      groupKey: 'adductors',
      name: 'Hip Adductors (Right)',
      displayName: 'Adductors (Right)',
      nameAr: 'العضلات المقربة للفخذ (يمين)',
      displayNameAr: 'الضامة الداخلية (يمين)',
      region: 'legs',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'adductors_l',
      jointActions: ['Hip adduction', 'Hip flexion/extension contribution'],
      functionEn: 'Adducts the thigh toward midline and stabilizes pelvis during deep squatting.',
      functionAr: 'تقريب الفخذ باتجاه منتصف الجسم وتثبيت قاع الحوض أثناء النزول العميق في السكوات.',
      aliases: ['inner thigh', 'groin muscles']
    },
    {
      id: 'quadriceps_l',
      groupKey: 'quadriceps',
      name: 'Quadriceps Femoris (Left)',
      displayName: 'Quadriceps (Left)',
      nameAr: 'العضلة رباعية الرؤوس الفخذية (يسار)',
      displayNameAr: 'الفخذ الأمامي (يسار)',
      region: 'legs',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'quadriceps_r',
      jointActions: ['Knee extension', 'Hip flexion (Rectus femoris)'],
      functionEn: 'Extends knee joint (Vastus lateralis, medialis, intermedius) and flexes hip via Rectus femoris.',
      functionAr: 'بسط مفصل الركبة (العضلة المتسعة الوحشية والإنسية) وثني مفصل الفخذ عبر العضلة المستقيمة الفخذية.',
      aliases: ['quads', 'thigh', 'vastus lateralis', 'rectus femoris']
    },
    {
      id: 'quadriceps_r',
      groupKey: 'quadriceps',
      name: 'Quadriceps Femoris (Right)',
      displayName: 'Quadriceps (Right)',
      nameAr: 'العضلة رباعية الرؤوس الفخذية (يمين)',
      displayNameAr: 'الفخذ الأمامي (يمين)',
      region: 'legs',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'quadriceps_l',
      jointActions: ['Knee extension', 'Hip flexion (Rectus femoris)'],
      functionEn: 'Extends knee joint (Vastus lateralis, medialis, intermedius) and flexes hip via Rectus femoris.',
      functionAr: 'بسط مفصل الركبة (العضلة المتسعة الوحشية والإنسية) وثني مفصل الفخذ عبر العضلة المستقيمة الفخذية.',
      aliases: ['quads', 'thigh', 'vastus lateralis', 'rectus femoris']
    },
    {
      id: 'tibialis_anterior_l',
      groupKey: 'tibialis_anterior',
      name: 'Tibialis Anterior (Left)',
      displayName: 'Shin / Tibialis (Left)',
      nameAr: 'العضلة الظنبوبية الأمامية (يسار)',
      displayNameAr: 'مقدمة الساق (يسار)',
      region: 'legs',
      view: 'front',
      side: 'left',
      category: 'primary',
      pairedWith: 'tibialis_anterior_r',
      jointActions: ['Ankle dorsiflexion', 'Foot inversion'],
      functionEn: 'Dorsiflexes the ankle (pulling toes toward shin), key shock absorber during running and decelerating.',
      functionAr: 'ثني الكاحل للأعلى (سحب أصابع القدم باتجاه القصبة)، تمتص الصدمات وتمنع إصابات أوتار الركبة والكاحل.',
      aliases: ['shin muscle', 'dorsiflexor']
    },
    {
      id: 'tibialis_anterior_r',
      groupKey: 'tibialis_anterior',
      name: 'Tibialis Anterior (Right)',
      displayName: 'Shin / Tibialis (Right)',
      nameAr: 'العضلة الظنبوبية الأمامية (يمين)',
      displayNameAr: 'مقدمة الساق (يمين)',
      region: 'legs',
      view: 'front',
      side: 'right',
      category: 'primary',
      pairedWith: 'tibialis_anterior_l',
      jointActions: ['Ankle dorsiflexion', 'Foot inversion'],
      functionEn: 'Dorsiflexes the ankle (pulling toes toward shin), key shock absorber during running and decelerating.',
      functionAr: 'ثني الكاحل للأعلى (سحب أصابع القدم باتجاه القصبة)، تمتص الصدمات وتمنع إصابات أوتار الركبة والكاحل.',
      aliases: ['shin muscle', 'dorsiflexor']
    },

    // --- BACK: TRAPEZIUS ---
    {
      id: 'trapezius_upper_l',
      groupKey: 'trapezius_upper',
      name: 'Trapezius — Upper Fibers (Left)',
      displayName: 'Upper Traps (Left)',
      nameAr: 'العضلة شبه المنحرفة - الألياف العلوية (يسار)',
      displayNameAr: 'الترابيس العلوية (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'trapezius_upper_r',
      jointActions: ['Scapular elevation', 'Neck extension / lateral flexion'],
      functionEn: 'Elevates scapula (shrugging motion) and supports heavy axial loads held in hands.',
      functionAr: 'رفع لوح الكتف للأعلى (حركة الشراغز Shrugs) وتحمل الأحمال الثقيلة المحمولة باليد.',
      aliases: ['upper traps', 'neck traps']
    },
    {
      id: 'trapezius_upper_r',
      groupKey: 'trapezius_upper',
      name: 'Trapezius — Upper Fibers (Right)',
      displayName: 'Upper Traps (Right)',
      nameAr: 'العضلة شبه المنحرفة - الألياف العلوية (يمين)',
      displayNameAr: 'الترابيس العلوية (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'trapezius_upper_l',
      jointActions: ['Scapular elevation', 'Neck extension / lateral flexion'],
      functionEn: 'Elevates scapula (shrugging motion) and supports heavy axial loads held in hands.',
      functionAr: 'رفع لوح الكتف للأعلى (حركة الشراغز Shrugs) وتحمل الأحمال الثقيلة المحمولة باليد.',
      aliases: ['upper traps', 'neck traps']
    },
    {
      id: 'trapezius_mid_l',
      groupKey: 'trapezius_mid',
      name: 'Trapezius — Middle Fibers (Left)',
      displayName: 'Middle Traps (Left)',
      nameAr: 'العضلة شبه المنحرفة - الألياف الوسطى (يسار)',
      displayNameAr: 'الترابيس الوسطى (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'trapezius_mid_r',
      jointActions: ['Scapular retraction'],
      functionEn: 'Retracts scapulae backward toward spine, vital for upper back thickness and posture.',
      functionAr: 'ضم لوحي الكتف للخلف باتجاه العمود الفقري، أساسية لكثافة الظهر العلوية واستقامة القامة.',
      aliases: ['mid traps', 'upper back thickness']
    },
    {
      id: 'trapezius_mid_r',
      groupKey: 'trapezius_mid',
      name: 'Trapezius — Middle Fibers (Right)',
      displayName: 'Middle Traps (Right)',
      nameAr: 'العضلة شبه المنحرفة - الألياف الوسطى (يمين)',
      displayNameAr: 'الترابيس الوسطى (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'trapezius_mid_l',
      jointActions: ['Scapular retraction'],
      functionEn: 'Retracts scapulae backward toward spine, vital for upper back thickness and posture.',
      functionAr: 'ضم لوحي الكتف للخلف باتجاه العمود الفقري، أساسية لكثافة الظهر العلوية واستقامة القامة.',
      aliases: ['mid traps', 'upper back thickness']
    },
    {
      id: 'trapezius_lower_l',
      groupKey: 'trapezius_lower',
      name: 'Trapezius — Lower Fibers (Left)',
      displayName: 'Lower Traps (Left)',
      nameAr: 'العضلة شبه المنحرفة - الألياف السفلية (يسار)',
      displayNameAr: 'الترابيس السفلية (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'trapezius_lower_r',
      jointActions: ['Scapular depression', 'Scapular upward rotation'],
      functionEn: 'Depresses the scapula downward, prevents shoulder impingement in overhead movements.',
      functionAr: 'سحب لوح الكتف لأسفل، وتمنع احتكاك أوتار الكتف (Impingement) أثناء تمارين الدفع والسحب.',
      aliases: ['lower traps', 'scapular depressor']
    },
    {
      id: 'trapezius_lower_r',
      groupKey: 'trapezius_lower',
      name: 'Trapezius — Lower Fibers (Right)',
      displayName: 'Lower Traps (Right)',
      nameAr: 'العضلة شبه المنحرفة - الألياف السفلية (يمين)',
      displayNameAr: 'الترابيس السفلية (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'trapezius_lower_l',
      jointActions: ['Scapular depression', 'Scapular upward rotation'],
      functionEn: 'Depresses the scapula downward, prevents shoulder impingement in overhead movements.',
      functionAr: 'سحب لوح الكتف لأسفل، وتمنع احتكاك أوتار الكتف (Impingement) أثناء تمارين الدفع والسحب.',
      aliases: ['lower traps', 'scapular depressor']
    },

    // --- BACK: DELTOIDS & RHOMBOIDS ---
    {
      id: 'posterior_deltoid_l',
      groupKey: 'posterior_deltoid',
      name: 'Posterior Deltoid (Left)',
      displayName: 'Rear Deltoid (Left)',
      nameAr: 'العضلة الدالية الخلفية (يسار)',
      displayNameAr: 'الكتف الخلفي (يسار)',
      region: 'shoulders',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'posterior_deltoid_r',
      jointActions: ['Horizontal abduction', 'Shoulder extension', 'External rotation'],
      functionEn: 'Horizontally abducts and extends the shoulder joint, key for 3D shoulder shape and shoulder cuff balance.',
      functionAr: 'تبعيد الكتف أفقياً للخلف وتدويره للخارج، أساسية لتوازن الكتف والمظهر ثلاثي الأبعاد.',
      aliases: ['rear delt', 'posterior shoulder']
    },
    {
      id: 'posterior_deltoid_r',
      groupKey: 'posterior_deltoid',
      name: 'Posterior Deltoid (Right)',
      displayName: 'Rear Deltoid (Right)',
      nameAr: 'العضلة الدالية الخلفية (يمين)',
      displayNameAr: 'الكتف الخلفي (يمين)',
      region: 'shoulders',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'posterior_deltoid_l',
      jointActions: ['Horizontal abduction', 'Shoulder extension', 'External rotation'],
      functionEn: 'Horizontally abducts and extends the shoulder joint, key for 3D shoulder shape and shoulder cuff balance.',
      functionAr: 'تبعيد الكتف أفقياً للخلف وتدويره للخارج، أساسية لتوازن الكتف والمظهر ثلاثي الأبعاد.',
      aliases: ['rear delt', 'posterior shoulder']
    },
    {
      id: 'rhomboids_l',
      groupKey: 'rhomboids',
      name: 'Rhomboids Major & Minor (Left)',
      displayName: 'Rhomboids (Left)',
      nameAr: 'العضلات المعينية الكبرى والصغرى (يسار)',
      displayNameAr: 'العضلات المعينية (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'rhomboids_r',
      jointActions: ['Scapular retraction', 'Scapular downward rotation'],
      functionEn: 'Retracts and stabilizes the scapula against the thoracic wall under heavy row tension.',
      functionAr: 'سحب وتثبيت لوح الكتف بقوة ضد جدار القفص الصدري أثناء تمارين التجديف والسحب الثقيل.',
      aliases: ['rhomboid major', 'scapular stabilizer']
    },
    {
      id: 'rhomboids_r',
      groupKey: 'rhomboids',
      name: 'Rhomboids Major & Minor (Right)',
      displayName: 'Rhomboids (Right)',
      nameAr: 'العضلات المعينية الكبرى والصغرى (يمين)',
      displayNameAr: 'العضلات المعينية (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'rhomboids_l',
      jointActions: ['Scapular retraction', 'Scapular downward rotation'],
      functionEn: 'Retracts and stabilizes the scapula against the thoracic wall under heavy row tension.',
      functionAr: 'سحب وتثبيت لوح الكتف بقوة ضد جدار القفص الصدري أثناء تمارين التجديف والسحب الثقيل.',
      aliases: ['rhomboid major', 'scapular stabilizer']
    },

    // --- BACK: LATS & TERES MAJOR ---
    {
      id: 'latissimus_dorsi_l',
      groupKey: 'latissimus_dorsi',
      name: 'Latissimus Dorsi (Left)',
      displayName: 'Lats (Left)',
      nameAr: 'العضلة العريضة الظهرية (المجنص) (يسار)',
      displayNameAr: 'الظهر العريض / المجنص (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'latissimus_dorsi_r',
      jointActions: ['Shoulder adduction', 'Shoulder extension', 'Internal rotation'],
      functionEn: 'Adducts and extends the humerus downward and backward, produces the athletic V-taper physique.',
      functionAr: 'تقريب وسحب العضد لأسفل وللخلف باتجاه الحوض، تمنح الجسم مظهر الحرف V الرياضي الشهير.',
      aliases: ['lats', 'wings', 'latissimus']
    },
    {
      id: 'latissimus_dorsi_r',
      groupKey: 'latissimus_dorsi',
      name: 'Latissimus Dorsi (Right)',
      displayName: 'Lats (Right)',
      nameAr: 'العضلة العريضة الظهرية (المجنص) (يمين)',
      displayNameAr: 'الظهر العريض / المجنص (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'latissimus_dorsi_l',
      jointActions: ['Shoulder adduction', 'Shoulder extension', 'Internal rotation'],
      functionEn: 'Adducts and extends the humerus downward and backward, produces the athletic V-taper physique.',
      functionAr: 'تقريب وسحب العضد لأسفل وللخلف باتجاه الحوض، تمنح الجسم مظهر الحرف V الرياضي الشهير.',
      aliases: ['lats', 'wings', 'latissimus']
    },
    {
      id: 'teres_major_l',
      groupKey: 'teres_major',
      name: 'Teres Major (Left)',
      displayName: 'Teres Major (Left)',
      nameAr: 'العضلة المدورة الكبيرة (يسار)',
      displayNameAr: 'المدورة الكبيرة (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'teres_major_r',
      jointActions: ['Shoulder adduction', 'Internal rotation'],
      functionEn: 'Synergist to latissimus dorsi ("little helper of the lats"), assists in pull-ups and pulldowns.',
      functionAr: 'المساعد الرئيسي لعضلة المجنص، تشارك بقوة في حركات العقلة والسحب العالي.',
      aliases: ['little helper lat', 'upper outer back']
    },
    {
      id: 'teres_major_r',
      groupKey: 'teres_major',
      name: 'Teres Major (Right)',
      displayName: 'Teres Major (Right)',
      nameAr: 'العضلة المدورة الكبيرة (يمين)',
      displayNameAr: 'المدورة الكبيرة (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'teres_major_l',
      jointActions: ['Shoulder adduction', 'Internal rotation'],
      functionEn: 'Synergist to latissimus dorsi ("little helper of the lats"), assists in pull-ups and pulldowns.',
      functionAr: 'المساعد الرئيسي لعضلة المجنص، تشارك بقوة في حركات العقلة والسحب العالي.',
      aliases: ['little helper lat', 'upper outer back']
    },

    // --- BACK: LOWER BACK & TRICEPS ---
    {
      id: 'erector_spinae_l',
      groupKey: 'erector_spinae',
      name: 'Erector Spinae (Left)',
      displayName: 'Lower Back (Left)',
      nameAr: 'عضلة ناصبة الفقار - أسفل الظهر والقطنية (يسار)',
      displayNameAr: 'القطنية وأسفل الظهر (يسار)',
      region: 'back',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'erector_spinae_r',
      jointActions: ['Spinal extension', 'Lateral flexion', 'Antiflexion postural brace'],
      functionEn: 'Extends vertebral column and resists flexion shear during deadlifts, squats and bent-over rows.',
      functionAr: 'بسط العمود الفقري ومقاومة الانحناء تحت الأوزان الثقيلة أثناء الرفعة الميتة والسكوات والتجديف.',
      aliases: ['lower back', 'spinal erectors', 'lumbar core']
    },
    {
      id: 'erector_spinae_r',
      groupKey: 'erector_spinae',
      name: 'Erector Spinae (Right)',
      displayName: 'Lower Back (Right)',
      nameAr: 'عضلة ناصبة الفقار - أسفل الظهر والقطنية (يمين)',
      displayNameAr: 'القطنية وأسفل الظهر (يمين)',
      region: 'back',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'erector_spinae_l',
      jointActions: ['Spinal extension', 'Lateral flexion', 'Antiflexion postural brace'],
      functionEn: 'Extends vertebral column and resists flexion shear during deadlifts, squats and bent-over rows.',
      functionAr: 'بسط العمود الفقري ومقاومة الانحناء تحت الأوزان الثقيلة أثناء الرفعة الميتة والسكوات والتجديف.',
      aliases: ['lower back', 'spinal erectors', 'lumbar core']
    },
    {
      id: 'triceps_brachii_l',
      groupKey: 'triceps',
      name: 'Triceps Brachii (Left)',
      displayName: 'Triceps (Left)',
      nameAr: 'العضلة ثلاثية الرؤوس العضدية (يسار)',
      displayNameAr: 'الترايسبس (يسار)',
      region: 'arms',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'triceps_brachii_r',
      jointActions: ['Elbow extension', 'Shoulder extension (long head)'],
      functionEn: 'Extends the elbow joint; long head also assists in shoulder adduction and extension.',
      functionAr: 'المحرك الأساسي لبسط مفصل المرفق، ويساعد الرأس الطويل في تثبيت وبسط مفصل الكتف للخلف.',
      aliases: ['triceps', 'long head triceps', 'lateral head triceps']
    },
    {
      id: 'triceps_brachii_r',
      groupKey: 'triceps',
      name: 'Triceps Brachii (Right)',
      displayName: 'Triceps (Right)',
      nameAr: 'العضلة ثلاثية الرؤوس العضدية (يمين)',
      displayNameAr: 'الترايسبس (يمين)',
      region: 'arms',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'triceps_brachii_l',
      jointActions: ['Elbow extension', 'Shoulder extension (long head)'],
      functionEn: 'Extends the elbow joint; long head also assists in shoulder adduction and extension.',
      functionAr: 'المحرك الأساسي لبسط مفصل المرفق، ويساعد الرأس الطويل في تثبيت وبسط مفصل الكتف للخلف.',
      aliases: ['triceps', 'long head triceps', 'lateral head triceps']
    },
    {
      id: 'forearms_post_l',
      groupKey: 'forearms_post',
      name: 'Forearm Extensors (Left)',
      displayName: 'Forearm Extensors (Left)',
      nameAr: 'عضلات الساعد الباسطة (يسار)',
      displayNameAr: 'الساعد الخلفي (يسار)',
      region: 'arms',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'forearms_post_r',
      jointActions: ['Wrist extension', 'Finger extension'],
      functionEn: 'Extends the wrist and fingers, counteracts gripping forces to prevent tendinopathy.',
      functionAr: 'بسط المعصم والأصابع وموازنة قوى القبضة لمنع التهابات الأوتار ومفصل الكوع.',
      aliases: ['wrist extensors', 'back of forearm']
    },
    {
      id: 'forearms_post_r',
      groupKey: 'forearms_post',
      name: 'Forearm Extensors (Right)',
      displayName: 'Forearm Extensors (Right)',
      nameAr: 'عضلات الساعد الباسطة (يمين)',
      displayNameAr: 'الساعد الخلفي (يمين)',
      region: 'arms',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'forearms_post_l',
      jointActions: ['Wrist extension', 'Finger extension'],
      functionEn: 'Extends the wrist and fingers, counteracts gripping forces to prevent tendinopathy.',
      functionAr: 'بسط المعصم والأصابع وموازنة قوى القبضة لمنع التهابات الأوتار ومفصل الكوع.',
      aliases: ['wrist extensors', 'back of forearm']
    },

    // --- BACK: GLUTES, HAMS & CALVES ---
    {
      id: 'gluteus_medius_l',
      groupKey: 'gluteus_medius',
      name: 'Gluteus Medius & Minimus (Left)',
      displayName: 'Upper / Side Glutes (Left)',
      nameAr: 'العضلة الألوية الوسطى والصغرى (يسار)',
      displayNameAr: 'الألوية الجانبية (يسار)',
      region: 'legs',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'gluteus_medius_r',
      jointActions: ['Hip abduction', 'Pelvic stabilization (Trendelenburg prevention)'],
      functionEn: 'Abducts the thigh and prevents contralateral pelvic drop during unilateral stance.',
      functionAr: 'تبعيد الفخذ جانبياً وتثبيت الحوض ومنع ميلانه أثناء الوقوف أو أداء التمارين الفردية (Lunges).',
      aliases: ['side glute', 'hip stabilizer']
    },
    {
      id: 'gluteus_medius_r',
      groupKey: 'gluteus_medius',
      name: 'Gluteus Medius & Minimus (Right)',
      displayName: 'Upper / Side Glutes (Right)',
      nameAr: 'العضلة الألوية الوسطى والصغرى (يمين)',
      displayNameAr: 'الألوية الجانبية (يمين)',
      region: 'legs',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'gluteus_medius_l',
      jointActions: ['Hip abduction', 'Pelvic stabilization (Trendelenburg prevention)'],
      functionEn: 'Abducts the thigh and prevents contralateral pelvic drop during unilateral stance.',
      functionAr: 'تبعيد الفخذ جانبياً وتثبيت الحوض ومنع ميلانه أثناء الوقوف أو أداء التمارين الفردية (Lunges).',
      aliases: ['side glute', 'hip stabilizer']
    },
    {
      id: 'gluteus_maximus_l',
      groupKey: 'gluteus_maximus',
      name: 'Gluteus Maximus (Left)',
      displayName: 'Gluteus Maximus (Left)',
      nameAr: 'العضلة الألوية الكبرى (يسار)',
      displayNameAr: 'الألوية الكبرى / المؤخرة (يسار)',
      region: 'legs',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'gluteus_maximus_r',
      jointActions: ['Hip extension', 'External rotation', 'Posterior pelvic tilt'],
      functionEn: 'Most powerful hip extensor in human body, primary mover in hip thrusts, squats and deadlifts.',
      functionAr: 'أقوى عضلة باسطة لمفصل الفخذ بالجسم البشري، المحرك الأكبر في تمارين الهيب ثرست والسكوات والديدلفت.',
      aliases: ['glutes', 'buttocks', 'hip extensor']
    },
    {
      id: 'gluteus_maximus_r',
      groupKey: 'gluteus_maximus',
      name: 'Gluteus Maximus (Right)',
      displayName: 'Gluteus Maximus (Right)',
      nameAr: 'العضلة الألوية الكبرى (يمين)',
      displayNameAr: 'الألوية الكبرى / المؤخرة (يمين)',
      region: 'legs',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'gluteus_maximus_l',
      jointActions: ['Hip extension', 'External rotation', 'Posterior pelvic tilt'],
      functionEn: 'Most powerful hip extensor in human body, primary mover in hip thrusts, squats and deadlifts.',
      functionAr: 'أقوى عضلة باسطة لمفصل الفخذ بالجسم البشري، المحرك الأكبر في تمارين الهيب ثرست والسكوات والديدلفت.',
      aliases: ['glutes', 'buttocks', 'hip extensor']
    },
    {
      id: 'hamstrings_l',
      groupKey: 'hamstrings',
      name: 'Hamstrings Complex (Left)',
      displayName: 'Hamstrings (Left)',
      nameAr: 'عضلات الفخذ الخلفية (المأبضية) (يسار)',
      displayNameAr: 'الفخذ الخلفي (يسار)',
      region: 'legs',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'hamstrings_r',
      jointActions: ['Knee flexion', 'Hip extension (biceps femoris long head & semitendinosus)'],
      functionEn: 'Flexes the knee joint and extends the hip, vital for sprinting speed and decelerating knee extension.',
      functionAr: 'ثني مفصل الركبة وبسط مفصل الفخذ، حاسمة لسرعة الانطلاق والركض وحماية الرباط الصليبي.',
      aliases: ['biceps femoris', 'semitendinosus', 'hams']
    },
    {
      id: 'hamstrings_r',
      groupKey: 'hamstrings',
      name: 'Hamstrings Complex (Right)',
      displayName: 'Hamstrings (Right)',
      nameAr: 'عضلات الفخذ الخلفية (المأبضية) (يمين)',
      displayNameAr: 'الفخذ الخلفي (يمين)',
      region: 'legs',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'hamstrings_l',
      jointActions: ['Knee flexion', 'Hip extension (biceps femoris long head & semitendinosus)'],
      functionEn: 'Flexes the knee joint and extends the hip, vital for sprinting speed and decelerating knee extension.',
      functionAr: 'ثني مفصل الركبة وبسط مفصل الفخذ، حاسمة لسرعة الانطلاق والركض وحماية الرباط الصليبي.',
      aliases: ['biceps femoris', 'semitendinosus', 'hams']
    },
    {
      id: 'gastrocnemius_l',
      groupKey: 'gastrocnemius',
      name: 'Gastrocnemius (Left)',
      displayName: 'Calves — Gastrocnemius (Left)',
      nameAr: 'عضلة الساق التوأمية السطحية (يسار)',
      displayNameAr: 'السمانة التوأمية (يسار)',
      region: 'legs',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'gastrocnemius_r',
      jointActions: ['Ankle plantarflexion', 'Weak knee flexion assistance'],
      functionEn: 'Plantarflexes the foot at the ankle joint when the knee is extended (standing calf raises).',
      functionAr: 'بسط ودفع القدم لأسفل عند استقامة مفصل الركبة (تمارين السمانة وقوفاً)، تمنح الساق شكلها الممتلئ.',
      aliases: ['standing calf', 'gastroc', 'calf diamond']
    },
    {
      id: 'gastrocnemius_r',
      groupKey: 'gastrocnemius',
      name: 'Gastrocnemius (Right)',
      displayName: 'Calves — Gastrocnemius (Right)',
      nameAr: 'عضلة الساق التوأمية السطحية (يمين)',
      displayNameAr: 'السمانة التوأمية (يمين)',
      region: 'legs',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'gastrocnemius_l',
      jointActions: ['Ankle plantarflexion', 'Weak knee flexion assistance'],
      functionEn: 'Plantarflexes the foot at the ankle joint when the knee is extended (standing calf raises).',
      functionAr: 'بسط ودفع القدم لأسفل عند استقامة مفصل الركبة (تمارين السمانة وقوفاً)، تمنح الساق شكلها الممتلئ.',
      aliases: ['standing calf', 'gastroc', 'calf diamond']
    },
    {
      id: 'soleus_l',
      groupKey: 'soleus',
      name: 'Soleus (Left)',
      displayName: 'Calves — Soleus (Left)',
      nameAr: 'العضلة النعلية العميقة للسمانة (يسار)',
      displayNameAr: 'السمانة النعلية (يسار)',
      region: 'legs',
      view: 'back',
      side: 'left',
      category: 'primary',
      pairedWith: 'soleus_r',
      jointActions: ['Ankle plantarflexion'],
      functionEn: 'Deep plantarflexor active whether knee is bent or straight; primary driver in seated calf raises.',
      functionAr: 'العضلة العميقة لبسط القدم، تنشط بعزل كامل عندما تكون الركبة مثنية (تمارين السمانة جلوساً).',
      aliases: ['deep calf', 'seated calf muscle']
    },
    {
      id: 'soleus_r',
      groupKey: 'soleus',
      name: 'Soleus (Right)',
      displayName: 'Calves — Soleus (Right)',
      nameAr: 'العضلة النعلية العميقة للسمانة (يمين)',
      displayNameAr: 'السمانة النعلية (يمين)',
      region: 'legs',
      view: 'back',
      side: 'right',
      category: 'primary',
      pairedWith: 'soleus_l',
      jointActions: ['Ankle plantarflexion'],
      functionEn: 'Deep plantarflexor active whether knee is bent or straight; primary driver in seated calf raises.',
      functionAr: 'العضلة العميقة لبسط القدم، تنشط بعزل كامل عندما تكون الركبة مثنية (تمارين السمانة جلوساً).',
      aliases: ['deep calf', 'seated calf muscle']
    }
  ];

  // 3. EXERCISES DATABASE WITH PRECISE PRIMARY / SECONDARY / STABILIZER RELATIONSHIPS
  const EXERCISES = [
    {
      id: 'barbell_bench_press',
      name: 'Barbell Bench Press',
      nameAr: 'الضغط بالبار المستوي (Bench Press)',
      equipment: 'barbell',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'pectoralis_major_mid_l', 'pectoralis_major_mid_r',
        'pectoralis_major_lower_l', 'pectoralis_major_lower_r'
      ],
      secondaryMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'triceps_brachii_l', 'triceps_brachii_r',
        'pectoralis_major_upper_l', 'pectoralis_major_upper_r'
      ],
      stabilizingMuscles: [
        'serratus_anterior_l', 'serratus_anterior_r',
        'latissimus_dorsi_l', 'latissimus_dorsi_r',
        'rectus_abdominis_upper', 'forearms_ant_l', 'forearms_ant_r'
      ],
      biomech: 'Horizontal pressing with progressive overload; scapulae retracted and depressed onto bench.',
      defaultSets: 4,
      defaultReps: '6-8',
      defaultRpe: 8.5,
      defaultRestSec: 150,
      defaultTempo: '3-0-1-0'
    },
    {
      id: 'incline_dumbbell_press',
      name: 'Incline Dumbbell Press (30°)',
      nameAr: 'ضغط الدمبلز مائل للأعلى (Incline DB Press)',
      equipment: 'dumbbell',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'pectoralis_major_upper_l', 'pectoralis_major_upper_r'
      ],
      secondaryMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'triceps_brachii_l', 'triceps_brachii_r',
        'pectoralis_major_mid_l', 'pectoralis_major_mid_r'
      ],
      stabilizingMuscles: [
        'serratus_anterior_l', 'serratus_anterior_r',
        'rectus_abdominis_upper', 'forearms_ant_l', 'forearms_ant_r'
      ],
      biomech: '30-degree incline aligns resistance directly with the clavicular pec fibers and reduces front delt impingement.',
      defaultSets: 3,
      defaultReps: '8-10',
      defaultRpe: 8,
      defaultRestSec: 120,
      defaultTempo: '3-1-1-0'
    },
    {
      id: 'cable_fly_mid',
      name: 'Standing Cable Fly (Chest Level)',
      nameAr: 'تفتيح الصدر بالكابل (Cable Fly)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'pectoralis_major_mid_l', 'pectoralis_major_mid_r',
        'pectoralis_major_lower_l', 'pectoralis_major_lower_r'
      ],
      secondaryMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'biceps_brachii_l', 'biceps_brachii_r'
      ],
      stabilizingMuscles: [
        'rectus_abdominis_upper', 'rectus_abdominis_lower',
        'external_obliques_l', 'external_obliques_r',
        'quadriceps_l', 'quadriceps_r'
      ],
      biomech: 'Maintains constant peak tension in peak contraction across horizontal adduction arc.',
      defaultSets: 3,
      defaultReps: '12-15',
      defaultRpe: 8.5,
      defaultRestSec: 90,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'low_to_high_cable_fly',
      name: 'Low-to-High Cable Fly',
      nameAr: 'تفتيح الكابل من أسفل لأعلى (Low-to-High Fly)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'pectoralis_major_upper_l', 'pectoralis_major_upper_r'
      ],
      secondaryMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r'
      ],
      stabilizingMuscles: [
        'rectus_abdominis_upper', 'rectus_abdominis_lower',
        'external_obliques_l', 'external_obliques_r'
      ],
      biomech: 'Follows diagonal path matching the upward clavicular fiber orientation of upper pectorals.',
      defaultSets: 3,
      defaultReps: '12-15',
      defaultRpe: 8,
      defaultRestSec: 75,
      defaultTempo: '2-1-1-1'
    },
    {
      id: 'overhead_shoulder_press',
      name: 'Overhead Barbell Military Press',
      nameAr: 'الضغط العسكري بالبار للكتف (Military Press)',
      equipment: 'barbell',
      difficulty: 'Advanced',
      primaryMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'lateral_deltoid_l', 'lateral_deltoid_r'
      ],
      secondaryMuscles: [
        'triceps_brachii_l', 'triceps_brachii_r',
        'trapezius_upper_l', 'trapezius_upper_r',
        'pectoralis_major_upper_l', 'pectoralis_major_upper_r'
      ],
      stabilizingMuscles: [
        'serratus_anterior_l', 'serratus_anterior_r',
        'rectus_abdominis_upper', 'rectus_abdominis_lower',
        'erector_spinae_l', 'erector_spinae_r',
        'gluteus_maximus_l', 'gluteus_maximus_r'
      ],
      biomech: 'Vertical pressing demanding total core bracing and scapular upward rotation.',
      defaultSets: 4,
      defaultReps: '6-8',
      defaultRpe: 8.5,
      defaultRestSec: 150,
      defaultTempo: '2-0-1-0'
    },
    {
      id: 'lateral_raise_db',
      name: 'Dumbbell Lateral Raise',
      nameAr: 'رفرفة جانبي بالدمبلز (Lateral Raise)',
      equipment: 'dumbbell',
      difficulty: 'Beginner',
      primaryMuscles: [
        'lateral_deltoid_l', 'lateral_deltoid_r'
      ],
      secondaryMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'trapezius_upper_l', 'trapezius_upper_r'
      ],
      stabilizingMuscles: [
        'forearms_ant_l', 'forearms_ant_r',
        'rectus_abdominis_upper', 'erector_spinae_l', 'erector_spinae_r'
      ],
      biomech: 'Scapular plane abduction (30° forward) with lead from elbows to eliminate trap dominance.',
      defaultSets: 4,
      defaultReps: '12-15',
      defaultRpe: 9,
      defaultRestSec: 60,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'face_pull_cable',
      name: 'Rope Face Pull with External Rotation',
      nameAr: 'سحب الحبل للوجه مع دوران خارجي (Face Pull)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'posterior_deltoid_l', 'posterior_deltoid_r',
        'trapezius_mid_l', 'trapezius_mid_r',
        'rhomboids_l', 'rhomboids_r'
      ],
      secondaryMuscles: [
        'lateral_deltoid_l', 'lateral_deltoid_r',
        'trapezius_lower_l', 'trapezius_lower_r',
        'biceps_brachii_l', 'biceps_brachii_r'
      ],
      stabilizingMuscles: [
        'erector_spinae_l', 'erector_spinae_r',
        'rectus_abdominis_upper', 'forearms_ant_l', 'forearms_ant_r'
      ],
      biomech: 'Simultaneous horizontal abduction and external rotation, strengthening rotator cuff integrity.',
      defaultSets: 4,
      defaultReps: '15-20',
      defaultRpe: 8,
      defaultRestSec: 60,
      defaultTempo: '2-1-1-1'
    },
    {
      id: 'lat_pulldown_wide',
      name: 'Wide-Grip Lat Pulldown',
      nameAr: 'السحب العالي بالكابل قبضة واسعة (Lat Pulldown)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'latissimus_dorsi_l', 'latissimus_dorsi_r',
        'teres_major_l', 'teres_major_r'
      ],
      secondaryMuscles: [
        'biceps_brachii_l', 'biceps_brachii_r',
        'brachialis_l', 'brachialis_r',
        'posterior_deltoid_l', 'posterior_deltoid_r',
        'rhomboids_l', 'rhomboids_r',
        'trapezius_lower_l', 'trapezius_lower_r'
      ],
      stabilizingMuscles: [
        'forearms_ant_l', 'forearms_ant_r',
        'rectus_abdominis_upper'
      ],
      biomech: 'Frontal plane shoulder adduction pulling humerus to waist with thoracic extension.',
      defaultSets: 4,
      defaultReps: '8-12',
      defaultRpe: 8.5,
      defaultRestSec: 90,
      defaultTempo: '3-0-1-1'
    },
    {
      id: 'seated_cable_row',
      name: 'Seated Neutral-Grip Cable Row',
      nameAr: 'سحب الكابل الأرضي جلوساً (Seated Cable Row)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'latissimus_dorsi_l', 'latissimus_dorsi_r',
        'rhomboids_l', 'rhomboids_r',
        'trapezius_mid_l', 'trapezius_mid_r'
      ],
      secondaryMuscles: [
        'biceps_brachii_l', 'biceps_brachii_r',
        'brachialis_l', 'brachialis_r',
        'posterior_deltoid_l', 'posterior_deltoid_r',
        'teres_major_l', 'teres_major_r'
      ],
      stabilizingMuscles: [
        'erector_spinae_l', 'erector_spinae_r',
        'hamstrings_l', 'hamstrings_r',
        'forearms_ant_l', 'forearms_ant_r'
      ],
      biomech: 'Horizontal pulling in sagittal plane driving elbows past torso for mid-back contraction.',
      defaultSets: 4,
      defaultReps: '10-12',
      defaultRpe: 8,
      defaultRestSec: 90,
      defaultTempo: '2-1-1-1'
    },
    {
      id: 'barbell_bent_over_row',
      name: 'Barbell Bent-Over Row (45°)',
      nameAr: 'التجديف بالبار منحنياً (Barbell Row)',
      equipment: 'barbell',
      difficulty: 'Advanced',
      primaryMuscles: [
        'latissimus_dorsi_l', 'latissimus_dorsi_r',
        'rhomboids_l', 'rhomboids_r',
        'trapezius_mid_l', 'trapezius_mid_r'
      ],
      secondaryMuscles: [
        'posterior_deltoid_l', 'posterior_deltoid_r',
        'biceps_brachii_l', 'biceps_brachii_r',
        'brachialis_l', 'brachialis_r',
        'trapezius_upper_l', 'trapezius_upper_r'
      ],
      stabilizingMuscles: [
        'erector_spinae_l', 'erector_spinae_r',
        'gluteus_maximus_l', 'gluteus_maximus_r',
        'hamstrings_l', 'hamstrings_r',
        'rectus_abdominis_upper', 'rectus_abdominis_lower',
        'forearms_ant_l', 'forearms_ant_r'
      ],
      biomech: 'Compound posterior chain stability while pulling barbell to lower sternum.',
      defaultSets: 4,
      defaultReps: '6-8',
      defaultRpe: 8.5,
      defaultRestSec: 120,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'barbell_curl',
      name: 'Standing Barbell Biceps Curl',
      nameAr: 'مرجحة البايسبس بالبار أولمبي (Barbell Curl)',
      equipment: 'barbell',
      difficulty: 'Beginner',
      primaryMuscles: [
        'biceps_brachii_l', 'biceps_brachii_r'
      ],
      secondaryMuscles: [
        'brachialis_l', 'brachialis_r',
        'forearms_ant_l', 'forearms_ant_r'
      ],
      stabilizingMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'rectus_abdominis_upper', 'erector_spinae_l', 'erector_spinae_r'
      ],
      biomech: 'Elbow flexion through full range of motion with elbows pinned to ribs to isolate biceps.',
      defaultSets: 3,
      defaultReps: '8-10',
      defaultRpe: 8.5,
      defaultRestSec: 75,
      defaultTempo: '3-0-1-1'
    },
    {
      id: 'hammer_curl_db',
      name: 'Neutral-Grip Dumbbell Hammer Curl',
      nameAr: 'مرجحة المطرقة بالدمبلز (Hammer Curl)',
      equipment: 'dumbbell',
      difficulty: 'Beginner',
      primaryMuscles: [
        'brachialis_l', 'brachialis_r',
        'forearms_ant_l', 'forearms_ant_r'
      ],
      secondaryMuscles: [
        'biceps_brachii_l', 'biceps_brachii_r'
      ],
      stabilizingMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'rectus_abdominis_upper'
      ],
      biomech: 'Neutral wrist maximizes brachialis and brachioradialis leverage to expand arm width.',
      defaultSets: 3,
      defaultReps: '10-12',
      defaultRpe: 8,
      defaultRestSec: 75,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'triceps_cable_pushdown',
      name: 'V-Bar Cable Triceps Pushdown',
      nameAr: 'ترايسبس كابل مسطرة / V (Triceps Pushdown)',
      equipment: 'cable',
      difficulty: 'Beginner',
      primaryMuscles: [
        'triceps_brachii_l', 'triceps_brachii_r'
      ],
      secondaryMuscles: [
        'forearms_ant_l', 'forearms_ant_r'
      ],
      stabilizingMuscles: [
        'rectus_abdominis_upper',
        'pectoralis_major_lower_l', 'pectoralis_major_lower_r'
      ],
      biomech: 'Isolated elbow extension emphasizing lateral and medial heads; lock elbows at bottom.',
      defaultSets: 4,
      defaultReps: '10-12',
      defaultRpe: 8.5,
      defaultRestSec: 60,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'overhead_cable_triceps',
      name: 'Overhead Rope Triceps Extension',
      nameAr: 'ترايسبس حبل خلف الرأس بالكابل (Overhead Extension)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'triceps_brachii_l', 'triceps_brachii_r'
      ],
      secondaryMuscles: [],
      stabilizingMuscles: [
        'rectus_abdominis_upper', 'rectus_abdominis_lower',
        'anterior_deltoid_l', 'anterior_deltoid_r'
      ],
      biomech: 'Shoulder flexion puts long head of triceps in loaded active stretch for hypertrophy.',
      defaultSets: 3,
      defaultReps: '12-15',
      defaultRpe: 8.5,
      defaultRestSec: 60,
      defaultTempo: '3-0-1-1'
    },
    {
      id: 'barbell_back_squat',
      name: 'Barbell Back Squat (High Bar)',
      nameAr: 'السكوات بالبار الحر (Barbell Back Squat)',
      equipment: 'barbell',
      difficulty: 'Advanced',
      primaryMuscles: [
        'quadriceps_l', 'quadriceps_r',
        'gluteus_maximus_l', 'gluteus_maximus_r'
      ],
      secondaryMuscles: [
        'adductors_l', 'adductors_r',
        'soleus_l', 'soleus_r',
        'hamstrings_l', 'hamstrings_r'
      ],
      stabilizingMuscles: [
        'erector_spinae_l', 'erector_spinae_r',
        'rectus_abdominis_upper', 'rectus_abdominis_lower',
        'external_obliques_l', 'external_obliques_r',
        'gastrocnemius_l', 'gastrocnemius_r',
        'gluteus_medius_l', 'gluteus_medius_r'
      ],
      biomech: 'King of leg builders; concurrent knee and hip extension requiring 360-degree core cylinder pressure.',
      defaultSets: 4,
      defaultReps: '6-8',
      defaultRpe: 8.5,
      defaultRestSec: 180,
      defaultTempo: '3-1-1-0'
    },
    {
      id: 'leg_press_45',
      name: '45-Degree Incline Leg Press',
      nameAr: 'مكبس الأرجل بزاوية 45 درجة (Leg Press)',
      equipment: 'machine',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'quadriceps_l', 'quadriceps_r',
        'gluteus_maximus_l', 'gluteus_maximus_r'
      ],
      secondaryMuscles: [
        'adductors_l', 'adductors_r',
        'hamstrings_l', 'hamstrings_r'
      ],
      stabilizingMuscles: [
        'soleus_l', 'soleus_r',
        'gastrocnemius_l', 'gastrocnemius_r'
      ],
      biomech: 'Safe maximal mechanical loading on quads without axial spinal fatigue.',
      defaultSets: 4,
      defaultReps: '10-12',
      defaultRpe: 9,
      defaultRestSec: 120,
      defaultTempo: '3-0-1-0'
    },
    {
      id: 'romanian_deadlift_barbell',
      name: 'Barbell Romanian Deadlift (RDL)',
      nameAr: 'الرفعة الرومانية بالبار (Romanian Deadlift)',
      equipment: 'barbell',
      difficulty: 'Advanced',
      primaryMuscles: [
        'hamstrings_l', 'hamstrings_r',
        'gluteus_maximus_l', 'gluteus_maximus_r'
      ],
      secondaryMuscles: [
        'erector_spinae_l', 'erector_spinae_r',
        'adductors_l', 'adductors_r'
      ],
      stabilizingMuscles: [
        'latissimus_dorsi_l', 'latissimus_dorsi_r',
        'trapezius_upper_l', 'trapezius_upper_r',
        'trapezius_mid_l', 'trapezius_mid_r',
        'forearms_ant_l', 'forearms_ant_r',
        'rectus_abdominis_upper', 'rectus_abdominis_lower'
      ],
      biomech: 'Pure hip hinge under deep hamstring tension without excessive knee flexion.',
      defaultSets: 4,
      defaultReps: '8-10',
      defaultRpe: 8.5,
      defaultRestSec: 150,
      defaultTempo: '3-1-1-0'
    },
    {
      id: 'lying_leg_curl',
      name: 'Lying Leg Curl Machine',
      nameAr: 'ثني الأرجل خلفي استلقاء (Lying Leg Curl)',
      equipment: 'machine',
      difficulty: 'Beginner',
      primaryMuscles: [
        'hamstrings_l', 'hamstrings_r'
      ],
      secondaryMuscles: [
        'gastrocnemius_l', 'gastrocnemius_r'
      ],
      stabilizingMuscles: [
        'gluteus_maximus_l', 'gluteus_maximus_r',
        'tibialis_anterior_l', 'tibialis_anterior_r'
      ],
      biomech: 'Direct isolation of the knee flexion function of hamstrings with knee aligned with pivot point.',
      defaultSets: 4,
      defaultReps: '10-12',
      defaultRpe: 9,
      defaultRestSec: 75,
      defaultTempo: '3-0-1-1'
    },
    {
      id: 'leg_extension_machine',
      name: 'Seated Leg Extension Machine',
      nameAr: 'تمديد الأرجل أمامي بالماكينة (Leg Extension)',
      equipment: 'machine',
      difficulty: 'Beginner',
      primaryMuscles: [
        'quadriceps_l', 'quadriceps_r'
      ],
      secondaryMuscles: [],
      stabilizingMuscles: [
        'rectus_abdominis_upper', 'rectus_abdominis_lower'
      ],
      biomech: 'Full contraction of all four quadriceps heads in shortened position; maintain controlled negative.',
      defaultSets: 4,
      defaultReps: '12-15',
      defaultRpe: 9,
      defaultRestSec: 75,
      defaultTempo: '2-0-1-2'
    },
    {
      id: 'standing_calf_raise',
      name: 'Standing Machine Calf Raise',
      nameAr: 'رفع السمانة وقوفاً بالماكينة (Standing Calf Raise)',
      equipment: 'machine',
      difficulty: 'Beginner',
      primaryMuscles: [
        'gastrocnemius_l', 'gastrocnemius_r'
      ],
      secondaryMuscles: [
        'soleus_l', 'soleus_r'
      ],
      stabilizingMuscles: [
        'quadriceps_l', 'quadriceps_r',
        'gluteus_maximus_l', 'gluteus_maximus_r',
        'tibialis_anterior_l', 'tibialis_anterior_r'
      ],
      biomech: 'Knee extension engages bi-articular gastrocnemius through deep ankle dorsiflexion stretch.',
      defaultSets: 4,
      defaultReps: '12-15',
      defaultRpe: 9,
      defaultRestSec: 60,
      defaultTempo: '3-2-1-1'
    },
    {
      id: 'seated_calf_raise',
      name: 'Seated Calf Raise (Soleus Focus)',
      nameAr: 'رفع السمانة جلوساً (Seated Calf Raise)',
      equipment: 'machine',
      difficulty: 'Beginner',
      primaryMuscles: [
        'soleus_l', 'soleus_r'
      ],
      secondaryMuscles: [
        'gastrocnemius_l', 'gastrocnemius_r'
      ],
      stabilizingMuscles: [
        'tibialis_anterior_l', 'tibialis_anterior_r'
      ],
      biomech: '90-degree knee bend deactivates gastrocnemius, funneling pure tension into deep soleus.',
      defaultSets: 4,
      defaultReps: '15-20',
      defaultRpe: 8.5,
      defaultRestSec: 60,
      defaultTempo: '2-2-1-1'
    },
    {
      id: 'hanging_leg_raise',
      name: 'Hanging Leg / Knee Raise',
      nameAr: 'رفع الأرجل تعليقاً على العقلة (Hanging Leg Raise)',
      equipment: 'bodyweight',
      difficulty: 'Advanced',
      primaryMuscles: [
        'rectus_abdominis_lower', 'rectus_abdominis_upper'
      ],
      secondaryMuscles: [
        'external_obliques_l', 'external_obliques_r'
      ],
      stabilizingMuscles: [
        'forearms_ant_l', 'forearms_ant_r',
        'latissimus_dorsi_l', 'latissimus_dorsi_r',
        'serratus_anterior_l', 'serratus_anterior_r'
      ],
      biomech: 'Posterior pelvic tilt initiates movement to ensure core flexion rather than pure hip flexor pull.',
      defaultSets: 3,
      defaultReps: '12-15',
      defaultRpe: 8.5,
      defaultRestSec: 60,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'cable_woodchopper',
      name: 'High-to-Low Cable Woodchopper',
      nameAr: 'حطاب الخواصر بالكابل (Cable Woodchopper)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'external_obliques_l', 'external_obliques_r',
        'rectus_abdominis_upper', 'rectus_abdominis_lower'
      ],
      secondaryMuscles: [
        'serratus_anterior_l', 'serratus_anterior_r',
        'anterior_deltoid_l', 'anterior_deltoid_r'
      ],
      stabilizingMuscles: [
        'gluteus_medius_l', 'gluteus_medius_r',
        'erector_spinae_l', 'erector_spinae_r'
      ],
      biomech: 'Diagonal rotational torque against cable resistance, targeting rotational core power and waist taper.',
      defaultSets: 3,
      defaultReps: '12-15',
      defaultRpe: 8,
      defaultRestSec: 60,
      defaultTempo: '2-1-1-0'
    },
    {
      id: 'dumbbell_shrugs',
      name: 'Heavy Dumbbell Shrugs',
      nameAr: 'شراغز الترابيس بالدمبلز (Dumbbell Shrugs)',
      equipment: 'dumbbell',
      difficulty: 'Beginner',
      primaryMuscles: [
        'trapezius_upper_l', 'trapezius_upper_r'
      ],
      secondaryMuscles: [
        'trapezius_mid_l', 'trapezius_mid_r',
        'forearms_ant_l', 'forearms_ant_r'
      ],
      stabilizingMuscles: [
        'erector_spinae_l', 'erector_spinae_r',
        'rectus_abdominis_upper'
      ],
      biomech: 'Straight vertical scapular elevation with pause at apex; avoid rolling shoulders backward.',
      defaultSets: 4,
      defaultReps: '10-12',
      defaultRpe: 9,
      defaultRestSec: 90,
      defaultTempo: '2-2-1-0'
    },
    {
      id: 'reverse_barbell_wrist_curl',
      name: 'Over-Bench Barbell Reverse Wrist Curl',
      nameAr: 'ثني المعصم العكسي بالبار على المقعد (Reverse Wrist Curl)',
      equipment: 'barbell',
      difficulty: 'Beginner',
      primaryMuscles: [
        'forearms_post_l', 'forearms_post_r'
      ],
      secondaryMuscles: [
        'forearms_ant_l', 'forearms_ant_r'
      ],
      stabilizingMuscles: [
        'biceps_brachii_l', 'biceps_brachii_r'
      ],
      biomech: 'Forearm pronated across bench with wrist extension isolating the extensor carpi radialis and digitorum under strict tempo.',
      defaultSets: 3,
      defaultReps: '12-15',
      defaultRpe: 8,
      defaultRestSec: 60,
      defaultTempo: '2-0-1-1'
    },
    {
      id: 'standing_cable_reverse_curl',
      name: 'Standing Cable Reverse Curl',
      nameAr: 'مرجحة الكابل بالقبضة المعكوسة (Cable Reverse Curl)',
      equipment: 'cable',
      difficulty: 'Intermediate',
      primaryMuscles: [
        'brachialis_l', 'brachialis_r',
        'forearms_post_l', 'forearms_post_r'
      ],
      secondaryMuscles: [
        'biceps_brachii_l', 'biceps_brachii_r'
      ],
      stabilizingMuscles: [
        'anterior_deltoid_l', 'anterior_deltoid_r',
        'rectus_abdominis_upper'
      ],
      biomech: 'Elbow flexion with pronated grip maximizing brachioradialis leverage and posterior forearm involvement.',
      defaultSets: 3,
      defaultReps: '10-12',
      defaultRpe: 8.5,
      defaultRestSec: 75,
      defaultTempo: '3-0-1-0'
    },
  ];

  // 4. ASSESSMENT STATUSES
  const ASSESSMENT_LEVELS = {
    priority: { id: 'priority', labelEn: 'Priority Focus', labelAr: 'أولوية قصوى', color: '#ef4444' },
    weak: { id: 'weak', labelEn: 'Weak / Lagging', labelAr: 'نقطة ضعف / متأخرة', color: '#f59e0b' },
    balanced: { id: 'balanced', labelEn: 'Balanced & Optimal', labelAr: 'متناسقة ومثالية', color: '#10b981' },
    attention: { id: 'attention', labelEn: 'Mobility / Attention', labelAr: 'تحتاج مرونة وتأهيل', color: '#8b5cf6' }
  };

  // 17 ARCHITECTURAL STABLE CANONICAL IDS
  const STABLE_MUSCLE_IDS = [
    'pectoralis_major_upper',
    'pectoralis_major_middle',
    'pectoralis_major_lower',
    'anterior_deltoid',
    'lateral_deltoid',
    'posterior_deltoid',
    'biceps',
    'triceps',
    'latissimus_dorsi',
    'trapezius',
    'rectus_abdominis',
    'obliques',
    'quadriceps',
    'hamstrings',
    'gluteus_maximus',
    'gastrocnemius',
    'soleus'
  ];

  // Helper lookups
  const muscleMap = new Map();
  const canonicalMap = new Map();

  MUSCLES.forEach(m => {
    muscleMap.set(m.id, m);
    if (m.groupKey && !canonicalMap.has(m.groupKey)) {
      canonicalMap.set(m.groupKey, m);
    }
    if (m.aliases && Array.isArray(m.aliases)) {
      m.aliases.forEach(a => {
        if (!canonicalMap.has(a)) canonicalMap.set(a, m);
      });
    }
  });

  // Explicit mappings for all 17 required stable keys
  canonicalMap.set('pectoralis_major_middle', muscleMap.get('pectoralis_major_mid_l') || muscleMap.get('pectoralis_major_mid_r'));
  canonicalMap.set('pectoralis_major_mid', muscleMap.get('pectoralis_major_mid_l') || muscleMap.get('pectoralis_major_mid_r'));
  canonicalMap.set('pectoralis_major_upper', muscleMap.get('pectoralis_major_upper_l'));
  canonicalMap.set('pectoralis_major_lower', muscleMap.get('pectoralis_major_lower_l'));
  canonicalMap.set('anterior_deltoid', muscleMap.get('anterior_deltoid_l'));
  canonicalMap.set('lateral_deltoid', muscleMap.get('lateral_deltoid_l'));
  canonicalMap.set('posterior_deltoid', muscleMap.get('posterior_deltoid_l'));
  canonicalMap.set('biceps', muscleMap.get('biceps_brachii_l') || muscleMap.get('biceps_brachii_r'));
  canonicalMap.set('triceps', muscleMap.get('triceps_brachii_l') || muscleMap.get('triceps_brachii_r'));
  canonicalMap.set('latissimus_dorsi', muscleMap.get('latissimus_dorsi_l'));
  canonicalMap.set('trapezius', muscleMap.get('trapezius_upper_l') || muscleMap.get('trapezius_mid_l'));
  canonicalMap.set('rectus_abdominis', muscleMap.get('rectus_abdominis_upper'));
  canonicalMap.set('obliques', muscleMap.get('external_obliques_l') || muscleMap.get('external_obliques_r'));
  canonicalMap.set('external_obliques', muscleMap.get('external_obliques_l') || muscleMap.get('external_obliques_r'));
  canonicalMap.set('quadriceps', muscleMap.get('quadriceps_l') || muscleMap.get('quadriceps_r'));
  canonicalMap.set('hamstrings', muscleMap.get('hamstrings_l') || muscleMap.get('hamstrings_r'));
  canonicalMap.set('gluteus_maximus', muscleMap.get('gluteus_maximus_l'));
  canonicalMap.set('gastrocnemius', muscleMap.get('gastrocnemius_l') || muscleMap.get('gastrocnemius_r'));
  canonicalMap.set('soleus', muscleMap.get('soleus_l'));

  const exerciseMap = new Map();
  EXERCISES.forEach(e => exerciseMap.set(e.id, e));

  return {
    REGIONS,
    MUSCLES,
    EXERCISES,
    ASSESSMENT_LEVELS,
    STABLE_MUSCLE_IDS,
    getMuscleById: (id) => {
      if (!id) return null;
      if (muscleMap.has(id)) return muscleMap.get(id);
      if (canonicalMap.has(id)) return canonicalMap.get(id);
      const clean = String(id).toLowerCase().replace(/[- ]/g, '_');
      if (canonicalMap.has(clean)) return canonicalMap.get(clean);
      return null;
    },
    getExerciseById: (id) => exerciseMap.get(id),
    getMusclesByView: (view) => MUSCLES.filter(m => m.view === view),
    getMusclesByRegion: (region) => MUSCLES.filter(m => m.region === region),
        getExercisesForMuscle: (muscleId) => {
      const primary = [];
      const secondary = [];
      const stabilizer = [];

      const target = (muscleMap.get(muscleId) || canonicalMap.get(muscleId));
      const matchIds = new Set([muscleId]);
      if (target) {
        if (target.pairedWith) matchIds.add(target.pairedWith);
        if (target.groupKey) matchIds.add(target.groupKey);
      }

      EXERCISES.forEach(ex => {
        const isPri = ex.primaryMuscles && ex.primaryMuscles.some(id => matchIds.has(id));
        const isSec = !isPri && ex.secondaryMuscles && ex.secondaryMuscles.some(id => matchIds.has(id));
        const isStab = !isPri && !isSec && ex.stabilizingMuscles && ex.stabilizingMuscles.some(id => matchIds.has(id));

        if (isPri) {
          primary.push(ex);
        } else if (isSec) {
          secondary.push(ex);
        } else if (isStab) {
          stabilizer.push(ex);
        }
      });

      return { primary, secondary, stabilizer, total: primary.length + secondary.length + stabilizer.length };
    }
  };
}));