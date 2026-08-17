import type { CarnivalHotspotDefinition, CarnivalHotspotId } from '../../types/carnival';
import { GameStateManager } from './GameStateManager';

export interface CarnivalExperienceSnapshot {
  initialized: boolean;
  hotspotIds: readonly CarnivalHotspotId[];
  visitedHotspotIds: readonly CarnivalHotspotId[];
}

export class CarnivalExperience {
  private readonly hotspots: Map<CarnivalHotspotId, CarnivalHotspotDefinition>;
  private readonly visited = new Set<CarnivalHotspotId>();

  constructor(state: GameStateManager, hotspotDefinitions: readonly CarnivalHotspotDefinition[]) {
    if (!state.get('costumeCompleted')) throw new Error('Carnival cannot initialize before the costume is complete.');
    if (!hotspotDefinitions.length) throw new Error('Carnival needs at least one exploration hotspot.');
    this.hotspots = new Map(hotspotDefinitions.map((hotspot) => [hotspot.id, hotspot]));
    if (this.hotspots.size !== hotspotDefinitions.length) throw new Error('Carnival hotspot IDs must be unique.');
  }

  get snapshot(): CarnivalExperienceSnapshot {
    return Object.freeze({
      initialized: true,
      hotspotIds: Object.freeze([...this.hotspots.keys()]),
      visitedHotspotIds: Object.freeze([...this.visited]),
    });
  }

  visit(hotspotId: CarnivalHotspotId): CarnivalHotspotDefinition {
    const hotspot = this.hotspots.get(hotspotId);
    if (!hotspot) throw new Error(`Unknown Carnival hotspot "${hotspotId}".`);
    this.visited.add(hotspotId);
    return hotspot;
  }
}
