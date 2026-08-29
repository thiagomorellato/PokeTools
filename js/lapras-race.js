// lapras-race.js — Swim Race com Pokémons Aquáticos das Gerações 1, 2 e 3 (até 100 Participantes)

var playerCount    = 4;
var raceRunners    = [];
var raceAnimId     = null;
var raceWinner     = null;
var savedNames     = [];
var countdownTimer = null;

// ─── ROSTER COMPLETO DE POKÉMONS AQUÁTICOS (GEN 1, 2 E 3) ───
var WATER_POKEMON_ROSTER = [
  // Gen 1 (Kanto)
  { id: 7, name: 'squirtle' },
  { id: 8, name: 'wartortle' },
  { id: 9, name: 'blastoise' },
  { id: 54, name: 'psyduck' },
  { id: 55, name: 'golduck' },
  { id: 60, name: 'poliwag' },
  { id: 61, name: 'poliwhirl' },
  { id: 62, name: 'poliwrath' },
  { id: 72, name: 'tentacool' },
  { id: 73, name: 'tentacruel' },
  { id: 79, name: 'slowpoke' },
  { id: 80, name: 'slowbro' },
  { id: 86, name: 'seel' },
  { id: 87, name: 'dewgong' },
  { id: 90, name: 'shellder' },
  { id: 91, name: 'cloyster' },
  { id: 98, name: 'krabby' },
  { id: 99, name: 'kingler' },
  { id: 116, name: 'horsea' },
  { id: 117, name: 'seadra' },
  { id: 118, name: 'goldeen' },
  { id: 119, name: 'seaking' },
  { id: 120, name: 'staryu' },
  { id: 121, name: 'starmie' },
  { id: 129, name: 'magikarp' },
  { id: 130, name: 'gyarados' },
  { id: 131, name: 'lapras' },
  { id: 134, name: 'vaporeon' },
  { id: 138, name: 'omanyte' },
  { id: 139, name: 'omastar' },
  { id: 140, name: 'kabuto' },
  { id: 141, name: 'kabutops' },

  // Gen 2 (Johto)
  { id: 158, name: 'totodile' },
  { id: 159, name: 'croconaw' },
  { id: 160, name: 'feraligatr' },
  { id: 170, name: 'chinchou' },
  { id: 171, name: 'lanturn' },
  { id: 183, name: 'marill' },
  { id: 184, name: 'azumarill' },
  { id: 186, name: 'politoed' },
  { id: 194, name: 'wooper' },
  { id: 195, name: 'quagsire' },
  { id: 199, name: 'slowking' },
  { id: 211, name: 'qwilfish' },
  { id: 222, name: 'corsola' },
  { id: 223, name: 'remoraid' },
  { id: 224, name: 'octillery' },
  { id: 226, name: 'mantine' },
  { id: 230, name: 'kingdra' },
  { id: 245, name: 'suicune' },

  // Gen 3 (Hoenn)
  { id: 258, name: 'mudkip' },
  { id: 259, name: 'marshtomp' },
  { id: 260, name: 'swampert' },
  { id: 270, name: 'lotad' },
  { id: 271, name: 'lombre' },
  { id: 272, name: 'ludicolo' },
  { id: 278, name: 'wingull' },
  { id: 279, name: 'pelipper' },
  { id: 283, name: 'surskit' },
  { id: 318, name: 'carvanha' },
  { id: 319, name: 'sharpedo' },
  { id: 320, name: 'wailmer' },
  { id: 321, name: 'wailord' },
  { id: 339, name: 'barboach' },
  { id: 340, name: 'whiscash' },
  { id: 341, name: 'corphish' },
  { id: 342, name: 'crawdaunt' },
  { id: 349, name: 'feebas' },
  { id: 350, name: 'milotic' },
  { id: 363, name: 'spheal' },
  { id: 364, name: 'sealeo' },
  { id: 365, name: 'walrein' },
  { id: 366, name: 'clamperl' },
  { id: 367, name: 'huntail' },
  { id: 368, name: 'gorebyss' },
  { id: 369, name: 'relicanth' },
  { id: 370, name: 'luvdisc' },
  { id: 382, name: 'kyogre' }
];

// Paleta dinâmica vibrante de cores para até 100 jogadores
function getLaneColor(index, total) {
  var hue = Math.round((index * 360) / Math.max(1, total));
  return 'hsl(' + hue + ', 85%, 58%)';
}

// ─── AJUSTE DE PARTICIPANTES E DURAÇÃO ───
function adjustPlayers(delta) {
  setPlayerCount(playerCount + delta);
}

function adjustRaceDuration(delta) {
  var durInput = document.getElementById('race-duration');
  if (!durInput) return;
  var cur = parseInt(durInput.value, 10) || 20;
  var nextVal = Math.max(5, Math.min(600, cur + delta));
  durInput.value = nextVal;
}

function onPlayerInputChanged(val) {
  if (val === '') return;
  var num = parseInt(val, 10);
  if (!isNaN(num) && num >= 2 && num <= 100) {
    playerCount = num;
    generateRaceNames();
  }
}

function onPlayerInputBlur(el) {
  var num = parseInt(el.value, 10);
  if (isNaN(num) || num < 2) num = 2;
  if (num > 100) num = 100;
  setPlayerCount(num);
}

function setPlayerCount(val) {
  playerCount = Math.max(2, Math.min(100, parseInt(val) || 2));
  var inputEl = document.getElementById('race-player-count');
  if (inputEl) inputEl.value = playerCount;
  var minusBtn = document.getElementById('players-minus-btn');
  if (minusBtn) minusBtn.disabled = playerCount <= 2;
  var plusBtn = document.getElementById('players-plus-btn');
  if (plusBtn) plusBtn.disabled = playerCount >= 100;
  generateRaceNames();
}

// ─── GERAR CAMPOS DE NOMES ───
function generateRaceNames() {
  var grid = document.getElementById('race-names-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (var i = 0; i < playerCount; i++) {
    var color = getLaneColor(i, playerCount);
    var saved = savedNames[i] || '';
    var prefix = typeof t === 'function' ? t('race_participant_prefix') : 'Nadador';
    var placeholderText = typeof t === 'function' ? t('race_participant_placeholder') : 'Nome do Participante';

    var field = document.createElement('div');
    field.className = 'race-name-field';

    var labelRow = document.createElement('div');
    labelRow.className = 'race-name-label-row';

    var dot = document.createElement('span');
    dot.className = 'race-color-dot';
    dot.style.background = color;
    dot.style.color = color;

    var label = document.createElement('label');
    label.className = 'race-name-label';
    label.style.color = color;
    label.textContent = prefix + ' ' + (i + 1);

    labelRow.appendChild(dot);
    labelRow.appendChild(label);

    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'race-name-input';
    inp.id = 'rp-' + i;
    inp.placeholder = placeholderText + ' ' + (i + 1);
    inp.maxLength = 18;
    inp.value = saved;

    field.appendChild(labelRow);
    field.appendChild(inp);
    grid.appendChild(field);
  }
}

// Atribui Pokémons aquáticos únicos (Gens 1, 2 e 3) e Shinies extras
function assignWaterPokemonToRunners() {
  var shuffled = WATER_POKEMON_ROSTER.slice().sort(function() { return 0.5 - Math.random(); });
  
  for (var i = 0; i < raceRunners.length; i++) {
    var poke;
    var isShiny = false;

    if (i < shuffled.length) {
      poke = shuffled[i];
      // 5% de chance de variante shiny por pura emoção visual
      isShiny = Math.random() < 0.05;
    } else {
      // Quando passar de 78 participantes, usa variantes Shinies dos mesmos aquáticos!
      var baseIndex = (i - shuffled.length) % shuffled.length;
      poke = shuffled[baseIndex];
      isShiny = true;
    }

    raceRunners[i].pokemon = {
      id: poke.id,
      name: poke.name,
      isShiny: isShiny,
      spriteUrl: 'https://play.pokemonshowdown.com/sprites/' + (isShiny ? 'ani-shiny' : 'ani') + '/' + poke.name + '.gif',
      fallbackUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (isShiny ? 'shiny/' : '') + poke.id + '.png'
    };
  }
}

// ─── INICIAR CORRIDA ───
function launchRace() {
  var dur = parseInt(document.getElementById('race-duration').value);
  if (!dur || dur < 5) {
    alert(typeof t === 'function' ? t('alert_duration_min') : 'Defina uma duração de pelo menos 5 segundos!');
    return;
  }

  savedNames = [];
  raceRunners = [];

  var prefix = typeof t === 'function' ? t('race_participant_prefix') : 'Nadador';

  for (var i = 0; i < playerCount; i++) {
    var inp  = document.getElementById('rp-' + i);
    var name = inp ? (inp.value.trim() || (prefix + ' ' + (i + 1))) : (prefix + ' ' + (i + 1));
    savedNames.push(inp ? inp.value : '');
    raceRunners.push({
      id: i,
      name: name,
      color: getLaneColor(i, playerCount),
      progress: 0,
      finished: false,
      spriteEl: null,
      trackArea: null,
      laneEl: null,
      pokemon: null
    });
  }

  assignWaterPokemonToRunners();

  raceWinner = null;
  cancelAnimationFrame(raceAnimId);
  clearInterval(countdownTimer);

  showRaceScreen('race-track');
  buildLanes();
  startCountdown(dur);
}

// ─── CONSTRUIR ELEMENTOS DA PISTA ───
function buildLanes() {
  var container = document.getElementById('race-lanes');
  container.innerHTML = '';

  var trackEl = document.getElementById('race-track-container');
  if (trackEl) trackEl.style.transform = 'none';

  var isCompact = playerCount > 12;

  raceRunners.forEach(function(runner) {
    var lane = document.createElement('div');
    lane.className = 'race-lane' + (isCompact ? ' compact-lane' : '');
    lane.id = 'lane-' + runner.id;
    lane.style.borderLeft = '3px solid ' + runner.color;

    var nameCol = document.createElement('div');
    nameCol.className = 'lane-name-col';
    nameCol.style.color = runner.color;
    nameCol.textContent = runner.name;

    var trackArea = document.createElement('div');
    trackArea.className = 'lane-track-area';
    trackArea.id = 'track-' + runner.id;

    var runnerWrap = document.createElement('div');
    runnerWrap.className = 'lapras-runner-wrap' + (isCompact ? ' compact-runner-wrap' : '');
    runnerWrap.id = 'runner-' + runner.id;

    var floatingName = document.createElement('span');
    floatingName.className = 'lapras-floating-name';
    floatingName.textContent = runner.name;
    floatingName.style.color = runner.color;

    var poke = runner.pokemon || { name: 'lapras', id: 131, isShiny: false, spriteUrl: 'https://play.pokemonshowdown.com/sprites/ani/lapras.gif', fallbackUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' };

    var sprite = document.createElement('img');
    sprite.className = 'lapras-sprite' + (isCompact ? ' compact-sprite' : '');
    sprite.alt = poke.name;
    sprite.id = 'sprite-' + runner.id;
    sprite.src = poke.spriteUrl;
    sprite.onerror = function() {
      this.src = poke.fallbackUrl;
    };

    runnerWrap.appendChild(floatingName);
    runnerWrap.appendChild(sprite);
    trackArea.appendChild(runnerWrap);

    lane.appendChild(nameCol);
    lane.appendChild(trackArea);
    container.appendChild(lane);

    runner.laneEl    = lane;
    runner.spriteEl  = runnerWrap;
    runner.trackArea = trackArea;
  });
}

// ─── CONTAGEM REGRESSIVA ───
function startCountdown(duration) {
  var overlay = document.getElementById('countdown-overlay');
  var display = document.getElementById('countdown-display');
  
  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';

  var count = 3;
  showCount(display, count);

  countdownTimer = setInterval(function() {
    count--;
    if (count > 0) {
      showCount(display, count);
    } else if (count === 0) {
      showCount(display, 'GO!');
    } else {
      clearInterval(countdownTimer);
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
      runRace(duration);
    }
  }, 750);
}

function showCount(el, val) {
  el.textContent = val;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'cdown-pop 0.65s cubic-bezier(0.34,1.56,0.64,1)';
}

// ─── EXECUÇÃO DA CORRIDA COM CÂMERA DINÂMICA ───
function runRace(durationSec) {
  var startTime = performance.now();
  var durationMs = durationSec * 1000;

  var runnerSpeeds = raceRunners.map(function() {
    return 0.85 + Math.random() * 0.30;
  });

  var bursts = raceRunners.map(function() {
    return {
      active: false,
      multiplier: 1,
      nextCheck: 2000 + Math.random() * 3000,
      duration: 0
    };
  });

  var trackContainer = document.getElementById('race-track-container');
  var cameraViewport = document.getElementById('race-camera-viewport');
  var trackerLeft    = document.getElementById('tracker-left');
  var trackerRight   = document.getElementById('tracker-right');
  var leaderBadge    = document.getElementById('leader-badge');

  function animate(now) {
    var elapsed = now - startTime;
    var rawProgress = Math.min(elapsed / durationMs, 1);

    var firstFinisher = null;
    var maxProg = -1;
    var currentLeader = null;

    raceRunners.forEach(function(runner, i) {
      if (runner.finished) return;

      var b = bursts[i];
      if (elapsed > b.nextCheck) {
        if (!b.active && Math.random() < 0.35) {
          b.active = true;
          b.multiplier = (Math.random() < 0.65) ? (1.5 + Math.random() * 0.8) : (0.4 + Math.random() * 0.3);
          b.duration = elapsed + 1200 + Math.random() * 1800;
        } else if (b.active && elapsed > b.duration) {
          b.active = false;
          b.multiplier = 1;
          b.nextCheck = elapsed + 2000 + Math.random() * 3500;
        }
      }

      var speed = runnerSpeeds[i] * (b.active ? b.multiplier : 1);
      var noise = (Math.sin(elapsed * 0.003 + i * 1.7) * 0.015);

      runner.progress = Math.min(
        1,
        runner.progress + (rawProgress * 0.0018 * speed) + noise * 0.003
      );

      if (rawProgress >= 0.96) {
        runner.progress = Math.min(1, runner.progress + 0.008 * speed);
      }

      if (runner.progress > maxProg) {
        maxProg = runner.progress;
        currentLeader = runner;
      }

      var trackAreaW = runner.trackArea ? runner.trackArea.clientWidth : 300;
      var spriteW = (playerCount > 12 ? 32 : 42);
      var maxLeftPx = Math.max(10, trackAreaW - spriteW);
      var currentLeftPx = Math.min(maxLeftPx, Math.max(0, runner.progress * maxLeftPx));

      if (runner.spriteEl) {
        runner.spriteEl.style.left = currentLeftPx + 'px';
      }

      if (runner.progress >= 1 && !firstFinisher) {
        runner.finished = true;
        firstFinisher = runner;
      }
    });

    if (currentLeader && leaderBadge) {
      var leaderPrefix = typeof t === 'function' ? t('race_leader_prefix') : '👑 Líder:';
      leaderBadge.textContent = leaderPrefix + ' ' + currentLeader.name;
      leaderBadge.style.borderColor = currentLeader.color;
    }

    if (window.innerWidth <= 640 && currentLeader && trackContainer && cameraViewport) {
      var viewportW = cameraViewport.clientWidth;
      var trackW = trackContainer.scrollWidth || (viewportW * 2.5);
      var maxTrackScroll = trackW - viewportW;
      
      var leaderX = currentLeader.progress * (trackW - 80);
      var targetScroll = leaderX - (viewportW * 0.45);
      var clampedScroll = Math.max(0, Math.min(maxTrackScroll, targetScroll));

      trackContainer.style.transform = 'translateX(-' + clampedScroll + 'px)';

      var offLeft = [];
      var offRight = [];

      raceRunners.forEach(function(r) {
        var rX = r.progress * (trackW - 80);
        if (rX < clampedScroll - 20) {
          offLeft.push(r);
        } else if (rX > clampedScroll + viewportW + 10) {
          offRight.push(r);
        }
      });

      renderTrackers(trackerLeft, offLeft, 'left');
      renderTrackers(trackerRight, offRight, 'right');
    }

    if (firstFinisher) {
      raceWinner = firstFinisher;
      var trackAreaW = firstFinisher.trackArea.clientWidth || 300;
      var spriteW = (playerCount > 12 ? 32 : 42);
      firstFinisher.spriteEl.style.left = (trackAreaW - spriteW) + 'px';
      setTimeout(function() { showWinner(firstFinisher); }, 600);
      return;
    }

    raceAnimId = requestAnimationFrame(animate);
  }

  raceAnimId = requestAnimationFrame(animate);
}

function renderTrackers(container, runners, side) {
  if (!container) return;
  container.innerHTML = '';
  runners.forEach(function(r) {
    var tag = document.createElement('div');
    tag.className = 'offscreen-tag';
    tag.style.borderColor = r.color;
    tag.style.borderLeftColor = r.color;
    if (side === 'left') {
      tag.textContent = '⬅ ' + r.name;
    } else {
      tag.textContent = r.name + ' ➡';
    }
    container.appendChild(tag);
  });
}

// ─── VENCEDOR ───
function showWinner(winner) {
  var nameEl = document.getElementById('winner-name-display');
  if (nameEl) nameEl.textContent = winner.name;

  var spriteEl = document.getElementById('winner-pokemon-sprite');
  if (spriteEl && winner.pokemon) {
    spriteEl.src = winner.pokemon.spriteUrl;
    spriteEl.onerror = function() {
      this.src = winner.pokemon.fallbackUrl;
    };
  }

  showRaceScreen('race-winner');
  spawnConfetti();
}

function spawnConfetti() {
  var container = document.getElementById('confetti-container');
  container.innerHTML = '';
  var colors = ['#f7c948','#e63946','#3ab8f5','#4caf50','#ff9800','#9c27b0','#fff','#4fc3f7'];
  for (var i = 0; i < 130; i++) {
    var p = document.createElement('div');
    p.className = 'confetti-piece';
    var size = (Math.random() * 8 + 5);
    p.style.cssText = [
      'left:'   + (Math.random() * 100) + 'vw',
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'background:' + colors[Math.floor(Math.random() * colors.length)],
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
      'animation-duration:' + (Math.random() * 2 + 2.2) + 's',
      'animation-delay:'    + (Math.random() * 1.8) + 's'
    ].join(';');
    container.appendChild(p);
  }
}

// ─── NAVEGAÇÃO DE TELAS DA CORRIDA ───
function showRaceScreen(id) {
  document.querySelectorAll('.race-screen').forEach(function(s) {
    s.classList.add('hidden');
  });
  var t = document.getElementById(id);
  if (t) t.classList.remove('hidden');
}

function raceAgain() {
  var dur = parseInt(document.getElementById('race-duration').value) || 20;
  cancelAnimationFrame(raceAnimId);
  clearInterval(countdownTimer);
  raceWinner = null;
  raceRunners.forEach(function(r) { r.progress = 0; r.finished = false; });
  assignWaterPokemonToRunners();
  showRaceScreen('race-track');
  buildLanes();
  startCountdown(dur);
}

function raceAgainWithoutWinner() {
  if (!raceWinner) { raceAgain(); return; }

  // Filtra os corredores retirando o que acabou de vencer
  var remaining = raceRunners.filter(function(r) { return r.id !== raceWinner.id; });
  
  if (remaining.length < 2) {
    alert(typeof t === 'function' ? t('alert_tourney_end') : 'Restou apenas 1 participante! O torneio foi concluído. 🏆');
    backToRaceSetup();
    return;
  }

  // Atualiza os nomes e a contagem de jogadores
  savedNames = remaining.map(function(r) { return r.name; });
  playerCount = remaining.length;
  var inputEl = document.getElementById('race-player-count');
  if (inputEl) inputEl.value = playerCount;

  var dur = parseInt(document.getElementById('race-duration').value) || 20;
  cancelAnimationFrame(raceAnimId);
  clearInterval(countdownTimer);

  var prefix = typeof t === 'function' ? t('race_participant_prefix') : 'Nadador';
  raceRunners = [];
  for (var i = 0; i < playerCount; i++) {
    raceRunners.push({
      id: i,
      name: savedNames[i] || (prefix + ' ' + (i + 1)),
      color: getLaneColor(i, playerCount),
      progress: 0,
      finished: false,
      spriteEl: null,
      trackArea: null,
      laneEl: null,
      pokemon: null
    });
  }

  assignWaterPokemonToRunners();

  raceWinner = null;
  showRaceScreen('race-track');
  buildLanes();
  startCountdown(dur);
}

function backToRaceSetup() {
  cancelAnimationFrame(raceAnimId);
  clearInterval(countdownTimer);
  showRaceScreen('race-setup');
  generateRaceNames();
}

function abortRace() {
  cancelAnimationFrame(raceAnimId);
  clearInterval(countdownTimer);
  var overlay = document.getElementById('countdown-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
  showRaceScreen('race-setup');
}
