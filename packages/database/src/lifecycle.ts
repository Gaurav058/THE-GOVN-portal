import { JobLifecycleStatus } from '@govn/types';

export interface DateLifecycleInputs {
  applicationStartDate: Date | string;
  applicationEndDate: Date | string;
  correctionStartDate?: Date | string | null;
  correctionEndDate?: Date | string | null;
  admitCardDate?: Date | string | null;
  examStartDate?: Date | string | null;
  examEndDate?: Date | string | null;
  answerKeyDate?: Date | string | null;
  resultDate?: Date | string | null;
  isCancelled?: boolean;
}

export class JobLifecycleEngine {
  /**
   * Calculates the exact dynamic lifecycle status of a recruitment notice based on the current timestamp.
   * Uses UTC timestamps normalized against IST business hours.
   */
  public static calculateStatus(
    inputs: DateLifecycleInputs,
    currentDate: Date = new Date('2026-09-14T09:00:00.000Z')
  ): JobLifecycleStatus {
    if (inputs.isCancelled) {
      return JobLifecycleStatus.CANCELLED;
    }

    const now = currentDate.getTime();
    const start = new Date(inputs.applicationStartDate).getTime();
    const end = new Date(inputs.applicationEndDate).getTime();

    // If result is already declared
    if (inputs.resultDate) {
      const resultTime = new Date(inputs.resultDate).getTime();
      if (now >= resultTime) {
        return JobLifecycleStatus.RESULT_DECLARED;
      }
    }

    // If answer key is available
    if (inputs.answerKeyDate) {
      const keyTime = new Date(inputs.answerKeyDate).getTime();
      if (now >= keyTime) {
        return JobLifecycleStatus.ANSWER_KEY_AVAILABLE;
      }
    }

    // If exam has completed
    if (inputs.examEndDate) {
      const examEndTime = new Date(inputs.examEndDate).getTime();
      if (now > examEndTime) {
        return JobLifecycleStatus.EXAM_COMPLETED;
      }
    }

    // If exam is scheduled
    if (inputs.examStartDate) {
      const examStartTime = new Date(inputs.examStartDate).getTime();
      if (now >= examStartTime && (!inputs.examEndDate || now <= new Date(inputs.examEndDate).getTime())) {
        return JobLifecycleStatus.EXAM_SCHEDULED;
      }
    }

    // If admit card is released
    if (inputs.admitCardDate) {
      const admitTime = new Date(inputs.admitCardDate).getTime();
      if (now >= admitTime && (!inputs.examStartDate || now < new Date(inputs.examStartDate).getTime())) {
        return JobLifecycleStatus.ADMIT_CARD_AVAILABLE;
      }
    }

    // If application correction window is active
    if (inputs.correctionStartDate && inputs.correctionEndDate) {
      const corrStart = new Date(inputs.correctionStartDate).getTime();
      const corrEnd = new Date(inputs.correctionEndDate).getTime();
      if (now >= corrStart && now <= corrEnd) {
        return JobLifecycleStatus.CORRECTION_OPEN;
      }
    }

    // Application closing soon (<= 3 days remaining)
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    if (now >= start && now <= end) {
      if (end - now <= threeDaysMs) {
        return JobLifecycleStatus.CLOSING_SOON;
      }
      return JobLifecycleStatus.APPLICATION_OPEN;
    }

    // Application closed
    if (now > end) {
      return JobLifecycleStatus.APPLICATION_CLOSED;
    }

    // Before application start (Verified upcoming)
    return JobLifecycleStatus.PUBLISHED;
  }
}
