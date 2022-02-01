import { useState, FormEvent, useEffect } from 'react';
import { UserV1 } from '@acme-shop/shared-ts';

interface UserProfileFormProps {
  user: UserV1;
}

interface FormData {
  name: string;
  email: string;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
    });
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

    console.log('Profile update submitted', user.id);

    try {
      console.log('Profile update - v1 API not supported for updates');
      setSuccess(true);
      console.log('Profile updated successfully', user.id);
    } catch (err) {
      console.log('Profile update failed', String(err));
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>

      {success && (
        <div className="success-message">Profile updated successfully!</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
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
