import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleInvitation() {
      const inviteId = searchParams.get('inviteId');
      
      if (!inviteId) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        // Get the invitation document
        const inviteRef = doc(db, 'teamMembers', inviteId);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setError('Invitation not found');
          setLoading(false);
          return;
        }

        const inviteData = inviteSnap.data();

        // Check if the invitation is for the current user
        if (inviteData.email.toLowerCase() !== currentUser.email.toLowerCase()) {
          setError('This invitation is for a different email address');
          setLoading(false);
          return;
        }

        // Update the invitation status
        await updateDoc(inviteRef, {
          status: 'accepted',
          acceptedAt: new Date(),
          userId: currentUser.uid
        });

        // Redirect to the team page
        navigate('/team');
      } catch (error) {
        console.error('Error accepting invitation:', error);
        setError('Failed to accept invitation. Please try again.');
        setLoading(false);
      }
    }

    if (currentUser) {
      handleInvitation();
    }
  }, [currentUser, navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Processing Invitation</h2>
          <p className="text-gray-600">Please wait while we process your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/team')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Team Page
          </button>
        </div>
      </div>
    );
  }

  return null;
} 