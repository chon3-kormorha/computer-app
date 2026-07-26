/* ==========================================================================
   Web Audio API Sound Engine (Retro Nintendo SFX)
   ========================================================================== */

let audioCtx = null;
let isMuted = false;

function checkMuteState() {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('flowchart_sound_muted');
  if (saved !== null) {
    isMuted = (saved === 'true');
  }
  return isMuted;
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.1) {
  if (checkMuteState()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silent catch
  }
}

export const SoundEngine = {
  toggleMute: () => {
    isMuted = !isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowchart_sound_muted', isMuted ? 'true' : 'false');
    }
    return isMuted;
  },
  isMuted: () => checkMuteState(),

  playClick: () => playTone(600, 0.05, 'square', 0.08),
  playCorrect: () => {
    playTone(523.25, 0.08, 'triangle', 0.12);
    setTimeout(() => playTone(659.25, 0.08, 'triangle', 0.12), 80);
    setTimeout(() => playTone(783.99, 0.14, 'triangle', 0.12), 160);
  },
  playWrong: () => {
    playTone(200, 0.1, 'sawtooth', 0.15);
    setTimeout(() => playTone(150, 0.15, 'sawtooth', 0.15), 100);
  },
  playVictory: () => {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.12, 'square', 0.1), idx * 100);
    });
  }
};
