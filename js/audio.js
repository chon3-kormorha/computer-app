/* ==========================================================================
   Web Audio API Sound Engine (Retro Nintendo-style SFX)
   ========================================================================== */

const SoundEngine = (() => {
  let audioCtx = null;
  let isMuted = false;

  // Global one-time user gesture audio unlock
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  };
  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { once: true });
  });

  // Initialize Web Audio Context on user interaction
  function getAudioContext() {
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

  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('flowchart_sound_muted', isMuted ? 'true' : 'false');
    return isMuted;
  }

  function checkMuteState() {
    const saved = localStorage.getItem('flowchart_sound_muted');
    if (saved !== null) {
      isMuted = (saved === 'true');
    }
    return isMuted;
  }

  // Play a simple synthesized tone
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
      console.warn('Audio play failed:', e);
    }
  }

  return {
    init: () => getAudioContext(),
    toggleMute,
    isMuted: checkMuteState,

    // Sound 1: Click / Select
    playClick: () => {
      playTone(600, 0.05, 'square', 0.08);
    },

    // Sound 2: Correct Answer / Chime
    playCorrect: () => {
      if (checkMuteState()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        
        // High arpeggio notes
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.12, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.12);
        });
      } catch (e) {}
    },

    // Sound 3: Wrong Answer / Buzz
    playWrong: () => {
      if (checkMuteState()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.25);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    },

    // Sound 4: Victory Fanfare (Level Complete)
    playVictory: () => {
      if (checkMuteState()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const melody = [
          { f: 523.25, d: 0.12, t: 0 },
          { f: 523.25, d: 0.12, t: 0.12 },
          { f: 523.25, d: 0.12, t: 0.24 },
          { f: 659.25, d: 0.25, t: 0.36 },
          { f: 783.99, d: 0.4,  t: 0.61 }
        ];

        melody.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(item.f, now + item.t);
          gain.gain.setValueAtTime(0.12, now + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + item.t);
          osc.stop(now + item.t + item.d);
        });
      } catch (e) {}
    }
  };
})();
