
import { Profile } from "@/types/auth";

export const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/`;
  }
  return '/';
};

export const isUserAdmin = (profile: Profile | null): boolean => {
  if (!profile?.email) {
    console.log('isUserAdmin: No profile or email found');
    return false;
  }
  
  const adminEmails = ['admin@evidence.com', 'adm@evidence.com', 'natanaelddd@gmail.com'];
  const isAdmin = adminEmails.includes(profile.email);
  
  console.log('isUserAdmin check:', {
    email: profile.email,
    isAdmin,
    adminEmails
  });
  
  return isAdmin;
};
