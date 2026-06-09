import React, { useState } from 'react';
import { Member, Gender } from '../types';
import { 
  Plus, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  UserPlus
} from 'lucide-react';
import { 
  MALE_AVATAR_1_SVG, 
  MALE_AVATAR_2_SVG, 
  MALE_AVATAR_3_SVG,
  FEMALE_AVATAR_1_SVG,
  FEMALE_AVATAR_2_SVG,
  FEMALE_AVATAR_3_SVG 
} from '../data';

interface MemberDirectoryProps {
  members: Member[];
  onAddMember: (member: Member) => void;
}

const svgToDataUrl = (svgString: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

const PRESET_AVATARS_FEMALE = [
  svgToDataUrl(FEMALE_AVATAR_1_SVG),
  svgToDataUrl(FEMALE_AVATAR_2_SVG),
  svgToDataUrl(FEMALE_AVATAR_3_SVG)
];

const PRESET_AVATARS_MALE = [
  svgToDataUrl(MALE_AVATAR_1_SVG),
  svgToDataUrl(MALE_AVATAR_2_SVG),
  svgToDataUrl(MALE_AVATAR_3_SVG)
];

export default function MemberDirectory({ members, onAddMember }: MemberDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'bride' | 'groom'>('all');
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'premium' | 'regular'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('bride');
  const [age, setAge] = useState<number>(27);
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [familyBackground, setFamilyBackground] = useState('');
  const [marriagePreferences, setMarriagePreferences] = useState('');
  const [isPremiumActive, setIsPremiumActive] = useState(true);
  const [isEligible, setIsEligible] = useState(true);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !education || !profession || !location || !contactEmail) {
      alert('Please fill out all required fields');
      return;
    }

    const avatars = gender === 'bride' ? PRESET_AVATARS_FEMALE : PRESET_AVATARS_MALE;
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newMember: Member = {
      id: 'm_' + Date.now(),
      name,
      gender,
      age: Number(age),
      education,
      profession,
      location,
      familyBackground: familyBackground || 'Polite respectable family background.',
      marriagePreferences: marriagePreferences || 'A like-minded caring partner.',
      photoUrl: randomAvatar,
      isPremiumActive,
      isEligible,
      contactEmail,
      contactPhone: contactPhone || '+1 (555) 000-0000'
    };

    onAddMember(newMember);
    setShowAddForm(false);

    // Reset Form
    setName('');
    setAge(27);
    setEducation('');
    setProfession('');
    setLocation('');
    setFamilyBackground('');
    setMarriagePreferences('');
    setContactEmail('');
    setContactPhone('');
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.education.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGender = genderFilter === 'all' || member.gender === genderFilter;
    const matchesPremium = premiumFilter === 'all' || 
                           (premiumFilter === 'premium' && member.isPremiumActive) ||
                           (premiumFilter === 'regular' && !member.isPremiumActive);

    return matchesSearch && matchesGender && matchesPremium;
  });

  return (
    <div id="member-directory-container" className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-emerald-850 flex items-center gap-2">
              <span>RahMatch Profile Database</span>
              <span className="font-sans text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full text-emerald-700 font-bold border border-emerald-100">
                {members.length} Registered
              </span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Search and filter respectful candidate profiles verified by human coordinators. All photos are kept private.
            </p>
          </div>

          <button 
            id="add-member-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-850 text-white font-medium rounded-xl text-sm transition-all self-start md:self-auto cursor-pointer"
          >
            <UserPlus className="w-4.5 h-4.5" />
            <span>{showAddForm ? 'Cancel Registration' : 'Register New Member'}</span>
          </button>
        </div>

        {/* Add Member Form (Unfolds when requested) */}
        {showAddForm && (
          <form id="new-member-form" onSubmit={handleFormSubmit} className="mt-6 pt-6 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-1 md:col-span-2 text-sm font-bold text-stone-850 uppercase tracking-wider mb-2">
              New Member Registration • Basic Intake Form
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Example: Aisha Rahman"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Gender *</label>
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value as Gender)}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white cursor-pointer"
                >
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Age *</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={e => setAge(Number(e.target.value))}
                  min={18}
                  max={70}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Education Degree *</label>
              <input 
                type="text" 
                value={education} 
                onChange={e => setEducation(e.target.value)}
                placeholder="Example: MS in Engineering, MBA"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Profession / Job Title *</label>
              <input 
                type="text" 
                value={profession} 
                onChange={e => setProfession(e.target.value)}
                placeholder="Example: Software Architect"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Location City / Suburb *</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                placeholder="Example: Seattle, USA"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Direct Contact Email *</label>
              <input 
                type="email" 
                value={contactEmail} 
                onChange={e => setContactEmail(e.target.value)}
                placeholder="private-email@domain.com"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Direct Contact Phone</label>
              <input 
                type="text" 
                value={contactPhone} 
                onChange={e => setContactPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 self-center mt-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isPremiumActive} 
                  onChange={e => setIsPremiumActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded--sm"
                />
                <span className="text-xs font-semibold text-stone-700">Account Verified Status</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isEligible} 
                  onChange={e => setIsEligible(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded-sm"
                />
                <span className="text-xs font-semibold text-stone-700">Eligible for live proposals</span>
              </label>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-stone-600 mb-1">Family Background & Cultural Heritage</label>
              <textarea 
                rows={2}
                value={familyBackground} 
                onChange={e => setFamilyBackground(e.target.value)}
                placeholder="Describe family values, parental professions, religious values, and cultural heritage..."
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-stone-600 mb-1">Marriage Partner Requirements & Preferences</label>
              <textarea 
                rows={2}
                value={marriagePreferences} 
                onChange={e => setMarriagePreferences(e.target.value)}
                placeholder="Ideals regarding theological values, location flexibility, education/profession preferences..."
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-stone-200 rounded-xl text-stone-500 font-medium text-sm hover:bg-stone-100 cursor-pointer"
              >
                Discard
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-emerald-700 text-white font-semibold text-sm rounded-xl hover:bg-emerald-800 transition-all cursor-pointer shadow-xs"
              >
                Register Member
              </button>
            </div>
          </form>
        )}

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row gap-3 mt-4 pt-4 border-t border-stone-200 font-sans">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, job, education..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-stone-400" />
            
            <select 
              value={genderFilter} 
              onChange={e => setGenderFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden bg-white cursor-pointer text-stone-800"
            >
              <option value="all">Any Gender</option>
              <option value="bride">Brides Only</option>
              <option value="groom">Grooms Only</option>
            </select>

            <select 
              value={premiumFilter} 
              onChange={e => setPremiumFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden bg-white cursor-pointer text-stone-800"
            >
              <option value="all">Any Status</option>
              <option value="premium">Verified Only</option>
              <option value="regular">Pending Review Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div 
            key={member.id} 
            id={`member-card-${member.id}`}
            className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500/45 shadow-xs hover:shadow-xs transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Card Photo Banner */}
              <div className="relative h-48 bg-stone-100 select-none">
                <img 
                  src={member.photoUrl} 
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Gender Tag & Premium Status Banner */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs ${
                    member.gender === 'bride' 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-[#334155] text-white'
                  }`}>
                    {member.gender}
                  </span>

                  {member.isPremiumActive ? (
                    <span className="flex items-center gap-1 bg-emerald-600 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs select-none">
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="bg-stone-500 backdrop-blur-xs text-stone-100 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs select-none">
                      Pending Audit
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-stone-850 shadow-xs select-none">
                  {member.age} Yrs Old
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-stone-850 text-lg leading-tight flex items-center justify-between">
                    <span>{member.name}</span>
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{member.location}</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-stone-200 pt-3">
                  <div className="flex items-start gap-2.5 text-xs">
                    <GraduationCap className="w-4.5 h-4.5 text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-stone-600 block font-semibold">Education</strong>
                      <span className="text-stone-500">{member.education}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5 text-xs">
                    <Briefcase className="w-4.5 h-4.5 text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-stone-600 block font-semibold">Profession</strong>
                      <span className="text-stone-500">{member.profession}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    <Users className="w-4.5 h-4.5 text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-stone-600 block font-semibold">Family Background</strong>
                      <span className="text-stone-500 line-clamp-2 md:line-clamp-3 leading-relaxed">{member.familyBackground}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                    <div className="w-full">
                      <strong className="text-emerald-800 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Spouse Expectations</strong>
                      <span className="text-stone-650 italic leading-snug">"{member.marriagePreferences}"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification badging and details */}
            <div className="px-5 py-3.5 border-t border-stone-150 bg-stone-50 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5 text-xs">
                {member.isEligible ? (
                  <span className="text-emerald-650 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Eligible to Match</span>
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                    <span>On Hold / Hidden</span>
                  </span>
                )}
              </div>

              <span className="text-[10px] text-stone-400 font-mono">ID: {member.id}</span>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-450 text-sm">No members match your database filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
