/// Simulation variables
var time = 0.0;
const deltaTime = 1.0 / 60.0;

/// Game variables
var total_automators = 0;
var total_quarries = 0;
var total_recyclers = 0;
var total_fabricators = 0;

var total_items = 0;
var total_scraps = 0;
var total_UUmatter = 0;


/// Parameters
var AUTOMATOR_STRING_NAME = "Automator";
var AUTOMATOR_START_COST = 10;
var AUTOMATOR_COST_INCREASING_FACTOR = 1.1;

var QUARRY_STRING_NAME = "Quarry";
var QUARRY_START_COST = 1000;
var QUARRY_COST_INCREASING_FACTOR = 1.15;

var RECYCLER_STRING_NAME = "Recycler";
var RECYCLER_START_COST = 10000;
var RECYCLER_COST_INCREASING_FACTOR = 1.2;

var FABRICATOR_STRING_NAME = "Fabricator";
var FABRICATOR_START_COST = 100000;
var FABRICATOR_COST_INCREASING_FACTOR = 1.5;
var FABRICATOR_MAX_PROGRESS = 100;



// var machines = { total_automators: 0, total_quarries: 0, total_recyclers: 0, total_fabricators: 0 };

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
      if (total_items >= this.cost(machines)) {
        total_items -= this.cost(machines);
        machines++;
      }
    }
    return machines;
  };
}

var automator = new Machine(AUTOMATOR_STRING_NAME, AUTOMATOR_START_COST, AUTOMATOR_COST_INCREASING_FACTOR);
automator.update = function() {
  total_items += updateValue(total_automators * 2);
};

var quarry = new Machine(QUARRY_STRING_NAME, QUARRY_START_COST, QUARRY_COST_INCREASING_FACTOR);
quarry.update = function() {
  total_items += updateValue(Math.pow(total_quarries, 2));
};

var recycler = new Machine(RECYCLER_STRING_NAME, RECYCLER_START_COST, RECYCLER_COST_INCREASING_FACTOR);
recycler.update = function() {
  var itemsPerScrap = updateValue(10 * total_recyclers);
  if (total_items - itemsPerScrap > 0) {
    total_scraps += updateValue(total_recyclers);
    total_items -= updateValue(itemsPerScrap);
  }
};

var fabricator = new Machine(FABRICATOR_STRING_NAME, FABRICATOR_START_COST, FABRICATOR_COST_INCREASING_FACTOR);
fabricator.update = function() {
  var scrapsToMatter = updateValue(2 * total_fabricators);
  if (total_scraps - scrapsToMatter > 0) {
    total_scraps -= scrapsToMatter;
    fabricator.progress += parseFloat(0.1 * total_fabricators);
  }
  if (fabricator.progress >= FABRICATOR_MAX_PROGRESS) {
    total_UUmatter++;
    fabricator.progress = 0;
  }
};

function updateValue(factor) {
  return factor * deltaTime;
}

function add(numb) {
  total_items += parseInt(numb);
}

function buyAutomator(number) {
  total_automators = automator.buy(number, total_automators);
}

function buyQuarry(number) {
  total_quarries = quarry.buy(number, total_quarries);
}

function buyRecycler(number) {
  total_recyclers = recycler.buy(number, total_recyclers);
}

function buyFabricator(number) {
  total_fabricators = fabricator.buy(number, total_fabricators);
}

function getAvailableMachines(machine, machines) {
  var totalCost = 0;
  var availableMachines = 0;
  var local_items = total_items;

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
  total_items = 0;
  total_scraps = 0;
  total_UUmatter = 0;

  total_automators = 0;
  total_quarries = 0;
  total_recyclers = 0;
  total_fabricators = 0;
}

function updateMachines() {
  automator.update();
  quarry.update();
  recycler.update();
  fabricator.update();
}

function updateScreenValues() {
  document.getElementById("total_items").innerHTML = Math.floor(total_items);
  document.getElementById("total_scraps").innerHTML = Math.floor(total_scraps);
  document.getElementById("total_UUmatter").innerHTML = total_UUmatter;
  
  document.getElementById("time").innerHTML = parseFloat(time).toFixed(3);
  
  document.getElementById("total_automators").innerHTML = total_automators;
  document.getElementById("total_quarries").innerHTML = total_quarries;
  document.getElementById("total_recyclers").innerHTML = total_recyclers;
  document.getElementById("total_fabricators").innerHTML = total_fabricators;

  document.getElementById("automatorCost").innerHTML = automator.cost(total_automators);
  document.getElementById("quarryCost").innerHTML = quarry.cost(total_quarries);
  document.getElementById("recyclerCost").innerHTML = recycler.cost(total_recyclers);
  document.getElementById("fabricatorCost").innerHTML = fabricator.cost(total_fabricators);

  document.getElementById("availableAutomators").innerHTML = getAvailableMachines(automator, total_automators);
  document.getElementById("availableQuarries").innerHTML = getAvailableMachines(quarry,total_quarries);
  document.getElementById("availableRecyclers").innerHTML = getAvailableMachines(recycler, total_recyclers);
  document.getElementById("availableFabricators").innerHTML = getAvailableMachines(fabricator, total_fabricators);

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
