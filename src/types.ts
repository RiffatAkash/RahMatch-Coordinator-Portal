export type Gender = 'bride' | 'groom';

export interface Member {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  education: string;
  profession: string;
  location: string;
  familyBackground: string;
  marriagePreferences: string;
  photoUrl: string;
  isPremiumActive: boolean;
  isEligible: boolean;
  contactEmail: string;
  contactPhone: string;
}

export type Step3Status = 'Pending' | 'Interested' | 'Not Interested' | 'Need More Info';
export type Step5Status = 'Pending' | 'Interested' | 'Not Interested' | 'Need More Info';

export interface MatchmakingLog {
  id: string;
  timestamp: string;
  step: number;
  message: string;
  author: 'Coordinator' | 'Matchmaker' | 'Requesting Party' | 'Second Party' | 'System';
}

export interface MatchRequest {
  id: string;
  requestingPartyId: string; // Party A
  candidatePartyId: string | null; // Party B
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  step1Completed: boolean;
  step1Notes: string;
  step2Completed: boolean;
  step2Notes: string;
  step2Verified: {
    compatibility: boolean;
    completeness: boolean;
    activeStatus: boolean;
    eligibleProposals: boolean;
  };
  step3Status: Step3Status;
  step3Notes: string;
  step3Feedback?: string;
  step4Completed: boolean;
  step4Notes: string;
  step4DateShared: string;
  step5Status: Step5Status;
  step5Notes: string;
  step5Feedback?: string;
  step6Completed: boolean;
  familyDiscussionScheduled?: string; // Date-string
  logs: MatchmakingLog[];
}
