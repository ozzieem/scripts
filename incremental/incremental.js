/// Simulation variables
var time = 0.0;
const deltaTime = 1.0 / 250.0;
var incFactor = 1.0;

/// Game variables
var totalAutomators = 0;
var totalQuarries = 0;
var totalUndergroundMiners = 0;
var totalRecyclers = 0;
var totalFabricators = 0;

var totalItems = 0;
var totalScraps = 0;
var totalUUmatter = 0;

/// Parameters
var AUTOMATOR_STRING_NAME = "Automator";
var AUTOMATOR_START_COST = 10;
var AUTOMATOR_COST_INCREASING_FACTOR = 1.1;
var AUTOMATOR_PRODUCTION_RATE = 5.0;

var QUARRY_STRING_NAME = "Quarry";
var QUARRY_START_COST = 100;
var QUARRY_COST_INCREASING_FACTOR = 1.15;
var QUARRY_PRODUCTION_RATE = 10.0;

var UNDERGROUNDMINER_STRING_NAME = "Quarry";
var UNDERGROUNDMINER_START_COST = 1000;
var UNDERGROUNDMINER_COST_INCREASING_FACTOR = 1.20;
var UNDERGROUNDMINER_PRODUCTION_RATE = 20.0;

var RECYCLER_STRING_NAME = "Recycler";
var RECYCLER_START_COST = 1000;
var RECYCLER_COST_INCREASING_FACTOR = 1.2;
var RECYCLER_SCRAP_PRODUCTION_RATE = 1.0;
var RECYCLER_ITEMS_CONSUMPTION_PER_SCRAP = 10.0;

var FABRICATOR_STRING_NAME = "Fabricator";
var FABRICATOR_START_COST = 10000;
var FABRICATOR_COST_INCREASING_FACTOR = 1.5;
var FABRICATOR_MAX_PROGRESS = 100;
var FABRICATOR_SCRAP_TO_UU_MATTER = 10.0;
var FABRICATOR_UU_MATTER_PRODUCTION_RATE = 1.0;

var UUMATTER_SELL_PRICE = 10000000;

// var machines = { totalAutomators: 0, totalQuarries: 0, totalRecyclers: 0, totalFabricators: 0 };

function Machine(name, startCost, costIncFactor) {
  this.name = name;
  this.startCost = startCost;
  this.costIncFactor = costIncFactor;
  this.progress = 0;

  this.cost = function(machines) {
    return Math.floor(this.startCost * Math.pow(this.costIncFactor, machines));
  };

  this.buy = function(quantity, machines) {
    for (i = 0; i < quantity; i++) {
      if (totalItems >= this.cost(machines)) {
        totalItems -= this.cost(machines);
        machines++;
      }
    }
    return machines;
  };
}

var automator = new Machine(
  AUTOMATOR_STRING_NAME,
  AUTOMATOR_START_COST,
  AUTOMATOR_COST_INCREASING_FACTOR
);
automator.update = function() {
  totalItems += updateValue(totalAutomators * AUTOMATOR_PRODUCTION_RATE);
};

var quarry = new Machine(
  QUARRY_STRING_NAME,
  QUARRY_START_COST,
  QUARRY_COST_INCREASING_FACTOR
);
quarry.update = function() {
  totalItems += updateValue(totalQuarries * QUARRY_PRODUCTION_RATE);
};

var undergroundMiner = new Machine(
  UNDERGROUNDMINER_STRING_NAME,
  UNDERGROUNDMINER_START_COST,
  UNDERGROUNDMINER_COST_INCREASING_FACTOR
);
undergroundMiner.update = function() {
  totalItems += updateValue(totalUndergroundMiners * UNDERGROUNDMINER_PRODUCTION_RATE);
};

var recycler = new Machine(
  RECYCLER_STRING_NAME,
  RECYCLER_START_COST,
  RECYCLER_COST_INCREASING_FACTOR
);
recycler.update = function() {
  var itemsPerScrap = updateValue(RECYCLER_SCRAP_PRODUCTION_RATE * totalRecyclers);
  if (totalItems - itemsPerScrap > 0) {
    totalScraps += updateValue(totalRecyclers);
    totalItems -= updateValue(itemsPerScrap);
  }
};

var fabricator = new Machine(
  FABRICATOR_STRING_NAME,
  FABRICATOR_START_COST,
  FABRICATOR_COST_INCREASING_FACTOR
);
fabricator.update = function() {
  var scrapsToMatter = updateValue(FABRICATOR_SCRAP_TO_UU_MATTER * totalFabricators);
  if (totalScraps - scrapsToMatter > 0) {
    totalScraps -= scrapsToMatter;
    fabricator.progress += parseFloat(0.1 * totalFabricators);
  }
  if (fabricator.progress >= FABRICATOR_MAX_PROGRESS) {
    totalUUmatter+=FABRICATOR_UU_MATTER_PRODUCTION_RATE;
    fabricator.progress = 0;
  }
};

function updateValue(factor) {
  return factor * deltaTime * incFactor;
}

// ******* ADD FUNCTIONS *******

function addItem(value) {
  totalItems += parseInt(value);
}

function addScrap(value) {
  totalScraps += parseInt(value);
}

function addUUmatter(value) {
  totalUUmatter += parseInt(value);
}

// ******** BUY/SELL FUNCTIONS *********

function buyAutomator(number) {
  totalAutomators = automator.buy(number, totalAutomators);
}

function buyQuarry(number) {
  totalQuarries = quarry.buy(number, totalQuarries);
}

function buyUndergroundMiner(number) {
  totalUndergroundMiners = undergroundMiner.buy(number, totalUndergroundMiners);
}

function buyRecycler(number) {
  totalRecyclers = recycler.buy(number, totalRecyclers);
}

function buyFabricator(number) {
  totalFabricators = fabricator.buy(number, totalFabricators);
}

function sellUUmatter(number) {
  if (totalUUmatter > 0) {
    if (totalUUmatter >= number) {
      addItem(UUMATTER_SELL_PRICE);
      totalUUmatter -= number;
    }
  }
}

function getAvailableMachines(machine, machines) {
  var totalCost = 0;
  var availableMachines = 0;
  var local_items = totalItems;

  while (local_items >= totalCost) {
    totalCost += machine.cost(machines);
    if (totalCost >= machine.cost(machines)) {
      machines++;
      availableMachines++;
    }
  }
  if (availableMachines < 0) {
    return 0;
  } else {
    return availableMachines - 1;
  }
}

function resetGame() {
  totalItems = 0;
  totalScraps = 0;
  totalUUmatter = 0;

  totalAutomators = 0;
  totalQuarries = 0;
  totalUndergroundMiners = 0;
  totalRecyclers = 0;
  totalFabricators = 0;
  time = 0;
}

function updateMachines() {
  automator.update();
  quarry.update();
  undergroundMiner.update();
  recycler.update();
  fabricator.update();
}

function getSelectedAutomatorQuantity() {
  const radioButtons = document.getElementsByName("buyQuantity");
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      return parseInt(radioButtons[i].value);
    }
  }
}

function updateScreenValues() {
  document.getElementById("totalItems").innerHTML = Math.floor(totalItems);
  document.getElementById("totalScraps").innerHTML = Math.floor(totalScraps);
  document.getElementById("totalUUmatter").innerHTML = totalUUmatter;

  document.getElementById("time").innerHTML = parseFloat(time).toFixed(3);

  document.getElementById("totalAutomators").innerHTML = totalAutomators;
  document.getElementById("totalQuarries").innerHTML = totalQuarries;
  document.getElementById("totalUndergroundMiners").innerHTML = totalUndergroundMiners;
  document.getElementById("totalRecyclers").innerHTML = totalRecyclers;
  document.getElementById("totalFabricators").innerHTML = totalFabricators;

  document.getElementById("automatorCost").innerHTML = automator.cost(totalAutomators);
  document.getElementById("quarryCost").innerHTML = quarry.cost(totalQuarries);
  document.getElementById("undergroundMinerCost").innerHTML = undergroundMiner.cost(totalUndergroundMiners);
  document.getElementById("recyclerCost").innerHTML = recycler.cost(totalRecyclers);
  document.getElementById("fabricatorCost").innerHTML = fabricator.cost(totalFabricators);

  document.getElementById("availableAutomators").innerHTML = getAvailableMachines(automator, totalAutomators);
  document.getElementById("availableQuarries").innerHTML = getAvailableMachines(quarry, totalQuarries);
  document.getElementById("availableUndergroundMiners").innerHTML = getAvailableMachines(undergroundMiner, totalUndergroundMiners);
  document.getElementById("availableRecyclers").innerHTML = getAvailableMachines(recycler, totalRecyclers);
  document.getElementById("availableFabricators").innerHTML = getAvailableMachines(fabricator, totalFabricators);

  document.getElementById("fabricatorProgress").innerHTML = Math.floor(fabricator.progress);

  document.getElementById("uumatterSellPrice").innerHTML = UUMATTER_SELL_PRICE;

  // Update production/consumption rates
  document.getElementById("automatorProductionRate").innerHTML = (totalAutomators * AUTOMATOR_PRODUCTION_RATE);
  document.getElementById("quarryProductionRate").innerHTML = (totalQuarries * QUARRY_PRODUCTION_RATE);
  document.getElementById("undergroundMinerProductionRate").innerHTML = (totalUndergroundMiners * UNDERGROUNDMINER_PRODUCTION_RATE);
  document.getElementById("recyclerScrapProductionRate").innerHTML = (totalRecyclers * RECYCLER_SCRAP_PRODUCTION_RATE);
  document.getElementById("recyclerItemsConsumptionRate").innerHTML = (totalRecyclers * RECYCLER_ITEMS_CONSUMPTION_PER_SCRAP * RECYCLER_SCRAP_PRODUCTION_RATE);
  document.getElementById("fabricatorUuMatterProductionRate").innerHTML = (totalFabricators * FABRICATOR_UU_MATTER_PRODUCTION_RATE);
  document.getElementById("fabricatorScrapConsumptionRate").innerHTML = (totalFabricators * FABRICATOR_SCRAP_TO_UU_MATTER);

}

function step() {
  time += deltaTime;
}

window.setInterval(function() {
  updateMachines();
  updateScreenValues();
  step();
}, deltaTime);
