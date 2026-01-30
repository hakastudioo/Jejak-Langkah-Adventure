
export interface PersonalData {
  fullName: string;
  whatsapp: string;
  email: string;
  address: string;
  mountain: string;
  packageCategory: string; 
  tripPackage: string;      
  startDate: string;
  climberCode?: string;
  identityImage?: string;
}

export interface Registration extends PersonalData {
  id: number;
  status: string;
  timestamp?: string;
  synced?: boolean;
}

export interface AdminSettings {
  googleScriptUrl?: string;
  spreadsheetId?: string;
  adminPhone?: string;
  adminEmail?: string;
}
