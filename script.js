// Updated version of "Path of the Primordial Flame" with FCC battle logic integrated + updated demon names (Amon, Lilith, Asmodeus) + cave structure + angelic weapon progression + dynamic images

const sceneImage = document.querySelector("#sceneImage");

let xp = 0;
let health = 100;
let coins = 50;
let currentSigil = 0;
let facing;
let shadowHealth;
let inventory = ["Sigil of Sandalphon"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const sigils = [
  { name: 'Sigil of Sandalphon', power: 5 },
  { name: 'Blade of Gabriel', power: 30 },
  { name: 'Sword of Michael', power: 50 },
  { name: 'Sigil of Metatron', power: 100 }
];

const demons = [
  { name: "Amon", level: 2, health: 15 },
  { name: "Lilith", level: 8, health: 60 },
  { name: "Asmodeus", level: 20, health: 300 }
];

const realms = [
  {
    name: "threshold",
    "button text": ["Enter the Sanctum", "Enter the Cave", "Face Asmodeus"],
    "button functions": [enterSanctum, enterCave, confrontDemon],
    text: "You stand before the Black Altar. The Sanctum and the Cave await."
  },
  {
    name: "sanctum",
    "button text": ["Transmute 10 health (10 coins)", "Channel new Sigil (30 coins)", "Return to Threshold"],
    "button functions": [transmuteHealth, channelSigil, returnToThreshold],
    text: "You step into the Sanctum. A flickering brazier glows beside an obsidian altar."
  },
  {
    name: "cave",
    "button text": ["Face Amon", "Face Lilith", "Return to Threshold"],
    "button functions": [faceAmon, faceLilith, returnToThreshold],
    text: "In the cave's gloom, dark entities stir. Choose your battle."
  },
  {
    name: "confront",
    "button text": ["Attack", "Dodge", "Flee"],
    "button functions": [attack, dodge, returnToThreshold],
    text: "A demonic presence coils around you. Prepare yourself."
  },
  {
    name: "defeat",
    "button text": ["Return", "Return", "Return"],
    "button functions": [returnToThreshold, returnToThreshold, returnToThreshold],
    text: "The demon vanishes into shadows. You gain XP and coins."
  },
  {
    name: "fall",
    "button text": ["RETRY", "RETRY", "RETRY"],
    "button functions": [restart, restart, restart],
    text: "Your essence fades into the abyss."
  }
];

button1.onclick = enterSanctum;
button2.onclick = enterCave;
button3.onclick = confrontDemon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;

  if (location.name === "threshold") {
    sceneImage.src = "./images/baphomet.jpg";
  } else if (location.name === "sanctum") {
    sceneImage.src = "./images/sanctum.jpg";
  } else if (location.name === "cave") {
    sceneImage.src = "./images/cave.jpg";
  } else if (location.name === "fall") {
    sceneImage.src = "./images/fall.jpg";
  }

  if (location.name === "cave") {
    button1.onmouseover = () => {
      text.innerText = "Amon waits in silence — weaker, yet whispers regrets of the past.";
    };
    button2.onmouseover = () => {
      text.innerText = "Lilith stirs — fierce and unpredictable, a shadow of hidden hunger.";
    };
    button3.onmouseover = () => {
      text.innerText = "Retreat from the cave, and return to the Black Altar.";
    };
    const resetText = () => { text.innerText = location.text; };
    button1.onmouseout = resetText;
    button2.onmouseout = resetText;
    button3.onmouseout = resetText;
  } else {
    button1.onmouseover = null;
    button2.onmouseover = null;
    button3.onmouseover = null;
    button1.onmouseout = null;
    button2.onmouseout = null;
    button3.onmouseout = null;
  }
}

function returnToThreshold() {
  update(realms[0]);
}

function enterSanctum() {
  update(realms[1]);
}

function enterCave() {
  update(realms[2]);
}

function faceAmon() {
  facing = 0;
  beginBattle();
}

function faceLilith() {
  facing = 1;
  beginBattle();
}

function confrontDemon() {
  facing = 2;
  beginBattle();
}

function beginBattle() {
  update(realms[3]);
  shadowHealth = demons[facing].health;
  monsterStats.style.display = "block";
  monsterName.innerText = demons[facing].name;
  monsterHealthText.innerText = shadowHealth;
  sceneImage.src = `./images/${demons[facing].name.toLowerCase()}.jpg`;
}

function attack() {
  text.innerText = "The " + demons[facing].name + " attacks.";
  text.innerText += " You respond with your " + sigils[currentSigil].name + ".";
  health -= getDemonAttack(demons[facing].level);

  if (shadowHit()) {
    shadowHealth -= sigils[currentSigil].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Your sigil misses.";
  }

  healthText.innerText = health;
  monsterHealthText.innerText = shadowHealth;

  if (health <= 0) {
    fall();
  } else if (shadowHealth <= 0) {
    if (facing === 2) {
      text.innerText = "Asmodeus has been banished. You are victorious!";
    } else {
      defeat();
    }
  }

  if (Math.random() <= 0.1 && inventory.length > 1) {
    text.innerText += " Your " + inventory.pop() + " shatters.";
    currentSigil--;
  }
}

function getDemonAttack(level) {
  const hit = (level * 5) - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

function shadowHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the blow from " + demons[facing].name;
}

function defeat() {
  coins += Math.floor(demons[facing].level * 6.7);
  xp += demons[facing].level;
  goldText.innerText = coins;
  xpText.innerText = xp;
  update(realms[4]);
}

function fall() {
  update(realms[5]);
}

function restart() {
  xp = 0;
  health = 100;
  coins = 50;
  currentSigil = 0;
  inventory = ["Sigil of Sandalphon"];
  goldText.innerText = coins;
  healthText.innerText = health;
  xpText.innerText = xp;
  returnToThreshold();
}

function transmuteHealth() {
  if (coins >= 10) {
    coins -= 10;
    health += 10;
    goldText.innerText = coins;
    healthText.innerText = health;
  } else {
    text.innerText = "Not enough coins to transmute health.";
  }
}

function channelSigil() {
  if (currentSigil < sigils.length - 1) {
    if (coins >= 30) {
      coins -= 30;
      currentSigil++;
      goldText.innerText = coins;
      let newSigil = sigils[currentSigil].name;
      text.innerText = "You have channeled the " + newSigil + ".";
      inventory.push(newSigil);
      text.innerText += " Inventory: " + inventory;
    } else {
      text.innerText = "Not enough coins to channel a new sigil.";
    }
  } else {
    text.innerText = "You already hold the most powerful sigil.";
    button2.innerText = "Offer sigil for 15 coins";
    button2.onclick = offerSigil;
  }
}

function offerSigil() {
  if (inventory.length > 1) {
    coins += 15;
    goldText.innerText = coins;
    let offered = inventory.shift();
    text.innerText = "You offered the " + offered + " to the void.";
    text.innerText += " Inventory: " + inventory;
  } else {
    text.innerText = "You cannot part with your only sigil.";
  }
}

update(realms[0]);