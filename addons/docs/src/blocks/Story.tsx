import global from 'global';
import { Story as LegacyStory } from './LegacyStory';
import { Story as ModernStory } from './ModernStory';

export const Story = global?.MODERN_INLINE_RENDER ? ModernStory : LegacyStory;

// FIXME: refactor
export { storyBlockIdFromId, lookupStoryId } from './ModernStory';
