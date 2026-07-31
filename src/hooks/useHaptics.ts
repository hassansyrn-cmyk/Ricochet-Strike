import { Haptics, ImpactStyle } from '@capacitor/haptics';

let lastVibrateTime = 0;
const VIBRATION_COOLDOWN = 150; // ms to avoid excessive vibration on high-freq hits

export const haptics = {
  light: async (vibrationEnabled: boolean) => {
    if (!vibrationEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Browser fallback
      if (navigator.vibrate) {
        const now = Date.now();
        if (now - lastVibrateTime > VIBRATION_COOLDOWN) {
          navigator.vibrate(12);
          lastVibrateTime = now;
        }
      }
    }
  },

  medium: async (vibrationEnabled: boolean) => {
    if (!vibrationEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Browser fallback
      if (navigator.vibrate) {
        const now = Date.now();
        if (now - lastVibrateTime > VIBRATION_COOLDOWN) {
          navigator.vibrate(28);
          lastVibrateTime = now;
        }
      }
    }
  },

  heavy: async (vibrationEnabled: boolean) => {
    if (!vibrationEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // Browser fallback
      if (navigator.vibrate) {
        const now = Date.now();
        if (now - lastVibrateTime > VIBRATION_COOLDOWN) {
          navigator.vibrate(55);
          lastVibrateTime = now;
        }
      }
    }
  }
};
export default haptics;
