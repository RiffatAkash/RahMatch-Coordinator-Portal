import React, { useState } from 'react';
import { MatchRequest, Member } from '../types';
import { 
  Plus, 
  ArrowRight,
  Clock, 
  CheckCircle,
  FileHeart,
  ChevronRight,
  Compass,
  AlertCircle
} from 'lucide-react';

interface ActiveCasesListProps {
  requests: MatchRequest[];
  members: Member[];
  onSelectCase: (requestId: string) => void;
  onCreateCase: (requestingPartyId: string) => void;
}

export default function ActiveCasesList({ 
  requests, 
  members, 
  onSelectCase, 
  onCreateCase 
}: ActiveCasesListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequesterId, setSelectedRequesterId] = useState('');

  // Find eligible requesters (i.e. members who don't have an active matchmaking case with status < 6)
  const activeRequesterIds = requests
    .filter(r => r.currentStep < 6)
    .map(r => r.requestingPartyId);

  const eligibleRequesters = members.filter(
    m => !activeRequesterIds.includes(m.id)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequesterId) return;
    onCreateCase(selectedRequesterId);
    setShowCreateModal(false);
    setSelectedRequesterId('');
  };

  const getStepColorClass = (step: number, currentStep: number) => {
    if (step < currentStep) return 'bg-emerald-600 text-white border-emerald-600';
    if (step === currentStep) return 'bg-emerald-500 text-white border-emerald-500 ring-4 ring-emerald-100 animate-pulse';
    return 'bg-stone-100 text-stone-450 border-stone-200';
  };

  const getStepText = (step: number) => {
    switch (step) {
      case 1: return 'Review Profile';
      case 2: return 'Identify Match';
      case 3: return 'Share Photo (A)';
      case 4: return 'Consent Recorded';
      case 5: return 'Share Profile (B)';
      case 6: return 'Mutual Interest';
      default: return 'Step';
    }
  };

  return (
    <div id="active-cases-container" className="space-y-6">
      {/* Header and trigger */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-serif text-emerald-850 flex items-center gap-2">
            <span>Matchmaking Case Dashboard</span>
            <span className="text-[10px] bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-full text-emerald-700 font-bold uppercase tracking-wider">
              {requests.length} Live Processes
            </span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Track and progress candidates through our respectful, human-audited 6-step rahmah matchmaking pipeline.
          </p>
        </div>

        <button 
          id="initiate-case-btn"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-850 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Matchmaking Request</span>
        </button>
      </div>

      {/* Creation Modal Modal */}
      {showCreateModal && (
        <div id="create-modal-overlay" className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fadeIn">
          <div id="create-modal" className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 shadow-xl animate-scaleIn">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-emerald-850">
                  Initiate Matchmaking Assistance
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Step 1: Inbound request registration under coordinator audit
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold p-1 bg-stone-50 hover:bg-stone-100 rounded-md text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  Select Requesting Member (Bride, Groom, Parents/Guardian)
                </label>
                
                {eligibleRequesters.length === 0 ? (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No free members available. Register a new member in the Profiles Database first!</span>
                  </div>
                ) : (
                  <select
                    value={selectedRequesterId}
                    onChange={e => setSelectedRequesterId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-505 cursor-pointer text-stone-800"
                    required
                  >
                    <option value="">-- Choose Member Profile --</option>
                    {eligibleRequesters.map(m => (
                      <option key={m.id} value={m.id} className="text-stone-850">
                        {m.name} ({m.gender === 'bride' ? 'Bride' : 'Groom'}, {m.age}y - {m.location})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedRequesterId && (() => {
                const reqMember = members.find(m => m.id === selectedRequesterId);
                if (!reqMember) return null;
                return (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 mt-2">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={reqMember.photoUrl} 
                        alt={reqMember.name} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover" 
                      />
                      <div>
                        <h4 className="font-bold text-stone-850 text-sm">{reqMember.name}</h4>
                        <span className="text-xs text-stone-500">{reqMember.profession} • {reqMember.location}</span>
                      </div>
                    </div>
                    <div className="text-xs text-stone-600 pt-2 border-t border-stone-200">
                      <strong className="block text-[#1e293b] font-semibold">Demanded Partner Preferences:</strong>
                      <span className="italic">"{reqMember.marriagePreferences}"</span>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-emerald-50/45 p-3.5 rounded-lg border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
                <strong>Next Phase:</strong> Once registered, you (the coordinator) will enter Step 1 where you must review intake preferences and search our secure database in Step 2 to suggest a matches.
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-500 font-medium text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedRequesterId}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-850 disabled:opacity-50 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Create Matchmaking Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cases List */}
      <div className="grid grid-cols-1 gap-6">
        {requests.map(req => {
          const requester = members.find(m => m.id === req.requestingPartyId);
          const candidate = req.candidatePartyId ? members.find(m => m.id === req.candidatePartyId) : null;

          if (!requester) return null;

          return (
            <div 
              key={req.id} 
              id={`case-card-${req.id}`}
              className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500/25 hover:shadow-xs transition-all p-6 relative overflow-hidden"
            >
              {/* Highlight ribbon based on status */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                req.currentStep === 6 ? 'bg-teal-500' : 'bg-emerald-700'
              }`} />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Visual relationship pairing */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shrink-0">
                  
                  {/* Party A: Requester */}
                  <div className="flex items-center gap-3 w-52">
                    <img 
                      src={requester.photoUrl} 
                      alt={requester.name} 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-stone-200"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400">Requesting Party</span>
                      <h4 className="font-bold text-stone-850 text-sm leading-tight">{requester.name}</h4>
                      <span className="text-xs text-stone-450">{requester.location}</span>
                    </div>
                  </div>

                  {/* Intersecting Arrow or Heart */}
                  <div className="flex flex-col items-center justify-center">
                    {req.currentStep === 6 ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                        <CheckCircle className="w-5 h-5 shrink-0" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center border border-stone-200 text-xs font-mono">
                        vs
                      </div>
                    )}
                  </div>

                  {/* Party B: Candidate */}
                  <div className="flex items-center gap-3 w-52">
                    {candidate ? (
                      <>
                        <img 
                          src={candidate.photoUrl} 
                          alt={candidate.name} 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover border-2 border-stone-200"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400">Matched Candidate</span>
                          <h4 className="font-bold text-stone-850 text-sm leading-tight">{candidate.name}</h4>
                          <span className="text-xs text-stone-450">{candidate.location}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-stone-50 border border-dashed border-stone-200 flex items-center justify-center text-stone-450">
                          <Compass className="w-5 h-5 animate-spin text-stone-300" style={{ animationDuration: '6s' }} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 font-semibold text-stone-500">Search Status</span>
                          <h4 className="font-bold text-emerald-850 text-xs">Waiting for Stage 2</h4>
                          <span className="text-[10px] text-stone-400">Database lookup</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Workflow Stepper Progress Indicator */}
                <div className="flex-1 max-w-xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Current Process:</span>
                      <strong className="text-stone-850 font-bold">
                        {req.currentStep === 6 ? 'Mutual Interest Confirmed ✓' : `Step ${req.currentStep}: ${getStepText(req.currentStep)}`}
                      </strong>
                    </span>
                    <span className="font-mono text-[11px] text-stone-500 font-bold">{Math.round((req.currentStep / 6) * 100)}% Complete</span>
                  </div>

                  {/* Horizontal Bar stepper */}
                  <div className="grid grid-cols-6 gap-1 md:gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <div key={num} className="space-y-1">
                        <div className={`h-1.5 rounded-xs transition-colors ${
                          num < req.currentStep ? 'bg-emerald-600' :
                          num === req.currentStep ? (req.currentStep === 6 ? 'bg-emerald-600' : 'bg-emerald-500 animate-pulse') :
                          'bg-stone-100'
                        }`} />
                        <span className={`hidden md:block text-[9px] font-bold text-center ${
                          num === req.currentStep ? 'text-stone-800' : 'text-stone-400'
                        }`}>
                          Step {num}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Case Manager Navigation button */}
                <button
                  id={`action-manage-${req.id}`}
                  onClick={() => onSelectCase(req.id)}
                  className="px-4 py-2 hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-all shrink-0 self-end lg:self-auto hover:border-emerald-500/20 cursor-pointer shadow-xs"
                >
                  <span>Launch Portal</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </button>

              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-emerald-850 text-lg">No Active Matchmaking Cases</h3>
            <p className="text-xs text-stone-450 mt-2">Create a case to initiate the step-by-step matchmaking pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
