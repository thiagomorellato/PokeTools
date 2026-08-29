// pokedex.js — Gerenciador da Pokédex e Sistema de Captura com Animação Épica

var POKEDEX_KEY = 'poketools_pokedex_v1';

// Recupera os dados salvos da Pokédex
function getPokedexData() {
  try {
    var raw = localStorage.getItem(POKEDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) {
    return {};
  }
}

// Salva um Pokémon capturado
function registerCaughtPokemon(pokemonId, isShiny) {
  var data = getPokedexData();
  var entry = data[pokemonId] || { count: 0, shiny: false, firstCaught: Date.now() };
  entry.count = (entry.count || 0) + 1;
  if (isShiny) {
    entry.shiny = true;
  }
  data[pokemonId] = entry;
  try {
    localStorage.setItem(POKEDEX_KEY, JSON.stringify(data));
  } catch(e) {}
  updatePokedexBadge();
}

// Atualiza o contador na navbar
function updatePokedexBadge() {
  var data = getPokedexData();
  var caughtCount = Object.keys(data).length;
  var badgeEl = document.getElementById('pokedex-count-badge');
  if (badgeEl) {
    badgeEl.textContent = caughtCount + '/151';
  }
}

// ─── CHANCE DE CAPTURA POR TIER (Pokébola Clássica) ───
function calculateCatchSuccess(tier) {
  var rates = {
    1: 0.75, // Muito Comum: 75%
    2: 0.45, // Comum: 45%
    3: 0.25, // Incomum: 25%
    4: 0.12, // Raro: 12%
    5: 0.04  // Lendário/Mítico: 4%
  };
  var chance = rates[tier] || 0.35;
  return Math.random() < chance;
}

// ─── ANIMAÇÃO COMPLETA DE ARREMESSO E CAPTURA ───
function attemptCatch(roamer) {
  if (roamer.isCatching) return;
  roamer.isCatching = true;
  roamer.speed = 0; // Pokémon para de andar imediatamente

  var wrapper = roamer.el;
  var img = roamer.imgEl;

  // Cria a Pokébola voadora usando o sprite oficial
  var ball = document.createElement('div');
  ball.className = 'throw-ball-sprite-wrap';
  ball.innerHTML = `
    <img src="https://play.pokemonshowdown.com/sprites/itemicons/poke-ball.png" class="ball-img-sprite" alt="Pokéball">
    <div class="ball-led-dot"></div>
  `;
  wrapper.appendChild(ball);

  // Efeito de feixe de luz vermelha e absorção
  setTimeout(function() {
    ball.classList.add('ball-open-beam');
    img.classList.add('pokemon-being-absorbed');

    setTimeout(function() {
      img.style.opacity = '0';
      img.style.transform = 'scale(0.01)';
      ball.classList.remove('ball-open-beam');
      ball.classList.add('ball-bounce-down');

      // Balançar no chão
      setTimeout(function() {
        ball.classList.remove('ball-bounce-down');
        ball.classList.add('ball-wiggling');

        // Calcula o resultado da captura
        var pokeInfo = (typeof GEN1_POKEMON !== 'undefined' && GEN1_POKEMON.find(p => p.id === roamer.id)) || { id: roamer.id, tier: 2, name: roamer.name };
        var success = calculateCatchSuccess(pokeInfo.tier);

        // Registra estatísticas
        if (typeof recordCatchAttempt === 'function') {
          recordCatchAttempt(pokeInfo, roamer.isShiny, success);
        }

        setTimeout(function() {
          ball.classList.remove('ball-wiggling');

          if (success) {
            // Sucesso na captura!
            ball.classList.add('ball-gotcha-stars');
            showCatchToast(roamer, true);
            registerCaughtPokemon(roamer.id, roamer.isShiny);

            setTimeout(function() {
              cleanupRoamer(roamer);
            }, 1500);
          } else {
            // Escapou da Pokébola em um redemoinho de folhinhas de fuga!
            ball.classList.add('ball-broke-smoke');
            showCatchToast(roamer, false);
            spawnFleeLeaves(wrapper);

            setTimeout(function() {
              cleanupRoamer(roamer);
            }, 900);
          }
        }, 1900);
      }, 550);
    }, 450);
  }, 400);
}

// Cria a animação de folhas de grama idênticas rodopiando na fuga
function spawnFleeLeaves(wrapper) {
  if (!wrapper) return;
  for (var i = 0; i < 7; i++) {
    var leaf = document.createElement('div');
    leaf.className = 'flee-leaf';
    leaf.textContent = '🍃'; // Todas as folhinhas idênticas
    var angle = (i / 7) * 2 * Math.PI + (Math.random() - 0.5) * 0.3;
    var dist = Math.random() * 40 + 30;
    var tx = Math.cos(angle) * dist;
    var ty = Math.sin(angle) * dist - 20;
    leaf.style.setProperty('--tx', tx + 'px');
    leaf.style.setProperty('--ty', ty + 'px');
    leaf.style.setProperty('--rot', (i * 55 + Math.random() * 30) + 'deg');
    leaf.style.animationDelay = (i * 0.03) + 's';
    wrapper.appendChild(leaf);
  }
}

function cleanupRoamer(roamer) {
  activePokemonIds.delete(roamer.id);
  if (roamer.el && roamer.el.parentNode) {
    roamer.el.parentNode.removeChild(roamer.el);
  }
  var idx = activeRoamers.indexOf(roamer);
  if (idx !== -1) activeRoamers.splice(idx, 1);
}

// ─── TOAST DE RESULTADO DA CAPTURA (Fila Sequencial: Um por Vez) ───
var toastQueue = [];
var isProcessingToast = false;

function showCatchToast(roamer, success) {
  toastQueue.push({
    name: roamer.name,
    isShiny: roamer.isShiny,
    success: success
  });
  if (!isProcessingToast) {
    processNextToast();
  }
}

function processNextToast() {
  if (toastQueue.length === 0) {
    isProcessingToast = false;
    return;
  }

  isProcessingToast = true;
  var item = toastQueue.shift();

  var toast = document.createElement('div');
  toast.className = 'catch-toast ' + (item.success ? 'toast-success' : 'toast-fail');
  
  var displayName = item.name.toUpperCase();
  if (item.success) {
    var prefix = item.isShiny
      ? (typeof t === 'function' ? t('toast_shiny_gotcha') + '<br>' : '✨ SHINY CAPTURADO! ✨<br>')
      : (typeof t === 'function' ? t('toast_gotcha') + ' ' : '🔴 Gotcha! ');
    var suffix = typeof t === 'function' ? t('toast_caught_suffix') : 'foi pego!';
    toast.innerHTML = prefix + '<b>' + displayName + '</b> ' + suffix;
  } else {
    var prefix = typeof t === 'function' ? t('toast_escaped_prefix') + ' ' : '💨 Ah não! ';
    var suffix = typeof t === 'function' ? t('toast_escaped_suffix') : 'escapou!';
    toast.innerHTML = prefix + '<b>' + displayName + '</b> ' + suffix;
  }

  document.body.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('toast-show');
  }, 20);

  // Exibe o toast e depois abre espaço suavemente para o próximo da fila
  setTimeout(function() {
    toast.classList.remove('toast-show');
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      setTimeout(function() {
        processNextToast();
      }, 100);
    }, 280);
  }, 1800);
}

// ─── MODAL DA POKÉDEX (151 POKÉMONS COM SOMBRAS) ───
var currentPokedexFilter = 'all'; // 'all' | 'shiny' | 'stats'

function openPokedexModal() {
  var modal = document.getElementById('pokedex-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  setPokedexFilter(currentPokedexFilter === 'stats' ? 'stats' : currentPokedexFilter);
}

function closePokedexModal() {
  var modal = document.getElementById('pokedex-modal');
  if (modal) modal.classList.add('hidden');
}

function setPokedexFilter(filter) {
  currentPokedexFilter = filter;
  document.querySelectorAll('.pokedex-tab-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-filter') === filter);
  });

  var grid = document.getElementById('pokedex-grid');
  var statsView = document.getElementById('pokedex-stats-view');

  if (filter === 'stats') {
    if (grid) grid.style.display = 'none';
    if (statsView) {
      statsView.style.display = 'block';
      if (typeof renderStatsView === 'function') {
        renderStatsView(statsView);
      }
    }
  } else {
    if (grid) grid.style.display = 'grid';
    if (statsView) statsView.style.display = 'none';
    renderPokedexGrid();
  }
}

function renderPokedexGrid() {
  var grid = document.getElementById('pokedex-grid');
  if (!grid || typeof GEN1_POKEMON === 'undefined') return;
  grid.innerHTML = '';

  var data = getPokedexData();
  var caughtCount = Object.keys(data).length;
  var shinyCount = Object.values(data).filter(d => d.shiny).length;

  var summaryEl = document.getElementById('pokedex-summary-text');
  if (summaryEl) {
    var pct = Math.round((caughtCount / 151) * 100);
    var caughtLabel = typeof t === 'function' ? t('pokedex_summary_caught') : 'Capturados:';
    var shiniesLabel = typeof t === 'function' ? t('pokedex_summary_shinies') : 'Shinies:';
    summaryEl.innerHTML = caughtLabel + ' <b>' + caughtCount + '/151</b> (' + pct + '%) &nbsp;|&nbsp; ' + shiniesLabel + ' <b>' + shinyCount + ' ✨</b>';
  }

  // Ordena rigorosamente do #001 (Bulbasaur) ao #151 (Mew)
  var sortedPokemon = GEN1_POKEMON.slice().sort(function(a, b) {
    return a.id - b.id;
  });

  sortedPokemon.forEach(function(poke) {
    var caughtEntry = data[poke.id];
    var isCaught = !!caughtEntry;
    var isShiny = isCaught && caughtEntry.shiny;

    if (currentPokedexFilter === 'shiny' && !isShiny) return;

    var numStr = '#' + String(poke.id).padStart(3, '0');
    var isLongName = poke.name.length >= 8;

    var card = document.createElement('div');
    card.className = 'pokedex-slot' + (isCaught ? ' slot-caught' : ' slot-unknown') + (isShiny ? ' slot-shiny' : '');

    var spriteUrl = 'https://play.pokemonshowdown.com/sprites/gen5/' + (isShiny ? 'shiny/' : '') + poke.name + '.png';
    var fallbackUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (isShiny ? 'shiny/' : '') + poke.id + '.png';

    card.innerHTML = `
      <div class="slot-number">${numStr}</div>
      <div class="slot-sprite-wrap">
        <img src="${spriteUrl}" alt="${poke.name}" class="slot-img" onerror="this.src='${fallbackUrl}'">
        ${isCaught && caughtEntry.count > 1 ? '<span class="slot-count-badge">x' + caughtEntry.count + '</span>' : ''}
      </div>
      <div class="slot-name ${isLongName ? 'slot-name-long' : ''}">${isCaught ? poke.name.toUpperCase() : '???'}</div>
      ${isShiny ? '<span class="slot-shiny-star" title="Versão Shiny Capturada!">✨</span>' : ''}
    `;

    grid.appendChild(card);
  });
}
