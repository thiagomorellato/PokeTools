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

// Atribui Pokémons aquáticos únicos (Gens 1, 2 e 3) e Shinies APENAS se exceder o total de espécies (78)
function assignWaterPokemonToRunners() {
  var shuffled = WATER_POKEMON_ROSTER.slice().sort(function() { return 0.5 - Math.random(); });
  
  for (var i = 0; i < raceRunners.length; i++) {
    var poke;
    var isShiny = false;

    if (i < shuffled.length) {
      poke = shuffled[i];
      isShiny = false; // 100% normal até o 78º participante
    } else {
      // Apenas se o número de participantes for maior que o total de aquáticos das 3 gerações (79 a 100)
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

// ─── CONSTRUIR ELEMENTOS DA PISTA (PELOTÃO 2.5D / RIO ABERTO) ───
function buildLanes() {
  var container = document.getElementById('race-lanes');
  if (!container) return;
  container.innerHTML = '';

  var trackEl = document.getElementById('race-track-container');
  if (trackEl) trackEl.style.transform = 'none';

  var cameraViewport = document.getElementById('race-camera-viewport');
  var trackW = cameraViewport ? cameraViewport.clientWidth : 960;
  var trackH = cameraViewport ? cameraViewport.clientHeight : 500;

  if (trackH < 280) trackH = 500;
  if (trackW < 360) trackW = 960;

  // Ângulo e inclinação pronunciada (Duck Race: -26deg com transform-origin: bottom center)
  var skewAngleDeg = 26;
  var tanTheta = Math.tan(skewAngleDeg * Math.PI / 180);

  // Posição base da linha de largada na parte inferior do rio (y = trackH)
  var startLineEl = document.getElementById('start-line-col');
  var startBaseX = (startLineEl && startLineEl.offsetLeft) ? (startLineEl.offsetLeft + 14) : 74;

  // Posição base da linha de chegada na parte inferior do rio (100% visível na tela)
  var finishLineEl = document.getElementById('finish-line-col');
  var finishBaseX;
  if (finishLineEl && finishLineEl.offsetLeft) {
    finishBaseX = finishLineEl.offsetLeft + 16;
  } else {
    var finishRight = Math.round(Math.min(290, Math.max(230, trackW * 0.25)));
    finishBaseX = trackW - finishRight - 16;
  }

  var topMargin = 32;
  var bottomMargin = trackH - 58;
  var usableH = Math.max(160, bottomMargin - topMargin);

  var n = raceRunners.length;
  var isUltraDense = n > 50;
  var isVeryDense = n > 25 && n <= 50; // Caso de ~40 participantes (como no print dos patos)
  var isDense = n > 12 && n <= 25;

  var spriteClass = isUltraDense ? ' ultra-compact-sprite' : (isVeryDense ? ' very-compact-sprite' : (isDense ? ' compact-sprite' : ''));

  // Se houver mais de 50 competidores, usa 2 colunas paralelas na mesma inclinação
  var useTwoCols = n > 50;
  var totalRows = useTwoCols ? Math.ceil(n / 2) : n;

  // Espaçamento vertical compacto para juntar os sprites em pelotão denso ("embolado" estilo Duck Race)
  var stepY;
  if (totalRows <= 12) {
    stepY = Math.min(34, usableH / Math.max(1, totalRows - 1));
  } else if (totalRows <= 25) {
    stepY = Math.min(18, Math.max(12, usableH / totalRows));
  } else {
    stepY = Math.min(11, Math.max(7.5, (usableH - 30) / totalRows));
  }

  var packH = (totalRows - 1) * stepY;
  var startY0 = Math.max(topMargin, Math.round(topMargin + (usableH - packH) / 2));

  raceRunners.forEach(function(runner, i) {
    var col = useTwoCols ? (i % 2) : 0;
    var row = useTwoCols ? Math.floor(i / 2) : i;

    var startY = Math.round(startY0 + row * stepY);

    // Na perspectiva inclinada (-26deg):
    // Na base (y = trackH), offset = 0.
    // No topo (y = 0), offset = trackH * tanTheta (inclinado para a direita).
    var tiltX = (trackH - startY) * tanTheta;
    var lineXAtY = startBaseX + tiltX;
    var finishLineXAtY = finishBaseX + tiltX;

    // Com transform: translateX(-100%) no CSS, o lado direito do wrapper encosta EXATAMENTE em startX!
    // Isso garante que QUALQUER sprite (Wingull com asas abertas, Kyogre gigante ou Magikarp)
    // fique milimetricamente alinhado na linha de largada pelo seu lado direito (frente do nadador)!
    var startX = Math.round(lineXAtY - (col * 14));
    var targetFinishX = Math.round(finishLineXAtY);

    var runnerWrap = document.createElement('div');
    runnerWrap.className = 'lapras-runner-wrap' + ((isVeryDense || isUltraDense) ? ' badge-runner-wrap' : (isDense ? ' compact-runner-wrap' : ''));
    runnerWrap.id = 'runner-' + runner.id;
    runnerWrap.style.left = startX + 'px';
    runnerWrap.style.top = startY + 'px';
    // Profundidade 2.5D: quem está mais abaixo na tela fica à frente (maior z-index)
    runnerWrap.style.zIndex = Math.round(startY * 10) + col;

    // Tag com nome / número do competidor
    var floatingName = document.createElement('span');
    floatingName.className = 'lapras-floating-name';
    floatingName.style.color = runner.color;
    floatingName.style.borderColor = runner.color;

    if (isVeryDense || isUltraDense) {
      floatingName.textContent = (i + 1);
      floatingName.title = (i + 1) + '. ' + runner.name;
    } else {
      floatingName.textContent = runner.name;
      floatingName.title = runner.name;
    }
    runnerWrap.appendChild(floatingName);

    // Sprite oficial do Pokémon Aquático nadando
    var poke = runner.pokemon || {
      name: 'lapras',
      id: 131,
      isShiny: false,
      spriteUrl: 'https://play.pokemonshowdown.com/sprites/ani/lapras.gif',
      fallbackUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png'
    };

    var sprite = document.createElement('img');
    sprite.className = 'lapras-sprite' + spriteClass;
    sprite.alt = poke.name;
    sprite.id = 'sprite-' + runner.id;
    sprite.src = poke.spriteUrl;
    sprite.onerror = function() {
      this.src = poke.fallbackUrl;
    };
    runnerWrap.appendChild(sprite);

    container.appendChild(runnerWrap);

    runner.x0 = startX;
    runner.y0 = startY;
    runner.currentX = startX;
    runner.currentY = startY;
    runner.targetFinishX = targetFinishX;
    runner.totalDistance = targetFinishX - startX;
    runner.spriteEl = runnerWrap;
    runner.floatingNameEl = floatingName;
    runner.crownEl = null;
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

// ─── EXECUÇÃO DA CORRIDA 2.5D (RIO ABERTO SEM ROLAGEM) ───
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
      nextCheck: 1800 + Math.random() * 2600,
      duration: 0
    };
  });

  var trackContainer = document.getElementById('race-track-container');
  var cameraViewport = document.getElementById('race-camera-viewport');
  var leaderBadge    = document.getElementById('leader-badge');
  var trackH         = cameraViewport ? cameraViewport.clientHeight : 500;
  var topMargin      = 32;
  var bottomMargin   = trackH - 58;

  var lastTime = performance.now();
  var activeLeader = null;
  var leaderCrown = null;
  var currentCamX = 0;
  if (trackContainer) trackContainer.style.transform = 'translateX(0px)';

  function animate(now) {
    var dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    var elapsed = now - startTime;
    var firstFinisher = null;
    var maxProg = -1;
    var currentLeader = null;

    var baseRate = 1 / durationSec;

    raceRunners.forEach(function(runner, i) {
      if (runner.finished) return;

      var b = bursts[i];
      if (elapsed > b.nextCheck) {
        if (!b.active && Math.random() < 0.42) {
          b.active = true;
          b.multiplier = (Math.random() < 0.62) ? (1.35 + Math.random() * 0.4) : (0.72 + Math.random() * 0.2);
          b.duration = elapsed + 900 + Math.random() * 1500;
        } else if (b.active && elapsed > b.duration) {
          b.active = false;
          b.multiplier = 1;
          b.nextCheck = elapsed + 1600 + Math.random() * 2800;
        }
      }

      var speedMult = runnerSpeeds[i] * (b.active ? b.multiplier : 1);
      var microWave = Math.sin(elapsed * 0.004 + i * 2.1) * 0.06;

      runner.progress = Math.min(
        1,
        runner.progress + (baseRate * (speedMult + microWave) * dt)
      );

      // Posição X proporcional ao trajeto exato até a linha de chegada inclinada
      runner.currentX = runner.x0 + (runner.progress * runner.totalDistance);

      // Efeito de Natação e Flutuação 2.5D na água
      var waveY = Math.sin(elapsed * 0.0035 + runner.id * 1.4) * (playerCount > 30 ? 2.5 : 4.5);
      runner.currentY = Math.max(topMargin, Math.min(bottomMargin, runner.y0 + waveY));

      if (runner.spriteEl) {
        runner.spriteEl.style.left = Math.round(runner.currentX) + 'px';
        runner.spriteEl.style.top  = Math.round(runner.currentY) + 'px';
        // Profundidade 2.5D: quem está mais abaixo na tela fica sempre na frente
        runner.spriteEl.style.zIndex = Math.round(runner.currentY * 10) + Math.round(runner.progress * 30);
      }

      if (runner.progress > maxProg) {
        maxProg = runner.progress;
        currentLeader = runner;
      }

      if ((runner.progress >= 1 || runner.currentX >= runner.targetFinishX) && !firstFinisher) {
        runner.finished = true;
        firstFinisher = runner;
      }
    });

    // ─── DESTAQUE DO LÍDER E COROA 👑 ───
    if (currentLeader) {
      if (currentLeader !== activeLeader) {
        if (leaderCrown && leaderCrown.parentNode) {
          leaderCrown.parentNode.removeChild(leaderCrown);
        }
        leaderCrown = document.createElement('span');
        leaderCrown.className = 'leader-crown-icon';
        leaderCrown.textContent = '👑';
        if (currentLeader.spriteEl) {
          currentLeader.spriteEl.appendChild(leaderCrown);
        }
        activeLeader = currentLeader;
      }

      if (leaderBadge) {
        var leaderPrefix = typeof t === 'function' ? t('race_leader_prefix') : '👑 Líder:';
        var pokeName = (currentLeader.pokemon ? ' (' + currentLeader.pokemon.name.toUpperCase() + (currentLeader.pokemon.isShiny ? ' ✨' : '') + ')' : '');
        leaderBadge.textContent = leaderPrefix + ' ' + currentLeader.name + pokeName;
        leaderBadge.style.borderColor = currentLeader.color;
      }

      // ─── CÂMERA DINÂMICA HORIZONTAL (SEGUE O LÍDER NO MOBILE QUANDO A PISTA É MAIS LARGA) ───
      if (trackContainer && cameraViewport) {
        var viewportW = cameraViewport.clientWidth;
        var trackW = trackContainer.scrollWidth;
        var maxTrackScroll = Math.max(0, trackW - viewportW);

        if (maxTrackScroll > 5) {
          // Posiciona o líder por volta de 40% a 45% do viewport
          var targetScrollX = currentLeader.currentX - (viewportW * 0.42);
          var clampedScrollX = Math.max(0, Math.min(maxTrackScroll, targetScrollX));
          currentCamX += (clampedScrollX - currentCamX) * 0.12;
          trackContainer.style.transform = 'translateX(-' + currentCamX.toFixed(1) + 'px)';
        } else {
          trackContainer.style.transform = 'none';
        }
      }
    }

    if (firstFinisher) {
      raceWinner = firstFinisher;
      firstFinisher.spriteEl.style.left = firstFinisher.targetFinishX + 'px';
      if (trackContainer && cameraViewport) {
        var viewportW = cameraViewport.clientWidth;
        var trackW = trackContainer.scrollWidth;
        var maxTrackScroll = Math.max(0, trackW - viewportW);
        if (maxTrackScroll > 5) {
          var finishTargetX = firstFinisher.targetFinishX - (viewportW * 0.7);
          var clampedFinishX = Math.max(0, Math.min(maxTrackScroll, finishTargetX));
          trackContainer.style.transform = 'translateX(-' + clampedFinishX.toFixed(1) + 'px)';
        }
      }
      setTimeout(function() { showWinner(firstFinisher); }, 600);
      return;
    }

    raceAnimId = requestAnimationFrame(animate);
  }

  raceAnimId = requestAnimationFrame(animate);
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
  var trackContainer = document.getElementById('race-track-container');
  if (trackContainer) trackContainer.style.transform = 'none';
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
  var trackContainer = document.getElementById('race-track-container');
  if (trackContainer) trackContainer.style.transform = 'none';
  showRaceScreen('race-setup');
}
