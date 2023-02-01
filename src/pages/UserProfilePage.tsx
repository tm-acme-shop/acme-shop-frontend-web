import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { UserProfileForm } from '../components/profile/UserProfileForm';
import { ENABLE_V1_API } from '../config/featureFlags';
import { toUserV1 } from '@acme-shop/shared-ts';
import { createLogger } from '../logging/logger';

const logger = createLogger('UserProfilePage');

export function UserProfilePage() {
  const { user, loading, error } = useUser();

  useEffect(() => {
    logger.info('Page view: profile');
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

  const profileUser = ENABLE_V1_API ? toUserV1(user) : user;

  return (
    <div className="user-profile-page">
      <h1>My Profile</h1>
      <UserProfileForm user={profileUser} />
    </div>
  );
}
