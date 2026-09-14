import { JobLifecycleStatus, VerificationStatus } from '@govn/types';

export function getStatusBadgeInfo(status: JobLifecycleStatus) {
  switch (status) {
    case JobLifecycleStatus.APPLICATION_OPEN:
      return { label: 'Application Open', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case JobLifecycleStatus.CLOSING_SOON:
      return { label: 'Closing Soon', colorClass: 'bg-amber-100 text-amber-900 border-amber-400 font-bold animate-pulse' };
    case JobLifecycleStatus.APPLICATION_CLOSED:
      return { label: 'Application Closed', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' };
    case JobLifecycleStatus.ADMIT_CARD_AVAILABLE:
      return { label: 'Admit Card Available', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' };
    case JobLifecycleStatus.EXAM_SCHEDULED:
      return { label: 'Exam Scheduled', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' };
    case JobLifecycleStatus.RESULT_DECLARED:
      return { label: 'Result Declared', colorClass: 'bg-teal-100 text-teal-800 border-teal-300 font-bold' };
    default:
      return { label: status.replace(/_/g, ' '), colorClass: 'bg-gray-100 text-gray-800 border-gray-300' };
  }
}

export function getVerificationBadgeInfo(status: VerificationStatus) {
  switch (status) {
    case VerificationStatus.VERIFIED:
      return { label: 'Official Verified', colorClass: 'bg-green-100 text-green-800 border-green-300' };
    case VerificationStatus.NEEDS_REVIEW:
      return { label: 'Pending Review', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    case VerificationStatus.CONFLICT_DETECTED:
      return { label: 'Conflict Flagged', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' };
    default:
      return { label: 'Unverified', colorClass: 'bg-gray-100 text-gray-700 border-gray-300' };
  }
}
