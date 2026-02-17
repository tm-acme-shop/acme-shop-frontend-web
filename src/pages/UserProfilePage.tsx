import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useLegacyAuth } from '../hooks/useFeatureFlag';
import { UserProfileForm } from '../components/profile/UserProfileForm';
import { toUserV1 } from '@tm-acme-shop/shared';
import { createLogger } from '../logging';

const log = createLogger('user-profile-page');

// FE-150: Profile page migrated to User type (2023-09)
export function UserProfilePage() {
  const { user, loading, error } = useUser();
  const isLegacyAuth = useLegacyAuth();

  useEffect(() => {
    log.info('Page view', { page: 'profile', usingLegacyUser: isLegacyAuth });
  }, [isLegacyAuth]);

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

      {isLegacyAuth ? (
        <UserProfileForm user={toUserV1(user)} isLegacy={true} />
      ) : (
        <UserProfileForm user={user} isLegacy={false} />
      )}
    </div>
  );
}
