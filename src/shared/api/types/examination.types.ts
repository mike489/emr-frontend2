
export interface ExaminationData {
  primary_complaint: string | null;
  current_oscular_medication: string | null;
  current_contact_lense_use: boolean | null;
  lens_type: string | null;
  current_systemic_medication: string | null;
  family_history: string[];
  systemic_conditions: string[];
  allergies: string[];

  // Visual Acuity
  distance_od_ucva: string | null;
  distance_od_scva: string | null;
  distance_od_bcva: string | null;
  distance_os_ucva: string | null;
  distance_os_scva: string | null;
  distance_os_bcva: string | null;
  near_od_ucva: string | null;
  near_od_scva: string | null;
  near_od_bcva: string | null;
  near_os_ucva: string | null;
  near_os_scva: string | null;
  near_os_bcva: string | null;

  // Pupil Reaction
  pupil_reaction_od_ucva: string | null;
  pupil_reaction_od_scva: string | null;
  pupil_reaction_od_bcva: string | null;
  pupil_reaction_os_ucva: string | null;
  pupil_reaction_os_scva: string | null;
  pupil_reaction_os_bcva: string | null;

  // Ocular Motility
  eom: 'Normal' | 'Restricted' | 'Other' | null;
  eom_gaze: string | null;
  eom_eye: string | null;

  // Alignment Tests
  hirschberg_test: string | null;
  hirschberg_test_eye: string | null;
  hirschberg_test_deviation: string | null;
  cover_uncover_test: string | null;
  cover_uncover_test_phoria: string | null;
  cover_uncover_test_tropia: string | null;
  cover_uncover_test_direction: string | null;
  cover_uncover_test_distance: string | null;
  cover_uncover_test_near: string | null;

  // Stereopsis
  stereopsis: string | null;
  stereopsis_test: string | null;

  // IOP
  methods: { value: string; other: string | null } | null;
  left_eye: string | null;
  right_eye: string | null;
  time_of_measurement: string | null;

  // Anterior Segment
  lids_od: string | null;
  lids_os: string | null;
  lashes_od: string | null;
  lashes_os: string | null;
  conjunctiva_od: string | null;
  conjunctiva_os: string | null;
  sclera_od: string | null;
  sclera_os: string | null;
  lacrimal_system_od: string | null;
  lacrimal_system_os: string | null;
  cornea_od: string | null;
  cornea_os: string | null;
  anterior_chamber_od: string | null;
  anterior_chamber_os: string | null;
  iris_od: string | null;
  iris_os: string | null;
  lens_od: string | null;
  lens_os: string | null;
  vitreous_od: string | null;
  vitreous_os: string | null;

  // Dilation
  dilated: 'Yes' | 'No' | null;
  dilation_time: string | null;
  dilation_drops_used: string | null;

  // Posterior Segment
  optic_disc_od: string | null;
  optic_disc_os: string | null;
  macula_od: string | null;
  macula_os: string | null;
  vessels_od: string | null;
  vessels_os: string | null;
  periphery_od: string | null;
  periphery_os: string | null;

  // Vitals
  heart_rate: string | null;
  temperature: string | null;
  respiratory_rate: string | null;
  oxygen_saturation: string | null;
  blood_pressure: string | null;

  // Final
  primary_diagnosis: string | null;
  plan: string | null;
}

export interface ExaminationDataResponse {
  examination_data: ExaminationData;
}
