import type { EndingId } from '../../types/endings';
import type { AngelMokoResponse, CarnivalGameState } from '../../types/gameState';

export const HIGH_COOPERATION_THRESHOLD = 2;
export const HIGH_ANGEL_TRUST_THRESHOLD = 2;

const supportiveMokoResponses: readonly AngelMokoResponse[] = [
  'staying-close',
  'shared-height-fear',
  'accepted-explanation',
];

export class EndingResolver {
  static resolve(state: Readonly<CarnivalGameState>): EndingId {
    if (!state.crisisResolved || !state.costumeCompleted || !state.panCompleted || !state.angelMokoResponse) {
      throw new Error('The complete Carnival journey is required before resolving an ending.');
    }

    if (state.cooperation >= HIGH_COOPERATION_THRESHOLD && state.repairedMistakeTogether) {
      return 'cc-club-team';
    }

    if (
      state.angelTrust >= HIGH_ANGEL_TRUST_THRESHOLD &&
      supportiveMokoResponses.includes(state.angelMokoResponse)
    ) {
      return 'together-on-the-road';
    }

    if (state.usedShortcut && state.angelAdmittedShortcut) {
      return 'we-fixed-it';
    }

    return 'one-little-step';
  }
}
