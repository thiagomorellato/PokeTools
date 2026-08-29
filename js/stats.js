// stats.js — Sistema Completo de Estatísticas de Treinador

var STATS_KEY = 'poketools_stats_v1';

function getStatsData() {
  try {
    var raw = localStorage.getItem(STATS_KEY);
    if (!raw) return initEmptyStats();
    var parsed = JSON.parse(raw);
    if (!parsed.seenByTier) parsed.seenByTier = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!parsed.seenByPokemon) parsed.seenByPokemon = {};
    if (!parsed.attemptsByTier) parsed.attemptsByTier = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!parsed.caughtByTier) parsed.caughtByTier = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return parsed;
  } catch(e) {
    return initEmptyStats();
  }
}

function initEmptyStats() {
  return {
    seenTotal: 0,
    seenShinies: 0,
    seenByTier: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    seenByPokemon: {},
    attemptsTotal: 0,
    attemptsByTier: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    attemptsShinies: 0,
    caughtTotal: 0,
    caughtByTier: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    caughtShinies: 0
  };
}

function saveStatsData(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch(e) {}
}

// ─── REGISTRAR POKÉMON VISTO NA TELA ───
function recordPokemonSeen(poke, isShiny) {
  if (!poke) return;
  var stats = getStatsData();
  stats.seenTotal = (stats.seenTotal || 0) + 1;
  if (isShiny) {
    stats.seenShinies = (stats.seenShinies || 0) + 1;
  }
  var t = poke.tier || 2;
  stats.seenByTier[t] = (stats.seenByTier[t] || 0) + 1;
  stats.seenByPokemon[poke.id] = (stats.seenByPokemon[poke.id] || 0) + 1;

  saveStatsData(stats);
}

// ─── REGISTRAR TENTATIVA E RESULTADO DE CAPTURA ───
function recordCatchAttempt(poke, isShiny, success) {
  if (!poke) return;
  var stats = getStatsData();
  var t = poke.tier || 2;

  stats.attemptsTotal = (stats.attemptsTotal || 0) + 1;
  stats.attemptsByTier[t] = (stats.attemptsByTier[t] || 0) + 1;
  if (isShiny) {
    stats.attemptsShinies = (stats.attemptsShinies || 0) + 1;
  }

  if (success) {
    stats.caughtTotal = (stats.caughtTotal || 0) + 1;
    stats.caughtByTier[t] = (stats.caughtByTier[t] || 0) + 1;
    if (isShiny) {
      stats.caughtShinies = (stats.caughtShinies || 0) + 1;
    }
  }

  saveStatsData(stats);
}

// ─── VISUALIZAÇÃO DE ESTATÍSTICAS NA POKÉDEX ───
function openStatsModal() {
  if (typeof openPokedexModal === 'function') {
    openPokedexModal();
    setPokedexFilter('stats');
  }
}

function closeStatsModal() {
  if (typeof closePokedexModal === 'function') {
    closePokedexModal();
  }
}

function renderStatsView(targetContainer) {
  var container = targetContainer || document.getElementById('pokedex-stats-view');
  if (!container) return;

  var stats = getStatsData();
  var pokedex = (typeof getPokedexData === 'function') ? getPokedexData() : {};
  var uniqueCaught = Object.keys(pokedex).length;
  var overallRate = stats.attemptsTotal > 0 ? Math.round((stats.caughtTotal / stats.attemptsTotal) * 100) : 0;

  var tierNames = {
    pt: {
      1: { name: 'Muito Comum', color: '#22c55e' },
      2: { name: 'Comum', color: '#38bdf8' },
      3: { name: 'Incomum', color: '#a855f7' },
      4: { name: 'Raro', color: '#f97316' },
      5: { name: 'Lendário / Mítico', color: '#eab308' }
    },
    en: {
      1: { name: 'Very Common', color: '#22c55e' },
      2: { name: 'Common', color: '#38bdf8' },
      3: { name: 'Uncommon', color: '#a855f7' },
      4: { name: 'Rare', color: '#f97316' },
      5: { name: 'Legendary / Mythical', color: '#eab308' }
    }
  };

  var lang = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'en' : 'pt';
  var tNames = tierNames[lang];

  // Encontra o Pokémon mais visto
  var mostSeenId = null;
  var mostSeenCount = 0;
  for (var pid in stats.seenByPokemon) {
    if (stats.seenByPokemon[pid] > mostSeenCount) {
      mostSeenCount = stats.seenByPokemon[pid];
      mostSeenId = parseInt(pid);
    }
  }
  var mostSeenPoke = (typeof GEN1_POKEMON !== 'undefined' && mostSeenId) ? GEN1_POKEMON.find(p => p.id === mostSeenId) : null;

  var html = `
    <!-- Cards de Resumo Rápido -->
    <div class="stats-cards-grid">
      
      <div class="stats-kpi-card">
        <div class="kpi-icon">👁️</div>
        <div class="kpi-value">${stats.seenTotal}</div>
        <div class="kpi-label">${lang === 'en' ? 'Pokémon Seen' : 'Pokémons Vistos'}</div>
        <div class="kpi-subtag">✨ ${stats.seenShinies} ${lang === 'en' ? 'Shinies seen' : 'Shinies vistos'}</div>
      </div>

      <div class="stats-kpi-card">
        <div class="kpi-icon">🎯</div>
        <div class="kpi-value">${stats.attemptsTotal}</div>
        <div class="kpi-label">${lang === 'en' ? 'Catch Attempts' : 'Tentativas de Captura'}</div>
        <div class="kpi-subtag">${overallRate}% ${lang === 'en' ? 'success rate' : 'de precisão'}</div>
      </div>

      <div class="stats-kpi-card">
        <div class="kpi-icon">🔴</div>
        <div class="kpi-value">${stats.caughtTotal}</div>
        <div class="kpi-label">${lang === 'en' ? 'Total Catches' : 'Total Capturados'}</div>
        <div class="kpi-subtag">${uniqueCaught}/151 ${lang === 'en' ? 'unique registered' : 'espécies registradas'}</div>
      </div>

      <div class="stats-kpi-card kpi-shiny">
        <div class="kpi-icon">✨</div>
        <div class="kpi-value">${stats.caughtShinies}</div>
        <div class="kpi-label">${lang === 'en' ? 'Shinies Caught' : 'Shinies Pegos'}</div>
        <div class="kpi-subtag">${stats.attemptsShinies} ${lang === 'en' ? 'shiny attempts' : 'tentativas em shiny'}</div>
      </div>

    </div>

    <!-- Tabela / Breakdown por Raridade -->
    <div class="stats-section-title">${lang === 'en' ? '📊 Breakdown by Rarity' : '📊 Estatísticas por Raridade'}</div>
    
    <div class="stats-table-wrap">
      <table class="stats-table">
        <thead>
          <tr>
            <th style="width: 32%;">${lang === 'en' ? 'Rarity' : 'Raridade'}</th>
            <th class="text-center" style="width: 17%;">${lang === 'en' ? 'Seen' : 'Vistos'}</th>
            <th class="text-center" style="width: 17%;">${lang === 'en' ? 'Attempts' : 'Tentativas'}</th>
            <th class="text-center" style="width: 17%;">${lang === 'en' ? 'Caught' : 'Capturas'}</th>
            <th class="text-center" style="width: 17%;">${lang === 'en' ? 'Rate' : 'Taxa'}</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (var tier = 1; tier <= 5; tier++) {
    var seen = stats.seenByTier[tier] || 0;
    var att = stats.attemptsByTier[tier] || 0;
    var cgt = stats.caughtByTier[tier] || 0;
    var rate = att > 0 ? Math.round((cgt / att) * 100) : 0;
    var tInfo = tNames[tier];

    html += `
      <tr>
        <td class="tier-cell">
          <span class="tier-dot" style="background: ${tInfo.color};"></span>
          <span style="color: ${tInfo.color}; font-weight: 800;">${tInfo.name}</span>
        </td>
        <td class="text-center font-bold">${seen}</td>
        <td class="text-center">${att}</td>
        <td class="text-center text-success">${cgt}</td>
        <td class="text-center">
          <span class="rate-pill">${att > 0 ? rate + '%' : '-'}</span>
        </td>
      </tr>
    `;
  }

  // Linha de Shinies
  var shinySeen = stats.seenShinies || 0;
  var shinyAtt = stats.attemptsShinies || 0;
  var shinyCgt = stats.caughtShinies || 0;
  var shinyRate = shinyAtt > 0 ? Math.round((shinyCgt / shinyAtt) * 100) : 0;

  html += `
        <tr class="shiny-row">
          <td class="tier-cell">
            <span class="tier-dot" style="background: #fbbf24; box-shadow: 0 0 8px #fbbf24;"></span>
            <span style="color: #fbbf24; font-weight: 900;">✨ Shinies</span>
          </td>
          <td class="text-center font-bold">${shinySeen}</td>
          <td class="text-center">${shinyAtt}</td>
          <td class="text-center text-success">${shinyCgt}</td>
          <td class="text-center">
            <span class="rate-pill rate-shiny">${shinyAtt > 0 ? shinyRate + '%' : '-'}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `;

  if (mostSeenPoke) {
    var spriteUrl = 'https://play.pokemonshowdown.com/sprites/gen5/' + mostSeenPoke.name + '.png';
    html += `
      <div class="stats-highlight-banner">
        <img src="${spriteUrl}" alt="${mostSeenPoke.name}" class="highlight-sprite">
        <div class="highlight-info">
          <div class="highlight-title">${lang === 'en' ? '⭐ Most Encountered Pokémon' : '⭐ Pokémon Mais Visto'}</div>
          <div class="highlight-name">${mostSeenPoke.name.toUpperCase()} (#${String(mostSeenPoke.id).padStart(3, '0')})</div>
          <div class="highlight-count">${mostSeenCount} ${lang === 'en' ? 'encounters' : 'aparições na sua tela'}</div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}
