import React, { useEffect, useState } from 'react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('expUser');
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  if (!user) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#0d1424]">
        <div className="bg-[#181f2a] p-8 rounded-xl shadow-xl border border-gray-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
          <p className="text-gray-400">No user information found.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#0d1424]">
      <div className="bg-[#181f2a] p-8 rounded-xl shadow-xl border border-gray-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Profile</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-2">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
          <div className="w-full">
            <div className="text-gray-400 text-sm mb-1">Name</div>
            <div className="text-white text-lg font-semibold mb-4">{user.name || '-'}</div>
            <div className="text-gray-400 text-sm mb-1">Email</div>
            <div className="text-white text-lg font-semibold">{user.email || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 