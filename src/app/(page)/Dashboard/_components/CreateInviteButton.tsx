'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateInviteButton() {
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const handleCreateInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/invite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to create invite');
        setLoading(false);
        return;
      }

      setInviteCode(data.invite.code);
      toast.success('Invite created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleCreateInvite} disabled={loading}>
        {loading ? 'Creating...' : 'Create Invite'}
      </Button>

      {inviteCode && (
        <div className="mt-2">
          <p>
            Invite Code: <strong>{inviteCode}</strong>
          </p>
          <p>
            Share this link:{' '}
            <a
              href={`/login/invite/${inviteCode}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              {`${window.location.origin}/login/invite/{inviteCode}`}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
