
import { Profile } from "@/types/auth";
import { ADMIN_EMAILS } from "@/constants/auth";

export const isUserAdmin = (profile: Profile | null): boolean => {
  return profile ? ADMIN_EMAILS.includes(profile.email) : false;
};

export const getRedirectUrl = (): string => {
  return `${window.location.origin}/`;
};
