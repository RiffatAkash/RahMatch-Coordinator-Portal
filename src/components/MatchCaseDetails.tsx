import React, { useState } from 'react';
import { MatchRequest, Member, Step3Status, Step5Status, MatchmakingLog } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  History, 
  Send, 
  Clock, 
  BookOpen, 
  Mail, 
  Phone, 
  Calendar,
  Sparkles,
  Search,
  Check,
  X,
  HelpCircle,
  FileText
} from 'lucide-react';

interface MatchCaseDetailsProps {
  caseItem: MatchRequest;
  members: Member[];
  onBack: () => void;
  onUpdateCase: (updatedCase: MatchRequest) => void;
}

export default function MatchCaseDetails({ 
  caseItem, 
  members, 
  onBack, 
  onUpdateCase 
}: MatchCaseDetailsProps) {
  const [activeStepTab, setActiveStepTab] = useState<number>(caseItem.currentStep);
  
  // Simulated actor perspective (for Role-Playing Steps 3 and 5)
  const [actingRole, setActingRole] = useState<'coordinator' | 'partyA' | 'partyB'>('coordinator');

  // Step 1 local states
  const [step1Check1, setStep1Check1] = useState(caseItem.step1Completed);
  const [step1Check2, setStep1Check2] = useState(caseItem.step1Completed);
  const [step1Check3, setStep1Check3] = useState(caseItem.step1Completed);
  const [step1NotesLocal, setStep1NotesLocal] = useState(caseItem.step1Notes || '');

  // Step 2 local states (Search / Match identification)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(caseItem.candidatePartyId);
  const [step2CheckCompatibility, setStep2CheckCompatibility] = useState(caseItem.step2Completed);
  const [step2CheckCompleteness, setStep2CheckCompleteness] = useState(caseItem.step2Completed);
  const [step2CheckActiveStatus, setStep2CheckActiveStatus] = useState(caseItem.step2Completed);
  const [step2CheckEligible, setStep2CheckEligible] = useState(caseItem.step2Completed);
  const [step2NotesLocal, setStep2NotesLocal] = useState(caseItem.step2Notes || '');

  // Step 3 local states (Feedback typing for party A)
  const [step3FeedbackLocal, setStep3FeedbackLocal] = useState('');

  // Step 4 local states
  const [step4NotesLocal, setStep4NotesLocal] = useState(caseItem.step4Notes || '');
  const [step4DateLocal, setStep4DateLocal] = useState(caseItem.step4DateShared || new Date().toISOString().split('T')[0]);

  // Step 5 local states (Feedback typing for party B)
  const [step5FeedbackLocal, setStep5FeedbackLocal] = useState('');

  // Step 6 local states (Family meeting)
  const [familyMeetingDate, setFamilyMeetingDate] = useState(caseItem.familyDiscussionScheduled || '');

  // Query actual Member profiles
  const requester = members.find(m => m.id === caseItem.requestingPartyId)!;
  const candidate = caseItem.candidatePartyId ? members.find(m => m.id === caseItem.candidatePartyId) : null;

  // Filter candidates of the opposite gender
  const potentialCandidates = members.filter(
    m => m.gender !== requester.gender && m.id !== requester.id
  );

  const filteredCandidatesInSearch = potentialCandidates.filter(m => {
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.profession.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Log write helper
  const addLog = (logs: MatchmakingLog[], step: number, message: string, author: 'Coordinator' | 'Requesting Party' | 'Second Party' | 'System'): MatchmakingLog[] => {
    const newLog: MatchmakingLog = {
      id: 'log_' + Date.now() + '_' + Math.random(),
      timestamp: new Date().toISOString(),
      step,
      message,
      author
    };
    return [...logs, newLog];
  };

  // --- SUBMISSIONS FOR EACH STEP ---

  // STEP 1 COMPLETE
  const handleStep1Submit = () => {
    if (!step1NotesLocal.trim()) {
      alert('Please add profile audit findings / notes before proceeding.');
      return;
    }
    const updated = {
      ...caseItem,
      step1Completed: true,
      step1Notes: step1NotesLocal,
      currentStep: 2 as const,
      logs: addLog(
        caseItem.logs,
        1,
        `Verified Profile: Profile audit completed. ${step1NotesLocal}`,
        'Coordinator'
      )
    };
    onUpdateCase(updated);
    setActiveStepTab(2);
  };

  // STEP 2 COMPLETE 
  const handleStep2Submit = () => {
    if (!selectedCandidateId) {
      alert('Please select a Bride/Groom from the candidates grid first.');
      return;
    }
    if (!step2CheckCompatibility || !step2CheckCompleteness || !step2CheckActiveStatus || !step2CheckEligible) {
      alert('All four registration & compatibility validation checks are mandatory before selecting.');
      return;
    }

    const matchedC_profile = members.find(m => m.id === selectedCandidateId)!;

    const updated = {
      ...caseItem,
      candidatePartyId: selectedCandidateId,
      step2Completed: true,
      step2Notes: step2NotesLocal || `Selected candidate ${matchedC_profile.name} who matches requesting preferences.`,
      step2Verified: {
        compatibility: step2CheckCompatibility,
        completeness: step2CheckCompleteness,
        activeStatus: step2CheckActiveStatus,
        eligibleProposals: step2CheckEligible
      },
      currentStep: 3 as const,
      step3Status: 'Pending' as const, // Clear any previous Step 3 status
      logs: addLog(
        caseItem.logs,
        2,
        `Potential Match Selected: Set ${matchedC_profile.name} as target spouse. Verified completeness, active status and eligibility.`,
        'Coordinator'
      )
    };
    onUpdateCase(updated);
    setActiveStepTab(3);
  };

  // STEP 3 - REQUESTING PARTY SUBMISSIONS (simulate Party A)
  const handleStep3Decision = (status: Step3Status) => {
    if (status === 'Not Interested') {
      // RESET CASE: "the matchmaking process ends and the matchmaker searches for another candidate."
      const candidateName = candidate ? candidate.name : 'Candidate';
      const updated = {
        ...caseItem,
        candidatePartyId: null, // Clear candidate
        step2Completed: false, // Reset Step 2 so we can find a new one
        step3Status: 'Not Interested' as const,
        currentStep: 2 as const, // Reset to step 2 search!
        logs: addLog(
          caseItem.logs,
          3,
          `${requester.name} reviewed candidate ${candidateName} privately and was NOT interested. Match reset to search phase. Notes: ${step3FeedbackLocal || 'No additional feedback provided.'}`,
          'Requesting Party'
        )
      };
      // Reset local checks
      setSelectedCandidateId(null);
      setStep2CheckCompatibility(false);
      setStep2CheckCompleteness(false);
      setStep2CheckActiveStatus(false);
      setStep2CheckEligible(false);
      
      onUpdateCase(updated);
      setActingRole('matchmaker');
      setActiveStepTab(2);
      setStep3FeedbackLocal('');
      alert(`Feedback recorded: "Not Interested". The matchmaking case has safely reset back to Step 2 search guidelines.`);
      return;
    }

    if (status === 'Need More Info') {
      const updated = {
        ...caseItem,
        step3Status: 'Need More Info' as const,
        step3Feedback: step3FeedbackLocal,
        logs: addLog(
          caseItem.logs,
          3,
          `${requester.name} requested more information: "${step3FeedbackLocal || 'Awaiting secondary question answer'}"`,
          'Requesting Party'
        )
      };
      onUpdateCase(updated);
      setStep3FeedbackLocal('');
      alert('Information request logged. The matchmaker will contact you shortly.');
      return;
    }

    if (status === 'Interested') {
      const updated = {
        ...caseItem,
        step3Status: 'Interested' as const,
        step3Notes: `Requesting party indicated absolute interest in ${candidate?.name || 'Selected Candidate'}.`,
        currentStep: 4 as const,
        logs: addLog(
          caseItem.logs,
          3,
          `${requester.name} (Requesting Party) approved candidate photo & details: Status set to INTERESTED.`,
          'Requesting Party'
        )
      };
      onUpdateCase(updated);
      setActingRole('matchmaker');
      setActiveStepTab(4);
      setStep3FeedbackLocal('');
    };
  };

  // STEP 4 - APPROVAL TO PROCEED (Coordinator archives details)
  const handleStep4Submit = () => {
    const updated = {
      ...caseItem,
      step4Completed: true,
      step4Notes: step4NotesLocal,
      step4DateShared: step4DateLocal,
      currentStep: 5 as const,
      step5Status: 'Pending' as const,
      logs: addLog(
        caseItem.logs,
        4,
        `Dossier proceeding approved on ${step4DateLocal}. Shared formal dossier connection path with ${candidate?.name}. Coordinator notes: ${step4NotesLocal || 'None'}`,
        'Coordinator'
      )
    };
    onUpdateCase(updated);
    setActiveStepTab(5);
  };

  // STEP 5 - SECOND PARTY SUBMISSIONS (simulate Party B)
  const handleStep5Decision = (status: Step5Status) => {
    const candidateName = candidate ? candidate.name : 'Party B';
    
    if (status === 'Not Interested') {
      // RESET CASE: Candidate declined proposal. Matchmaker resets to Step 2 for a new search.
      const updated = {
        ...caseItem,
        candidatePartyId: null,
        step2Completed: false,
        step3Status: 'Pending' as const,
        step5Status: 'Not Interested' as const,
        currentStep: 2 as const, // Reset to step 2 search!
        logs: addLog(
          caseItem.logs,
          5,
          `Second Party (${candidateName}) reviewed proposal from ${requester.name} and was NOT interested. Match reset to search phase. Feedback: ${step5FeedbackLocal || 'Declined proposal'}`,
          'Second Party'
        )
      };
      setSelectedCandidateId(null);
      setStep2CheckCompatibility(false);
      setStep2CheckCompleteness(false);
      setStep2CheckActiveStatus(false);
      setStep2CheckEligible(false);
      
      onUpdateCase(updated);
      setActingRole('matchmaker');
      setActiveStepTab(2);
      setStep5FeedbackLocal('');
      alert(`Feedback recorded: "Not Interested". Second Party rejected. The matching process resets back to Step 2 search.`);
      return;
    }

    if (status === 'Need More Info') {
      const updated = {
        ...caseItem,
        step5Status: 'Need More Info' as const,
        step5Feedback: step5FeedbackLocal,
        logs: addLog(
          caseItem.logs,
          5,
          `Second Party (${candidateName}) requested more parameters: "${step5FeedbackLocal || 'Awaiting details'}"`,
          'Second Party'
        )
      };
      onUpdateCase(updated);
      setStep5FeedbackLocal('');
      alert('Information request logged from Second Party. Action noted for Matchmaker.');
      return;
    }

    if (status === 'Interested') {
      const updated = {
        ...caseItem,
        step5Status: 'Interested' as const,
        step5Notes: `Second party (${candidateName}) indicated interest in ${requester.name}.`,
        currentStep: 6 as const,
        step6Completed: true,
        logs: addLog(
          caseItem.logs,
          5,
          `Second Party (${candidateName}) approved proposal: Status set to INTERESTED. MUTUAL INTEREST CONFIRMED!`,
          'Second Party'
        )
      };
      onUpdateCase(updated);
      setActingRole('matchmaker');
      setActiveStepTab(6);
      setStep5FeedbackLocal('');
    }
  };

  // STEP 6 - SCHEDULING DISCUSSIONS
  const handleScheduleFamilyMet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyMeetingDate) return;

    const updated = {
      ...caseItem,
      familyDiscussionScheduled: familyMeetingDate,
      logs: addLog(
        caseItem.logs,
        6,
        `Scheduled introductory family discussion meetup for: ${familyMeetingDate}`,
        'Coordinator'
      )
    };
    onUpdateCase(updated);
    alert(`Introductory Family Discussion scheduled for ${familyMeetingDate}!`);
  };

  return (
    <div id="match-case-details-view" className="space-y-6">
      
      {/* Back Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button 
          id="back-to-dashboard-btn"
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Dashboard</span>
        </button>

        {/* Actor Roleplaying Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs font-medium self-end sm:self-auto select-none mt-1 sm:mt-0 font-sans">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Demo Role:</span>
          
          <button
            onClick={() => setActingRole('coordinator')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              actingRole === 'coordinator' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            Coordinator
          </button>
          
          {caseItem.currentStep === 3 && (
            <button
              onClick={() => setActingRole('partyA')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                actingRole === 'partyA' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              👩 {requester.name} (Party A)
            </button>
          )}

          {caseItem.currentStep === 5 && (
            <button
              onClick={() => setActingRole('partyB')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                actingRole === 'partyB' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-emerald-605 hover:bg-emerald-50'
              }`}
            >
              👨 {candidate?.name || 'Party B'} (Party B)
            </button>
          )}
        </div>
      </div>

      {/* Case Overview Panel */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase font-sans">
                Case ID: {caseItem.id}
              </span>
              {caseItem.currentStep === 6 && (
                <span className="text-[11px] font-bold tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase flex items-center gap-1 font-sans">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Mutual Confirmed</span>
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight font-serif text-slate-100">
              Matchmaking Case: {requester.name} ⇆ {candidate ? candidate.name : 'Identifying Matching Candidate...'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Active tracking of the mutual matching pipeline requirements. Use the controls below to update states.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs w-full md:w-auto font-sans">
            <div className="text-center shrink-0">
              <span className="block text-[11px] font-medium text-slate-400 uppercase">Current Step</span>
              <span className="block text-xl font-bold font-mono text-emerald-400 font-sans">Step {caseItem.currentStep}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-left font-sans">
              <span className="block text-[11px] font-medium text-slate-400 uppercase font-sans">Latest Action</span>
              <span className="block text-xs font-semibold text-slate-200 truncate max-w-56">
                {caseItem.logs[caseItem.logs.length - 1]?.message || 'Case instituted.'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Warning Alert for Roleplay */}
        {caseItem.currentStep === 3 && actingRole === 'coordinator' && (
          <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5 font-sans">
            <AlertCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="font-semibold block text-emerald-300 mb-0.5 font-sans">🔒 Step 3: Action Required by Requesting Party ({requester.name})</strong>
              To proceed to step 4, the requesting party must privately review the candidate's portrait and express interest. Since this is a test simulation, toggle the role at the top right to <strong className="text-light font-bold underline bg-emerald-500/20 px-1 py-0.5 rounded-sm">👩 {requester.name} (Party A)</strong> to submit their decision.
            </div>
          </div>
        )}

        {caseItem.currentStep === 5 && actingRole === 'coordinator' && (
          <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5 font-sans">
            <AlertCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="font-semibold block text-emerald-300 mb-0.5 font-sans">🔒 Step 5: Action Required by Second Party ({candidate?.name})</strong>
              To fulfill Mutual Interest constraints, the second party must review the proposal. Toggle the simulation role at the top right to <strong className="text-light font-bold underline bg-emerald-500/20 px-1 py-0.5 rounded-sm">👨 {candidate?.name || 'Party B'} (Party B)</strong> to decide.
            </div>
          </div>
        )}
      </div>

      {/* Main Split Layout: Left Step Navigation | Right Interactive Active Step Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: 6-Step Stepper Menu */}
        <div id="side-stepper-menu" className="col-span-1 lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1.5 pb-2 border-b border-slate-100">
            Pipeline Steps
          </h3>

          {[1, 2, 3, 4, 5, 6].map(num => {
            const isCompleted = num < caseItem.currentStep;
            const isActive = num === caseItem.currentStep;
            const isCurrentTab = num === activeStepTab;
            
            let btnBg = 'hover:bg-slate-50 text-slate-600 border-transparent';
            if (isCurrentTab) btnBg = 'bg-emerald-700 text-white shadow-xs border-emerald-700';
            else if (isCompleted) btnBg = 'bg-emerald-50/70 text-emerald-800 border-emerald-100/60 hover:bg-emerald-100/50';
            else if (isActive) btnBg = 'bg-emerald-50 text-emerald-950 border-emerald-150/70 hover:bg-emerald-100/60';

            return (
              <button
                key={num}
                id={`sidebar-step-tab-${num}`}
                onClick={() => setActiveStepTab(num)}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all font-medium cursor-pointer font-sans ${btnBg}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted ? 'bg-emerald-600 text-white' :
                    isActive ? 'bg-emerald-700 text-white animate-pulse' :
                    isCurrentTab ? 'bg-white text-slate-800' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? '✓' : num}
                  </div>
                  <div className="text-left font-sans">
                    <span className="block text-xs font-semibold">
                      {num === 1 && "1. Request Audit"}
                      {num === 2 && "2. Identify Potential Match"}
                      {num === 3 && "3. Share Candidate Photo"}
                      {num === 4 && "4. Record Consent"}
                      {num === 5 && "5. Share Profile Details"}
                      {num === 6 && "6. Mutual Interest Meeting"}
                    </span>
                    <span className="block text-[10px] opacity-75">
                      {num === num && (
                        isCompleted ? 'Finished' :
                        isActive ? 'Active Task' : 'Awaiting Previous'
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 font-sans">
                  {num > caseItem.currentStep && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-slate-100/80 rounded-sm text-slate-400 text-center">Locked</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Step Panel */}
        <div className="col-span-1 lg:col-span-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6 min-h-[480px]">
          
          {/* STEP HEADER OVERVIEW */}
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                Stage {activeStepTab} Controls
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">
                {activeStepTab === 1 && "Step 1: Matchmaking Request Profile Review"}
                {activeStepTab === 2 && "Step 2: Database Search & Potential Match Identification"}
                {activeStepTab === 3 && "Step 3: Private Photo Sharing with Requesting Party"}
                {activeStepTab === 4 && "Step 4: Formal Approvals & Recording Proceedings"}
                {activeStepTab === 5 && "Step 5: Share dossier with Second Candidate"}
                {activeStepTab === 6 && "Step 6: Mutual Interest Confirmation & Introductions"}
              </h2>
            </div>

            <div className="text-right">
              {activeStepTab < caseItem.currentStep && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Passed ✓</span>
              )}
              {activeStepTab === caseItem.currentStep && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full animate-pulse">Running Node</span>
              )}
              {activeStepTab > caseItem.currentStep && (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Locked Node</span>
              )}
            </div>
          </div>

          {/* RENDERING INDIVIDUAL ACTIVE STEP MODULE CONTROLS */}

          {/* STEP 1: MATCHMAKING REQUEST AUDIT */}
          {activeStepTab === 1 && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img 
                    src={requester.photoUrl} 
                    alt={requester.name} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-xs" 
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{requester.name} ({requester.gender === 'bride' ? 'Bride' : 'Groom'})</h3>
                    <p className="text-xs text-slate-500">{requester.profession} • {requester.location} • {requester.age} Yrs</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-200/50">
                  <div>
                    <span className="font-semibold block text-slate-600 uppercase tracking-wider text-[10px] mb-1">Education Credentials</span>
                    <span className="text-slate-700 bg-white p-2 rounded-lg border border-slate-150 block">{requester.education}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-600 uppercase tracking-wider text-[10px] mb-1">Profession Alignment</span>
                    <span className="text-slate-700 bg-white p-2 rounded-lg border border-slate-150 block">{requester.profession}</span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-semibold block text-slate-600 uppercase tracking-wider text-[10px] mb-1">Family Structure & Background</span>
                    <span className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-150 block leading-relaxed">{requester.familyBackground}</span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-semibold block text-slate-600 uppercase tracking-wider text-[10px] mb-1">Demanded Partner Preferences</span>
                    <span className="text-slate-850 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100/50 block italic leading-relaxed font-medium">"{requester.marriagePreferences}"</span>
                  </div>
                </div>
              </div>

              {/* Action checklist */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Coordinator's Audit Verification Checklist</h4>
                
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={step1Check1}
                      onChange={e => setStep1Check1(e.target.checked)}
                      disabled={caseItem.currentStep > 1}
                      className="w-4 h-4 text-emerald-700 focus:ring-emerald-500 rounded-sm" 
                    />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">Age & Location Audit</span>
                      <span className="block text-[10px] text-slate-400 font-sans">Checked legal credentials, certified date of birth and residency.</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={step1Check2}
                      onChange={e => setStep1Check2(e.target.checked)}
                      disabled={caseItem.currentStep > 1}
                      className="w-4 h-4 text-emerald-700 focus:ring-emerald-500 rounded-sm" 
                    />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">Educational & Career Verification</span>
                      <span className="block text-[10px] text-slate-400 font-sans">Inspected reported credentials, resumes and corporate active employment documents.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={step1Check3}
                      onChange={e => setStep1Check3(e.target.checked)}
                      disabled={caseItem.currentStep > 1}
                      className="w-4 h-4 text-emerald-700 focus:ring-emerald-500 rounded-sm" 
                    />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">Family Background & Preference Integrity</span>
                      <span className="block text-[10px] text-slate-400 font-sans">Confirmed interview parameters with registering primary parent / guardian.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Coordinator auditing notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5 font-sans">Coordinator Audit Notes *</label>
                <textarea 
                  rows={3}
                  value={step1NotesLocal}
                  onChange={e => setStep1NotesLocal(e.target.value)}
                  disabled={caseItem.currentStep > 1}
                  placeholder="Record summary of profile qualifications, special notes, family cultural criteria etc..."
                  className="w-full text-sm border border-slate-200 focus:ring-1 focus:outline-hidden focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-500 font-sans"
                />
              </div>

              {caseItem.currentStep === 1 ? (
                <button
                  onClick={handleStep1Submit}
                  disabled={!step1Check1 || !step1Check2 || !step1Check3 || !step1NotesLocal.trim()}
                  className="w-full px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Confirm Profile Valid & Proceed to Step 2 search
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>Profile audit successfully finalized on case institution. Progress locked.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: IDENTIFY POTENTIAL MATCH */}
          {activeStepTab === 2 && (
            <div className="space-y-6">
              {caseItem.currentStep === 2 ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                      Search and Select suitable Bride/Groom candidate ({requester.gender === 'bride' ? 'Grooms' : 'Brides'} Pool)
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal">
                      Query available registered candidates whose backgrounds match AI credentials. Compare details below:
                    </p>
                  </div>

                  {/* MINI SEARCH GRID */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search candidates by name, location, degree..."
                        className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                      {filteredCandidatesInSearch.map(m => {
                        const isSel = selectedCandidateId === m.id;
                        return (
                          <div 
                            key={m.id}
                            id={`candidate-search-${m.id}`}
                            onClick={() => {
                              setSelectedCandidateId(m.id);
                              // Trigger state warning if membership inactive
                              setStep2CheckActiveStatus(m.isPremiumActive);
                            }}
                            className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                              isSel 
                                ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-100'
                                : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200 bg-white'
                            }`}
                          >
                            <img 
                              src={m.photoUrl} 
                              alt={m.name} 
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-lg object-cover" 
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                <span className="truncate">{m.name}</span>
                                <span className="font-mono text-[9px] uppercase bg-slate-100 text-slate-500 px-1 py-0.5 rounded-sm shrink-0">{m.age}y</span>
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate">{m.profession}</p>
                              <p className="text-[9px] text-slate-500 truncate font-medium">{m.location}</p>
                            </div>
                          </div>
                        );
                      })}

                      {filteredCandidatesInSearch.length === 0 && (
                        <p className="col-span-2 text-center text-xs text-slate-400 py-6">No matching candidates available.</p>
                      )}
                    </div>
                  </div>

                  {/* SIDE BY SIDE COMPARISON PREVIEW */}
                  {selectedCandidateId && (() => {
                    const chosen = members.find(m => m.id === selectedCandidateId)!;
                    return (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <span className="text-xs font-bold text-slate-700">Side-by-Side Compatibility Review</span>
                          <span className="text-[10px] font-mono text-slate-400">Target Candidate: {chosen.name}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          {/* Col 1: Party A */}
                          <div className="space-y-2 border-r border-slate-200/50 pr-4">
                            <span className="block text-[10px] font-bold text-emerald-700 uppercase font-sans">👩 Party A: {requester.name}</span>
                            <p className="font-semibold text-slate-800">{requester.age} Yrs • {requester.location}</p>
                            <p className="text-slate-500 font-sans">Edu: {requester.education}</p>
                            <p className="text-slate-500 font-sans">Prof: {requester.profession}</p>
                            <div className="bg-white p-2 rounded-lg text-[10px] border border-slate-150 text-slate-600 font-sans">
                              <strong className="block text-[9px] uppercase font-bold text-slate-400">Needs</strong>
                              <span className="italic">"{requester.marriagePreferences}"</span>
                            </div>
                          </div>

                          {/* Col 2: Chosen Party B */}
                          <div className="space-y-2 pl-2">
                            <span className="block text-[10px] font-bold text-emerald-600 uppercase font-sans">👨 Party B: {chosen.name}</span>
                            <p className="font-semibold text-slate-800">{chosen.age} Yrs • {chosen.location}</p>
                            <p className="text-slate-500">Edu: {chosen.education}</p>
                            <p className="text-slate-500">Prof: {chosen.profession}</p>
                            <div className="bg-white p-2 rounded-lg text-[10px] border border-slate-150 text-slate-600">
                              <strong className="block text-[9px] uppercase font-bold text-slate-400 font-sans">Needs</strong>
                              <span className="italic">"{chosen.marriagePreferences}"</span>
                            </div>
                          </div>
                        </div>

                        {/* Prompt-mandated Verification Checklist */}
                        <div className="pt-3 border-t border-slate-200/60 space-y-2.5">
                          <span className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">
                            Step 2 Mandatory Verifications
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            
                            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-150 cursor-pointer select-none font-sans font-sans">
                              <input 
                                type="checkbox" 
                                checked={step2CheckCompatibility}
                                onChange={e => setStep2CheckCompatibility(e.target.checked)}
                                className="w-3.5 h-3.5 text-emerald-700 focus:ring-emerald-500 rounded-sm text-xs text-center"
                              />
                              <div className="text-[11px]">
                                <span className="font-semibold text-slate-800 block">Basic Compatibility</span>
                                <span className="text-[9px] text-slate-400 block line-clamp-1">Education & pref alignment checked.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-150 cursor-pointer select-none font-sans">
                              <input 
                                type="checkbox" 
                                checked={step2CheckCompleteness}
                                onChange={e => setStep2CheckCompleteness(e.target.checked)}
                                className="w-3.5 h-3.5 text-emerald-700 focus:ring-emerald-500 rounded-sm text-xs"
                              />
                              <div className="text-[11px]">
                                <span className="font-semibold text-slate-800 block">Profile Completeness</span>
                                <span className="text-[9px] text-slate-400 block line-clamp-1">Photos, biography, parent details are complete.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-150 cursor-pointer select-none font-sans">
                              <input 
                                type="checkbox" 
                                checked={step2CheckActiveStatus}
                                onChange={e => setStep2CheckActiveStatus(e.target.checked)}
                                className="w-3.5 h-3.5 text-emerald-700 focus:ring-emerald-500 rounded-sm text-xs"
                              />
                              <div className="text-[11px]">
                                <span className="font-semibold text-slate-800 block">Verified Account Status</span>
                                <span className="text-[9px] text-slate-400 block line-clamp-1">
                                  {chosen.isPremiumActive ? '✓ Verification is active.' : '⚠️ Verification status pending review.'}
                                </span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-150 cursor-pointer select-none font-sans">
                              <input 
                                type="checkbox" 
                                checked={step2CheckEligible}
                                onChange={e => setStep2CheckEligible(e.target.checked)}
                                className="w-3.5 h-3.5 text-emerald-700 focus:ring-emerald-500 rounded-sm text-xs"
                              />
                              <div className="text-[11px]">
                                <span className="font-semibold text-slate-800 block">Eligibility to Receive Proposals</span>
                                <span className="text-[9px] text-slate-400 block line-clamp-1">Member hasn't locked another commitment.</span>
                              </div>
                            </label>

                          </div>
                        </div>

                        {/* Coordinator notes for pairing */}
                        <div className="pt-2">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 font-sans">Coordinator Pairing Logic Notes *</label>
                          <input 
                            type="text"
                            value={step2NotesLocal}
                            onChange={e => setStep2NotesLocal(e.target.value)}
                            placeholder="Example: Aligned with education background and West Coast preferences..."
                            className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:outline-hidden focus:ring-emerald-500 bg-white font-sans"
                          />
                        </div>

                        <button
                          onClick={handleStep2Submit}
                          disabled={!step2CheckCompatibility || !step2CheckCompleteness || !step2CheckActiveStatus || !step2CheckEligible}
                          className="w-full py-2.5 bg-emerald-700 border border-emerald-850 text-white hover:bg-emerald-800 disabled:opacity-40 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer font-sans"
                        >
                          Lock Candidate & Move to Preview Sharing
                        </button>

                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      <span className="font-semibold text-sm">Step 2 Finalized: Potential Match Locked</span>
                    </div>
                    <p className="text-emerald-700 pl-6 text-xs">
                      Candidate selected & archived: <strong>{candidate?.name}</strong>. Certified completeness protocols successfully.
                    </p>
                  </div>

                  {candidate && (
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex gap-4 items-center">
                      <img 
                        src={candidate.photoUrl} 
                        alt={candidate.name} 
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border border-slate-200" 
                      />
                      <div className="text-xs">
                        <strong className="block text-slate-800 text-sm">{candidate.name}</strong>
                        <span className="text-slate-500">{candidate.profession} • {candidate.location}</span>
                        <blockquote className="text-[11px] text-slate-450 italic mt-1 bg-white px-2 py-1 rounded-sm border border-slate-100 font-serif">
                          "{caseItem.step2Notes}"
                        </blockquote>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SHARE CANDIDATE PHOTO WITH REQUESTING PARTY */}
          {activeStepTab === 3 && (
            <div className="space-y-6">
              
              {/* STEP 3 COMPLETE OR NOT REVIEW */}
              {caseItem.step3Status !== 'Pending' && activeStepTab < caseItem.currentStep ? (
                // Step 3 is completed
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span className="font-bold text-sm">Step 3 Verified!</span>
                  </div>
                  <p className="text-emerald-700 font-medium pl-6">
                    Requesting party ({requester.name}) responded: <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide text-[9px]">{caseItem.step3Status}</span>
                  </p>
                </div>
              ) : (
                // Step 3 is the active step
                <div className="space-y-5">
                  {actingRole !== 'partyA' ? (
                    // Display security block warning coordinator first
                    <div className="p-6 text-center border border-slate-205 rounded-2xl bg-slate-50/50 space-y-3.5 select-none font-sans">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                        <ShieldCheck className="w-6 h-6 shrink-0" />
                      </div>
                      
                      <div className="max-w-md mx-auto">
                        <h3 className="font-bold text-slate-850 text-sm tracking-wide uppercase">🔐 SECURE COORDINATION PORTAL</h3>
                        <p className="text-xs text-slate-500 mt-1 lines-relaxed">
                          In compliance with Step 3, the candidate's portrait is <strong className="font-semibold text-slate-705">ONLY</strong> visible to the Requesting Party (<strong className="font-semibold text-slate-705">{requester.name}</strong>). The prospective candidate ({candidate?.name}) has not been contacted or notified.
                        </p>
                      </div>

                      <button
                        onClick={() => setActingRole('partyA')}
                        className="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs hover:bg-emerald-850 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Switch Role & Review as {requester.name}</span>
                      </button>
                    </div>
                  ) : (
                    // Showing perspective of requesting party (A)
                    <div className="space-y-5 border border-emerald-200 rounded-2xl p-5 bg-emerald-50/10 animate-fadeIn font-sans">
                      <div className="bg-emerald-705 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase inline-block select-none">
                        SIMULATED ACTOR: 👩 {requester.name} (Requesting Party Review)
                      </div>

                      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                        
                        {/* PORTRAIT CONTAINER */}
                        <div className="relative h-64 bg-slate-100 select-none">
                          <img 
                            src={candidate?.photoUrl} 
                            alt={candidate?.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top" 
                          />
                          <div className="absolute top-4 left-4 bg-emerald-900/90 backdrop-blur-xs text-white text-[11px] px-3 py-1 bg-emerald-800 rounded-full font-bold uppercase tracking-wider shadow-xs">
                            Step 3 Privately Shared Profile Photo
                          </div>
                        </div>

                        {/* PROFILE BIO DETAILS */}
                        <div className="p-5 space-y-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Coordinator Recommended Spouse</span>
                            <h3 className="font-sans font-bold text-slate-805 text-lg">{candidate?.name}, {candidate?.age}</h3>
                            <p className="text-xs font-medium text-slate-500">{candidate?.profession} • {candidate?.location}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-50 pt-3 font-sans">
                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <strong className="block text-[10px] text-slate-400 uppercase tracking-wide">Education Alignment</strong>
                              <span>{candidate?.education}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <strong className="block text-[10px] text-slate-400 uppercase tracking-wide">Professional Status</strong>
                              <span>{candidate?.profession}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg col-span-1 sm:col-span-2">
                              <strong className="block text-[10px] text-slate-400 uppercase tracking-wide">Family Lineage & Cultural Background</strong>
                              <span className="leading-relaxed block mt-0.5">{candidate?.familyBackground}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Interactive Feedback buttons */}
                      <div className="space-y-3 pt-3 border-t border-slate-150">
                        <label className="block text-xs font-semibold text-slate-650">Provide Feedback / Questions (Optional if interested):</label>
                        <input 
                           type="text" 
                          value={step3FeedbackLocal}
                          onChange={e => setStep3FeedbackLocal(e.target.value)}
                          placeholder="Examples: 'Is he open to relocating?' or 'What are his hobbies?'"
                          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                        />

                        {/* Responses selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          
                          <button
                            onClick={() => handleStep3Decision('Interested')}
                            className="py-2.5 bg-emerald-700 hover:bg-emerald-805 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                          >
                            <Check className="w-4 h-4" />
                            <span>Interested 💚</span>
                          </button>

                          <button
                            onClick={() => handleStep3Decision('Need More Info')}
                            className="py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span>Need More Info ℹ️</span>
                          </button>

                          <button
                            onClick={() => handleStep3Decision('Not Interested')}
                            className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                          >
                            <X className="w-4 h-4" />
                            <span>Not Interested ❌</span>
                          </button>

                        </div>

                        <div className="p-3 bg-emerald-50/50 text-[11px] text-emerald-800 rounded-lg leading-snug font-sans">
                          <strong>⚠️ Simulation Note:</strong> Selecting <strong>"Not Interested"</strong> will permanently terminate this candidacy pairing and reset the matchmaking process back to Step 2 search according to platform guidelines.
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* STEP 4: REQUEST APPROVAL TO PROCEED */}
          {activeStepTab === 4 && (
            <div className="space-y-6">
              
              {caseItem.step4Completed ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      <span className="font-bold text-sm">Step 4 Complete - Proceedings Archived</span>
                    </div>
                    <p className="text-emerald-755">
                      Approval registered shared on: <strong>{caseItem.step4DateShared}</strong>. Coordinator notes documented.
                    </p>
                  </div>

                  <div className="p-3.5 border border-slate-100 rounded-xl bg-slate-50 text-xs space-y-1.5">
                    <span className="font-mono text-[9px] uppercase text-slate-400 font-semibold block">Logged Proceedings Dossier</span>
                    <p className="text-slate-700 leading-normal font-sans italic">
                      "{caseItem.step4Notes}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-sans">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-850 rounded-xl text-xs">
                    <strong className="block text-emerald-900 mb-1">Step 4 Agenda: Proceeding Documentation Review</strong>
                    As the requesting party has approved (Interest Confirmed), the Coordinator will now record the share dates, notes, and log system docket items before reaching the second candidate (Party B) in Step 5.
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-655 uppercase mb-1">Response Recorded Status</label>
                      <span className="bg-emerald-50 border border-emerald-150 text-emerald-800 font-bold px-3 py-2.5 rounded-xl text-xs block text-center uppercase tracking-wide">
                        Party A Interested 💚
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-605 uppercase mb-1">Dossier Shared Date *</label>
                      <input 
                        type="date"
                        value={step4DateLocal}
                        onChange={e => setStep4DateLocal(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                     <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Dossier Recording and Coordinator Notes *</label>
                    <textarea 
                      rows={3}
                      value={step4NotesLocal}
                      onChange={e => setStep4NotesLocal(e.target.value)}
                      placeholder="Add formal notes of the discussion, parents expectations, and authorization parameters..."
                      className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-emerald-500 bg-white font-sans"
                    />
                  </div>

                  <button
                    onClick={handleStep4Submit}
                    disabled={!step4NotesLocal.trim()}
                    className="w-full py-2.5 bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-sans shadow-sm"
                  >
                    Archive Proceedings & Request Approval from Second Party
                  </button>
                </div>
              )}

            </div>
          )}

          {/* STEP 5: SHARE PROFILE WITH SECOND PARTY */}
          {activeStepTab === 5 && (
            <div className="space-y-6">
              
              {caseItem.step5Status !== 'Pending' && activeStepTab < caseItem.currentStep ? (
                // Completed Step 5
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span className="font-bold text-sm">Step 5 Verified!</span>
                  </div>
                  <p className="text-emerald-700 font-medium pl-6">
                    Second party ({candidate?.name}) responded: <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide text-[9px]">{caseItem.step5Status}</span>
                  </p>
                </div>
              ) : (
                // Step 5 active review
                <div className="space-y-5">
                  {actingRole !== 'partyB' ? (
                    <div className="p-6 text-center border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3.5 select-none font-sans">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                        <Users className="w-6 h-6 shrink-0" />
                      </div>
                      
                      <div className="max-w-md mx-auto">
                        <h3 className="font-bold text-slate-850 text-sm tracking-wide uppercase">🔐 SECURE COORDINATOR PORTAL</h3>
                        <p className="text-xs text-slate-500 mt-1 line-relaxed">
                          We are ready to share Requesting Party ({requester.name})'s credentials privately with our target Bride/Groom ({candidate?.name}). Switch simulated views to record their response.
                        </p>
                      </div>

                      <button
                        onClick={() => setActingRole('partyB')}
                        className="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs hover:bg-emerald-850 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Switch Role & Review as {candidate?.name || 'Party B'}</span>
                      </button>
                    </div>
                  ) : (
                    // Simulated perspective of candidate (B)
                    <div className="space-y-5 border border-emerald-200 rounded-2xl p-5 bg-emerald-50/10 animate-fadeIn font-sans font-sans">
                      <div className="bg-emerald-705 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase inline-block select-none">
                        SIMULATED ACTOR: 👨 {candidate?.name || 'Party B'} (Second Party Review)
                      </div>

                      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                        
                        {/* PORTRAIT CONTAINER */}
                        <div className="relative h-64 bg-slate-100 select-none">
                          <img 
                            src={requester?.photoUrl} 
                            alt={requester?.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center" 
                          />
                          <div className="absolute top-4 left-4 bg-emerald-850 text-white text-[11px] px-3 py-1 bg-emerald-800 rounded-full font-bold uppercase tracking-wider shadow-xs font-sans">
                            Step 5 Share Docket - Requesting Party Profile Photo
                          </div>
                        </div>

                        {/* COMPATIBILITY BIO */}
                        <div className="p-5 space-y-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Coordinator Recommended Spouse</span>
                            <h3 className="font-sans font-bold text-slate-855 text-lg">{requester?.name}, {requester?.age}</h3>
                            <p className="text-xs font-medium text-slate-500">{requester?.profession} • {requester?.location}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-50 pt-3">
                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <strong className="block text-[10px] text-slate-400 uppercase tracking-wide">Education Level</strong>
                              <span>{requester?.education}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg font-sans">
                              <strong className="block text-[10px] text-slate-400 uppercase tracking-wide font-sans">Job Division</strong>
                              <span>{requester?.profession}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg col-span-1 sm:col-span-2">
                              <strong className="block text-[10px] text-slate-400 uppercase tracking-wide">Family Culture Background</strong>
                              <span className="leading-relaxed block mt-0.5">{requester?.familyBackground}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Interactive Controls */}
                      <div className="space-y-3 pt-3 border-t border-slate-150">
                        <label className="block text-xs font-semibold text-slate-650">Provide Feedback / Remarks (Optional):</label>
                        <input 
                          type="text" 
                          value={step5FeedbackLocal}
                          onChange={e => setStep5FeedbackLocal(e.target.value)}
                          placeholder="Examples: 'Looking forward to meeting' or 'Would like to talk on video call.'"
                          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans font-sans"
                        />

                        {/* Responses selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          
                          <button
                            onClick={() => handleStep5Decision('Interested')}
                            className="py-2.5 bg-emerald-700 hover:bg-emerald-805 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                          >
                            <Check className="w-4 h-4" />
                            <span>Interested 💚</span>
                          </button>

                          <button
                            onClick={() => handleStep5Decision('Need More Info')}
                            className="py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span>Need More Info ℹ️</span>
                          </button>

                          <button
                            onClick={() => handleStep5Decision('Not Interested')}
                            className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                          >
                            <X className="w-4 h-4" />
                            <span>Not Interested ❌</span>
                          </button>

                        </div>

                        <div className="p-3 bg-emerald-50/50 text-[11px] text-emerald-800 rounded-lg leading-snug font-sans">
                          <strong>⚠️ Simulation Note:</strong> Selecting <strong>"Not Interested"</strong> will decline the portfolio proposal and safely reset the matching pipeline back to Step 2 search mode.
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* STEP 6: MUTUAL INTEREST CONFIRMATION */}
          {activeStepTab === 6 && (
            <div className="space-y-6">
              
              {/* CELEBRATORY BANNER */}
              <div className="text-center p-8 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl text-white shadow-xs space-y-3 relative overflow-hidden select-none font-serif">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] opacity-10" />
                
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xs rounded-full flex items-center justify-center text-white mx-auto text-lg border border-white/20 select-none">
                  ✨
                </div>
 
                <div className="relative z-10 max-w-sm mx-auto">
                  <h3 className="font-serif font-semibold text-lg tracking-wide uppercase">Mutual Interest Reached</h3>
                  <p className="text-xs text-emerald-100/90 leading-relaxed mt-2 italic">
                    "And He placed between you love and mercy."<br />
                    <span className="text-[10px] font-sans opacity-70 not-italic">— Surah Ar-Rum, 30:21</span>
                  </p>
                  <p className="text-xs text-white/90 mt-3 font-sans font-medium">
                    Both {requester.name} and {candidate?.name} have formally expressed profound matching interest.
                  </p>
                </div>
              </div>

              {/* Secure Contact Exchange panel according to details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1 px-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Authorized Contact Information Exchange</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Requester Contact card */}
                  <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex gap-2 items-center">
                      <img src={requester.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Bride Profile</span>
                        <h4 className="font-bold text-slate-800 text-xs">{requester.name}</h4>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 text-xs pt-2.5 border-t border-slate-200/50">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{requester.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{requester.contactPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Contact card */}
                  <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex gap-2 items-center">
                      <img src={candidate?.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Groom Profile</span>
                        <h4 className="font-bold text-slate-800 text-xs">{candidate?.name}</h4>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 text-xs pt-2.5 border-t border-slate-200/50">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{candidate?.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{candidate?.contactPhone}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Family introduction Scheduler */}
              <div className="p-5 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4.5 h-4.5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">Arrange Introductory Family Discussions</h4>
                    <p className="text-[11px] text-slate-450 leading-normal mt-0.5">
                      Schedule a virtual Zoom or physical meeting for both sets of parents and advisors to establish formal arrangements.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleScheduleFamilyMet} className="flex gap-2 pt-1">
                  <input 
                    type="date"
                    value={familyMeetingDate}
                    onChange={e => setFamilyMeetingDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded-xl px-3 py-2 flex-grow focus:outline-hidden bg-white hover:border-slate-300 font-medium"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Schedule discussion
                  </button>
                </form>

                {caseItem.familyDiscussionScheduled && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center justify-between font-medium">
                    <span>📅 Introductory Family Meetup officially scheduled for <strong>{caseItem.familyDiscussionScheduled}</strong>!</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 px-2 py-0.5 rounded-sm">Confirmed</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* HISTORICAL PROGRESSION LOGS FOR THIS CASE */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Matching Audit Log & Comm History</span>
            </h3>

            <div className="divide-y divide-slate-100/50 max-h-40 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-100/80 pr-1 space-y-2 text-xs">
              {caseItem.logs && caseItem.logs.slice().reverse().map(log => (
                <div key={log.id} className="pt-2 first:pt-0 space-y-0.5 font-sans">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold">{log.author} • Step {log.step}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-slate-650 font-medium leading-relaxed">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
