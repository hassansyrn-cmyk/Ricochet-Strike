import { SaveData } from '../types/game';

const SAVE_KEY = 'ricochet_save_v2';

export const DEFAULT_SAVE: SaveData = {
  unlocked: 1,
  coins: 0,
  stars: {},
  bestScores: {},
  selectedBall: 0,
  ownedBalls: [0],
  sound: true,
  vibration: true,
  daily: '',
  dailyStreak: 0,
  tutorialCompleted: false
};

export function loadSaveData(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_SAVE };
    }

    // Ensure backwards compatibility and default fallbacks for corrupt saves
    return {
      unlocked: typeof parsed.unlocked === 'number' ? parsed.unlocked : DEFAULT_SAVE.unlocked,
      coins: typeof parsed.coins === 'number' ? parsed.coins : DEFAULT_SAVE.coins,
      stars: (parsed.stars && typeof parsed.stars === 'object') ? parsed.stars : DEFAULT_SAVE.stars,
      bestScores: (parsed.bestScores && typeof parsed.bestScores === 'object') ? parsed.bestScores : DEFAULT_SAVE.bestScores,
      selectedBall: typeof parsed.selectedBall === 'number' ? parsed.selectedBall : DEFAULT_SAVE.selectedBall,
      ownedBalls: Array.isArray(parsed.ownedBalls) ? parsed.ownedBalls.map(Number) : DEFAULT_SAVE.ownedBalls,
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULT_SAVE.sound,
      vibration: typeof parsed.vibration === 'boolean' ? parsed.vibration : DEFAULT_SAVE.vibration,
      daily: typeof parsed.daily === 'string' ? parsed.daily : DEFAULT_SAVE.daily,
      dailyStreak: typeof parsed.dailyStreak === 'number' ? parsed.dailyStreak : DEFAULT_SAVE.dailyStreak,
      tutorialCompleted: typeof parsed.tutorialCompleted === 'boolean' ? parsed.tutorialCompleted : DEFAULT_SAVE.tutorialCompleted
    };
  } catch (err) {
    console.error('Error loading save data from LocalStorage:', err);
    return { ...DEFAULT_SAVE };
  }
}

export function saveSaveData(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing save data to LocalStorage:', err);
  }
}
