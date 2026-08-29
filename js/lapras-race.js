// lapras-race.js — Lapras Race com suporte a até 100 Participantes e Câmera Dinâmica

var playerCount    = 4;
var raceRunners    = [];
var raceAnimId     = null;
var raceWinner     = null;
var savedNames     = [];
var countdownTimer = null;

// Paleta dinâmica vibrante de cores para até 100 jogadores
function getLaneColor(index, total) {
  var hue = Math.round((index * 360) / Math.max(1, total));
  return 'hsl(' + hue + ', 85%, 58%)';
}

// ─── AJUSTE DE PARTICIPANTES E DURAÇÃO (Botões + / - e Digitação) ───
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

// ─── GERAR CAMPOS DE NOMES (Com scroll para muitos corredores) ───
function generateRaceNames() {
  var grid = document.getElementById('race-names-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (var i = 0; i < playerCount; i++) {
    var color = getLaneColor(i, playerCount);
    var saved = savedNames[i] || '';
    var prefix = typeof t === 'function' ? t('race_participant_prefix') : 'Lapras';
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

// ─── INICIAR CORRIDA ───
function launchRace() {
  var dur = parseInt(document.getElementById('race-duration').value);
  if (!dur || dur < 5) {
    alert(typeof t === 'function' ? t('alert_duration_min') : 'Defina uma duração de pelo menos 5 segundos!');
    return;
  }

  savedNames = [];
  raceRunners = [];

  var prefix = typeof t === 'function' ? t('race_participant_prefix') : 'Lapras';

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
      trackArea: null
    });
  }

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

    var sprite = document.createElement('img');
    sprite.className = 'lapras-sprite' + (isCompact ? ' compact-sprite' : '');
    sprite.alt = 'Lapras';
    sprite.id = 'sprite-' + runner.id;
    sprite.src = 'https://play.pokemonshowdown.com/sprites/ani/lapras.gif';
    sprite.onerror = function() {
      this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png';
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

// ─── EXECUÇÃO DA CORRIDA ───
function runRace(duration) {
  var durationMs = duration * 1000;

  raceRunners.forEach(function(r) {
    r.progress  = 0;
    r.finished  = false;
    r.targetMs  = durationMs * (0.85 + Math.random() * 0.30);
    r.baseSpeed = 100 / r.targetMs;
    r.curSpeed  = r.baseSpeed * (0.75 + Math.random() * 0.5);
  });

  var lastTs = null;
  var trackContainer = document.getElementById('race-track-container');
  var cameraViewport = document.getElementById('race-camera-viewport');
  var trackerLeft    = document.getElementById('tracker-left');
  var trackerRight   = document.getElementById('tracker-right');
  var leaderBadge    = document.getElementById('leader-badge');

  function animate(ts) {
    if (!lastTs) lastTs = ts;
    var delta = Math.min(ts - lastTs, 50);
    lastTs = ts;

    var firstFinisher = null;
    var currentLeader = raceRunners[0];

    raceRunners.forEach(function(r) {
      if (r.finished) return;

      r.curSpeed += (Math.random() - 0.5) * r.baseSpeed * 0.16;
      r.curSpeed  = Math.max(r.baseSpeed * 0.3, Math.min(r.baseSpeed * 2.2, r.curSpeed));

      r.progress = Math.min(100, r.progress + r.curSpeed * delta);

      // Posiciona sprite precisamente até a linha de chegada (100%)
      var trackAreaW = r.trackArea.clientWidth || 300;
      var spriteW = (playerCount > 12 ? 32 : 42);
      var maxLeftPx = Math.max(0, trackAreaW - spriteW);
      var currentLeftPx = (r.progress / 100) * maxLeftPx;
      r.spriteEl.style.left = currentLeftPx + 'px';

      if (r.progress > currentLeader.progress) {
        currentLeader = r;
      }

      if (r.progress >= 100 && !firstFinisher) {
        r.finished = true;
        firstFinisher = r;
      }
    });

    // Atualiza Líder no topo
    if (leaderBadge && currentLeader) {
      var leaderPrefix = typeof t === 'function' ? t('race_leader_prefix') : '👑 Líder:';
      leaderBadge.textContent = leaderPrefix + ' ' + currentLeader.name;
    }

    // ─── AUTO-ROLAGEM VERTICAL NO LÍDER (Desktop & Mobile com muitos Lapras) ───
    if (cameraViewport && currentLeader && currentLeader.laneEl) {
      var laneTop = currentLeader.laneEl.offsetTop;
      var laneH = currentLeader.laneEl.offsetHeight || 42;
      var viewportH = cameraViewport.clientHeight;
      var maxScrollTop = cameraViewport.scrollHeight - viewportH;
      if (maxScrollTop > 0) {
        var targetScrollY = Math.max(0, Math.min(maxScrollTop, (laneTop + laneH / 2) - (viewportH / 2)));
        // Interpolação suave para a câmera acompanhar sem solavancos
        cameraViewport.scrollTop += (targetScrollY - cameraViewport.scrollTop) * 0.08;
      }
    }

    // ─── CÂMERA DINÂMICA HORIZONTAL NO LÍDER (MOBILE) ───
    var isMobile = window.innerWidth <= 640;
    if (isMobile && trackContainer && cameraViewport && currentLeader.trackArea) {
      var viewportW = cameraViewport.clientWidth;
      var trackW    = trackContainer.offsetWidth || trackContainer.scrollWidth;
      var maxPan    = Math.max(0, trackW - viewportW);

      var nameColW   = 90;
      var trackAreaW = currentLeader.trackArea.clientWidth || (trackW - nameColW - 44);
      var spriteW    = (playerCount > 12 ? 32 : 42);

      var leaderSpriteLeft = (currentLeader.progress / 100) * (trackAreaW - spriteW);
      var leaderCenterX    = nameColW + leaderSpriteLeft + (spriteW / 2);

      var targetCam = Math.max(0, Math.min(maxPan, leaderCenterX - (viewportW / 2)));
      trackContainer.style.transform = 'translateX(' + (-targetCam) + 'px)';

      // Indicadores de fora da tela
      var viewLeft  = targetCam;
      var viewRight = targetCam + viewportW;

      var leftOut = [];
      var rightOut = [];

      raceRunners.forEach(function(r) {
        var rSpriteLeft = (r.progress / 100) * (trackAreaW - spriteW);
        var rCenterX    = nameColW + rSpriteLeft + (spriteW / 2);

        if (rCenterX < viewLeft - 10) {
          leftOut.push(r);
        } else if (rCenterX > viewRight + 10) {
          rightOut.push(r);
        }
      });

      renderTrackers(trackerLeft, leftOut.slice(0, 5), 'left');
      renderTrackers(trackerRight, rightOut.slice(0, 5), 'right');
    } else {
      if (trackContainer) trackContainer.style.transform = 'none';
      if (trackerLeft) trackerLeft.innerHTML = '';
      if (trackerRight) trackerRight.innerHTML = '';
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
  document.getElementById('winner-name-display').textContent = winner.name;
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

  raceRunners = [];
  for (var i = 0; i < playerCount; i++) {
    raceRunners.push({
      id: i,
      name: savedNames[i] || ('Lapras ' + (i + 1)),
      color: getLaneColor(i, playerCount),
      progress: 0,
      finished: false,
      spriteEl: null,
      trackArea: null,
      laneEl: null
    });
  }

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
