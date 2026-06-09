import React, { useState } from 'react';
import { Member, MatchRequest, MatchmakingLog, Step5Status } from '../types';
import { 
  Heart, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Send, 
  ChevronRight, 
  RefreshCw,
  Info,
  Clock,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';

interface GroomPortalProps {
  members: Member[];
  requests: MatchRequest[];
  onUpdateCase: (updatedCase: MatchRequest) => void;
  onCreateCase: (requestingPartyId: string, candidatePartyId: string) => void;
  onSelectGroomId: (id: string) => void;
  selectedGroomId: string;
}

export default function GroomPortal({
  members,
  requests,
  onUpdateCase,
  onCreateCase,
  onSelectGroomId,
  selectedGroomId
}: GroomPortalProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [searchBQuery, setSearchBQuery] = useState('');

  // Grooms list
  const grooms = members.filter(m => m.gender === 'groom');
  const selectedGroom = grooms.find(g => g.id === selectedGroomId) || grooms[0];

  // Active cases where this Groom is either the Requesting Party or the Candidate Party
  const myCases = requests.filter(r => 
    r.requestingPartyId === selectedGroom.id || r.candidatePartyId === selectedGroom.id
  );
  // Live or advanced case
  const activeCase = myCases.find(c => c.currentStep < 6) || myCases.find(c => c.currentStep === 6);

  // Identify who the matched Bride is in his case
  const matchedBride = activeCase
    ? (activeCase.requestingPartyId === selectedGroom.id 
        ? (activeCase.candidatePartyId ? members.find(m => m.id === activeCase.candidatePartyId) : null)
        : members.find(m => m.id === activeCase.requestingPartyId))
    : null;

  // Unmatched brides list for recommendations
  const matchedBrideIds = requests
    .filter(r => r.requestingPartyId !== null)
    .map(r => r.requestingPartyId);

  const availableBrides = members.filter(m => m.gender === 'bride' && !matchedBrideIds.includes(m.id));

  const filteredBrides = availableBrides.filter(b => 
    b.name.toLowerCase().includes(searchBQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(searchBQuery.toLowerCase()) ||
    b.profession.toLowerCase().includes(searchBQuery.toLowerCase())
  );

  // Helper log addition
  const addLog = (
    logs: MatchmakingLog[], 
    step: number, 
    message: string, 
    author: 'Coordinator' | 'Matchmaker' | 'Requesting Party' | 'Second Party' | 'System'
  ): MatchmakingLog[] => {
    return [
      ...logs,
      {
        id: 'log_groom_' + Date.now() + '_' + Math.random(),
        timestamp: new Date().toISOString(),
        step,
        message,
        author
      }
    ];
  };

  // Handle Interactive Step 5 Decision
  const handleDecision = (decision: Step5Status) => {
    if (!activeCase) return;

    if (decision === 'Not Interested') {
      const bName = matchedBride ? matchedBride.name : 'Candidate';
      const updated: MatchRequest = {
        ...activeCase,
        candidatePartyId: null,
        step2Completed: false,
        step5Status: 'Not Interested',
        currentStep: 2, // Reset to step 2 search for the case!
        logs: addLog(
          activeCase.logs,
          5,
          `Groom ${selectedGroom.name} marked candidate Bride ${bName} as 'Not Interested'. Match case reset to search phase. Notes: ${feedbackText || 'None'}`,
          'Second Party'
        )
      };
      onUpdateCase(updated);
      setFeedbackText('');
      alert('Your private feedback has been logged. The matching coordinator has been notified to reset matchmaking search parameters.');
      return;
    }

    if (decision === 'Need More Info') {
      const updated: MatchRequest = {
        ...activeCase,
        step5Status: 'Need More Info',
        step5Feedback: feedbackText,
        logs: addLog(
          activeCase.logs,
          5,
          `Groom ${selectedGroom.name} requested supplementary information: "${feedbackText || 'Details'}"`,
          'Second Party'
        )
      };
      onUpdateCase(updated);
      setFeedbackText('');
      alert('Your inquiry was logged. The coordinator will clarify details safely.');
      return;
    }

    if (decision === 'Interested') {
      // Advance to Step 6 (Mutual Interest achieved!)
      const updated: MatchRequest = {
        ...activeCase,
        step5Status: 'Interested',
        step3Status: 'Interested', // Keep A side interested
        currentStep: 6,
        step6Completed: true,
        familyDiscussionScheduled: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Invite scheduled in 4 days
        logs: addLog(
          activeCase.logs,
          5,
          `Groom ${selectedGroom.name} (Second Party) approved candidate bride: status set to INTERESTED. Mutual Match Confirmed!`,
          'Second Party'
        )
      };
      // Add the final system log confirming success
      updated.logs = addLog(
        updated.logs,
        6,
        `MUTUAL INTEREST ACHIEVED between ${matchedBride?.name} and ${selectedGroom.name}! Direct contact details activated. Introductory discussion scheduled.`,
        'System'
      );

      onUpdateCase(updated);
      setFeedbackText('');
      alert('Alhamdulillah! Beautiful news! Both parties have confirmed mutual interest. Direct matches are unlocked; introduction dates have been scheduled.');
    }
  };

  // Submit recommendation proposal
  const handleProposeMatch = (brideId: string) => {
    // Check if grooms has any active cases
    const hasLiveCase = myCases.some(c => c.currentStep < 6);
    if (hasLiveCase) {
      alert('You already have a matching request in progress. Please review current matching files before proposing new ones.');
      return;
    }

    const brideObj = members.find(m => m.id === brideId)!;

    const dateStr = new Date().toISOString();
    const newRequest: MatchRequest = {
      id: 'case_' + Date.now(),
      requestingPartyId: brideId, // In this model, the request centers the Bride as requestingParty, or Groom
      candidatePartyId: selectedGroom.id,
      currentStep: 1,
      step1Completed: false,
      step1Notes: `Groom requested connection proposal with Bride ${brideObj.name}. Coordinator audit of credentials initiated.`,
      step2Completed: false,
      step2Notes: '',
      step2Verified: {
        compatibility: false,
        completeness: false,
        activeStatus: false,
        eligibleProposals: false
      },
      step3Status: 'Pending',
      step3Notes: '',
      step4Completed: false,
      step4Notes: '',
      step4DateShared: '',
      step5Status: 'Pending',
      step5Notes: '',
      step6Completed: false,
      logs: [
        {
          id: 'log_req_groom_' + Date.now(),
          timestamp: dateStr,
          step: 1,
          message: `Groom ${selectedGroom.name} registered connection request with ${brideObj.name}. Background checks initiated.`,
          author: 'Second Party'
        },
        {
          id: 'log_sys_' + Date.now(),
          timestamp: dateStr,
          step: 1,
          message: `Coordinator registered case. Active-search validation scheduled.`,
          author: 'System'
        }
      ]
    };

    onCreateCase(brideId, selectedGroom.id);
    alert(`Alhamdulillah! Connection proposal registered for bride ${brideObj.name}. Our matrimonial coordinator will verify database fields soon.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Selector controls */}
      <div className="bg-gradient-to-r from-indigo-50 to-emerald-50/30 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs select-none">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-100/50 px-2.5 py-1 rounded-full font-sans">
            Secure Matrimonial Client Portal
          </span>
          <h2 className="text-xl font-serif font-bold text-stone-850 mt-2 flex items-center gap-2">
            <span>Groom Personal Workspace</span>
            <span className="w-2 h-2 rounded-full bg-indigo-650 animate-pulse"></span>
          </h2>
          <p className="text-xs text-stone-550 mt-1">
            Simulate the private portal accessed by active Grooms. Choose your profile below to swap perspectives.
          </p>
        </div>

        {/* Identity select */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Act As Groom:</label>
          <select
            value={selectedGroomId}
            onChange={e => onSelectGroomId(e.target.value)}
            className="px-4 py-2 text-xs font-bold text-stone-800 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            {grooms.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.age}y - {g.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT INDEX: Groom profile cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs relative">
            <div className="h-2 bg-indigo-500" />
            <div className="p-6 text-center">
              <div className="relative inline-block">
                <img 
                  src={selectedGroom.photoUrl} 
                  alt={selectedGroom.name} 
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-indigo-50 shadow-md"
                />
                <span className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">
                  ✓
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif text-stone-850 mt-4">{selectedGroom.name}</h3>
              <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-0.5">{selectedGroom.profession}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-[10px] text-stone-550 mt-3.5">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{selectedGroom.location}</span>
              </div>

              {/* Verified seal */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col gap-2.5 text-left text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-medium">Deen & Morals Verified</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm font-bold border border-emerald-150 inline-flex items-center gap-1 text-[10px] uppercase">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Vetted</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-medium">Membership Class</span>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-sm font-bold border border-indigo-150 text-[10px] uppercase">
                    Premium Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h4 className="font-serif font-bold text-stone-850 text-sm border-b border-stone-100 pb-2">My Registered Dossier</h4>
            
            <div className="space-y-3.5 text-xs text-stone-700">
              <div className="flex gap-2.5">
                <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Education Degrees</span>
                  <span className="font-medium">{selectedGroom.education}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Briefcase className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Employment Vocation</span>
                  <span className="font-medium">{selectedGroom.profession}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Family Background Vetting</span>
                  <p className="text-stone-500 mt-1 italic text-[11px] leading-relaxed">
                    "{selectedGroom.familyBackground}"
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Heart className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Sought Wife Attributes</span>
                  <p className="text-stone-550 mt-1 italic text-[11px] leading-relaxed font-medium">
                    "{selectedGroom.marriagePreferences}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AREA: Active matching and browse candidates */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeCase ? (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              
              <div className="bg-stone-50/70 border-b border-stone-200 px-6 py-4.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <Heart className="w-4.5 h-4.5 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-stone-850 text-sm">
                      My Private Matchmaker Proposal
                    </h3>
                    <p className="text-[10px] text-stone-450 mt-0.5">
                      Case Reference: <strong className="font-mono text-[10px] text-stone-500">{activeCase.id}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">Status Index</span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-150 rounded-sm text-[10px] font-bold uppercase">
                    Stage {activeCase.currentStep} of 6
                  </span>
                </div>
              </div>

              {/* Status workflow */}
              <div className="p-6 space-y-6">
                
                {activeCase.currentStep <= 2 && (
                  <div className="p-8 text-center text-stone-600 space-y-3.5">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto border border-indigo-100">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1 ml-auto mr-auto">
                      <h4 className="font-bold text-stone-850 text-sm">Identifying Compatible Brides</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        The coordinator is searching available files. If aligned profile candidates are flagged, we proceed directly into the privacy checks process. Standard notifications follow shortly.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEPS 3 & 4 (Bride reviewing, Groom is waiting/hidden) */}
                {(activeCase.currentStep === 3 || activeCase.currentStep === 4) && (
                  <div className="p-8 text-center border border-stone-150 rounded-xl bg-[#FAF9F6]/40 space-y-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto border border-amber-150">
                      <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="font-serif font-bold text-stone-850 text-base">Candidate Review in Progress</h4>
                      
                      <div className="p-3.5 bg-amber-50/50 text-amber-900 border border-amber-100 rounded-lg text-left text-xs leading-relaxed space-y-1">
                        <span className="font-bold block text-[11px] text-amber-950">🤫 Respectful Silence Framework Active</span>
                        <span>Alhamdulillah, we have presented your credential overview to a compatible verified Bride candidate. Under strict privacy rules, her identifying info remains silent for now. If she clicks interest approval, we immediately release her portfolio for your reciprocal review! Thank you for protecting her comfort of choice.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5 INTERACTIVE BRIDE DOSSIER REVIEW FOR GROOM */}
                {activeCase.currentStep === 5 && matchedBride && (
                  <div className="space-y-6">
                    <div className="bg-amber-50/45 border border-amber-100 p-4.5 rounded-xl text-xs text-amber-900 leading-relaxed">
                      <div className="flex gap-2 font-bold mb-1 items-center">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Private Bride Portfolio For Your Vetting (Step 5)</span>
                      </div>
                      Alhamdulillah, candidate Bride <strong className="font-bold text-amber-950">{matchedBride.name}</strong> has reviewed your files and formally expressed positive matchmaking interest! It is now your turn to confidentially review her family background, education degrees, and credentials.
                    </div>

                    {/* Candidate Details card */}
                    <div className="border border-stone-200 rounded-xl overflow-hidden bg-[#FAF9F6]/40 p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200 pb-4 md:pb-0 md:pr-4">
                        <img 
                          src={matchedBride.photoUrl} 
                          alt="Bride avatar" 
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-full object-cover border-2 border-stone-200"
                        />
                        <span className="text-stone-400 text-[10px] uppercase font-bold mt-2">Bride Code</span>
                        <span className="font-mono text-xs font-bold text-stone-650 mt-0.5">#{matchedBride.id.toUpperCase()}</span>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-stone-400">Age / Occupation</span>
                            <span className="block font-semibold text-xs text-stone-800">{matchedBride.age}y — {matchedBride.profession}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-stone-400">Residency Location</span>
                            <span className="block font-semibold text-xs text-stone-800">{matchedBride.location}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-bold text-stone-400">Education Details</span>
                          <span className="block text-xs font-semibold text-stone-850 flex items-center gap-1.5 mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{matchedBride.education}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-bold text-stone-400">Family Pedigree Standard</span>
                          <p className="text-[11px] text-stone-555 italic mt-0.5 leading-relaxed font-medium text-stone-550">
                            "{matchedBride.familyBackground}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Decision Interface */}
                    <div className="space-y-4 pt-4 border-t border-stone-100">
                      <div>
                        <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                          Add Private Feedback For the Matching Coordinator
                        </label>
                        <textarea
                          rows={2}
                          value={feedbackText}
                          onChange={e => setFeedbackText(e.target.value)}
                          placeholder="Provide specific notes, scheduling preferences, or questions for our hand-reviewed matching audit..."
                          className="w-full px-3 py-2.5 text-xs text-stone-800 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-stone-350"
                        />
                      </div>

                      {/* Interactive Triggers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDecision('Interested')}
                          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-850 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Yes, I am Interested ✓</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDecision('Need More Info')}
                          className="px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-850 font-semibold rounded-xl border border-stone-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>Request Clarity</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDecision('Not Interested')}
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl border border-rose-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline Proposal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCase.currentStep === 6 && matchedBride && (
                  <div className="p-6 text-center border border-emerald-100 rounded-xl bg-teal-50/20 space-y-5">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="font-bold text-emerald-900 text-base font-serif">Alhamdulillah! Mutual Interest Confirmed!</h4>
                      <p className="text-xs text-stone-650 leading-relaxed">
                        Both you and <strong className="font-bold text-stone-850">{matchedBride.name}</strong> have expressed relative interest. Our human coordinator is scheduling safe introductory meetings for both families.
                      </p>
                    </div>

                    {/* Shared Contact details */}
                    <div className="border border-stone-150 rounded-lg p-4 bg-white text-left text-xs text-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                      <div className="space-y-1 font-sans">
                        <strong className="text-[10px] text-stone-400 block uppercase">Her Profile dossier Reference</strong>
                        <span className="font-bold text-stone-850 inline-block mb-1 text-sm">{matchedBride.name}</span>
                        <div className="flex gap-1.5 items-center">
                          <Mail className="w-3.5 h-3.5 text-indigo-505 text-indigo-600" />
                          <span>{matchedBride.contactEmail}</span>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <Phone className="w-3.5 h-3.5 text-indigo-505 text-indigo-600" />
                          <span>{matchedBride.contactPhone}</span>
                        </div>
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-stone-150 pt-3 sm:pt-0 sm:pl-4 space-y-1 font-sans">
                        <strong className="text-[10px] text-stone-400 block uppercase">Introductory Discussion</strong>
                        <span className="block font-medium text-stone-650">Our coordinator is setting up proper parental connection discussion details:</span>
                        <div className="flex gap-1.5 items-center mt-2 p-1.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-100 font-semibold text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{activeCase.familyDiscussionScheduled ? new Date(activeCase.familyDiscussionScheduled).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : 'Date Scheduled Pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <h3 className="font-serif font-bold text-stone-850 text-base">No Matching Case Assigned</h3>
              <p className="text-xs text-stone-450 mt-1 max-w-sm mx-auto">
                No active matrimonial pipeline matches your account currently. Review suggested recommendations below or coordinate with our review boards.
              </p>
            </div>
          )}

          {/* CHOOSE NEW INTERACTIVE RECOMMENDATIONS FOR COMPATIBILITY */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-stone-850 text-sm">
                  Browse Secure Brides Vault
                </h3>
                <p className="text-[11px] text-stone-450 mt-0.5">
                  Private database screening. Members who match structural standards and general location categories.
                </p>
              </div>

              {/* Search Brides */}
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Filter Brides..."
                  value={searchBQuery}
                  onChange={e => setSearchBQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-[11px] bg-[#FAF9F6] border border-stone-200 rounded-lg text-stone-700 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
                />
                <span className="absolute left-2.5 top-2 text-stone-400 text-xs">🔍</span>
              </div>
            </div>

            {/* Brides grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBrides.map(bride => (
                <div 
                  key={bride.id}
                  className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 hover:bg-[#FAF9F6]/40 hover:border-indigo-400/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={bride.photoUrl} 
                        alt="Bride pic" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full border border-stone-200 object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-stone-850 text-xs">{bride.name}</h4>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">{bride.profession}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-600 space-y-1">
                      <span className="block"><strong className="text-stone-500">Education:</strong> {bride.education}</span>
                      <span className="block"><strong className="text-stone-500">Residency:</strong> {bride.location}</span>
                      <p className="text-[10px] text-stone-400 line-clamp-2 italic font-mono mt-1">"{bride.marriagePreferences}"</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-150 mt-3 flex items-center justify-between">
                    <span className="text-[9px] bg-rose-50 text-rose-850 border border-rose-200 rounded-xs px-2 py-0.5 font-bold uppercase">
                      Premium
                    </span>

                    <button
                      type="button"
                      onClick={() => handleProposeMatch(bride.id)}
                      className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold hover:bg-indigo-100/50 cursor-pointer transition-all flex items-center gap-1 leading-tight"
                    >
                      <span>Request Propose</span>
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredBrides.length === 0 && (
                <p className="text-center text-stone-400 text-xs py-6 sm:col-span-2">No unmatched brides match your search filters.</p>
              )}
            </div>

            <div className="p-3 bg-indigo-50/30 border border-indigo-100 rounded-lg text-[10px] text-indigo-850 leading-relaxed font-medium">
              <span className="font-bold text-indigo-900 block mb-0.5">⚠️ Matrimony Trust Framework</span>
              Reviewing recommended candidacies does NOT prompt automatic alerts or compromise privacy. Only when you press "Request Propose" does our human coordinator schedule matching audits between both respective guardians.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
