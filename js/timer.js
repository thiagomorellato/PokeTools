// timer.js — Timer TCG (Fluxo em 3 Etapas com Turnos e Relógio Limpo)

var currentMode   = 'general'; // 'general' | 'vs'
var currentStep   = 1;         // 1 | 2 | 3
var timerInterval = null;
var timerRunning  = false;
var timerTotal    = 0;
var timerLeft     = 0;
var currentTurn   = 1;

var CIRC = 2 * Math.PI * 105; // ~659.73 para raio 105

function timerInitDisplay() {
  updateDigitsFromInputs();
  setProgress(1);

  ['input-hours','input-minutes','input-seconds'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        if (!timerRunning && timerLeft === 0) {
          updateDigitsFromInputs();
        }
      });
    }
  });
}

// ─── NAVEGAÇÃO DE ETAPAS ───
function goToTimerStep(step) {
  currentStep = step;
  document.querySelectorAll('.timer-step-screen').forEach(function(s) {
    s.classList.remove('active-step');
  });
  var target = document.getElementById('timer-step-' + step);
  if (target) target.classList.add('active-step');
}

// ESCOLHA DO MODO (Geral ou VS)
function selectTimerMode(mode) {
  currentMode = mode;
  var vsSection = document.getElementById('vs-names-section');
  var titleEl   = document.getElementById('step-2-title');

  if (mode === 'general') {
    if (vsSection) vsSection.style.display = 'none';
    if (titleEl)   titleEl.textContent   = '⏳ Configuração do Tempo (Mesa Geral)';
  } else {
    if (vsSection) vsSection.style.display = 'block';
    if (titleEl)   titleEl.textContent   = '⚔️ Jogadores & Tempo (Partida VS)';
  }

  goToTimerStep(2);
}

// PRESETS RÁPIDOS DE TEMPO
function setTimePreset(h, m, s) {
  document.getElementById('input-hours').value   = h;
  document.getElementById('input-minutes').value = m;
  document.getElementById('input-seconds').value = s;
  updateDigitsFromInputs();
}

// CONTADOR DE TURNOS INTERATIVO
function advanceTurn() {
  currentTurn++;
  var turnEl = document.getElementById('turn-number');
  if (turnEl) turnEl.textContent = currentTurn;
  var labelEl = document.getElementById('turn-label-text');
  if (labelEl && typeof t === 'function') labelEl.textContent = t('timer_turn_prefix');
}

// ETAPA 2 -> ETAPA 3 (IR PARA O TIMER ATIVO)
function proceedToActiveTimer() {
  var h = parseInt(document.getElementById('input-hours').value)   || 0;
  var m = parseInt(document.getElementById('input-minutes').value) || 0;
  var s = parseInt(document.getElementById('input-seconds').value) || 0;

  var total = h * 3600 + m * 60 + s;
  if (total <= 0) {
    alert(typeof t === 'function' ? t('alert_time_zero') : 'Por favor, defina um tempo maior que zero!');
    return;
  }

  timerTotal = total;
  timerLeft  = total;
  currentTurn = 1;
  var turnEl = document.getElementById('turn-number');
  if (turnEl) turnEl.textContent = currentTurn;
  var labelEl = document.getElementById('turn-label-text');
  if (labelEl && typeof t === 'function') labelEl.textContent = t('timer_turn_prefix');

  // Atualizar Topbar e Banners
  var modeBadge = document.getElementById('active-mode-badge');
  var vsBanner  = document.getElementById('active-vs-banner');

  if (currentMode === 'general') {
    if (modeBadge) modeBadge.textContent = typeof t === 'function' ? t('timer_mode_general_badge') : '⏳ Modo Geral';
    if (vsBanner)  vsBanner.classList.remove('show-banner');
  } else {
    if (modeBadge) modeBadge.textContent = typeof t === 'function' ? t('timer_mode_vs_badge') : '⚔️ Partida VS';
    var p1 = (document.getElementById('player1-name').value.trim()) || (typeof t === 'function' ? t('timer_p1_placeholder') : 'Jogador 1');
    var p2 = (document.getElementById('player2-name').value.trim()) || (typeof t === 'function' ? t('timer_p2_placeholder') : 'Jogador 2');
    document.getElementById('banner-p1').textContent = p1;
    document.getElementById('banner-p2').textContent = p2;
    if (vsBanner)  vsBanner.classList.add('show-banner');
  }

  // Resetar estado de corrida do relógio
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('play-icon').textContent = '▶';
  document.getElementById('play-text').textContent = typeof t === 'function' ? t('timer_start') : 'Iniciar';
  document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_ready') : 'Pronto!';
  document.getElementById('timer-clock-wrap').classList.remove('warning');

  renderTimer();
  goToTimerStep(3);
}

// ─── EXECUÇÃO DO TIMER (ETAPA 3) ───
function timerToggle() {
  if (timerRunning) {
    timerPause();
  } else {
    timerStart();
  }
}

function timerStart() {
  if (timerLeft <= 0) {
    timerLeft = timerTotal;
  }

  timerRunning = true;
  document.getElementById('play-icon').textContent = '⏸';
  document.getElementById('play-text').textContent = typeof t === 'function' ? t('timer_pause') : 'Pausar';
  document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_running') : 'Em Andamento';

  timerInterval = setInterval(function() {
    timerLeft--;
    if (timerLeft <= 0) {
      timerLeft = 0;
      onTimerFinished();
    } else {
      renderTimer();
    }
  }, 1000);

  renderTimer();
}

function timerPause() {
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('play-icon').textContent = '▶';
  document.getElementById('play-text').textContent = typeof t === 'function' ? t('timer_start') : 'Continuar';
  document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_paused') : 'Pausado';
}

function timerReset() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerLeft    = timerTotal;

  document.getElementById('play-icon').textContent = '▶';
  document.getElementById('play-text').textContent = typeof t === 'function' ? t('timer_start') : 'Iniciar';
  document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_ready') : 'Pronto!';
  document.getElementById('timer-clock-wrap').classList.remove('warning');

  renderTimer();
}

function onTimerFinished() {
  clearInterval(timerInterval);
  timerRunning = false;

  document.getElementById('timer-digits').textContent = '00:00';
  document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_finished') : 'Tempo Esgotado!';
  document.getElementById('play-icon').textContent = '▶';
  document.getElementById('play-text').textContent = typeof t === 'function' ? t('timer_start') : 'Reiniciar';
  document.getElementById('timer-clock-wrap').classList.add('warning');
  setProgress(0);
}

function renderTimer() {
  document.getElementById('timer-digits').textContent = formatTime(timerLeft);
  var frac = timerTotal > 0 ? timerLeft / timerTotal : 1;
  setProgress(frac);

  var wrap = document.getElementById('timer-clock-wrap');
  if (timerLeft <= 60 && timerLeft > 0) {
    wrap.classList.add('warning');
    document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_last_minute') : 'Último minuto!';
  } else {
    wrap.classList.remove('warning');
    if (timerRunning) document.getElementById('timer-status').textContent = typeof t === 'function' ? t('timer_running') : 'Em Andamento';
  }
}

function setProgress(fraction) {
  var circle = document.getElementById('clock-progress');
  if (!circle) return;
  var offset = CIRC * (1 - Math.max(0, Math.min(1, fraction)));
  circle.style.strokeDasharray  = CIRC;
  circle.style.strokeDashoffset = offset;
}

function updateDigitsFromInputs() {
  var h = parseInt(document.getElementById('input-hours').value)   || 0;
  var m = parseInt(document.getElementById('input-minutes').value) || 0;
  var s = parseInt(document.getElementById('input-seconds').value) || 0;
  document.getElementById('timer-digits').textContent = formatTime(h * 3600 + m * 60 + s);
}

function formatTime(total) {
  var h = Math.floor(total / 3600);
  var m = Math.floor((total % 3600) / 60);
  var s = total % 60;
  if (h > 0) return pad(h) + ':' + pad(m) + ':' + pad(s);
  return pad(m) + ':' + pad(s);
}

function pad(n) { return String(n).padStart(2, '0'); }
