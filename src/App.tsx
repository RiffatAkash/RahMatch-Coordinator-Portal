import React, { useState } from 'react';
import { Member, MatchRequest, MatchmakingLog } from './types';
import { INITIAL_MEMBERS, INITIAL_MATCH_REQUESTS } from './data';
import ProcessMap from './components/ProcessMap';
import MemberDirectory from './components/MemberDirectory';
import ActiveCasesList from './components/ActiveCasesList';
import MatchCaseDetails from './components/MatchCaseDetails';
import BridePortal from './components/BridePortal';
import GroomPortal from './components/GroomPortal';
import { 
  HeartHandshake, 
  Map, 
  Users, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle,
  FileHeart,
  Heart,
  User
} from 'lucide-react';

export default function App() {
  // Global React state
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [requests, setRequests] = useState<MatchRequest[]>(INITIAL_MATCH_REQUESTS);
  
  // Navigation / View state
  const [activeTab, setActiveTab] = useState<'cases' | 'directory' | 'protocol'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Top level role-playing switcher state
  const [currentRoleView, setCurrentRoleView] = useState<'coordinator' | 'bride' | 'groom'>('coordinator');
  const [selectedBrideId, setSelectedBrideId] = useState<string>('m1'); // Defaults to Aisha Rahman
  const [selectedGroomId, setSelectedGroomId] = useState<string>('m4'); // Defaults to Tariq Mahmood

  // ADD NEW MEMBER
  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
  };

  // INITIATE NEW MATCHMAKING CASE
  const handleCreateCase = (requestingPartyId: string) => {
    const requester = members.find(m => m.id === requestingPartyId)!;
    const dateStr = new Date().toISOString();

    const newRequest: MatchRequest = {
      id: 'case_' + Date.now(),
      requestingPartyId,
      candidatePartyId: null,
      currentStep: 1,
      step1Completed: false,
      step1Notes: '',
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
          id: 'log_init_' + Date.now(),
          timestamp: dateStr,
          step: 1,
          message: `Matchmaking help requested by ${requester.name}. Audit review in progress.`,
          author: 'System'
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
    setSelectedCaseId(newRequest.id); // Go right into managing it!
  };

  // INITIATE NEW CASE WITH PRE-CHOSEN CANDIDATE DIRECTLY
  const handleCreateCaseWithCandidate = (requestingPartyId: string, candidatePartyId: string) => {
    const requester = members.find(m => m.id === requestingPartyId)!;
    const candidateObj = members.find(m => m.id === candidatePartyId)!;
    const dateStr = new Date().toISOString();

    const newRequest: MatchRequest = {
      id: 'case_propose_' + Date.now(),
      requestingPartyId,
      candidatePartyId,
      currentStep: 1,
      step1Completed: false,
      step1Notes: `Connection candidate ${candidateObj.name} proposed directly by ${requester.name} via private workspace dashboard.`,
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
          id: 'log_propose_init_' + Date.now(),
          timestamp: dateStr,
          step: 1,
          message: `Matchmaking case initialized. Connection proposed between ${requester.name} and candidate ${candidateObj.name}. Coordinator review in progress.`,
          author: 'System'
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
  };

  // UPDATE ACTIVE CASE STEPS
  const handleUpdateCase = (updatedCase: MatchRequest) => {
    setRequests(prev => prev.map(req => req.id === updatedCase.id ? updatedCase : req));
  };

  // Find currently selected case model
  const activeCaseItem = requests.find(r => r.id === selectedCaseId);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      
      {/* Quranic Quote Top Banner */}
      <div className="bg-emerald-800 text-stone-100 py-2.5 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs tracking-wide select-none">
        <div className="flex items-center gap-2 font-serif italic text-stone-200">
          <span>وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</span>
          <span className="hidden sm:inline opacity-60">•</span>
          <span>“And He placed between you love and mercy.” — Quran 30:21</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-semibold text-emerald-300">
          <span>Islamic Matrimonial Service</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        </div>
      </div>

      {/* Workspace Perspective Switcher */}
      <div className="bg-stone-900 text-stone-200 border-b border-stone-800 py-3 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans selection:bg-rose-500 select-none">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-stone-300 uppercase tracking-widest text-[10px]">
            Portal Workspace:
          </span>
        </div>

        <div className="flex flex-wrap bg-stone-800 p-1 rounded-xl border border-stone-700 shadow-inner gap-1">
          <button
            id="workspace-coordinator-btn"
            onClick={() => setCurrentRoleView('coordinator')}
            className={`px-4.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer text-xs ${
              currentRoleView === 'coordinator'
                ? 'bg-emerald-700 text-white shadow-sm font-bold'
                : 'text-stone-400 hover:text-stone-150'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Coordinator Portal</span>
          </button>
          
          <button
            id="workspace-bride-btn"
            onClick={() => {
              setCurrentRoleView('bride');
              setSelectedCaseId(null); // return to lists so they can see portal
            }}
            className={`px-4.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer text-xs ${
              currentRoleView === 'bride'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'text-stone-400 hover:text-stone-150'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Bride Portal layout</span>
          </button>

          <button
            id="workspace-groom-btn"
            onClick={() => {
              setCurrentRoleView('groom');
              setSelectedCaseId(null);
            }}
            className={`px-4.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer text-xs ${
              currentRoleView === 'groom'
                ? 'bg-indigo-650 text-white shadow-sm font-bold'
                : 'text-stone-400 hover:text-stone-150'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Groom Portal layout</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-stone-400 font-mono font-medium">
          <span>Simulation Mode:</span>
          <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase border ${
            currentRoleView === 'coordinator' 
              ? 'bg-emerald-950/50 text-emerald-405 border-emerald-800' 
              : currentRoleView === 'bride' 
                ? 'bg-rose-950/50 text-rose-405 border-rose-800' 
                : 'bg-indigo-950/50 text-indigo-405 border-indigo-800'
          }`}>
            {currentRoleView === 'coordinator' ? 'Coordinator Hub' : currentRoleView === 'bride' ? 'Bride Perspective' : 'Groom Perspective'}
          </span>
        </div>
      </div>

      <div className="flex-grow">
        {/* Core Header section (only render standard for coordinator to preserve custom theme layouts) */}
        {currentRoleView === 'coordinator' && (
          <header className="bg-white border-b border-stone-200 py-6 px-8 select-none">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3.5">
                <div id="app-logo" className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-xs">
                  <HeartHandshake className="w-5.5 h-5.5 text-stone-100" />
                </div>
                <div className="text-left">
                  <span className="text-2xl font-serif font-semibold tracking-tight text-emerald-850">
                    Rah<span className="text-emerald-600 font-bold">Match</span>
                  </span>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-semibold font-sans mt-0.5">
                    Muslim Matrimonial Service
                  </span>
                </div>
              </div>

              {/* Quick stats panel */}
              <div className="flex items-center gap-8 text-xs bg-stone-50 border border-stone-200 p-3 rounded-xl text-stone-600">
                <div className="text-center font-medium">
                  <span className="block text-[10px] uppercase font-bold text-stone-400">Total Pool</span>
                  <span className="font-bold text-stone-850 text-sm">{members.length} Members</span>
                </div>
                <div className="w-px h-6 bg-stone-200" />
                <div className="text-center font-medium">
                  <span className="block text-[10px] uppercase font-bold text-stone-400">Active Cases</span>
                  <span className="font-bold text-stone-850 text-sm">{requests.length} Live</span>
                </div>
                <div className="w-px h-6 bg-stone-200" />
                <div className="text-center font-bold">
                  <span className="block text-[10px] uppercase font-bold text-stone-400">Mutual Fits</span>
                  <span className="font-bold text-emerald-600 text-sm">{requests.filter(r => r.currentStep === 6).length} Fits ✓</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Outer container */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          
          {/* Main Top Navigation Tab panel (Only shown in Coordinator view when not displaying details) */}
          {currentRoleView === 'coordinator' && !selectedCaseId && (
            <div className="flex justify-center sm:justify-start items-center border-b border-stone-200">
              <nav className="flex space-x-8 text-sm font-medium -mb-px">
                <button
                   id="tab-cases-btn"
                   onClick={() => setActiveTab('cases')}
                   className={`pb-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 font-semibold ${
                     activeTab === 'cases'
                       ? 'border-emerald-600 text-emerald-700 font-bold'
                       : 'border-transparent text-stone-500 hover:text-stone-850'
                   }`}
                >
                  <Layers className="w-4.5 h-4.5 shrink-0" />
                  <span>Matchmaking Cases</span>
                  <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full font-mono font-medium">
                    {requests.length}
                  </span>
                </button>

                <button
                   id="tab-directory-btn"
                   onClick={() => setActiveTab('directory')}
                   className={`pb-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 font-semibold ${
                     activeTab === 'directory'
                       ? 'border-emerald-600 text-emerald-700 font-bold'
                       : 'border-transparent text-stone-500 hover:text-stone-850'
                   }`}
                >
                  <Users className="w-4.5 h-4.5 shrink-0" />
                  <span>Profiles Database</span>
                  <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full font-mono font-medium">
                    {members.length}
                  </span>
                </button>

                <button
                   id="tab-protocol-btn"
                   onClick={() => setActiveTab('protocol')}
                   className={`pb-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 font-semibold ${
                     activeTab === 'protocol'
                       ? 'border-emerald-600 text-emerald-700 font-bold'
                       : 'border-transparent text-stone-500 hover:text-stone-850'
                   }`}
                >
                  <Map className="w-4.5 h-4.5 shrink-0" />
                  <span>How It Works</span>
                </button>
              </nav>
            </div>
          )}

          {/* RENDER THE RELEVANT perspective view */}
          {currentRoleView === 'coordinator' ? (
            selectedCaseId && activeCaseItem ? (
              <MatchCaseDetails 
                caseItem={activeCaseItem}
                members={members}
                onBack={() => {
                  setSelectedCaseId(null);
                }}
                onUpdateCase={handleUpdateCase}
              />
            ) : (
              <>
                {activeTab === 'cases' && (
                  <ActiveCasesList 
                    requests={requests}
                    members={members}
                    onSelectCase={setSelectedCaseId}
                    onCreateCase={handleCreateCase}
                  />
                )}

                {activeTab === 'directory' && (
                  <MemberDirectory 
                    members={members}
                    onAddMember={handleAddMember}
                  />
                )}

                {activeTab === 'protocol' && (
                  <ProcessMap />
                )}
              </>
            )
          ) : currentRoleView === 'bride' ? (
            <BridePortal 
              members={members}
              requests={requests}
              onUpdateCase={handleUpdateCase}
              onCreateCase={handleCreateCaseWithCandidate}
              onSelectBrideId={setSelectedBrideId}
              selectedBrideId={selectedBrideId}
            />
          ) : (
            <GroomPortal 
              members={members}
              requests={requests}
              onUpdateCase={handleUpdateCase}
              onCreateCase={handleCreateCaseWithCandidate}
              onSelectGroomId={setSelectedGroomId}
              selectedGroomId={selectedGroomId}
            />
          )}

        </main>
      </div>

      {/* Footer layout */}
      <footer className="h-16 bg-white border-t border-stone-200 flex flex-col md:flex-row items-center px-8 text-[11px] text-stone-500 justify-between gap-2 py-4 mt-12">
        <p>© 2026 RahMatch • Where Mercy Meets Its Match. All client details verified by human coordinators. Total privacy protection.</p>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Matchmaking Ethical Guidelines</span>
          <span>Support ID: #RM-4492</span>
        </div>
      </footer>
    </div>
  );
}
