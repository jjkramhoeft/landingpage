/*
  Sound for the site, generated with the Web Audio API (no audio files).

  - Off by default. The speaker button (#sound-toggle) turns it on or off, and the choice is remembered across pages.
  - Browsers only allow audio after a user gesture, so a remembered "on" starts at the first click or key press.
  - The music is chosen per page with <body data-music="...">: "pad" (main page), "piano" (career page),
    "synth" (algorithms page) or "chiptune" (games page).
  - Effects, played only when sound is on: Sound.blip(frequency) a short hover sound, Sound.chime(step) a soft bell,
    Sound.click() a mechanical click, Sound.keys(count) a burst of keyboard typing, and the 8-bit
    Sound.coin(), Sound.jump() and Sound.over() (game over).
*/
(function () {
  'use strict';

  const STORAGE_KEY = 'jjk-sound';
  const MASTER_VOLUME = 0.2;

  const button = document.getElementById('sound-toggle');
  const trackName = (document.body && document.body.dataset.music) || 'pad';

  let ctx = null;
  let master = null;     // music volume, faded in and out
  let musicIn = null;    // tracks connect here (dry + reverb)
  let reverbSend = null; // extra reverb input for effects
  let sfxBus = null;     // effects, not affected by the music fade
  let clickNoise = null; // short noise burst for mechanical clicks
  let track = null;
  let wanted = false;    // what the visitor chose
  let playing = false;   // whether audio is actually running

  const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function loadPreference() {
    try { return localStorage.getItem(STORAGE_KEY) === 'on'; } catch (e) { return false; }
  }

  function savePreference(on) {
    try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); } catch (e) { /* storage unavailable */ }
  }

  function noiseBuffer(seconds) {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function reverbImpulse(seconds) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
    }
    return buffer;
  }

  function lfo(frequency, depth, target) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.value = depth;
    osc.connect(gain);
    gain.connect(target);
    osc.start();
  }

  // ---- Tracks: each returns { start(), stop() } ----

  // Main page: slow, warm synth chords with a soft wind texture.
  function padTrack() {
    const CHORD_SECONDS = 9;
    // Dmaj9, Bm9, Gmaj9, A6/9 as MIDI note numbers.
    const CHORDS = [
      [50, 57, 61, 64, 66],
      [47, 54, 57, 61, 62],
      [43, 50, 54, 59, 62],
      [45, 52, 59, 61, 64],
    ];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.5;
    lfo(0.05, 400, filter.frequency);
    filter.connect(musicIn);

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(3);
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 450;
    band.Q.value = 0.7;
    lfo(0.03, 200, band.frequency);
    const wind = ctx.createGain();
    wind.gain.value = 0.035;
    lfo(0.07, 0.025, wind.gain);
    noise.connect(band);
    band.connect(wind);
    wind.connect(musicIn);
    noise.start();

    let timer = 0;
    let index = 0;

    function playChord() {
      const notes = CHORDS[index++ % CHORDS.length];
      const t = ctx.currentTime;
      const attack = 3, hold = CHORD_SECONDS - attack, release = 5;
      const end = t + attack + hold + release;
      notes.forEach((note) => {
        const voice = ctx.createGain();
        voice.gain.setValueAtTime(0, t);
        voice.gain.linearRampToValueAtTime(0.06, t + attack);
        voice.gain.setValueAtTime(0.06, t + attack + hold);
        voice.gain.linearRampToValueAtTime(0, end);
        voice.connect(filter);
        // Two slightly detuned oscillators per note for a warmer sound.
        [['triangle', -5], ['sine', 5]].forEach(([type, cents]) => {
          const osc = ctx.createOscillator();
          osc.type = type;
          osc.frequency.value = midiToHz(note);
          osc.detune.value = cents;
          osc.connect(voice);
          osc.start(t);
          osc.stop(end + 0.1);
        });
      });
    }

    return {
      start() {
        if (timer) return;
        playChord();
        timer = setInterval(playChord, CHORD_SECONDS * 1000);
      },
      stop() {
        clearInterval(timer);
        timer = 0;
      },
    };
  }

  // Career page: a calm, slightly lo-fi piano loop (Fmaj7, Em7, Dm7, Cmaj7 at 72 BPM).
  function pianoTrack() {
    const BEAT = 60 / 72;
    const BARS = [
      { bass: 41, notes: [57, 60, 64, 65, 69] },
      { bass: 40, notes: [55, 59, 62, 64, 67] },
      { bass: 38, notes: [53, 57, 60, 62, 65] },
      { bass: 36, notes: [55, 59, 60, 64, 67] },
    ];
    // [beat, chord note index (-1 = bass), velocity]
    const PATTERN = [
      [0, -1, 0.55], [0, 2, 0.35], [0.5, 3, 0.25], [1, 4, 0.3],
      [1.5, 3, 0.2], [2, 1, 0.3], [2.5, 2, 0.22], [3, 3, 0.28],
    ];

    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 2400;
    tone.connect(musicIn);

    let timer = 0;
    let bar = 0;
    let nextBar = 0;

    function note(midi, time, velocity, length) {
      const f = midiToHz(midi);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(velocity * 0.22, time + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, time + length);
      env.connect(tone);
      // A few harmonics give a soft, piano-like tone.
      [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(([multiple, type, amount]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = f * multiple;
        gain.gain.value = amount;
        osc.connect(gain);
        gain.connect(env);
        osc.start(time);
        osc.stop(time + length + 0.05);
      });
    }

    // Schedules notes a little ahead of time so timers can't make the rhythm stumble.
    function schedule() {
      while (nextBar < ctx.currentTime + 0.6) {
        const chord = BARS[bar % BARS.length];
        PATTERN.forEach(([beat, index, velocity]) => {
          if (index >= 0 && Math.random() < 0.15) return; // leave out the odd note for variation
          const time = nextBar + beat * BEAT + (index >= 0 ? (Math.random() - 0.5) * 0.02 : 0);
          const v = velocity * (0.85 + Math.random() * 0.3);
          if (index < 0) note(chord.bass, time, v, 3.5);
          else note(chord.notes[index], time, v, 2.4);
        });
        nextBar += 4 * BEAT;
        bar++;
      }
    }

    return {
      start() {
        if (timer) return;
        nextBar = ctx.currentTime + 0.1;
        schedule();
        timer = setInterval(schedule, 200);
      },
      stop() {
        clearInterval(timer);
        timer = 0;
      },
    };
  }

  // Algorithms page: a minimal, synthwave-light loop (Am, F, C, G at 96 BPM) with arpeggio, bass and soft drums.
  function synthTrack() {
    const STEP = 60 / 96 / 4; // one sixteenth note
    const CHORDS = [
      { bass: 33, arp: [57, 60, 64, 69] },
      { bass: 29, arp: [53, 57, 60, 65] },
      { bass: 36, arp: [55, 60, 64, 67] },
      { bass: 31, arp: [55, 59, 62, 67] },
    ];
    const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 2, 1];
    const BASS_STEPS = [0, 3, 6, 8, 11, 14];

    const arpFilter = ctx.createBiquadFilter();
    arpFilter.type = 'lowpass';
    arpFilter.frequency.value = 1500;
    arpFilter.Q.value = 4;
    lfo(0.06, 700, arpFilter.frequency);
    arpFilter.connect(musicIn);

    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 320;
    bassFilter.connect(musicIn);

    const hatNoise = noiseBuffer(0.2);

    let timer = 0;
    let bar = 0;
    let nextBar = 0;

    function pluck(midi, time) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = midiToHz(midi);
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(0.035, time + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
      osc.connect(env);
      env.connect(arpFilter);
      osc.start(time);
      osc.stop(time + 0.25);
    }

    function bass(midi, time) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = midiToHz(midi);
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(0.16, time + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 2.6);
      osc.connect(env);
      env.connect(bassFilter);
      osc.start(time);
      osc.stop(time + STEP * 3);
    }

    function kick(time) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.frequency.setValueAtTime(120, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.18);
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(0.22, time + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
      osc.connect(env);
      env.connect(master);
      osc.start(time);
      osc.stop(time + 0.32);
    }

    function hat(time) {
      const src = ctx.createBufferSource();
      const high = ctx.createBiquadFilter();
      const env = ctx.createGain();
      src.buffer = hatNoise;
      high.type = 'highpass';
      high.frequency.value = 7000;
      env.gain.setValueAtTime(0.0001, time);
      env.gain.exponentialRampToValueAtTime(0.05, time + 0.002);
      env.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
      src.connect(high);
      high.connect(env);
      env.connect(master);
      src.start(time);
      src.stop(time + 0.05);
    }

    function schedule() {
      while (nextBar < ctx.currentTime + 0.6) {
        const chord = CHORDS[Math.floor(bar / 2) % CHORDS.length];
        for (let step = 0; step < 16; step++) {
          const time = nextBar + step * STEP;
          pluck(chord.arp[ARP[step]] + (bar % 4 === 3 && step > 11 ? 12 : 0), time);
          if (BASS_STEPS.includes(step)) bass(chord.bass, time);
          if (step === 0 || step === 8) kick(time);
          if (step % 4 === 2) hat(time);
        }
        nextBar += 16 * STEP;
        bar++;
      }
    }

    return {
      start() {
        if (timer) return;
        nextBar = ctx.currentTime + 0.1;
        schedule();
        timer = setInterval(schedule, 200);
      },
      stop() {
        clearInterval(timer);
        timer = 0;
      },
    };
  }

  // A pulse wave like the square channels of an 8-bit console (duty 0.25 = the classic thin "NES" tone).
  function pulseWave(duty) {
    const n = 32;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let k = 1; k < n; k++) real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
    return ctx.createPeriodicWave(real, imag);
  }

  // Games page: a cheerful chiptune loop (C, Am, F, G at 140 BPM) with pulse lead, triangle bass and noise drums.
  function chiptuneTrack() {
    const STEP = 60 / 140 / 4; // one sixteenth note
    // Lead melody in eighth notes, one row per bar. null = rest.
    const MELODY = [
      [76, 79, 84, 79, 76, 79, 81, 79],
      [76, 72, 76, 81, 79, 76, 72, 74],
      [77, 81, 84, 81, 77, 81, 79, 77],
      [74, 79, 83, 79, 86, 83, 79, null],
    ];
    const BASS = [48, 45, 41, 43];

    const lead = pulseWave(0.25);
    const drumNoise = noiseBuffer(0.3);

    let timer = 0;
    let bar = 0;
    let nextBar = 0;

    function tone(wave, frequency, time, length, level) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      if (typeof wave === 'string') osc.type = wave; else osc.setPeriodicWave(wave);
      osc.frequency.value = frequency;
      env.gain.setValueAtTime(level, time);
      env.gain.setValueAtTime(level, time + length * 0.7);
      env.gain.exponentialRampToValueAtTime(0.0001, time + length);
      osc.connect(env);
      env.connect(musicIn);
      osc.start(time);
      osc.stop(time + length + 0.02);
    }

    function noise(time, length, level, highpass) {
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();
      src.buffer = drumNoise;
      filter.type = 'highpass';
      filter.frequency.value = highpass;
      env.gain.setValueAtTime(level, time);
      env.gain.exponentialRampToValueAtTime(0.0001, time + length);
      src.connect(filter);
      filter.connect(env);
      env.connect(master);
      src.start(time);
      src.stop(time + length + 0.02);
    }

    function kick(time) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(50, time + 0.12);
      env.gain.setValueAtTime(0.35, time);
      env.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
      osc.connect(env);
      env.connect(master);
      osc.start(time);
      osc.stop(time + 0.18);
    }

    function schedule() {
      while (nextBar < ctx.currentTime + 0.6) {
        const index = bar % 4;
        const lift = Math.floor(bar / 4) % 2 === 1 && index >= 2 ? 12 : 0; // every other round, end an octave up
        MELODY[index].forEach((note, eighth) => {
          if (note != null) tone(lead, midiToHz(note + lift), nextBar + eighth * 2 * STEP, STEP * 1.8, 0.05);
        });
        for (let eighth = 0; eighth < 8; eighth++) {
          const time = nextBar + eighth * 2 * STEP;
          tone('triangle', midiToHz(BASS[index] + (eighth % 2 ? 12 : 0)), time, STEP * 1.7, 0.16);
          noise(time + STEP, 0.03, 0.03, 8000);
        }
        kick(nextBar);
        kick(nextBar + 8 * STEP);
        noise(nextBar + 4 * STEP, 0.12, 0.09, 1500);
        noise(nextBar + 12 * STEP, 0.12, 0.09, 1500);
        nextBar += 16 * STEP;
        bar++;
      }
    }

    return {
      start() {
        if (timer) return;
        nextBar = ctx.currentTime + 0.1;
        schedule();
        timer = setInterval(schedule, 200);
      },
      stop() {
        clearInterval(timer);
        timer = 0;
      },
    };
  }

  const TRACKS = { pad: padTrack, piano: pianoTrack, synth: synthTrack, chiptune: chiptuneTrack };

  // ---- Engine ----

  function setup() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    ctx = new AudioCtx();

    const compressor = ctx.createDynamicsCompressor();
    compressor.connect(ctx.destination);

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(compressor);

    const reverb = ctx.createConvolver();
    reverb.buffer = reverbImpulse(3.5);
    const wet = ctx.createGain();
    wet.gain.value = 0.4;
    reverb.connect(wet);
    wet.connect(master);

    reverbSend = ctx.createGain();
    reverbSend.connect(reverb);

    musicIn = ctx.createGain();
    musicIn.connect(master);
    musicIn.connect(reverbSend);

    sfxBus = ctx.createGain();
    sfxBus.connect(compressor);

    clickNoise = noiseBuffer(0.1);

    track = (TRACKS[trackName] || padTrack)();
    return true;
  }

  function fadeTo(value, seconds) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(value, t + seconds);
  }

  function start() {
    if (!ctx && !setup()) return;
    ctx.resume();
    fadeTo(MASTER_VOLUME, 2.5);
    track.start();
    playing = true;
  }

  function stop() {
    if (!ctx || !playing) return;
    playing = false;
    track.stop();
    fadeTo(0, 0.8);
    setTimeout(() => { if (!playing) ctx.suspend(); }, 900);
  }

  function render() {
    if (!button) return;
    const label = wanted ? 'Turn sound off' : 'Turn sound on';
    button.setAttribute('aria-pressed', String(wanted));
    button.setAttribute('aria-label', label);
    button.title = label;
  }

  function blip(frequency) {
    if (!playing || !ctx) return;
    const f = frequency || 330;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    osc.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.15);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // A soft bell. `step` walks up a pentatonic scale, so consecutive chimes form a little melody.
  function chime(step) {
    if (!playing || !ctx) return;
    const SCALE = [76, 79, 81, 83, 86, 88];
    const f = midiToHz(SCALE[Math.abs(step || 0) % SCALE.length]);
    const t = ctx.currentTime;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.045, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    env.connect(sfxBus);
    env.connect(reverbSend);
    [[1, 1], [2.76, 0.25], [5.4, 0.08]].forEach(([multiple, amount]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = f * multiple;
      gain.gain.value = amount;
      osc.connect(gain);
      gain.connect(env);
      osc.start(t);
      osc.stop(t + 1.7);
    });
  }

  // A soft mechanical click: a filtered noise burst plus a low tick.
  function tick(time, frequency, level) {
    const src = ctx.createBufferSource();
    const band = ctx.createBiquadFilter();
    const env = ctx.createGain();
    src.buffer = clickNoise;
    band.type = 'bandpass';
    band.frequency.value = frequency;
    band.Q.value = 1.4;
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(level, time + 0.002);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);
    src.connect(band);
    band.connect(env);
    env.connect(sfxBus);
    src.start(time);
    src.stop(time + 0.05);

    const thump = ctx.createOscillator();
    const thumpEnv = ctx.createGain();
    thump.frequency.value = 170;
    thumpEnv.gain.setValueAtTime(0.0001, time);
    thumpEnv.gain.exponentialRampToValueAtTime(level * 0.4, time + 0.002);
    thumpEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
    thump.connect(thumpEnv);
    thumpEnv.connect(sfxBus);
    thump.start(time);
    thump.stop(time + 0.04);
  }

  function click() {
    if (!playing || !ctx) return;
    tick(ctx.currentTime, 2600, 0.14);
  }

  // A short burst of keyboard typing.
  function keys(count) {
    if (!playing || !ctx) return;
    let time = ctx.currentTime;
    for (let i = 0; i < (count || 4); i++) {
      tick(time, 1800 + Math.random() * 1400, 0.06 + Math.random() * 0.04);
      time += 0.045 + Math.random() * 0.05;
    }
  }

  // 8-bit style effects: a square-wave note that can slide from one pitch to another.
  function square(time, from, to, length, level) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(from, time);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, time + length);
    env.gain.setValueAtTime(level, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(env);
    env.connect(sfxBus);
    osc.start(time);
    osc.stop(time + length + 0.02);
  }

  function coin() {
    if (!playing || !ctx) return;
    const t = ctx.currentTime;
    square(t, 988, 988, 0.07, 0.05);
    square(t + 0.07, 1319, 1319, 0.28, 0.05);
  }

  function jump() {
    if (!playing || !ctx) return;
    square(ctx.currentTime, 220, 700, 0.14, 0.03);
  }

  function over() {
    if (!playing || !ctx) return;
    const t = ctx.currentTime;
    [523, 392, 330, 262].forEach((f, i) => square(t + i * 0.13, f, f * 0.97, 0.14, 0.05));
  }

  if (button) {
    button.addEventListener('click', () => {
      wanted = !wanted;
      savePreference(wanted);
      render();
      if (wanted) start(); else stop();
    });
  }

  // Pause while the tab is hidden (timers are throttled there anyway).
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) {
      track.stop();
      ctx.suspend();
    } else {
      ctx.resume();
      track.start();
    }
  });

  wanted = loadPreference();
  render();

  if (wanted) {
    const events = ['pointerdown', 'keydown'];
    const arm = (e) => {
      if (e.target instanceof Element && e.target.closest('#sound-toggle')) return; // the button handles itself
      events.forEach((type) => document.removeEventListener(type, arm, true));
      if (wanted && !playing) start();
    };
    events.forEach((type) => document.addEventListener(type, arm, true));
  }

  window.Sound = { blip, chime, click, keys, coin, jump, over };
})();
