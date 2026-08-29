// pokemon-data.js — Tabela completa dos 151 Pokémons de Kanto (Gen 1) com Raridades

var GEN1_POKEMON = [
  // Tier 1: Muito Comum (Peso 50)
  { id: 16, name: 'pidgey', tier: 1 },
  { id: 19, name: 'rattata', tier: 1 },
  { id: 10, name: 'caterpie', tier: 1 },
  { id: 13, name: 'weedle', tier: 1 },
  { id: 41, name: 'zubat', tier: 1 },
  { id: 74, name: 'geodude', tier: 1 },
  { id: 21, name: 'spearow', tier: 1 },
  { id: 129, name: 'magikarp', tier: 1 },

  // Tier 2: Comum (Peso 30)
  { id: 1, name: 'bulbasaur', tier: 2 },
  { id: 4, name: 'charmander', tier: 2 },
  { id: 7, name: 'squirtle', tier: 2 },
  { id: 25, name: 'pikachu', tier: 2 },
  { id: 27, name: 'sandshrew', tier: 2 },
  { id: 29, name: 'nidoranf', tier: 2 },
  { id: 32, name: 'nidoranm', tier: 2 },
  { id: 43, name: 'oddish', tier: 2 },
  { id: 60, name: 'poliwag', tier: 2 },
  { id: 66, name: 'machop', tier: 2 },
  { id: 69, name: 'bellsprout', tier: 2 },
  { id: 72, name: 'tentacool', tier: 2 },
  { id: 77, name: 'ponyta', tier: 2 },
  { id: 79, name: 'slowpoke', tier: 2 },
  { id: 81, name: 'magnemite', tier: 2 },
  { id: 92, name: 'gastly', tier: 2 },
  { id: 96, name: 'drowzee', tier: 2 },
  { id: 98, name: 'krabby', tier: 2 },
  { id: 100, name: 'voltorb', tier: 2 },
  { id: 118, name: 'goldeen', tier: 2 },
  { id: 120, name: 'staryu', tier: 2 },

  // Tier 3: Incomum / Evoluções 1 (Peso 15)
  { id: 2, name: 'ivysaur', tier: 3 },
  { id: 5, name: 'charmeleon', tier: 3 },
  { id: 8, name: 'wartortle', tier: 3 },
  { id: 11, name: 'metapod', tier: 3 },
  { id: 14, name: 'kakuna', tier: 3 },
  { id: 17, name: 'pidgeotto', tier: 3 },
  { id: 20, name: 'raticate', tier: 3 },
  { id: 22, name: 'fearow', tier: 3 },
  { id: 23, name: 'ekans', tier: 3 },
  { id: 24, name: 'arbok', tier: 3 },
  { id: 26, name: 'raichu', tier: 3 },
  { id: 28, name: 'sandslash', tier: 3 },
  { id: 30, name: 'nidorina', tier: 3 },
  { id: 33, name: 'nidorino', tier: 3 },
  { id: 35, name: 'clefairy', tier: 3 },
  { id: 37, name: 'vulpix', tier: 3 },
  { id: 39, name: 'jigglypuff', tier: 3 },
  { id: 42, name: 'golbat', tier: 3 },
  { id: 44, name: 'gloom', tier: 3 },
  { id: 46, name: 'paras', tier: 3 },
  { id: 47, name: 'parasect', tier: 3 },
  { id: 48, name: 'venonat', tier: 3 },
  { id: 50, name: 'diglett', tier: 3 },
  { id: 51, name: 'dugtrio', tier: 3 },
  { id: 52, name: 'meowth', tier: 3 },
  { id: 53, name: 'persian', tier: 3 },
  { id: 54, name: 'psyduck', tier: 3 },
  { id: 56, name: 'mankey', tier: 3 },
  { id: 57, name: 'primeape', tier: 3 },
  { id: 58, name: 'growlithe', tier: 3 },
  { id: 61, name: 'poliwhirl', tier: 3 },
  { id: 63, name: 'abra', tier: 3 },
  { id: 64, name: 'kadabra', tier: 3 },
  { id: 67, name: 'machoke', tier: 3 },
  { id: 70, name: 'weepinbell', tier: 3 },
  { id: 75, name: 'graveler', tier: 3 },
  { id: 78, name: 'rapidash', tier: 3 },
  { id: 80, name: 'slowbro', tier: 3 },
  { id: 82, name: 'magneton', tier: 3 },
  { id: 83, name: 'farfetchd', tier: 3 },
  { id: 84, name: 'doduo', tier: 3 },
  { id: 85, name: 'dodrio', tier: 3 },
  { id: 86, name: 'seel', tier: 3 },
  { id: 87, name: 'dewgong', tier: 3 },
  { id: 88, name: 'grimer', tier: 3 },
  { id: 89, name: 'muk', tier: 3 },
  { id: 90, name: 'shellder', tier: 3 },
  { id: 91, name: 'cloyster', tier: 3 },
  { id: 93, name: 'haunter', tier: 3 },
  { id: 95, name: 'onix', tier: 3 },
  { id: 97, name: 'hypno', tier: 3 },
  { id: 99, name: 'kingler', tier: 3 },
  { id: 101, name: 'electrode', tier: 3 },
  { id: 102, name: 'exeggcute', tier: 3 },
  { id: 104, name: 'cubone', tier: 3 },
  { id: 105, name: 'marowak', tier: 3 },
  { id: 106, name: 'hitmonlee', tier: 3 },
  { id: 107, name: 'hitmonchan', tier: 3 },
  { id: 108, name: 'lickitung', tier: 3 },
  { id: 109, name: 'koffing', tier: 3 },
  { id: 110, name: 'weezing', tier: 3 },
  { id: 111, name: 'rhyhorn', tier: 3 },
  { id: 112, name: 'rhydon', tier: 3 },
  { id: 114, name: 'tangela', tier: 3 },
  { id: 116, name: 'horsea', tier: 3 },
  { id: 117, name: 'seadra', tier: 3 },
  { id: 119, name: 'seaking', tier: 3 },
  { id: 121, name: 'starmie', tier: 3 },
  { id: 122, name: 'mrmime', tier: 3 },
  { id: 123, name: 'scyther', tier: 3 },
  { id: 124, name: 'jynx', tier: 3 },
  { id: 125, name: 'electabuzz', tier: 3 },
  { id: 126, name: 'magmar', tier: 3 },
  { id: 127, name: 'pinsir', tier: 3 },
  { id: 128, name: 'tauros', tier: 3 },
  { id: 133, name: 'eevee', tier: 3 },
  { id: 134, name: 'vaporeon', tier: 3 },
  { id: 135, name: 'jolteon', tier: 3 },
  { id: 136, name: 'flareon', tier: 3 },
  { id: 137, name: 'porygon', tier: 3 },
  { id: 138, name: 'omanyte', tier: 3 },
  { id: 139, name: 'omastar', tier: 3 },
  { id: 140, name: 'kabuto', tier: 3 },
  { id: 141, name: 'kabutops', tier: 3 },
  { id: 147, name: 'dratini', tier: 3 },
  { id: 148, name: 'dragonair', tier: 3 },

  // Tier 4: Raro / Estágio Final / Especiais (Peso 4)
  { id: 3, name: 'venusaur', tier: 4 },
  { id: 6, name: 'charizard', tier: 4 },
  { id: 9, name: 'blastoise', tier: 4 },
  { id: 12, name: 'butterfree', tier: 4 },
  { id: 15, name: 'beedrill', tier: 4 },
  { id: 18, name: 'pidgeot', tier: 4 },
  { id: 31, name: 'nidoqueen', tier: 4 },
  { id: 34, name: 'nidoking', tier: 4 },
  { id: 36, name: 'clefable', tier: 4 },
  { id: 38, name: 'ninetales', tier: 4 },
  { id: 40, name: 'wigglytuff', tier: 4 },
  { id: 45, name: 'vileplume', tier: 4 },
  { id: 49, name: 'venomoth', tier: 4 },
  { id: 55, name: 'golduck', tier: 4 },
  { id: 59, name: 'arcanine', tier: 4 },
  { id: 62, name: 'poliwrath', tier: 4 },
  { id: 65, name: 'alakazam', tier: 4 },
  { id: 68, name: 'machamp', tier: 4 },
  { id: 71, name: 'victreebel', tier: 4 },
  { id: 73, name: 'tentacruel', tier: 4 },
  { id: 76, name: 'golem', tier: 4 },
  { id: 94, name: 'gengar', tier: 4 },
  { id: 103, name: 'exeggutor', tier: 4 },
  { id: 113, name: 'chansey', tier: 4 },
  { id: 115, name: 'kangaskhan', tier: 4 },
  { id: 130, name: 'gyarados', tier: 4 },
  { id: 131, name: 'lapras', tier: 4 },
  { id: 132, name: 'ditto', tier: 4 },
  { id: 142, name: 'aerodactyl', tier: 4 },
  { id: 143, name: 'snorlax', tier: 4 },

  // Tier 5: Lendário / Mítico (Peso 1)
  { id: 144, name: 'articuno', tier: 5 },
  { id: 145, name: 'zapdos', tier: 5 },
  { id: 146, name: 'moltres', tier: 5 },
  { id: 149, name: 'dragonite', tier: 5 },
  { id: 150, name: 'mewtwo', tier: 5 },
  { id: 151, name: 'mew', tier: 5 }
];

// Pesos por Tier de raridade
var TIER_WEIGHTS = {
  1: 50, // Muito Comum
  2: 30, // Comum
  3: 15, // Incomum
  4: 4,  // Raro
  5: 1   // Lendário / Mítico
};

// Sorteia um Pokémon da Gen 1 respeitando os pesos de raridade
function pickRandomGen1Pokemon(excludeIds) {
  var available = GEN1_POKEMON.filter(function(p) {
    return !excludeIds.has(p.id);
  });

  if (available.length === 0) {
    available = GEN1_POKEMON;
  }

  // Soma total de pesos
  var totalWeight = 0;
  available.forEach(function(p) {
    totalWeight += (TIER_WEIGHTS[p.tier] || 10);
  });

  var rand = Math.random() * totalWeight;
  var accum = 0;

  for (var i = 0; i < available.length; i++) {
    accum += (TIER_WEIGHTS[available[i].tier] || 10);
    if (rand <= accum) {
      return available[i];
    }
  }

  return available[0];
}
