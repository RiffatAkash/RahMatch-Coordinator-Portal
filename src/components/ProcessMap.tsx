import React from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Image, 
  Heart, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';

const STEPS_INFO = [
  {
    step: 1,
    title: "Matchmaking Request",
    actor: "Bride, Groom, or Parent",
    icon: ClipboardCheck,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "A member registers and requests assistance. The coordinator thoroughly reviews the profile: age, education, profession, location, family background, and marriage preferences."
  },
  {
    step: 2,
    title: "Identify Potential Match",
    actor: "Coordinator Portal Search",
    icon: Search,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "The coordinator searches our database for highly compatible members. They verify key criteria: basic cultural fit, profile completeness, active community status, and general compatibility."
  },
  {
    step: 3,
    title: "Share Candidate with Requesting Party",
    actor: "Requesting Party Review",
    icon: Image,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "The coordinator shares the selected candidate's curated bio and background (without identifying secrets) with the requesting party ONLY. The second party remains completely unnotified to avoid any pressure."
  },
  {
    step: 4,
    title: "Request Approval to Proceed",
    actor: "Coordinator Verification",
    icon: Send,
    color: "bg-stone-100 text-stone-700 border-stone-200",
    desc: "If the requesting party is interested and gives their formal consent, the coordinator records the approval and prepares to initiate private outreach to the second party."
  },
  {
    step: 5,
    title: "Share Profile with Second Party",
    actor: "Second Party Review",
    icon: Heart,
    color: "bg-amber-100/70 text-amber-800 border-amber-200",
    desc: "The coordinator contacts the second candidate and shares the first party's background. They review compatibility details privately and comfortable with their parents or family."
  },
  {
    step: 6,
    title: "Mutual Interest & Introduction",
    actor: "Respectful Family Introduction",
    icon: CheckCircle2,
    color: "bg-teal-50 text-teal-700 border-teal-200",
    desc: "If both parties express mutual interest, the coordinator schedules a respectful introduction. Contact info is shared securely and guidance on initial family discussions is provided."
  }
];

export default function ProcessMap() {
  return (
    <div id="process-map-container" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
      <div className="flex items-start justify-between border-b border-stone-200 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-emerald-850 flex items-center gap-2">
            <span>6-Step RahMatch Protocol Map</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Understanding our hand-curated, respectful matrimonial introduction process.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-750 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-emerald-150">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real Human Coordinators</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {STEPS_INFO.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={item.step} 
              id={`process-step-${item.step}`}
              className="relative p-5 rounded-xl border border-stone-200 bg-[#FAF9F6]/40 hover:bg-[#FAF9F6] hover:border-emerald-500/20 transition-all group flex flex-col justify-between"
            >
              {/* Connector Arrows for Desktop layout */}
              {index < 5 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-stone-300 group-hover:text-emerald-300 transition-colors">
                  <ArrowRight className="w-5 h-5 bg-white rounded-full p-0.5 border border-stone-200" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${item.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full border border-stone-200">
                    Step {item.step}
                  </span>
                </div>

                <h3 className="font-bold text-stone-850 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-stone-400 mb-2.5 uppercase tracking-wider">
                  Responsible: {item.actor}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-semibold">Stage {item.step <= 2 ? 'Preparation' : item.step <= 4 ? 'A-Side Review' : 'B-Side Review'}</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100 select-none">Secure</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 animate-pulse shrink-0"></div>
        <div className="text-xs text-emerald-950 leading-relaxed">
          <strong className="font-bold text-emerald-950">Core Privacy Guarantee:</strong> In Step 3, the selected Candidate is <strong className="font-bold text-emerald-950">NOT</strong> aware of this proposal. This is to protect both parties from starting any premature attachments or pre-introduction stress. Only when Party A shows positive interest (Step 4) is Party B approached for consent in Step 5.
        </div>
      </div>
    </div>
  );
}
