

export interface PatientAddress {
  city?: string;
  kifle_ketema?: string;
  wereda?: string;
}

export interface PatientCategory {
  id: string;
  name: string;
  description?: string;
  color: string;          
  created_at: string;
  updated_at: string;
}

export interface PatientFlags {
  can_be_send_to_triage: boolean;
  is_checked_out: boolean;
  is_checked_in: boolean;
  bill_paid: boolean;
  has_unpaid_bills: boolean;
  requires_payment: boolean;
  patient_has_been_more_than_15_days: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  username?: string;
  status?: string;
  profile_photo_path?: string | null;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CurrentDoctor {
  id: string;
  name: string;
  phone?: string;
  username?: string;
  email: string;
  user?: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  title?: string | null;
  full_name: string;
  emr_number: string;
  date_of_birth?: string | null;     
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string | null;
  address?: PatientAddress | null;
  blood_type?: string | null;
  height?: string | null;
  weight?: string | null;
  national_id?: string | null;
  passport_number?: string | null;
  medical_history?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  created_by: string;
  patient_category_id: string;
  status: string;                      
  visit_id: string;
  constultation_id: string;            
  age: number;
  is_card_expired: boolean;
  current_doctor?: CurrentDoctor | null;
  attachments: any[];                   
  flags: PatientFlags;
  visit_type: "New" | "Follow Up" | string;  
  patient_category: PatientCategory;
  media: any[];                         
  created_at?: string;
  updated_at?: string;
}


export interface PatientListResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    current_page: number;
    data: Patient[];
    total: number;
    per_page: number;
 
  };
}