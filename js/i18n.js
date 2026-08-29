// i18n.js — Internacionalização Completa (Português & Inglês)

var currentLang = localStorage.getItem('poketools_lang') || 'pt';

var TRANSLATIONS = {
  pt: {
    // Navbar & Menu
    nav_home: "Início",
    nav_menu_title: "Menu & Opções",
    theme_label: "Aparência",
    theme_dark: "Modo Escuro 🌙",
    theme_light: "Modo Claro ☀️",
    lang_label: "Idioma / Language",
    lang_pt: "🇧🇷 Português",
    lang_en: "🇺🇸 English",

    // Home
    home_subtitle: "Ferramentas temáticas para suas partidas e torneios!",
    card_timer_title: "Timer TCG",
    card_timer_desc: "Temporizador de partidas",
    card_timer_cta: "Acessar Timer →",
    card_race_title: "Lapras Race",
    card_race_desc: "Sorteio aleatório",
    card_race_cta: "Acessar Corrida →",

    // Timer Step 1
    timer_choose_mode: "⏱️ Escolha o Modo do Timer",
    timer_mode_subtitle: "Selecione como deseja utilizar o cronômetro na sua mesa",
    timer_general_title: "Timer Geral",
    timer_general_desc: "Ideal para mesas com 4+ jogadores, torneios ou múltiplas partidas usando o mesmo relógio.",
    timer_general_tag: "Sem nomes de jogadores",
    timer_general_btn: "Selecionar Modo Geral →",
    timer_vs_title: "Partida VS (1v1)",
    timer_vs_desc: "Partida direta entre 2 jogadores com placar e nomes personalizados na tela.",
    timer_vs_tag: "Com Jogador 1 vs Jogador 2",
    timer_vs_btn: "Selecionar Modo VS →",

    // Timer Step 2
    timer_back: "← Voltar",
    timer_setup_general_title: "⏳ Configuração do Tempo (Mesa Geral)",
    timer_setup_vs_title: "⚔️ Jogadores & Tempo (Partida VS)",
    timer_p1_label: "🔵 Jogador 1",
    timer_p1_placeholder: "Nome do Jogador 1",
    timer_p2_label: "🔴 Jogador 2",
    timer_p2_placeholder: "Nome do Jogador 2",
    timer_time_label: "⏰ Defina o Tempo da Rodada",
    preset_50: "50 min (Oficial)",
    preset_30: "30 min",
    preset_20: "20 min",
    preset_10: "10 min",
    time_hours: "Horas",
    time_min: "Min",
    time_sec: "Seg",
    timer_proceed_btn: "Ir para o Timer ⏱️ →",

    // Timer Step 3
    timer_adjust: "⚙️ Ajustar",
    timer_reset_quick: "🔄 Resetar",
    timer_mode_general_badge: "⏳ Modo Geral",
    timer_mode_vs_badge: "⚔️ Partida VS",
    timer_turn_prefix: "Turno",
    timer_ready: "Pronto!",
    timer_running: "Em Andamento",
    timer_paused: "Pausado",
    timer_finished: "Tempo Esgotado!",
    timer_start: "Iniciar",
    timer_pause: "Pausar",
    timer_reset: "🔄 Resetar",

    // Lapras Race
    race_title: "🌊 Lapras Race",
    race_players_label: "👥 Participantes",
    race_players_unit: "jog",
    race_duration_label: "⏱️ Duração",
    race_duration_unit: "seg",
    race_participant_prefix: "Lapras",
    race_participant_placeholder: "Nome do Participante",
    race_launch_btn: "🏁 Iniciar Corrida!",
    race_running_title: "🌊 Corrida em Andamento!",
    race_leader_prefix: "👑 Líder:",
    race_abort_btn: "✕ Cancelar",
    race_winner_heading: "VENCEDOR!",
    race_again_btn: "🔄 Correr Novamente",
    race_again_no_winner_btn: "🚫 Correr Sem o Vencedor",
    race_new_config_btn: "⚙️ Nova Config",

    // Pokédex
    pokedex_summary_caught: "Capturados:",
    pokedex_summary_shinies: "Shinies:",
    filter_all: "Todos",
    filter_caught: "Capturados",
    filter_missing: "Faltando",
    filter_shiny: "✨ Shinies",
    pokedex_modal_title: "POKÉDEX DE KANTO",

    // Toast
    toast_gotcha: "🔴 Gotcha!",
    toast_shiny_gotcha: "✨ SHINY CAPTURADO! ✨",
    toast_caught_suffix: "foi pego!",
    toast_escaped_prefix: "💨 Ah não!",
    toast_escaped_suffix: "escapou!",

    // Alerts
    alert_time_zero: "Por favor, defina um tempo maior que zero!",
    alert_duration_min: "Defina uma duração de pelo menos 5 segundos!",
    alert_tourney_end: "Restou apenas 1 participante! O torneio foi concluído. 🏆"
  },
  en: {
    // Navbar & Menu
    nav_home: "Home",
    nav_menu_title: "Menu & Options",
    theme_label: "Appearance",
    theme_dark: "Dark Mode 🌙",
    theme_light: "Light Mode ☀️",
    lang_label: "Language / Idioma",
    lang_pt: "🇧🇷 Português",
    lang_en: "🇺🇸 English",

    // Home
    home_subtitle: "Themed tools for your matches and tournaments!",
    card_timer_title: "TCG Timer",
    card_timer_desc: "Match timer",
    card_timer_cta: "Open Timer →",
    card_race_title: "Lapras Race",
    card_race_desc: "Random picker",
    card_race_cta: "Open Race →",

    // Timer Step 1
    timer_choose_mode: "⏱️ Choose Timer Mode",
    timer_mode_subtitle: "Select how you want to use the timer at your table",
    timer_general_title: "General Timer",
    timer_general_desc: "Great for 4+ player pods, tournaments, or table-wide rounds sharing one clock.",
    timer_general_tag: "No player names",
    timer_general_btn: "Select General Mode →",
    timer_vs_title: "VS Match (1v1)",
    timer_vs_desc: "Direct 2-player match with custom player names on screen.",
    timer_vs_tag: "Player 1 vs Player 2",
    timer_vs_btn: "Select VS Mode →",

    // Timer Step 2
    timer_back: "← Back",
    timer_setup_general_title: "⏳ Time Setup (General Pod)",
    timer_setup_vs_title: "⚔️ Players & Time (VS Match)",
    timer_p1_label: "🔵 Player 1",
    timer_p1_placeholder: "Player 1 Name",
    timer_p2_label: "🔴 Player 2",
    timer_p2_placeholder: "Player 2 Name",
    timer_time_label: "⏰ Set Round Duration",
    preset_50: "50 min (Official)",
    preset_30: "30 min",
    preset_20: "20 min",
    preset_10: "10 min",
    time_hours: "Hours",
    time_min: "Min",
    time_sec: "Sec",
    timer_proceed_btn: "Go to Timer ⏱️ →",

    // Timer Step 3
    timer_adjust: "⚙️ Adjust",
    timer_reset_quick: "🔄 Reset",
    timer_mode_general_badge: "⏳ General Mode",
    timer_mode_vs_badge: "⚔️ VS Match",
    timer_turn_prefix: "Turn",
    timer_ready: "Ready!",
    timer_running: "Running",
    timer_paused: "Paused",
    timer_finished: "Time's Up!",
    timer_start: "Start",
    timer_pause: "Pause",
    timer_reset: "🔄 Reset",

    // Lapras Race
    race_title: "🌊 Lapras Race",
    race_players_label: "👥 Participants",
    race_players_unit: "ply",
    race_duration_label: "⏱️ Duration",
    race_duration_unit: "sec",
    race_participant_prefix: "Lapras",
    race_participant_placeholder: "Participant Name",
    race_launch_btn: "🏁 Start Race!",
    race_running_title: "🌊 Race in Progress!",
    race_leader_prefix: "👑 Leader:",
    race_abort_btn: "✕ Cancel",
    race_winner_heading: "WINNER!",
    race_again_btn: "🔄 Race Again",
    race_again_no_winner_btn: "🚫 Race Without Winner",
    race_new_config_btn: "⚙️ New Setup",

    // Pokédex
    pokedex_summary_caught: "Caught:",
    pokedex_summary_shinies: "Shinies:",
    filter_all: "All",
    filter_caught: "Caught",
    filter_missing: "Missing",
    filter_shiny: "✨ Shinies",
    pokedex_modal_title: "KANTO POKÉDEX",

    // Toast
    toast_gotcha: "🔴 Gotcha!",
    toast_shiny_gotcha: "✨ SHINY CAUGHT! ✨",
    toast_caught_suffix: "was caught!",
    toast_escaped_prefix: "💨 Oh no!",
    toast_escaped_suffix: "fled!",

    // Alerts
    alert_time_zero: "Please set a duration greater than zero!",
    alert_duration_min: "Please set a duration of at least 5 seconds!",
    alert_tourney_end: "Only 1 participant left! Tournament concluded. 🏆"
  }
};

function t(key) {
  var langObj = TRANSLATIONS[currentLang] || TRANSLATIONS['pt'];
  return langObj[key] || TRANSLATIONS['pt'][key] || key;
}

function setLanguage(lang) {
  currentLang = (lang === 'en') ? 'en' : 'pt';
  localStorage.setItem('poketools_lang', currentLang);
  applyTranslations();
  
  // Atualiza botões ativos no menu
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });

  // Atualiza componentes dinâmicos
  if (typeof renderPokedexGrid === 'function') renderPokedexGrid();
  if (typeof generateRaceNames === 'function') generateRaceNames();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var text = t(key);
    if (text) el.textContent = text;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    var html = t(key);
    if (html) el.innerHTML = html;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    var text = t(key);
    if (text) el.placeholder = text;
  });

  document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-title');
    var text = t(key);
    if (text) el.title = text;
  });

  // Atualiza o botão de play/pause se o timer estiver rodando
  var playText = document.getElementById('play-text');
  if (playText && typeof timerRunning !== 'undefined') {
    playText.textContent = timerRunning ? t('timer_pause') : t('timer_start');
  }

  // Atualiza o badge de modo
  var modeBadge = document.getElementById('active-mode-badge');
  if (modeBadge && typeof currentMode !== 'undefined') {
    modeBadge.textContent = (currentMode === 'general') ? t('timer_mode_general_badge') : t('timer_mode_vs_badge');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setLanguage(currentLang);
});
