import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadSaveData, saveSaveData, DEFAULT_SAVE } from '../hooks/useLocalStorage';

describe('Local Storage Saves Data Systems', () => {
  beforeEach(() => {
    // Clear virtual localStorage values
    localStorage.clear();
  });

  it('should load default save configurations when storage is empty', () => {
    const data = loadSaveData();
    expect(data.unlocked).toBe(1);
    expect(data.coins).toBe(0);
    expect(data.sound).toBe(true);
  });

  it('should successfully recover and upgrade save formats', () => {
    const corruptData = {
      unlocked: 'ten', // corrupt string
      coins: 500,
      sound: 'no' // corrupt string
    };

    localStorage.setItem('ricochet_save_v2', JSON.stringify(corruptData));
    const loaded = loadSaveData();

    expect(loaded.unlocked).toBe(1); // restored fallback
    expect(loaded.coins).toBe(500); // successfully matched
    expect(loaded.sound).toBe(true); // default upgraded
  });

  it('should persist exact values successfully', () => {
    const customSave = {
      ...DEFAULT_SAVE,
      coins: 950,
      unlocked: 45
    };
    saveSaveData(customSave);

    const loaded = loadSaveData();
    expect(loaded.coins).toBe(950);
    expect(loaded.unlocked).toBe(45);
  });
});
