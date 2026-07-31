import React, { useState, useEffect, useRef } from 'react';
import { loadSaveData, saveSaveData } from './hooks/useLocalStorage';
import { haptics } from './hooks/useHaptics';
import { soundSynth } from './audio/soundSynth';
import { generateLevel, validateLevel } from './levels/levels';
import { PROJECTILE_CONFIGS } from './physics/projectileConfig';
import { GameplayEngine, GameplayEngineState } from './physics/gameplayEngine';

import HomeScreen from './components/HomeScreen';
import LevelSelection from './components/LevelSelection';
import GameCanvas from './components/GameCanvas';
import GameOverlay from './components/GameOverlay';
import ResultScreen from './components/ResultScreen';
import Shop from './components/Shop';
import DailyReward from './components/DailyReward';
import SettingsPanel from './components/SettingsPanel';
import Tutorial from './components/Tutorial';

import { SaveData } from './types/game';

export const App: React.FC = () => {
  // 1. Core Reactive States
  const [screen, setScreen] = useState<'home' | 'levels' | 'game' | 'shop' | 'daily' | 'settings'>('home');
  const [saveData, setSaveData] = useState<SaveData>(() => loadSaveData());
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  // Gameplay Engine Engine Sync States
  const [engineState, setEngineState] = useState<GameplayEngineState | null>(null);

  // 2. Refs for persistent background gameplay instance objects
  const activeLevel = generateLevel(activeLevelId);
  const selectedProjConfig = PROJECTILE_CONFIGS[saveData.selectedBall];
  const engineRef = useRef<GameplayEngine | null>(null);

  // Initialize/Resume AudioContext and settings sync
  useEffect(() => {
    soundSynth.setSoundEnabled(saveData.sound);
  }, [saveData.sound]);

  // Synchronise save state writes
  const updateSave = (newSave: SaveData) => {
    setSaveData(newSave);
    saveSaveData(newSave);
  };

  // Launch tutorial on first app startup triggers
  useEffect(() => {
    if (!saveData.tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [saveData.tutorialCompleted]);

  // Handle visibility changes to safely freeze simulation and audio
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.visibilityState === 'hidden';
      soundSynth.setSoundEnabled(isHidden ? false : saveData.sound);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveData.sound]);

  // Handle Gameplay state changes synced from engine loops
  const handleEngineStateChange = (state: GameplayEngineState) => {
    setEngineState(state);

    // Trigger Win complete routines
    if (state.levelCompleted) {
      handleLevelWin(state);
    }
  };

  const handleSoundEffect = (sound: string) => {
    if (!saveData.sound) return;
    switch (sound) {
      case 'aim':
        soundSynth.playAimTension(0.65);
        break;
      case 'launch':
        soundSynth.playLaunch();
        break;
      case 'bounce':
        soundSynth.playBounce();
        break;
      case 'glass':
        soundSynth.playGlassBreak();
        break;
      case 'portal':
        soundSynth.playPortal();
        break;
      case 'volt':
        soundSynth.playVoltChain();
        break;
      case 'frost':
        soundSynth.playFrostSlow();
        break;
      case 'fail':
        soundSynth.playHazardFailure();
        break;
      case 'target':
        soundSynth.playTargetDestruction();
        break;
      case 'perfect':
        soundSynth.playPerfectRicochet();
        break;
      case 'button':
        soundSynth.playButton();
        break;
    }
  };

  const handleHapticEffect = (intensity: 'light' | 'medium' | 'heavy') => {
    if (!saveData.vibration) return;
    switch (intensity) {
      case 'light':
        haptics.light(true);
        break;
      case 'medium':
        haptics.medium(true);
        break;
      case 'heavy':
        haptics.heavy(true);
        break;
    }
  };

  // 3. Main Gameplay Controls
  const startLevel = (levelId: number) => {
    const level = generateLevel(levelId);
    validateLevel(level); // verification check

    setActiveLevelId(levelId);
    setScreen('game');

    const totalAmmo = level.maxAmmo;
    if (engineRef.current) {
      engineRef.current.reset(level, totalAmmo);
    } else {
      engineRef.current = new GameplayEngine(
        level,
        totalAmmo,
        handleEngineStateChange,
        handleSoundEffect,
        handleHapticEffect
      );
    }
    // force state refresh
    setEngineState({ ...engineRef.current.state });
  };

  const handleLevelWin = (state: GameplayEngineState) => {
    // 3-star rating verification logic
    const baseTargetShots = activeLevelId < 31 ? 1 : 2;
    let starsAwarded = 1;

    if (state.shotsUsed <= baseTargetShots + 1) starsAwarded = 2;
    // Maximum stars awarded only on optimal shots AND required bonus ricochets matched
    if (state.shotsUsed <= baseTargetShots && state.bounceCount >= activeLevel.requiredBounces + 1) {
      starsAwarded = 3;
    }

    // Score computation
    const baseScore = 100 * Math.pow(2, state.bounceCount) + state.ammo * 250 + starsAwarded * 500;

    // Coin rewards increments (prevent repeatedly farming coins)
    const previousStars = saveData.stars[activeLevelId] || 0;
    const additionalCoins = Math.max(0, starsAwarded - previousStars) * 20 + 20;

    const updatedStars = { ...saveData.stars, [activeLevelId]: Math.max(previousStars, starsAwarded) };
    const updatedScores = { ...saveData.bestScores, [activeLevelId]: Math.max(saveData.bestScores[activeLevelId] || 0, baseScore) };
    const nextUnlockedLevel = Math.max(saveData.unlocked, Math.min(100, activeLevelId + 1));

    updateSave({
      ...saveData,
      unlocked: nextUnlockedLevel,
      stars: updatedStars,
      bestScores: updatedScores,
      coins: saveData.coins + additionalCoins
    });
  };

  // 4. Shop Handlers
  const selectBall = (id: number) => {
    handleSoundEffect('button');
    updateSave({
      ...saveData,
      selectedBall: id
    });
  };

  const buyBall = (id: number, price: number) => {
    handleSoundEffect('button');
    if (saveData.coins >= price && !saveData.ownedBalls.includes(id)) {
      updateSave({
        ...saveData,
        coins: saveData.coins - price,
        ownedBalls: [...saveData.ownedBalls, id],
        selectedBall: id
      });
    }
  };

  // 5. Daily Reward Handlers
  const claimDailyReward = (coinsAward: number, newStreak: number) => {
    handleSoundEffect('button');
    const todayStr = new Date().toISOString().split('T')[0];
    updateSave({
      ...saveData,
      coins: saveData.coins + coinsAward,
      daily: todayStr,
      dailyStreak: newStreak
    });
  };

  return (
    <div className="relative w-screen h-screen bg-[#071324] overflow-hidden flex items-center justify-center select-none touch-none">

      {/* 1. App screens routes */}
      {screen === 'home' && (
        <HomeScreen
          saveData={saveData}
          onNavigate={(scr) => {
            handleSoundEffect('button');
            setScreen(scr);
          }}
          onQuickPlay={() => {
            handleSoundEffect('button');
            startLevel(saveData.unlocked);
          }}
        />
      )}

      {screen === 'levels' && (
        <LevelSelection
          saveData={saveData}
          onSelectLevel={(id) => {
            handleSoundEffect('button');
            startLevel(id);
          }}
          onBack={() => {
            handleSoundEffect('button');
            setScreen('home');
          }}
        />
      )}

      {screen === 'game' && engineRef.current && engineState && (
        <div className="w-full h-full relative">
          <GameCanvas
            engine={engineRef.current}
            level={activeLevel}
            selectedProjConfig={selectedProjConfig}
            onLaunchComplete={() => {}}
          />

          <GameOverlay
            level={activeLevel}
            ammo={engineState.ammo}
            maxAmmo={activeLevel.maxAmmo}
            requiredBounces={activeLevel.requiredBounces}
            levelTime={engineState.levelTime}
            timeLimit={activeLevel.timeLimit}
            message={engineState.message}
            soundEnabled={saveData.sound}
            onToggleSound={() => {
              handleSoundEffect('button');
              updateSave({ ...saveData, sound: !saveData.sound });
            }}
            onRestart={() => {
              handleSoundEffect('button');
              startLevel(activeLevelId);
            }}
            onExit={() => {
              handleSoundEffect('button');
              setScreen('levels');
            }}
            isAiming={engineState.isAiming}
            activeProjectileCount={engineState.projectiles.length}
            selectedProjectileType={selectedProjConfig.name}
          />

          {/* Results Modal overlay screen */}
          {(engineState.levelCompleted || engineState.levelFailed) && (
            <ResultScreen
              isWin={engineState.levelCompleted}
              score={engineState.levelCompleted ? (100 * Math.pow(2, engineState.bounceCount) + engineState.ammo * 250) : 0}
              starsEarned={
                engineState.levelCompleted
                  ? (engineState.shotsUsed <= (activeLevelId < 31 ? 1 : 2) && engineState.bounceCount >= activeLevel.requiredBounces + 1 ? 3 : engineState.shotsUsed <= (activeLevelId < 31 ? 1 : 2) + 1 ? 2 : 1)
                  : 0
              }
              message={engineState.failReason}
              bounceCount={engineState.bounceCount}
              levelId={activeLevelId}
              onRetry={() => {
                handleSoundEffect('button');
                startLevel(activeLevelId);
              }}
              onNext={() => {
                handleSoundEffect('button');
                startLevel(activeLevelId + 1);
              }}
              onBackToLevels={() => {
                handleSoundEffect('button');
                setScreen('levels');
              }}
            />
          )}
        </div>
      )}

      {screen === 'shop' && (
        <Shop
          saveData={saveData}
          onSelectBall={selectBall}
          onBuyBall={buyBall}
          onBack={() => {
            handleSoundEffect('button');
            setScreen('home');
          }}
        />
      )}

      {screen === 'daily' && (
        <DailyReward
          saveData={saveData}
          onClaim={claimDailyReward}
          onBack={() => {
            handleSoundEffect('button');
            setScreen('home');
          }}
        />
      )}

      {screen === 'settings' && (
        <SettingsPanel
          soundEnabled={saveData.sound}
          vibrationEnabled={saveData.vibration}
          onToggleSound={() => {
            handleSoundEffect('button');
            updateSave({ ...saveData, sound: !saveData.sound });
          }}
          onToggleVibration={() => {
            handleSoundEffect('button');
            updateSave({ ...saveData, vibration: !saveData.vibration });
          }}
          onResetTutorial={() => {
            handleSoundEffect('button');
            updateSave({ ...saveData, tutorialCompleted: false });
            setShowTutorial(true);
            setScreen('home');
          }}
          onClose={() => {
            handleSoundEffect('button');
            setScreen('home');
          }}
        />
      )}

      {/* 2. Modal Onboarding Tutorial flows */}
      {showTutorial && (
        <Tutorial
          onDismiss={() => {
            handleSoundEffect('button');
            updateSave({ ...saveData, tutorialCompleted: true });
            setShowTutorial(false);
          }}
        />
      )}

    </div>
  );
};

export default App;
