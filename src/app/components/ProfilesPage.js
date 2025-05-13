import React, { useState, useEffect } from 'react';
import { fetchTopUsers, searchUser } from '@/actions/userActions';
import { HashLoader } from 'react-spinners';
import Link from 'next/link';
import Image from 'next/image';

const formatRupees = (paise) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(paise / 100);
};

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopProfiles = async () => {
      try {
        const topProfiles = await fetchTopUsers();
        // Convert amounts to rupees for display while keeping original paise data
        const formattedProfiles = Array.isArray(topProfiles) 
          ? topProfiles.map(profile => ({
              ...profile,
              displayRaisedFunds: formatRupees(profile.raisedFunds || 0)
            }))
          : [];
        setProfiles(formattedProfiles);
      } catch (error) {
        console.error('Error fetching top profiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    loadTopProfiles();
  }, []);

  useEffect(() => {
    const filterProfiles = async () => {
      if (searchTerm.trim() === '') {
        setFilteredProfiles([]);
        return;
      }

      try {
        const searchResults = await searchUser(searchTerm);
        // Convert amounts to rupees for display
        const formattedResults = Array.isArray(searchResults)
          ? searchResults.map(profile => ({
              ...profile,
              displayRaisedFunds: formatRupees(profile.raisedFunds || 0)
            }))
          : [];
        setFilteredProfiles(formattedResults);
      } catch (error) {
        console.error('Error fetching profiles based on search term:', error);
        setFilteredProfiles([]);
      }
    };
    filterProfiles();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <HashLoader color="#d8b4fe" loading={loading} size={50} />
      </div>
    );
  }

  const displayProfiles = searchTerm.trim() ? filteredProfiles : profiles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
          Support Amazing Creators
        </h1>
        <p className="text-lg text-purple-100 max-w-2xl mx-auto">
          Discover and support talented individuals bringing their ideas to life
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 pl-12 rounded-full bg-purple-800/50 border border-purple-500/30 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-300"
            placeholder="Search creators by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto">
        {searchTerm.trim() && filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-purple-800/30 rounded-full mb-4">
              <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-purple-100 mb-2">No creators found</h3>
            <p className="text-purple-200">We couldn't find any creators matching "{searchTerm}"</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-purple-100">
              {searchTerm.trim() ? 'Search Results' : 'Top Fundraisers'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProfiles.map((profile) => (
                <Link key={profile.username} href={`/${profile.username}`}>
                  <div className="group bg-gradient-to-b from-purple-800/30 to-indigo-800/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={profile.avatar || '/icons/user-default.svg'}
                          alt={profile.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-purple-400"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                          {profile.name}
                        </h3>
                        <p className="text-purple-300">@{profile.username}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="pt-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-purple-200">Raised Funds:</span>
                          <span className="font-bold text-white">
                            {profile.displayRaisedFunds || formatRupees(0)}
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/50 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (profile.raisedFunds || 0) / 10000 * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilesPage;