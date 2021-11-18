/* global CONFIG, Handlebars, Hooks, Actors, ActorSheet, ChatMessage, Dialog, Items, ItemSheet, Macro, game, ui */

// Import Modules
import { preloadHandlebarsTemplates } from "./templates.js";
import { migrateWorld } from "./migration.js";
import { VampireActor } from "./actor/actor.js";
import { VampireItem } from "./item/item.js";
import { VampireItemSheet } from "./item/item-sheet.js";
import { VampireDie, VampireHungerDie } from "./dice/dice.js";
import { rollDice } from "./actor/roll-dice.js";
import { CoterieActorSheet } from "./actor/coterie-actor-sheet.js";
import { MortalActorSheet } from "./actor/mortal-actor-sheet.js";
import { GhoulActorSheet } from "./actor/ghoul-actor-sheet.js";
import { VampireActorSheet } from "./actor/vampire-actor-sheet.js";
import { WerewolfActorSheet } from "./actor/werewolf-actor-sheet.js";
import { MageActorSheet } from "./actor/mage-actor-sheet.js";

Hooks.once("init", async function () {
  console.log("Initializing Schrecknet...");

  game.settings.register("WoDA20", "worldVersion", {
    name: "world Version",
    hint: "Automatically upgrades data when the system.json is upgraded.",
    scope: "world",
    config: true,
    default: "1.5",
    type: String,
  });

  game.WoDA20 = {
    VampireActor,
    VampireItem,
    rollItemMacro,
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = VampireActor;
  CONFIG.Item.documentClass = VampireItem;
  CONFIG.Dice.terms.v = VampireDie;
  CONFIG.Dice.terms.h = VampireHungerDie;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("WoDA20", VampireActorSheet, {
    label: "Vampire Sheet",
    types: ["vampire", "character"],
    makeDefault: true,
  });
  Actors.registerSheet("WoDA20", WerewolfActorSheet, {
    label: "Werewolf Sheet",
    types: ["werewolf", "character"],
    makeDefault: true,
  });
  Actors.registerSheet("WoDA20", MageActorSheet, {
    label: "Mage Sheet",
    types: ["mage", "character"],
    makeDefault: true,
  });
  Actors.registerSheet("WoDA20", GhoulActorSheet, {
    label: "Ghoul Sheet",
    types: ["ghoul"],
    makeDefault: true,
  });
  Actors.registerSheet("WoDA20", MortalActorSheet, {
    label: "Mortal Sheet",
    types: ["mortal"],
    makeDefault: true,
  });
  Actors.registerSheet("WoDA20", CoterieActorSheet, {
    label: "Coterie Sheet",
    types: ["coterie"],
    makeDefault: true,
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("WoDA20", VampireItemSheet, {
    label: "Item Sheet",
    makeDefault: true,
  });

  preloadHandlebarsTemplates();

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper("concat", function () {
    let outStr = "";
    for (const arg in arguments) {
      if (typeof arguments[arg] !== "object") {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper("or", function (bool1, bool2) {
    return bool1 || bool2;
  });

  Handlebars.registerHelper("and", function (bool1, bool2) {
    return bool1 && bool2;
  });

  Handlebars.registerHelper("toLowerCase", function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper("toUpperCaseFirstLetter", function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('ge', function( a, b ){
    var next =  arguments[arguments.length-1];
    return (a >= b) ? next.fn(this) : next.inverse(this);
  });
  Handlebars.registerHelper('le', function( a, b ){
    var next =  arguments[arguments.length-1];
    console.log(a,b);
    console.log((a <= b)) 
    return (a <= b) ? next.fn(this) : next.inverse(this);
    
  });
  Handlebars.registerHelper("setVar", function(varName, varValue, options) {
    options.data.root[varName] = varValue;
  });
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  Handlebars.registerHelper("generateFeatureLabel", function (str) {
    return "WoDA20.".concat(capitalize(str));
  });

  Handlebars.registerHelper("generateSkillLabel", function (str) {
    return "WoDA20.".concat(
      str
        .split(" ")
        .flatMap((word) => capitalize(word))
        .join("")
    );
  });

  // TODO: there exist math helpers for handlebars
  Handlebars.registerHelper(
    "frenzy",
    function (willpowerMax, willpowerAgg, willpowerSup, humanity) {
      return (
        willpowerMax - willpowerAgg - willpowerSup + Math.floor(humanity / 3)
      );
    }
  );

  Handlebars.registerHelper(
    "willpower",
    function (willpowerMax, willpowerAgg, willpowerSup) {
      return willpowerMax - willpowerAgg - willpowerSup;
    }
  );

  // TODO: there exist math helpers for handlebars
  Handlebars.registerHelper("remorse", function (humanity) {
    return 10 - humanity;
  });

  Handlebars.registerHelper("numLoop", function (num, options) {
    let ret = "";

    for (let i = 0, j = num; i < j; i++) {
      ret = ret + options.fn(i);
    }

    return ret;
  });

  Handlebars.registerHelper("getDisciplineName", function (key, roll = false) {
    const disciplines = {
      abombwe: "WoDA20.Abombwe",
      abyss_mysticism: "WoDA20.AbyssMysticism",
      akhu: "WoDA20.Akhu",
      animalism: "WoDA20.Animalism",
      auspex: "WoDA20.Auspex",
      bardo: "WoDA20.Bardo",
      celerity: "WoDA20.Celerity",
      chimerstry: "WoDA20.Chimerstry",
      daimonion: "WoDA20.Daimonion",
      dark_thaumaturgy: "WoDA20.DarkThaumaturgy",
      dementation: "WoDA20.Dementation",
      dominate: "WoDA20.Dominate",
      duranki: "WoDA20.Duranki",
      flight: "WoDA20.Flight",
      fortitude: "WoDA20.Fortitude",
      koldunic_sorcery: "WoDA20.",
      melpominee: "WoDA20.KoldunicSorcery",
      mortis: "WoDA20.Mortis",
      mytherceria: "WoDA20.Mytherceria",
      necromancy: "WoDA20.Necromancy",
      obeah: "WoDA20.Obeah",
      obfuscate: "WoDA20.Obfuscate",
      obtenebration: "WoDA20.Obtenebration",
      ogham: "WoDA20.Ogham",
      potence: "WoDA20.Potence",
      presence: "WoDA20.Presence",
      protean: "WoDA20.Protean",
      quietus: "WoDA20.Quietus",
      sadhana: "WoDA20.Sadhana",
      sanguinus: "WoDA20.Sanguinus",
      sielanic_thaumaturgy: "WoDA20.SielanicThaumaturgy",
      sihr: "WoDA20.Sihr",
      spiritus: "WoDA20.Spiritus",
      temporis: "WoDA20.Temporis",
      thanatosis: "WoDA20.Thanatosis",
      thaumaturgy: "WoDA20.Thaumaturgy",
      valeren: "WoDA20.valeren",
      vicissitude: "WoDA20.vicissitude",
      voudoun_necromancy: "WoDA20.VoudounNecromancy",
      visceratika: "WoDA20.visceratika",
      wanga: "WoDA20.Wanga",
      
    };
    // if (roll) {
    //   // if (key === "rituals") {
    //   //   return disciplines.sorcery;
    //   // } else
    //   if (key === "ceremonies") {
    //     return disciplines.oblivion;
    //   }
    // }
    return disciplines[key];
  });
});

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createVampireMacro(data, slot));
});

Hooks.once("diceSoNiceReady", (dice3d) => {
  dice3d.addSystem({ id: "WoDA20", name: "WoDA20" }, true);
  dice3d.addDicePreset({
    type: "dv",
    labels: [
      "systems/wod20/assets/images/normal-fail-dsn.png",
      "systems/wod20/assets/images/normal-fail-dsn.png",
      "systems/wod20/assets/images/normal-fail-dsn.png",
      "systems/wod20/assets/images/normal-fail-dsn.png",
      "systems/wod20/assets/images/normal-fail-dsn.png",
      "systems/wod20/assets/images/normal-success-dsn.png",
      "systems/wod20/assets/images/normal-success-dsn.png",
      "systems/wod20/assets/images/normal-success-dsn.png",
      "systems/wod20/assets/images/normal-success-dsn.png",
      "systems/wod20/assets/images/normal-crit-dsn.png",
    ],
    colorset: "black",
    fontScale: 0.5,
    system: "WoDA20",
  });
  dice3d.addColorset(
    {
      name: "hunger",
      description: "V5 Hunger Dice",
      category: "V5",
      foreground: "#fff",
      background: "#450000",
      texture: "none",
      edge: "#450000",
      material: "plastic",
      font: "Arial Black",
      fontScale: {
        d6: 1.1,
        df: 2.5,
      },
    },
    "default"
  );
  dice3d.addDicePreset({
    type: "dh",
    labels: [
      "systems/wod20/assets/images/bestial-fail-dsn.png",
      "systems/wod20/assets/images/red-fail-dsn.png",
      "systems/wod20/assets/images/red-fail-dsn.png",
      "systems/wod20/assets/images/red-fail-dsn.png",
      "systems/wod20/assets/images/red-fail-dsn.png",
      "systems/wod20/assets/images/red-success-dsn.png",
      "systems/wod20/assets/images/red-success-dsn.png",
      "systems/wod20/assets/images/red-success-dsn.png",
      "systems/wod20/assets/images/red-success-dsn.png",
      "systems/wod20/assets/images/red-crit-dsn.png",
    ],
    colorset: "hunger",
    system: "WoDA20",
  });
});

/* -------------------------------------------- */
/*  Add willpower reroll                        */
/* -------------------------------------------- */

// Create context menu option on selection
// TODO: Add condition that it only shows up on willpower-able rolls
Hooks.on("getChatLogEntryContext", function (html, options) {
  options.push({
    name: game.i18n.localize("WoDA20.WillpowerReroll"),
    icon: '<i class="fas fa-redo"></i>',
    condition: (li) => {
      // Only show this context menu if the person is GM or author of the message
      const message = game.messages.get(li.attr("data-message-id"));

      return game.user.isGM || message.isAuthor;
    },
    callback: (li) => willpowerReroll(li),
  });
});

Hooks.once("ready", function () {
  migrateWorld();
});

async function willpowerReroll(roll) {
  const dice = roll.find(".normal-dice");
  const diceRolls = [];

  // Go through the message's dice and add them to the diceRolls array
  Object.keys(dice).forEach(function (i) {
    // This for some reason returns "prevObject" and "length"
    // Fixes will be attempted, but for now solved by just ensuring the index is a number
    if (i > -1) {
      diceRolls.push(`<div class="die">${dice[i].outerHTML}</div>`);
    }
  });

  // Create dialog for rerolling dice
  const template = `
    <form>
        <div class="window-content">
            <label><b>Select dice to reroll (Max 3)</b></label>
            <hr>
            <span class="dice-tooltip">
              <div class="dice-rolls willpowerReroll flexrow">
                ${diceRolls.reverse().join("")}
              </div>
            </span>
        </div>
    </form>`;

  let buttons = {};
  buttons = {
    draw: {
      icon: '<i class="fas fa-check"></i>',
      label: "Reroll",
      callback: (roll) => rerollDie(roll),
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel",
    },
  };

  new Dialog({
    title: "Willpower Reroll",
    content: template,
    buttons: buttons,
    render: function () {
      $(".willpowerReroll .die").on("click", dieSelect);
    },
    default: "draw",
  }).render(true);
}

// Handles selecting and de-selecting the die
function dieSelect() {
  // If the die isn't already selected and there aren't 3 already selected, add selected to the die
  if (
    !$(this).hasClass("selected") &&
    $(".willpowerReroll .selected").length < 3
  ) {
    $(this).addClass("selected");
  } else {
    $(this).removeClass("selected");
  }
}

// Handles rerolling the number of dice selected
// TODO: Make this function duplicate/replace the previous roll with the new results
// TODO: Make this function able to tick superficial willpower damage
// For now this works well enough as "roll three new dice"
function rerollDie(actor) {
  const diceSelected = $(".willpowerReroll .selected").length;

  // If there is at least 1 die selected and aren't any more than 3 die selected, reroll the total number of die and generate a new message.
  if (diceSelected > 0 && diceSelected < 4) {
    rollDice(diceSelected, actor, "Willpower Reroll", 0, false);
  }
}

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createVampireMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data))
    return ui.notifications.warn(
      "You can only create macro buttons for owned Items"
    );
  const item = data.data;

  // Create the macro command
  const command = `game.WoDA20.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "WoDA20.itemMacro": true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find((i) => i.name === itemName) : null;
  if (!item)
    return ui.notifications.warn(
      `Your controlled Actor does not have an item named ${itemName}`
    );

  // Trigger the item roll
  return item.roll();
}
