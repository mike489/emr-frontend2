import * as Yup from 'yup';

// Helper: strip HTML and check if there's real text
const isNotEmptyHtml = (value?: string) => {
  if (!value) return false;
  const text = value.replace(/<[^>]*>/g, '').trim();
  return text.length > 0;
};

// Define allowed values for Select fields
const EOM_OPTIONS = ['Normal', 'Restricted', 'Other'] as const;
const DILATED_OPTIONS = ['Yes', 'No'] as const;

export const validationSchema = Yup.object().shape({
  // === PATIENT HISTORY ===
  primary_complaint: Yup.string().nullable(),

  current_oscular_medication: Yup.string().nullable(),

  current_contact_lense_use: Yup.boolean().nullable(),

  lens_type: Yup.string().when('current_contact_lense_use', {
    is: true,
    then: schema => schema.required('Lens type is required when contact lens use is selected'),
    otherwise: schema => schema.nullable(),
  }),

  current_systemic_medication: Yup.string().nullable(),

  // Optional arrays
  family_history: Yup.array().of(Yup.string().nullable()).nullable(),
  systemic_conditions: Yup.array().of(Yup.string().nullable()).nullable(),
  allergies: Yup.array().of(Yup.string().nullable()).nullable(),

  // === VISUAL ACUITY (ALL NULLABLE) ===
  ...['distance', 'near'].reduce(
    (acc, dist) => {
      ['od', 'os'].forEach(eye => {
        ['ucva', 'scva', 'bcva'].forEach(type => {
          const field = `${dist}_${eye}_${type}`;
          acc[field] = Yup.string().nullable() as Yup.StringSchema<string | null>;
        });
      });
      return acc;
    },
    {} as Record<string, Yup.StringSchema<string | null>>
  ),

  // === PUPIL REACTION (NULLABLE) ===
  ...['od', 'os'].reduce(
    (acc, eye) => {
      ['ucva', 'scva', 'bcva'].forEach(type => {
        const field = `pupil_reaction_${eye}_${type}`;
        acc[field] = Yup.string().nullable() as Yup.StringSchema<string | null>;
      });
      return acc;
    },
    {} as Record<string, Yup.StringSchema<string | null>>
  ),

  // === OCULAR MOTILITY ===
  eom: Yup.string().oneOf(EOM_OPTIONS, 'Invalid EOM selection').nullable() as Yup.StringSchema<
    (typeof EOM_OPTIONS)[number] | null
  >,

  eom_gaze: Yup.string().nullable(),
  eom_eye: Yup.string().nullable(),

  // === ALIGNMENT TESTS ===
  hirschberg_test: Yup.string().nullable(),
  hirschberg_test_eye: Yup.string().nullable(),
  hirschberg_test_deviation: Yup.string().nullable(),
  cover_uncover_test: Yup.string().nullable(),
  cover_uncover_test_phoria: Yup.string().nullable(),
  cover_uncover_test_tropia: Yup.string().nullable(),
  cover_uncover_test_direction: Yup.string().nullable(),
  cover_uncover_test_distance: Yup.string().nullable(),
  cover_uncover_test_near: Yup.string().nullable(),

  // === STEREOPSIS ===
  stereopsis: Yup.string().nullable(),
  stereopsis_test: Yup.string().nullable(),

  // === IOP ===
  methods: Yup.object({
    value: Yup.string().nullable(),
    other: Yup.string().when('value', {
      is: 'Other',
      then: schema => schema.required('Please specify other method'),
      otherwise: schema => schema.nullable(),
    }),
  }).nullable(),

  left_eye: Yup.string().nullable(),
  right_eye: Yup.string().nullable(),

  time_of_measurement: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm (e.g. 14:30)')
    .nullable(),

  // === ANTERIOR SEGMENT (OD/OS) ===
  ...[
    'lids',
    'lashes',
    'conjunctiva',
    'sclera',
    'lacrimal_system',
    'cornea',
    'anterior_chamber',
    'iris',
    'lens',
    'vitreous',
  ].reduce(
    (acc, part) => {
      acc[`${part}_od`] = Yup.string().nullable() as Yup.StringSchema<string | null>;
      acc[`${part}_os`] = Yup.string().nullable() as Yup.StringSchema<string | null>;
      return acc;
    },
    {} as Record<string, Yup.StringSchema<string | null>>
  ),

  // === DILATION ===
  dilated: Yup.string()
    .oneOf(DILATED_OPTIONS, 'Dilation status must be Yes or No')
    .nullable() as Yup.StringSchema<(typeof DILATED_OPTIONS)[number] | null>,

  dilation_time: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Dilation time must be HH:mm (e.g. 15:00)')
    .when('dilated', {
      is: 'Yes',
      then: schema => schema.required('Dilation time is required when dilated is Yes'),
      otherwise: schema => schema.nullable(),
    }),

  dilation_drops_used: Yup.string().nullable(),

  // === POSTERIOR SEGMENT (OD/OS) ===
  ...['optic_disc', 'macula', 'vessels', 'periphery'].reduce(
    (acc, part) => {
      acc[`${part}_od`] = Yup.string().nullable() as Yup.StringSchema<string | null>;
      acc[`${part}_os`] = Yup.string().nullable() as Yup.StringSchema<string | null>;
      return acc;
    },
    {} as Record<string, Yup.StringSchema<string | null>>
  ),

  // === VITAL SIGNS (NULLABLE) ===
  vitals: Yup.object({
    heart_rate: Yup.string().nullable(),
    temperature: Yup.string().nullable(),
    respiratory_rate: Yup.string().nullable(),
    oxygen_saturation: Yup.string().nullable(),
    blood_pressure: Yup.string().nullable(),
  }).nullable(),

  // === FINAL ===
  primary_diagnosis: Yup.string()
    .test('not-empty-html', 'Primary diagnosis is required', isNotEmptyHtml)
    .nullable(),

  plan: Yup.string()
    .test('not-empty-html', 'Management plan is required', isNotEmptyHtml)
    .nullable(),
});
