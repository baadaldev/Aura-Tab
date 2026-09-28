/* ==========================================================
   AuraTab - Main Script (Interactive Canvas, Clock, Audio, Themes)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initCanvas();
  initTheme();
  initAmbientSound();
  initTodo();
  initQuotes();
});

/* ----------------------------------------------------------
   1. Realtime Clock, Date & Greeting
   ---------------------------------------------------------- */
function initClock() {
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const ampmEl = document.getElementById('ampm');
  const dateEl = document.getElementById('date-display');
  const greetingEl = document.getElementById('greeting-text');

  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

  function update() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Greeting logic
    if (hours >= 4 && hours < 12) {
      greetingEl.textContent = 'শুভ সকাল! নতুন দিনের শুভেচ্ছা ✨';
    } else if (hours >= 12 && hours < 16) {
      greetingEl.textContent = 'শুভ দুপুর! দারুণ একটি দিন কাটুক ☀️';
    } else if (hours >= 16 && hours < 19) {
      greetingEl.textContent = 'শুভ বিকেল! কিছুটা রিফ্রেশমেন্টের সময় ☕';
    } else if (hours >= 19 && hours < 23) {
      greetingEl.textContent = 'শুভ সন্ধ্যা! আজকের কাজগুলো গুটিয়ে নাও 🌆';
    } else {
      greetingEl.textContent = 'শুভ রাত্রি! মিষ্টি ঘুম আর মিষ্টি স্বপ্ন 🌙';
    }

    // 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    ampmEl.textContent = ampm;

    // Date
    const dayName = daysBn[now.getDay()];
    const dateNum = now.getDate();
    const monthName = monthsBn[now.getMonth()];
    const yearNum = now.getFullYear();

    dateEl.textContent = `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
  }

  update();
  setInterval(update, 1000);
}

/* ----------------------------------------------------------
   2. Interactive Floating Particles Canvas
   ---------------------------------------------------------- */
let canvasThemeColors = {
  particle: '#00f2fe',
  line: 'rgba(0, 242, 254, 0.15)'
};

function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create particles
  const particleCount = Math.min(Math.floor((width * height) / 12000), 90);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.size = Math.random() * 2.5 + 1.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = canvasThemeColors.particle;
      ctx.shadowBlur = 10;
      ctx.shadowColor = canvasThemeColors.particle;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      // Screen bounds
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = canvasThemeColors.line.replace('0.15', alpha.toFixed(3));
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ----------------------------------------------------------
   3. Theme Switcher
   ---------------------------------------------------------- */
function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const options = document.querySelectorAll('.theme-option');

  const themeColors = {
    cyberpunk: { particle: '#00f2fe', line: 'rgba(0, 242, 254, 0.15)' },
    space: { particle: '#38bdf8', line: 'rgba(56, 189, 248, 0.15)' },
    sunset: { particle: '#f97316', line: 'rgba(249, 115, 22, 0.15)' },
    matrix: { particle: '#00ff66', line: 'rgba(0, 255, 102, 0.15)' }
  };

  // Load saved theme
  const savedTheme = localStorage.getItem('auratab_theme') || 'cyberpunk';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    themeMenu.classList.add('hidden');
  });

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      const selected = opt.getAttribute('data-set-theme');
      applyTheme(selected);
      localStorage.setItem('auratab_theme', selected);
      themeMenu.classList.add('hidden');
    });
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (themeColors[theme]) {
      canvasThemeColors = themeColors[theme];
    }
    options.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-set-theme') === theme);
    });
  }
}

/* ----------------------------------------------------------
   4. Ambient Relaxing Rain Sound (Pure Web Audio API)
   ---------------------------------------------------------- */
function initAmbientSound() {
  const soundBtn = document.getElementById('sound-btn');
  const soundOffIcon = document.getElementById('sound-icon-off');
  const soundOnIcon = document.getElementById('sound-icon-on');
  const soundStatus = document.getElementById('sound-status');

  let audioCtx = null;
  let noiseNode = null;
  let gainNode = null;
  let isPlaying = false;

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startRain();
    } else {
      stopRain();
    }
  });

  function startRain() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Generate Pink/Brownish noise for natural rain sound
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain adjustment
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      // Filter to simulate soothing raindrop atmosphere
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      isPlaying = true;

      soundOffIcon.classList.add('hidden');
      soundOnIcon.classList.remove('hidden');
      soundStatus.textContent = 'বৃষ্টি চলছে...';
    } catch (e) {
      console.error('Audio initialization error:', e);
    }
  }

  function stopRain() {
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    isPlaying = false;
    soundOffIcon.classList.remove('hidden');
    soundOnIcon.classList.add('hidden');
    soundStatus.textContent = 'বৃষ্টি সাউন্ড';
  }
}

/* ----------------------------------------------------------
   5. Interactive To-Do List
   ---------------------------------------------------------- */
function initTodo() {
  const toggleBtn = document.getElementById('todo-toggle-btn');
  const panel = document.getElementById('todo-panel');
  const closeBtn = document.getElementById('todo-close-btn');
  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('todo-add-btn');
  const list = document.getElementById('todo-list');

  let todos = JSON.parse(localStorage.getItem('auratab_todos') || '[]');

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  function render() {
    list.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.done ? 'done' : ''}`;

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = todo.done;
      check.addEventListener('change', () => {
        todos[index].done = check.checked;
        save();
        render();
      });

      const span = document.createElement('span');
      span.textContent = todo.text;

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'ডিলিট করো';
      delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        save();
        render();
      });

      const leftDiv = document.createElement('div');
      leftDiv.style.display = 'flex';
      leftDiv.style.alignItems = 'center';
      leftDiv.appendChild(check);
      leftDiv.appendChild(span);

      li.appendChild(leftDiv);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  function save() {
    localStorage.setItem('auratab_todos', JSON.stringify(todos));
  }

  function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    save();
    render();
    input.value = '';
  }

  addBtn.addEventListener('click', addTodo);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  render();
}

/* ----------------------------------------------------------
   6. Rotating Quotes
   ---------------------------------------------------------- */
function initQuotes() {
  const quoteEl = document.getElementById('quote-text');
  const quotes = [
    '"প্রতিটি নতুন দিন হলো নতুন কিছু তৈরি করার সবচেয়ে সুন্দর সুযোগ।"',
    '"ছোট ছোট পদক্ষেপে এগিয়ে চলো, বড় সাফল্য তোমার অপেক্ষায়।"',
    '"কঠিন সমস্যার ভেতরই সবচেয়ে দারুণ সমাধানের জন্ম হয়।"',
    '"আজকের ফোকাসড ১ ঘণ্টা কালকের ঘণ্টার পর ঘণ্টা বাঁচিয়ে দেবে।"',
    '"ভুল করতে ভয় পেয়ো না, ভুল থেকেই আসল কোডার তৈরি হয়।"'
  ];

  let current = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = quotes[current];

  quoteEl.addEventListener('click', () => {
    current = (current + 1) % quotes.length;
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.textContent = quotes[current];
      quoteEl.style.opacity = '0.85';
    }, 200);
  });
}
