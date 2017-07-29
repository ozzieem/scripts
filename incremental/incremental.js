/// Simulation variables
var time = 0.0;
const deltaTime = 1.0 / 250.0;

/// Game variables
var totalAutomators = 0;
var totalQuarries = 0;
var totalRecyclers = 0;
var totalFabricators = 0;

var totalItems = 0;
var totalScraps = 0;
var totalUUmatter = 0;


/// Parameters
var AUTOMATOR_STRING_NAME = "Automator";
var AUTOMATOR_START_COST = 10;
var AUTOMATOR_COST_INCREASING_FACTOR = 1.1;

var QUARRY_STRING_NAME = "Quarry";
var QUARRY_START_COST = 100;
var QUARRY_COST_INCREASING_FACTOR = 1.15;

var RECYCLER_STRING_NAME = "Recycler";
var RECYCLER_START_COST = 1000;
var RECYCLER_COST_INCREASING_FACTOR = 1.2;

var FABRICATOR_STRING_NAME = "Fabricator";
var FABRICATOR_START_COST = 10000;
var FABRICATOR_COST_INCREASING_FACTOR = 1.5;
var FABRICATOR_MAX_PROGRESS = 100;



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

var automator = new Machine(AUTOMATOR_STRING_NAME, AUTOMATOR_START_COST, AUTOMATOR_COST_INCREASING_FACTOR);
automator.update = function() {
  totalItems += updateValue(totalAutomators * 2);
};

var quarry = new Machine(QUARRY_STRING_NAME, QUARRY_START_COST, QUARRY_COST_INCREASING_FACTOR);
quarry.update = function() {
  totalItems += updateValue(totalQuarries * 5);
};

var recycler = new Machine(RECYCLER_STRING_NAME, RECYCLER_START_COST, RECYCLER_COST_INCREASING_FACTOR);
recycler.update = function() {
  var itemsPerScrap = updateValue(10 * totalRecyclers);
  if (totalItems - itemsPerScrap > 0) {
    totalScraps += updateValue(totalRecyclers);
    totalItems -= updateValue(itemsPerScrap);
  }
};

var fabricator = new Machine(FABRICATOR_STRING_NAME, FABRICATOR_START_COST, FABRICATOR_COST_INCREASING_FACTOR);
fabricator.update = function() {
  var scrapsToMatter = updateValue(2 * totalFabricators);
  if (totalScraps - scrapsToMatter > 0) {
    totalScraps -= scrapsToMatter;
    fabricator.progress += parseFloat(0.1 * totalFabricators);
  }
  if (fabricator.progress >= FABRICATOR_MAX_PROGRESS) {
    totalUUmatter++;
    fabricator.progress = 0;
  }
};

function updateValue(factor) {
  return factor * deltaTime;
}

function add(numb) {
  totalItems += parseInt(numb);
}

function buyAutomator(number) {
  totalAutomators = automator.buy(number, totalAutomators);
}

function buyQuarry(number) {
  totalQuarries = quarry.buy(number, totalQuarries);
}

function buyRecycler(number) {
  totalRecyclers = recycler.buy(number, totalRecyclers);
}

function buyFabricator(number) {
  totalFabricators = fabricator.buy(number, totalFabricators);
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
  totalRecyclers = 0;
  totalFabricators = 0;
}

function updateMachines() {
  automator.update();
  quarry.update();
  recycler.update();
  fabricator.update();
}

function updateScreenValues() {
  document.getElementById("totalItems").innerHTML = Math.floor(totalItems);
  document.getElementById("totalScraps").innerHTML = Math.floor(totalScraps);
  document.getElementById("totalUUmatter").innerHTML = totalUUmatter;
  
  document.getElementById("time").innerHTML = parseFloat(time).toFixed(3);
  
  document.getElementById("totalAutomators").innerHTML = totalAutomators;
  document.getElementById("totalQuarries").innerHTML = totalQuarries;
  document.getElementById("totalRecyclers").innerHTML = totalRecyclers;
  document.getElementById("totalFabricators").innerHTML = totalFabricators;

  document.getElementById("automatorCost").innerHTML = automator.cost(totalAutomators);
  document.getElementById("quarryCost").innerHTML = quarry.cost(totalQuarries);
  document.getElementById("recyclerCost").innerHTML = recycler.cost(totalRecyclers);
  document.getElementById("fabricatorCost").innerHTML = fabricator.cost(totalFabricators);

  document.getElementById("availableAutomators").innerHTML = getAvailableMachines(automator, totalAutomators);
  document.getElementById("availableQuarries").innerHTML = getAvailableMachines(quarry,totalQuarries);
  document.getElementById("availableRecyclers").innerHTML = getAvailableMachines(recycler, totalRecyclers);
  document.getElementById("availableFabricators").innerHTML = getAvailableMachines(fabricator, totalFabricators);

  document.getElementById("fabricatorProgress").innerHTML = Math.floor(fabricator.progress);
}

function step() {
	time += deltaTime;
}

window.setInterval(function() {
  updateMachines();
  updateScreenValues();
  step();

}, deltaTime);