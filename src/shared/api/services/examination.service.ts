// src/services/examination.service.ts
import { createApiClient } from '../interceptors';
import type { AxiosResponse } from 'axios';

const examinationApi = createApiClient(import.meta.env.VITE_EMS_URL);

/* ------------------------------------------------------------------ */
/* -------------------------- COMMON TYPES -------------------------- */
/* ------------------------------------------------------------------ */

export interface PaginationMeta {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

/** Generic wrapper for paginated list responses */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/** Convenience type for standard API responses */
export type ApiResponse<T> = Promise<AxiosResponse<T>>;

/* ------------------------------------------------------------------ */
/* --------------------------- COMPLAINTS --------------------------- */
/* ------------------------------------------------------------------ */

export interface Complaint {
  id: string;
  visit_id: string;
  complaint: string;
  created_at?: string;
  created_by?: string;
  // Add other fields as returned by your API
}

export interface ComplaintListResponse {
  data: Complaint[];
  pagination: PaginationMeta;
}

export const ComplaintService = {
  // Fetch complaints by visitId with pagination
  list: (visitId: string, page = 1, perPage = 10) =>
    examinationApi.get(`/complaints`, {
      params: { visit_id: visitId, page, per_page: perPage },
    }),

  get: (id: string) => examinationApi.get(`/complaints/${id}`),
  create: (data: any) => examinationApi.post('/complaints', data),
  update: (id: string, data: any) => examinationApi.put(`/complaints/${id}`, data),
  delete: (id: string) => examinationApi.delete(`/complaints/${id}`),
};

/* ------------------------------------------------------------------ */
/* --------------------------- HISTORY (Medical) -------------------- */
/* ------------------------------------------------------------------ */

export interface MedicalHistory {
  id: number;
  created_at: string;
  created_by: string;
  systemic_conditions: string[];
  allergies: string[];
  current_systemic_medication: string;
}

export interface MedicalHistoryListResponse {
  data: MedicalHistory[];
  pagination: PaginationMeta;
}

export const MedicalHistoryService = {
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get('/medical-histories', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  get: (id: number): ApiResponse<MedicalHistory> => examinationApi.get(`/medical-histories/${id}`),

  create: (
    data: Omit<MedicalHistory, 'id' | 'created_at' | 'created_by'>
  ): ApiResponse<MedicalHistory> => examinationApi.post('/medical-histories', data),

  update: (id: number, data: Partial<Omit<MedicalHistory, 'id'>>): ApiResponse<MedicalHistory> =>
    examinationApi.patch(`/medical-histories/${id}`, data),

  delete: (id: number): ApiResponse<void> => examinationApi.delete(`/medical-histories/${id}`),
};

/* ------------------------------------------------------------------ */
/* -------------------------- OCULAR HISTORY ------------------------ */
/* ------------------------------------------------------------------ */

export interface OcularHistory {
  id: number;
  created_at: string;
  created_by: string;
  current_ocular_medication: string;
  current_contact_lense_use: boolean;
  lens_type: string;
  family_history: string[];
}

export interface OcularHistoryListResponse {
  data: OcularHistory[];
  pagination: PaginationMeta;
}

export const OcularHistoryService = {
  list: (visitId: string, page = 1, perPage = 10) =>
    examinationApi.get('/ocular-histories', {
      params: { visit_id: visitId, page, per_page: perPage },
    }),

  get: (id: number) => examinationApi.get(`/ocular-histories/${id}`),

  create: (
    data: Omit<OcularHistory, 'id' | 'created_at' | 'created_by'>
  ): ApiResponse<OcularHistory> => examinationApi.post('/ocular-histories', data),

  update: (id: number, data: Partial<Omit<OcularHistory, 'id'>>): ApiResponse<OcularHistory> =>
    examinationApi.patch(`/ocular-histories/${id}`, data),

  delete: (id: number): ApiResponse<void> => examinationApi.delete(`/ocular-histories/${id}`),
};

/* ------------------------------------------------------------------ */
/* -------------------------- VISUAL ACUITY ------------------------- */
/* ------------------------------------------------------------------ */

export interface EyeAcuity {
  ucva?: string;
  scva?: string;
  bcva?: string;
}

export interface VisualAcuity {
  id: string;
  visit_id: string;
  distance_od: EyeAcuity;
  distance_os: EyeAcuity;
  near_od: EyeAcuity;
  near_os: EyeAcuity;
  pupil_reaction_od: EyeAcuity;
  pupil_reaction_os: EyeAcuity;
  created_at?: string;
  created_by?: string;
}

export interface VisualAcuityListResponse {
  data: VisualAcuity[];
  pagination: PaginationMeta;
}

export const VisualAcuityService = {
  // Fetch all visual acuities for a given visit, with pagination support
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get('/visual-acuities', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single visual acuity record by ID
  get: (id: string) => examinationApi.get(`/visual-acuities/${id}`),

  // Create a new visual acuity record
  create: (data: Omit<VisualAcuity, 'id' | 'created_at' | 'created_by'>) =>
    examinationApi.post('/visual-acuities', data),

  // Update an existing visual acuity record
  update: (id: string, data: Partial<Omit<VisualAcuity, 'id' | 'created_at' | 'created_by'>>) =>
    examinationApi.patch(`/visual-acuities/${id}`, data),

  // Delete a visual acuity record
  delete: (id: string): ApiResponse<void> => examinationApi.delete(`/visual-acuities/${id}`),
};

/* ------------------------------------------------------------------ */
/* ------------------------- OCULAR MOTILITIES ---------------------- */
/* ------------------------------------------------------------------ */

export interface ExtraocularMovements {
  value?: string;
  gaze?: string;
  eye?: string;
}

export interface HirschbergTest {
  value?: string;
  eye?: string;
  deviation?: string;
}

export interface CoverUncoverTest {
  value?: string;
  phoria?: string;
  tropia?: string;
  direction?: string;
  distance?: string;
  near?: string;
}

export interface Stereopsis {
  value?: string;
  test?: string;
}

export interface OcularMotility {
  id: string;
  visit_id: string;
  eom: ExtraocularMovements;
  hirschberg_test: HirschbergTest;
  cover_uncover_test: CoverUncoverTest;
  stereopsis: Stereopsis;
  systemic_conditions?: string[];
  allergies?: string[];
  current_systemic_medication?: string;
  eye_movement_restriction?: string;
  strabismus_type?: string;
  deviation_measurements?: string[];
  created_at?: string;
  created_by?: string;
}

export interface OcularMotilityListResponse {
  data: OcularMotility[];
  pagination: PaginationMeta;
}

export const OcularMotilityService = {
  // List ocular motilities for a visit with pagination & search
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get<OcularMotilityListResponse>('/ocular-motilities', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single ocular motility record
  get: (id: string) => examinationApi.get<OcularMotility>(`/ocular-motilities/${id}`),

  // Create a new ocular motility record
  create: (data: Omit<OcularMotility, 'id' | 'created_at' | 'created_by'>) =>
    examinationApi.post<OcularMotility>('/ocular-motilities', data),

  // Update an existing ocular motility record
  update: (id: string, data: Partial<Omit<OcularMotility, 'id' | 'created_at' | 'created_by'>>) =>
    examinationApi.patch<OcularMotility>(`/ocular-motilities/${id}`, data),

  // Delete an ocular motility record
  delete: (id: string): ApiResponse<void> => examinationApi.delete(`/ocular-motilities/${id}`),
};

/* ------------------------------------------------------------------ */
/* --------------------- INTRAOCULAR PRESSURE ----------------------- */
/* ------------------------------------------------------------------ */

export interface MeasurementMethod {
  value: string;
  other?: string | null;
}

export interface IntraocularPressure {
  id: string;
  visit_id: string;
  left_eye: string;
  right_eye: string;
  time_of_measurement: string;
  method: MeasurementMethod;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

export interface IntraocularPressureListResponse {
  data: IntraocularPressure[];
  pagination: PaginationMeta;
}

export const IntraocularPressureService = {
  // List intraocular pressures for a visit with pagination & search
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get<IntraocularPressureListResponse>('/intraocular-pressures', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single intraocular pressure record
  get: (id: string) => examinationApi.get<IntraocularPressure>(`/intraocular-pressures/${id}`),

  // Create a new intraocular pressure record
  create: (data: Omit<IntraocularPressure, 'id' | 'created_at' | 'created_by'>) =>
    examinationApi.post<IntraocularPressure>('/intraocular-pressures', data),

  // Update an existing intraocular pressure record
  update: (
    id: string,
    data: Partial<Omit<IntraocularPressure, 'id' | 'created_at' | 'created_by'>>
  ) => examinationApi.patch<IntraocularPressure>(`/intraocular-pressures/${id}`, data),

  // Delete an intraocular pressure record
  delete: (id: string): ApiResponse<void> => examinationApi.delete(`/intraocular-pressures/${id}`),
};

/* ------------------------------------------------------------------ */
/* --------------------- ADNEXA EXAMINATION ------------------------- */
/* ------------------------------------------------------------------ */

export interface AdnexaEyeData {
  value: string;
  other?: string | null;
}

export interface AdnexaField {
  od: AdnexaEyeData;
  os: AdnexaEyeData;
}

export interface AdnexaData {
  id: string;
  visit_id: string;
  lids: AdnexaField;
  lashes: AdnexaField;
  conjunctiva: AdnexaField;
  sclera: AdnexaField;
  lacrimal_system: AdnexaField;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

export interface AdnexaListResponse {
  data: AdnexaData[];
  pagination: PaginationMeta;
}

export const AdnexaService = {
  // List adnexa examinations for a visit with pagination & search
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get<AdnexaListResponse>('/adnexa-examinations', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single adnexa examination record
  get: (id: string) => examinationApi.get<AdnexaData>(`/adnexa-examinations/${id}`),

  // Create a new adnexa examination record
  create: (data: Omit<AdnexaData, 'id' | 'created_at' | 'created_by'>) =>
    examinationApi.post<AdnexaData>('/adnexa-examinations', data),

  // Update an existing adnexa examination record
  update: (id: string, data: Partial<Omit<AdnexaData, 'id' | 'created_at' | 'created_by'>>) =>
    examinationApi.patch<AdnexaData>(`/adnexa-examinations/${id}`, data),

  // Delete an adnexa examination record
  delete: (id: string): ApiResponse<void> => examinationApi.delete(`/adnexa-examinations/${id}`),
};

/* ------------------------------------------------------------------ */
/* ------------------- SLIT LAMP EXAMINATION ------------------------ */
/* ------------------------------------------------------------------ */
export interface SlitLampEyeData {
  value: string;
  other?: string | null;
}

export interface SlitLampField {
  od: SlitLampEyeData;
  os: SlitLampEyeData;
}

export interface SlitLampExamination {
  id: string;
  visit_id: string;
  lids: SlitLampField;
  lashes: SlitLampField;
  conjunctiva: SlitLampField;
  cornea: SlitLampField;
  anterior_chamber: SlitLampField;
  iris: SlitLampField;
  pupil: SlitLampField;
  lens: SlitLampField;
  vitreous: SlitLampField;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

/* ----------------------- RESPONSE TYPES ---------------------------- */

export interface SlitLampListResponse {
  data: SlitLampExamination[];
  pagination: PaginationMeta;
}

/* ----------------------- SERVICE METHODS --------------------------- */

export const SlitLampService = {
  // List slit lamp examinations for a visit with pagination & search
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get<SlitLampListResponse>('/slit-lamp-examinations', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single slit lamp examination record
  get: (id: string) => examinationApi.get<SlitLampExamination>(`/slit-lamp-examinations/${id}`),

  // Create a new slit lamp examination record
  create: (data: Omit<SlitLampExamination, 'id' | 'created_at' | 'created_by'>) =>
    examinationApi.post<SlitLampExamination>('/slit-lamp-examinations', data),

  // Update an existing slit lamp examination record
  update: (
    id: string,
    data: Partial<Omit<SlitLampExamination, 'id' | 'created_at' | 'created_by'>>
  ) => examinationApi.patch<SlitLampExamination>(`/slit-lamp-examinations/${id}`, data),

  // Delete a slit lamp examination record
  delete: (id: string): ApiResponse<void> => examinationApi.delete(`/slit-lamp-examinations/${id}`),
};

/* ------------------------------------------------------------------ */
/* --------------------- FUNDUS EXAMINATION ------------------------- */
/* ------------------------------------------------------------------ */

export interface FundusEyeField {
  value: string;
  other?: string | null;
  cupping?: string | null;
}

export interface FundusField {
  od: FundusEyeField;
  os: FundusEyeField;
}

export interface DilatedInfo {
  value: string; // "Yes" or "No"
  time?: string;
  drops?: string;
}

export interface FundusExamination {
  id: string;
  visit_id: string;
  dilated?: DilatedInfo;
  optic_disc?: FundusField;
  macula?: FundusField;
  vessels?: FundusField;
  periphery?: FundusField;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

export interface FundusExaminationListResponse {
  data: FundusExamination[];
  pagination: PaginationMeta;
}

/* -------------------- Service -------------------- */

export const FundusExaminationsService = {
  // List all fundus examinations for a visit
  list: (visitId: string, page = 1, perPage = 10, search = '') =>
    examinationApi.get<FundusExaminationListResponse>('/fundus-examinations', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single fundus examination
  get: (id: string) => examinationApi.get<FundusExamination>(`/fundus-examinations/${id}`),

  // Create a new fundus examination
  create: (data: Omit<FundusExamination, 'id' | 'created_at' | 'created_by'>) =>
    examinationApi.post<FundusExamination>('/fundus-examinations', data),

  // Update an existing fundus examination
  update: (
    id: string,
    data: Partial<Omit<FundusExamination, 'id' | 'created_at' | 'created_by'>>
  ) => examinationApi.patch<FundusExamination>(`/fundus-examinations/${id}`, data),

  // Delete a fundus examination
  delete: (id: string): ApiResponse<void> => examinationApi.delete(`/fundus-examinations/${id}`),
};

/* ------------------------------------------------------------------ */
/* --------------------- INITIAL IMPRESSIONS ------------------------ */
/* ------------------------------------------------------------------ */

export interface InitialImpression {
  id: string;
  visit_id: string;
  primary_diagnosis: string;
  plan: string;
  created_at?: string;
  created_by?: string;
}

export interface InitialImpressionPagination {
  current_page: number;
  data: InitialImpression[];
  total: number;
  last_page: number;
  per_page: number;
}

export interface InitialImpressionListResponse {
  success: boolean;
  message: string;
  status: number;
  data: InitialImpressionPagination;
}

export const InitialImpressionsService = {
  // List initial impressions for a visit
  list: (
    visitId: string,
    page = 1,
    perPage = 10,
    search = ''
  ): Promise<AxiosResponse<InitialImpressionListResponse>> =>
    examinationApi.get('/initial-impressions', {
      params: { visit_id: visitId, page, per_page: perPage, search },
    }),

  // Get a single initial impression
  get: (id: string): Promise<AxiosResponse<InitialImpression>> =>
    examinationApi.get(`/initial-impressions/${id}`),

  // Create a new initial impression
  create: (
    data: Omit<InitialImpression, 'id' | 'created_at' | 'created_by'>
  ): Promise<AxiosResponse<InitialImpression>> => examinationApi.post('/initial-impressions', data),

  // Update an existing initial impression
  update: (
    id: string,
    data: Partial<Omit<InitialImpression, 'id' | 'created_at' | 'created_by'>>
  ): Promise<AxiosResponse<InitialImpression>> =>
    examinationApi.patch(`/initial-impressions/${id}`, data),

  // Delete an initial impression
  delete: (id: string): Promise<ApiResponse<void>> =>
    examinationApi.delete(`/initial-impressions/${id}`),
};
