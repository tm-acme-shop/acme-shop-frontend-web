import { useState, FormEvent, useEffect } from 'react';
import { User, getFullName } from '@acme-shop/shared-ts';
import { updateUserProfile } from '../../services/userService';
import { logger } from '../../logging/logger';
import { isUserV1 } from '../../store/userStore';

interface UserProfileFormProps {
  user: User;
  isLegacy?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * UserProfileForm handles user profile editing.
 * Accepts either User or UserV1 props, with internal mapping from legacy fields.
 *
 * TODO(TEAM-FRONTEND): Remove support for UserV1 once migration is complete
 */
export function UserProfileForm({ user, isLegacy = false }: UserProfileFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     {
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
      });
    } else {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    logger.info('Profile update submitted', {
      userId: user.id,
      isLegacy,
    });

    try {
      await updateUserProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setSuccess(true);
      logger.info('Profile updated successfully', { userId: user.id });
    } catch (err) {
      logger.error('Profile update failed', { error: String(err) });
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>

      {isLegacy && (
        <div className="legacy-notice">
          You are using a legacy profile format. Some features may be limited.
        </div>
      )}

      {success && (
        <div className="success-message">Profile updated successfully!</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          disabled
        />
        <small>Email cannot be changed</small>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
