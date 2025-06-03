import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'teamMembers'),
      where('teamOwnerId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const members = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      setTeamMembers(members);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const inviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setError('');
      await addDoc(collection(db, 'teamMembers'), {
        email: inviteEmail,
        teamOwnerId: currentUser.uid,
        status: 'pending',
        invitedAt: new Date(),
      });
      setInviteEmail('');
    } catch (error) {
      setError('Failed to send invitation. Please try again.');
      console.error('Error inviting member:', error);
    }
  };

  const removeMember = async (memberId) => {
    try {
      await deleteDoc(doc(db, 'teamMembers', memberId));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <p className="mt-2 text-gray-600">
          Manage your team members and collaborators
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Invite Team Member</h2>
        <form onSubmit={inviteMember} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="flex gap-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          {loading ? (
            <div className="text-center py-4">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No team members yet. Invite someone to collaborate!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <li key={member.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status:{' '}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {member.status}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 