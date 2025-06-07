// Updated version of "Path of the Primordial Flame" with FCC battle logic integrated

let energy = 0;
let vitality = 100;
let soulCoins = 50;
let currentSigil = 0;
let facing;
let shadowVitality;
let inventory = ["rusted sigil"];

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
  { name: 'rusted sigil', power: 5 },
  { name: 'blood rune', power: 30 },
  { name: 'obsidian glyph', power: 50 },
  { name: 'primordial seal', power: 100 }
];

const shadows = [
  { name: "withered shadow", level: 2, health: 15 },
  { name: "lurking sorrow", level: 8, health: 60 },
  { name: "bound demon", level: 20, health: 300 }
];

const realms = [
  {
    name: "threshold",
    "button text": ["Enter the Inner Sanctum", "Face a Shadow", "Confront the Demon"],
    "button functions": [enterSanctum, faceShadow, confrontDemon],
    text: "You stand between realms. The Inner Sanctum calls, but your Shadows stir."
  },
  {
    name: "sanctum",
    "button text": ["Transmute 10 vitality (10 coins)", "Channel new Sigil (30 coins)", "Return to Threshold"],
    "button functions": [transmuteVitality, channelSigil, returnToThreshold],
    text: "You step into the Sanctum. A flickering brazier glows beside an obsidian altar."
  },
  {
    name: "confront",
    "button text": ["Attack", "Dodge", "Flee"],
    "button functions": [attack, dodge, returnToThreshold],
    text: "The presence of the entity thickens the air. Will you fight or flee?"
  },
  {
    name: "defeat",
    "button text": ["Return", "Return", "Return"],
    "button functions": [returnToThreshold, returnToThreshold, returnToThreshold],
    text: "The shadow dissipates into the void. You gain energy and coins."
  },
  {
    name: "fall",
    "button text": ["RETRY", "RETRY", "RETRY"],
    "button functions": [restart, restart, restart],
    text: "You fall into darkness."
  }
];

button1.onclick = enterSanctum;
button2.onclick = faceShadow;
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
}

function returnToThreshold() {
  update(realms[0]);
}

function enterSanctum() {
  update(realms[1]);
}

function faceShadow() {
  facing = 0;
  beginBattle();
}

function confrontDemon() {
  facing = 2;
  beginBattle();
}

function beginBattle() {
  update(realms[2]);
  shadowVitality = shadows[facing].health;
  monsterStats.style.display = "block";
  monsterName.innerText = shadows[facing].name;
  monsterHealthText.innerText = shadowVitality;
}

function attack() {
  text.innerText = "The " + shadows[facing].name + " lashes out.";
  text.innerText += " You counter with your " + sigils[currentSigil].name + ".";
  vitality -= getShadowAttack(shadows[facing].level);

  if (shadowHit()) {
    shadowVitality -= sigils[currentSigil].power + Math.floor(Math.random() * energy) + 1;
  } else {
    text.innerText += " Your sigil misses its mark.";
  }

  healthText.innerText = vitality;
  monsterHealthText.innerText = shadowVitality;

  if (vitality <= 0) {
    fall();
  } else if (shadowVitality <= 0) {
    if (facing === 2) {
      text.innerText = "The bound demon is vanquished. You are victorious.";
    } else {
      defeat();
    }
  }

  if (Math.random() <= 0.1 && inventory.length > 1) {
    text.innerText += " Your " + inventory.pop() + " shatters.";
    currentSigil--;
  }
}

function getShadowAttack(level) {
  const hit = (level * 5) - Math.floor(Math.random() * energy);
  return hit > 0 ? hit : 0;
}

function shadowHit() {
  return Math.random() > 0.2 || vitality < 20;
}

function dodge() {
  text.innerText = "You dodge the incoming blow from the " + shadows[facing].name;
}

function defeat() {
  soulCoins += Math.floor(shadows[facing].level * 6.7);
  energy += shadows[facing].level;
  goldText.innerText = soulCoins;
  xpText.innerText = energy;
  update(realms[3]);
}

function fall() {
  update(realms[4]);
}

function restart() {
  energy = 0;
  vitality = 100;
  soulCoins = 50;
  currentSigil = 0;
  inventory = ["rusted sigil"];
  goldText.innerText = soulCoins;
  healthText.innerText = vitality;
  xpText.innerText = energy;
  returnToThreshold();
}

function transmuteVitality() {
  if (soulCoins >= 10) {
    soulCoins -= 10;
    vitality += 10;
    goldText.innerText = soulCoins;
    healthText.innerText = vitality;
  } else {
    text.innerText = "You lack the soul coins to transmute vitality.";
  }
}

function channelSigil() {
  if (currentSigil < sigils.length - 1) {
    if (soulCoins >= 30) {
      soulCoins -= 30;
      currentSigil++;
      goldText.innerText = soulCoins;
      let newSigil = sigils[currentSigil].name;
      text.innerText = "You have channeled the " + newSigil + ".";
      inventory.push(newSigil);
      text.innerText += " Inventory: " + inventory;
    } else {
      text.innerText = "Not enough soul coins to channel a new sigil.";
    }
  } else {
    text.innerText = "You already hold the most powerful sigil.";
    button2.innerText = "Offer sigil for 15 coins";
    button2.onclick = offerSigil;
  }
}

function offerSigil() {
  if (inventory.length > 1) {
    soulCoins += 15;
    goldText.innerText = soulCoins;
    let offered = inventory.shift();
    text.innerText = "You offered the " + offered + " to the void.";
    text.innerText += " Inventory: " + inventory;
  } else {
    text.innerText = "You cannot part with your only sigil.";
  }
}
