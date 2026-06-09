import React, { useState } from 'react';
import { Member, MatchRequest, MatchmakingLog, Step3Status } from '../types';
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

interface BridePortalProps {
  members: Member[];
  requests: MatchRequest[];
  onUpdateCase: (updatedCase: MatchRequest) => void;
  onCreateCase: (requestingPartyId: string, candidatePartyId: string) => void;
  onSelectBrideId: (id: string) => void;
  selectedBrideId: string;
}

export default function BridePortal({
  members,
  requests,
  onUpdateCase,
  onCreateCase,
  onSelectBrideId,
  selectedBrideId
}: BridePortalProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [proposalNotes, setProposalNotes] = useState('');
  const [searchGQuery, setSearchGQuery] = useState('');

  // Brides list
  const brides = members.filter(m => m.gender === 'bride');
  const selectedBride = brides.find(b => b.id === selectedBrideId) || brides[0];

  // Active matchmaking cases for this bride (inclusive of completed active ones)
  const myCases = requests.filter(r => r.requestingPartyId === selectedBride.id);
  // Find case that is live or most recently advanced
  const activeCase = myCases.find(c => c.currentStep < 6) || myCases.find(c => c.currentStep === 6);

  const matchedGroom = activeCase?.candidatePartyId 
    ? members.find(m => m.id === activeCase.candidatePartyId) 
    : null;

  // Unmatched grooms list for recommendation browsing
  const matchedGroomIds = requests
    .filter(r => r.candidatePartyId !== null)
    .map(r => r.candidatePartyId as string);

  const availableGrooms = members.filter(m => m.gender === 'groom' && !matchedGroomIds.includes(m.id));

  const filteredGrooms = availableGrooms.filter(g => 
    g.name.toLowerCase().includes(searchGQuery.toLowerCase()) ||
    g.location.toLowerCase().includes(searchGQuery.toLowerCase()) ||
    g.profession.toLowerCase().includes(searchGQuery.toLowerCase())
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
        id: 'log_bride_' + Date.now() + '_' + Math.random(),
        timestamp: new Date().toISOString(),
        step,
        message,
        author
      }
    ];
  };

  // Handle Interactive Step 3 Decision
  const handleDecision = (decision: Step3Status) => {
    if (!activeCase) return;

    if (decision === 'Not Interested') {
      const gName = matchedGroom ? matchedGroom.name : 'Candidate';
      const updated: MatchRequest = {
        ...activeCase,
        candidatePartyId: null,
        step2Completed: false,
        step3Status: 'Not Interested',
        currentStep: 2,
        logs: addLog(
          activeCase.logs,
          3,
          `Bride ${selectedBride.name} marked candidate ${gName} as 'Not Interested'. Matchmaker will identify alternative options. Notes: ${feedbackText || 'No additional notes'}`,
          'Requesting Party'
        )
      };
      onUpdateCase(updated);
      setFeedbackText('');
      alert('Your private response has been submitted to the Coordinator. The matchmaking request has been comfortably reset to identify new prospective matches.');
      return;
    }

    if (decision === 'Need More Info') {
      const updated: MatchRequest = {
        ...activeCase,
        step3Status: 'Need More Info',
        step3Feedback: feedbackText,
        logs: addLog(
          activeCase.logs,
          3,
          `Bride ${selectedBride.name} requested more info: "${feedbackText || 'Inquire details'}"`,
          'Requesting Party'
        )
      };
      onUpdateCase(updated);
      setFeedbackText('');
      alert('Your inquiry has been relayed to the Matchmaker. They will conduct secure follow-ups.');
      return;
    }

    if (decision === 'Interested') {
      const updated: MatchRequest = {
        ...activeCase,
        step3Status: 'Interested',
        step3Notes: `Requesting party indicated interest in ${matchedGroom?.name}.`,
        currentStep: 4,
        logs: addLog(
          activeCase.logs,
          3,
          `Bride ${selectedBride.name} approved candidate profile: set status to INTERESTED. Consent recorded for private outreach.`,
          'Requesting Party'
        )
      };
      onUpdateCase(updated);
      setFeedbackText('');
      alert('Alhamdulillah! Your interest has been securely recorded. The coordinator will now seek consent from the candidate side.');
    }
  };

  // Propose recommendation
  const handleProposeMatch = (groomId: string) => {
    // Check if bride has an active case
    const hasLiveCase = myCases.some(c => c.currentStep < 6);
    if (hasLiveCase) {
      alert('You already have a matchmaking request in progress. Please complete or discuss with the Coordinator before proposing another.');
      return;
    }

    const groomObj = members.find(m => m.id === groomId)!;

    // Create case where Step 1 is in-progress and Candidate is pre-selected for review
    const dateStr = new Date().toISOString();
    const newRequest: MatchRequest = {
      id: 'case_' + Date.now(),
      requestingPartyId: selectedBride.id,
      candidatePartyId: groomId,
      currentStep: 1,
      step1Completed: false,
      step1Notes: `Bride requested matching proposal with interest in candidate ${groomObj.name}. Setup coordinator review.`,
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
          id: 'log_req_bride_' + Date.now(),
          timestamp: dateStr,
          step: 1,
          message: `Bride ${selectedBride.name} initiated connection proposal with ${groomObj.name}. Recalls coordination vetting.`,
          author: 'Requesting Party'
        },
        {
          id: 'log_sys_' + Date.now(),
          timestamp: dateStr,
          step: 1,
          message: `Initiated Step 1: Matching registry. Coordinator review scheduled.`,
          author: 'System'
        }
      ]
    };

    // We can simulate creating a new request
    // Call custom handler or add to cases
    onCreateCase(selectedBride.id, groomId);
    alert(`Alhamdulillah! Connection proposal requested with groom ${groomObj.name}. Our matching coordinator will review and audit compliance soon.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Selection Control Panel */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-6 rounded-2xl border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs select-none">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 bg-rose-100/50 px-2.5 py-1 rounded-full font-sans">
            Secure Matrimonial Client Portal
          </span>
          <h2 className="text-xl font-serif font-bold text-stone-850 mt-2 flex items-center gap-2">
            <span>Bride Personal Workspace</span>
            <span className="w-2 h-2 rounded-full bg-rose-450 animate-pulse"></span>
          </h2>
          <p className="text-xs text-stone-550 mt-1">
            Simulate the private dashboard seen by active Brides. Choose your identity below to synchronize views.
          </p>
        </div>

        {/* Identity Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Act As Bride:</label>
          <select
            value={selectedBrideId}
            onChange={e => onSelectBrideId(e.target.value)}
            className="px-4 py-2 text-xs font-bold text-stone-800 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 shadow-2xs cursor-pointer"
          >
            {brides.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.age}y - {b.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Bride Dossier Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs relative">
            <div className="h-2 bg-rose-400" />
            <div className="p-6 text-center">
              <div className="relative inline-block">
                <img 
                  src={selectedBride.photoUrl} 
                  alt={selectedBride.name} 
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-rose-50 shadow-md"
                />
                <span className={`absolute bottom-0 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm ${
                  selectedBride.isPremiumActive ? 'bg-emerald-500' : 'bg-stone-300'
                }`}>
                  ✓
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif text-stone-850 mt-4">{selectedBride.name}</h3>
              <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-0.5">{selectedBride.profession}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-[10px] text-stone-550 mt-3.5">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{selectedBride.location}</span>
              </div>

              {/* Status Ribbon info */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col gap-2.5 text-left text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-medium">Islamic Audit Seal</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm font-bold border border-emerald-150 inline-flex items-center gap-1 text-[10px] uppercase">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-medium">Membership Status</span>
                  {selectedBride.isPremiumActive ? (
                    <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-sm font-bold border border-rose-150 text-[10px] uppercase">
                      Premium Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-red-50 text-red-700 rounded-sm font-bold border border-red-150 text-[10px] uppercase select-all">
                      Review Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed background cards */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h4 className="font-serif font-bold text-stone-850 text-sm border-b border-stone-100 pb-2">My Registered Dossier</h4>
            
            <div className="space-y-3.5 text-xs text-stone-700">
              <div className="flex gap-2.5">
                <GraduationCap className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Education Background</span>
                  <span className="font-medium">{selectedBride.education}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Briefcase className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Profession / Career</span>
                  <span className="font-medium">{selectedBride.profession}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <FileText className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Family Pedigree Statement</span>
                  <p className="text-stone-500 mt-1 italic text-[11px] leading-relaxed">
                    "{selectedBride.familyBackground}"
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Wanted Partner Criteria</span>
                  <p className="text-stone-550 mt-1 italic text-[11px] leading-relaxed font-medium">
                    "{selectedBride.marriagePreferences}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE/RIGHT COLUMNS: Cases and Active Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Active Matching Proposal */}
          {activeCase ? (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              
              {/* Layout header */}
              <div className="bg-stone-50/70 border-b border-stone-200 px-6 py-4.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
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
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-150 rounded-sm text-[10px] font-bold uppercase">
                    Stage {activeCase.currentStep} of 6
                  </span>
                </div>
              </div>

              {/* Step Explanatory Visual Layout */}
              <div className="p-6 space-y-6">
                
                {activeCase.currentStep === 1 && (
                  <div className="p-8 text-center text-stone-600 space-y-3.5">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto border border-rose-100">
                      <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-bold text-stone-850 text-sm">Intake Audit In Progress</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Your matchmaking request is registered. Our coordinator is currently vetting details and preparing your portfolio. We search the registry for suitable profiles once complete.
                      </p>
                    </div>
                  </div>
                )}

                {activeCase.currentStep === 2 && (
                  <div className="p-8 text-center text-stone-600 space-y-3.5">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto border border-rose-100">
                      <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-bold text-stone-850 text-sm">Identifying Compatible Grooms</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        The matchmaker is checking candidates for compliance with your requested credentials, location preferences, and age constraints. Standby for the Step 3 proposal file soon!
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3 INTERACTIVE CANDIDATE DOSSIER REVIEW */}
                {activeCase.currentStep === 3 && matchedGroom && (
                  <div className="space-y-6">
                    <div className="bg-amber-50/45 border border-amber-100 p-4.5 rounded-xl text-xs text-amber-900 leading-relaxed">
                      <div className="flex gap-2 font-bold mb-1 items-center">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Private Candidate Portfolio For Your Review (Step 3)</span>
                      </div>
                      We have identified a compatible professional groom candidate who matches your criteria. Below consists of his educational background and values. Under strict privacy rules, <strong className="font-bold text-amber-950">he is completely unnotified</strong> and does not know this review is happening. Review comfortably.
                    </div>

                    {/* Candidate Details card */}
                    <div className="border border-stone-200 rounded-xl overflow-hidden bg-[#FAF9F6]/40 p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="md:col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200 pb-4 md:pb-0 md:pr-4">
                        <img 
                          src={matchedGroom.photoUrl} 
                          alt="Groom avatar" 
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-full object-cover border-2 border-stone-200"
                        />
                        <span className="text-stone-400 text-[10px] uppercase font-bold mt-2">Confidential Code</span>
                        <span className="font-mono text-xs font-bold text-stone-650 mt-0.5">#{matchedGroom.id.toUpperCase()}</span>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-stone-400">Age / Occupation</span>
                            <span className="block font-semibold text-xs text-stone-800">{matchedGroom.age}y — {matchedGroom.profession}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-stone-400">Residency Location</span>
                            <span className="block font-semibold text-xs text-stone-800">{matchedGroom.location}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-bold text-stone-400">Education Details</span>
                          <span className="block text-xs font-semibold text-stone-850 flex items-center gap-1.5 mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
                            <span>{matchedGroom.education}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-bold text-stone-400">Family & Ethical Pedigree</span>
                          <p className="text-[11px] text-stone-550 italic mt-0.5 leading-relaxed font-medium">
                            "{matchedGroom.familyBackground}"
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
                          placeholder="Provide matching notes or ask specific questions (e.g., 'Does he travel?', 'What are his thoughts on relocations?') ..."
                          className="w-full px-3 py-2.5 text-xs text-stone-800 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 placeholder:text-stone-350"
                        />
                      </div>

                      {/* Interactive Triggers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-1">
                        <button
                          type="button"
                          onClick={() => handleDecision('Interested')}
                          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-850 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Proceed ({activeCase.step3Status === 'Interested' ? 'Saved' : 'Yes'})</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDecision('Need More Info')}
                          className="px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold rounded-xl border border-stone-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>Ask More Info</span>
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

                {activeCase.currentStep === 4 && matchedGroom && (
                  <div className="p-6 text-center border border-stone-150 rounded-xl bg-[#FAF9F6]/40 space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-150">
                      <ShieldCheck className="w-6 h-6 shrink-0" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-bold text-stone-850 text-sm">Interest Confirmed & Saved</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Alhamdulillah, you have expressed interest in candidate <strong className="font-semibold text-stone-800">{matchedGroom.name}</strong>. The coordinator is preparing your verified portfolio dossier for sharing privately with him.
                      </p>
                    </div>
                  </div>
                )}

                {activeCase.currentStep === 5 && matchedGroom && (
                  <div className="p-6 text-center border border-stone-150 rounded-xl bg-[#FAF9F6]/40 space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto border border-blue-150">
                      <Clock className="w-5.5 h-5.5 shrink-0 animate-pulse" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-bold text-stone-850 text-sm">Groom Reviewing (Step 5)</h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Your professional dossier package has been shared confidentially with <strong className="font-semibold text-stone-800">{matchedGroom.name}</strong>. He and his family are privately reviewing details. We will notify you immediately of his decision!
                      </p>
                    </div>
                  </div>
                )}

                {activeCase.currentStep === 6 && matchedGroom && (
                  <div className="p-6 text-center border border-emerald-100 rounded-xl bg-teal-50/20 space-y-5">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="font-bold text-emerald-900 text-base font-serif">Alhamdulillah! Mutual Interest Confirmed!</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Both you and <strong className="font-bold text-stone-800">{matchedGroom.name}</strong> have expressed interest. The coordinator has safely authorized the release of direct contact variables to initiate introduce discussions.
                      </p>
                    </div>

                    {/* Shared Contact block */}
                    <div className="border border-stone-150 rounded-lg p-4 bg-white text-left text-xs text-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                      <div className="space-y-1 font-sans">
                        <strong className="text-[10px] text-stone-400 block uppercase">His Private Reference</strong>
                        <span className="font-bold text-stone-850 inline-block mb-1 text-sm">{matchedGroom.name}</span>
                        <div className="flex gap-1.5 items-center">
                          <Mail className="w-3.5 h-3.5 text-rose-500" />
                          <span>{matchedGroom.contactEmail}</span>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <Phone className="w-3.5 h-3.5 text-rose-500" />
                          <span>{matchedGroom.contactPhone}</span>
                        </div>
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-stone-150 pt-3 sm:pt-0 sm:pl-4 space-y-1 font-sans">
                        <strong className="text-[10px] text-stone-400 block uppercase">Introductory Discussion</strong>
                        <span className="block font-medium text-stone-650">A respectful intro meeting has been scheduled via coordinator oversight:</span>
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
                Our matchmakers are currently searching for verified prospects. You can review available members privately below and request guidance.
              </p>
            </div>
          )}

          {/* CHOOSE NEW CANDIDATES LIST FOR COMPATIBILITY OUTREACH */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-stone-850 text-sm">
                  Browse Secure Grooms Catalog
                </h3>
                <p className="text-[11px] text-stone-450 mt-0.5">
                  Private view of potential partners registered in our premium matching vaults.
                </p>
              </div>

              {/* Search Grooms */}
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Filter Grooms..."
                  value={searchGQuery}
                  onChange={e => setSearchGQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-[11px] bg-[#FAF9F6] border border-stone-200 rounded-lg text-stone-700 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-rose-400"
                />
                <span className="absolute left-2.5 top-2 text-stone-400 text-xs">🔍</span>
              </div>
            </div>

            {/* Grooms grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredGrooms.map(groom => (
                <div 
                  key={groom.id}
                  className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 hover:bg-[#FAF9F6]/40 hover:border-rose-400/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={groom.photoUrl} 
                        alt="Groom pic" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full border border-stone-200 object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-stone-850 text-xs">{groom.name}</h4>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">{groom.profession}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-600 space-y-1">
                      <span className="block"><strong className="text-stone-500">Education:</strong> {groom.education}</span>
                      <span className="block"><strong className="text-stone-500">Residency:</strong> {groom.location}</span>
                      <p className="text-[10px] text-stone-400 line-clamp-2 italic font-mono mt-1">"{groom.marriagePreferences}"</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-150 mt-3 flex items-center justify-between">
                    <span className="text-[9px] bg-amber-50 text-amber-850 border border-amber-200 rounded-xs px-2 py-0.5 font-bold uppercase">
                      Premium
                    </span>

                    <button
                      type="button"
                      onClick={() => handleProposeMatch(groom.id)}
                      className="px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold hover:bg-rose-100/50 cursor-pointer transition-all flex items-center gap-1 leading-tight"
                    >
                      <span>Request Propose</span>
                      <ChevronRight className="w-3 h-3 text-rose-500" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredGrooms.length === 0 && (
                <p className="text-center text-stone-400 text-xs py-6 sm:col-span-2">No unmatched grooms match your quick query filter.</p>
              )}
            </div>

            <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-lg text-[10px] text-rose-850 leading-relaxed font-medium">
              <span className="font-bold text-rose-900 block mb-0.5">⚠️ Matrimony Trust Framework</span>
              Browsing available grooms does NOT share your identity or start immediate notifications. Only when you press "Request Propose" does our human coordinator review compatibility and initiate formal case auditing.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
