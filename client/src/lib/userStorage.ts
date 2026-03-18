// ===== User Profile Local Storage =====

export interface UserProfile {
  nickname: string;
  firstVisitDate: string;
  skinTypePreference: string;
  reminderEnabled: boolean;
}

const PROFILE_KEY = "xinyan_profile";
const RECORDS_KEY = "xinyan_records";

function getDefaultProfile(): UserProfile {
  return {
    nickname: "芯颜用户",
    firstVisitDate: new Date().toISOString().split("T")[0],
    skinTypePreference: "",
    reminderEnabled: false,
  };
}

export function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return { ...getDefaultProfile(), ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  const profile = getDefaultProfile();
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getDaysSinceFirstVisit(): number {
  const profile = getProfile();
  const first = new Date(profile.firstVisitDate);
  const now = new Date();
  const diff = now.getTime() - first.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function clearAllData(): void {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(RECORDS_KEY);
}
