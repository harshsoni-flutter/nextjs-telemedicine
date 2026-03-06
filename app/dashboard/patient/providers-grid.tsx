'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Provider {
  id: string;
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  bio: string | null;
  years_of_experience: number | null;
}

interface ProvidersGridProps {
  providers: Provider[];
}

export function ProvidersGrid({ providers }: ProvidersGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Get unique specialties
  const specialties = useMemo(() => {
    const specs = new Set(providers.map((p) => p.specialty).filter(Boolean));
    return Array.from(specs).sort();
  }, [providers]);

  // Filter providers based on search and specialty
  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        !searchQuery ||
        `${provider.first_name} ${provider.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        provider.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        !selectedSpecialty || provider.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [providers, searchQuery, selectedSpecialty]);

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-indigo-100 text-indigo-700',
  ];

  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#e8e6e1] bg-white px-4 py-3 text-sm text-[#1a1f2e] placeholder-[#5c6370] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>

        {/* Specialty Filter */}
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSpecialty(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedSpecialty === null
                  ? 'bg-[#0d9488] text-white'
                  : 'border border-[#e8e6e1] bg-white text-[#1a1f2e] hover:border-[#0d9488]'
              }`}
            >
              All specialties
            </button>
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedSpecialty === specialty
                    ? 'bg-[#0d9488] text-white'
                    : 'border border-[#e8e6e1] bg-white text-[#1a1f2e] hover:border-[#0d9488]'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {filteredProviders.length > 0 ? (
        <>
          <p className="text-sm text-[#5c6370]">
            Showing {filteredProviders.length} of {providers.length} providers
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((p, index) => (
              <li key={p.id}>
                <div className="group h-full rounded-2xl border border-[#e8e6e1] bg-white p-6 transition hover:border-[#0d9488] hover:shadow-lg sm:p-8">
                  {/* Avatar */}
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${getAvatarColor(
                        index
                      )}`}
                    >
                      {getInitials(p.first_name, p.last_name)}
                    </div>
                  </div>

                  {/* Provider Name */}
                  <h3 className="text-center text-xl font-semibold text-[#1a1f2e]">
                    {[p.first_name, p.last_name].filter(Boolean).join(' ') ||
                      'Provider'}
                  </h3>

                  {/* Specialty Badge */}
                  {p.specialty && (
                    <div className="mt-3 flex justify-center">
                      <span className="rounded-full bg-[#ccfbf1] px-3 py-1 text-sm font-medium text-[#0d9488]">
                        {p.specialty}
                      </span>
                    </div>
                  )}

                  {/* Bio */}
                  {p.bio && (
                    <p className="mt-4 text-center text-sm text-[#5c6370] line-clamp-3">
                      {p.bio}
                    </p>
                  )}

                  {/* Experience */}
                  {p.years_of_experience != null && (
                    <div className="mt-4 flex items-center justify-center gap-1 text-sm text-[#5c6370]">
                      <svg
                        className="h-4 w-4 text-[#0d9488]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>{p.years_of_experience} years of experience</span>
                    </div>
                  )}

                  {/* Book Button */}
                  <Link
                    href={`/dashboard/patient/book?provider=${p.id}`}
                    className="mt-6 block"
                  >
                    <Button className="w-full bg-[#0d9488] hover:bg-[#0f766e]">
                      Book appointment
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#e8e6e1] p-12 text-center">
          <p className="text-lg text-[#5c6370]">
            No providers match your search. Try a different query or specialty.
          </p>
        </div>
      )}
    </div>
  );
}
