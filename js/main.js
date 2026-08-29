// main.js — Navegação, Modo Dia/Noite e Pokémons Roamers com Captura de Pokébola

// ─── NAVEGAÇÃO ───
function navigateTo(sectionName) {
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.remove('active-section');
  });
  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.remove('active');
  });

  var target = document.getElementById('section-' + sectionName);
  if (target) {
    target.classList.add('active-section');
    window.scrollTo(0, 0);
  }

  var roamerLayer = document.getElementById('pokemon-roamer-container');
  if (roamerLayer) {
    roamerLayer.style.display = 'block';
  }

  var navBtn = document.getElementById('nav-' + sectionName);
  if (navBtn) navBtn.classList.add('active');

  if (sectionName === 'home') initParticles();
}

// ─── MENU DRAWER / OPÇÕES ───
function toggleMenu() {
  var menu = document.getElementById('menu-modal');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

function closeMenuOnBackdrop(e) {
  if (e.target && e.target.id === 'menu-modal') {
    toggleMenu();
  }
}

function navigateToHomeFromMenu() {
  toggleMenu();
  navigateTo('home');
}

function openStatsFromMenu() {
  toggleMenu();
  if (typeof openStatsModal === 'function') {
    openStatsModal();
  }
}

// ─── MODO DIA / NOITE ───
function initTheme() {
  var savedTheme = localStorage.getItem('poketools_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcon('light');
  } else {
    document.body.classList.remove('light-mode');
    updateThemeIcon('dark');
  }
}

function toggleDayNightMode() {
  var isLight = document.body.classList.toggle('light-mode');
  var theme = isLight ? 'light' : 'dark';
  localStorage.setItem('poketools_theme', theme);
  updateThemeIcon(theme);
  if (typeof initParticles === 'function') initParticles();
}

function updateThemeIcon(theme) {
  var iconEl = document.getElementById('theme-toggle-icon');
  var textEl = document.getElementById('theme-toggle-text');
  var isLight = (theme === 'light');

  if (iconEl) {
    iconEl.textContent = isLight ? '🌙' : '☀️';
  }
  if (textEl) {
    if (typeof t === 'function') {
      textEl.textContent = isLight ? t('theme_dark') : t('theme_light');
    } else {
      textEl.textContent = isLight ? 'Modo Escuro 🌙' : 'Modo Claro ☀️';
    }
  }
}

// ─── PARTÍCULAS NO FUNDO ───
var particleAnim = null;
function initParticles() {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  if (particleAnim) cancelAnimationFrame(particleAnim);

  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var isLight = document.body.classList.contains('light-mode');
  var colors = isLight
    ? ['#0e7dc2', '#f7c948', '#e63946', '#4caf50', '#ffffff']
    : ['#f7c948', '#3ab8f5', '#e63946', '#ffffff', '#4fc3f7'];

  var particles = [];
  for (var i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particleAnim = requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─── POKÉMON ROAMERS (151 Pokémons, Sem Repetição, Raridade e Captura) ───
var activeRoamers = [];
var activePokemonIds = new Set();

function initPokemonRoamers() {
  var container = document.getElementById('pokemon-roamer-container');
  if (!container) return;

  for (var i = 0; i < 5; i++) {
    setTimeout(function() {
      spawnRoamer();
    }, i * 1400);
  }

  setInterval(function() {
    if (activeRoamers.length < 6) {
      spawnRoamer();
    }
  }, 3200);

  animateRoamers();
}

function spawnRoamer(forceShiny, forcedPoke) {
  var container = document.getElementById('pokemon-roamer-container');
  if (!container || typeof pickRandomGen1Pokemon !== 'function') return;

  var poke = forcedPoke || pickRandomGen1Pokemon(activePokemonIds);
  if (!poke) return;

  // Se forceShiny for true, é 100% Shiny! Caso contrário, chance normal (1 em 300)
  var isShiny = forceShiny === true ? true : (Math.random() < (1 / 300));

  if (typeof recordPokemonSeen === 'function') {
    recordPokemonSeen(poke, isShiny);
  }

  var goingRight = Math.random() > 0.5;
  var startX = goingRight ? -90 : window.innerWidth + 90;
  var speed = (Math.random() * 0.45 + 0.35) * (goingRight ? 1 : -1);

  var minY = window.innerHeight * 0.16;
  var maxY = window.innerHeight * 0.84;
  var posY = minY + Math.random() * (maxY - minY);

  var wrapper = document.createElement('div');
  wrapper.className = 'roamer-wrapper' + (isShiny ? ' shiny-wrapper' : '');
  wrapper.style.top = posY + 'px';
  wrapper.style.left = startX + 'px';

  var img = document.createElement('img');
  img.className = 'roaming-pokemon-img';
  var spriteBase = isShiny ? 'ani-shiny' : 'ani';
  img.src = 'https://play.pokemonshowdown.com/sprites/' + spriteBase + '/' + poke.name + '.gif';
  img.alt = poke.name + (isShiny ? ' (SHINY!)' : '');
  img.style.transform = goingRight ? 'scaleX(1)' : 'scaleX(-1)';
  
  img.onerror = function() {
    this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (isShiny ? 'shiny/' : '') + poke.id + '.png';
  };

  var roamerObj = {
    id: poke.id,
    name: poke.name,
    el: wrapper,
    imgEl: img,
    x: startX,
    speed: speed,
    goingRight: goingRight,
    isShiny: isShiny,
    isCatching: false
  };

  // 🎯 CLIQUE E TOQUE PARA ARREMESSAR POKÉBOLA
  function handleCatchTrigger(e) {
    if (e) {
      e.stopPropagation();
    }
    if (typeof attemptCatch === 'function') {
      attemptCatch(roamerObj);
    }
  }

  wrapper.addEventListener('pointerdown', handleCatchTrigger);
  wrapper.addEventListener('click', handleCatchTrigger);

  wrapper.appendChild(img);
  container.appendChild(wrapper);
  activeRoamers.push(roamerObj);
}

function animateRoamers() {
  var screenW = window.innerWidth;

  for (var i = activeRoamers.length - 1; i >= 0; i--) {
    var r = activeRoamers[i];
    if (r.isCatching) continue; // Parado durante arremesso

    r.x += r.speed;
    r.el.style.left = r.x + 'px';

    if ((r.goingRight && r.x > screenW + 110) || (!r.goingRight && r.x < -130)) {
      activePokemonIds.delete(r.id);
      if (r.el.parentNode) r.el.parentNode.removeChild(r.el);
      activeRoamers.splice(i, 1);
    }
  }

  requestAnimationFrame(animateRoamers);
}

// ─── HELPER DE TESTE PARA O CONSOLE: GERAR SHINY ───
window.spawnShiny = function(pokeParam) {
  var forced = null;
  if (typeof GEN1_POKEMON !== 'undefined') {
    if (typeof pokeParam === 'number') {
      forced = GEN1_POKEMON.find(function(p) { return p.id === pokeParam; });
    } else if (typeof pokeParam === 'string' && pokeParam.trim() !== '') {
      var query = pokeParam.trim().toLowerCase();
      forced = GEN1_POKEMON.find(function(p) { return p.name.toLowerCase() === query; });
    }
  }
  spawnRoamer(true, forced);
  console.log('✨ Pokémon Shiny gerado com sucesso na tela!');
};

// ─── INICIALIZAÇÃO GERAL ───
window.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initParticles();
  initPokemonRoamers();
  if (typeof updatePokedexBadge === 'function') updatePokedexBadge();
  if (typeof generateRaceNames === 'function') generateRaceNames();
  if (typeof timerInitDisplay === 'function') timerInitDisplay();
});
