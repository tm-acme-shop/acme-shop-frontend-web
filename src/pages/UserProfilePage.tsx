import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { UserProfileForm } from '../components/profile/UserProfileForm';

export function UserProfilePage() {
  const { user, loading, error } = useUser();

  useEffect(() => {
    console.log('Page view: profile');
  }, []);

  if (loading) {
    return (
      <div className="profile-page loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-page error">
        <p>Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      <UserProfileForm user={user} />
    </div>
  );
}
