/* global ChatMessage, Roll, game */

// Function to roll dice
export function rollDice(
  numDice,
  actor,
  label = "",
  difficulty = 0,
  useHunger,
  specialty,
  wound
) {

  function healthModifier(wound) {
    // pick health value from ordered key (see health.html for the order)
    switch (true) {
      case wound == "hurt":
        return -1
      case wound == "injured":
        return -1
      case wound == "wounded":
        return -2
      case wound == "mauled":
        return -2
      case wound == "crippled":
        return -5
      case wound == "incapacitated":
        return -10000000
      default:
        return 0
    }
  }
  let critSuccess = 0;
  let chanceDie = numDice + healthModifier(wound) <= 0
  let dice = chanceDie ? 1 : numDice + healthModifier(wound);
  let difficultyResult = ``;
  let specialSkillParam = 0
  if (specialty) {
    specialSkillParam = 2;
  }
  else {
    specialSkillParam = 1;
  }
  console.log(dice);

  let rollsSUM = new Roll((dice.toString()).concat("d10")).roll();
  let successes = rollsSUM.dice[0].results.reduce((acc, die) => (die.result === 10) ? acc += specialSkillParam : (die.result >= difficulty) ? acc += 1 : (die.result === 1) ? acc -= 1 : acc, 0);
  let addDiceRolls = 0;
  for (var key in rollsSUM.terms[0].results) {
    if (rollsSUM.terms[0].results[key].result === 10) {
      addDiceRolls += specialSkillParam;
      critSuccess += 1;
    }

  }
  while (addDiceRolls > 0) {
    let newAddRoll = new Roll("1d10").roll();
    rollsSUM.terms[0].results = rollsSUM.terms[0].results.concat(newAddRoll.terms[0].results)
    successes = successes + newAddRoll.dice[0].results.reduce((acc, die) => (die.result === 10) ? acc += specialSkillParam : (die.result >= difficulty) ? acc += 1 : acc, 0);
    if (newAddRoll.terms[0].results[0].result === 10) {
      addDiceRolls += specialSkillParam;
    }
    addDiceRolls -= 1;
  }


  if (difficulty !== 0) {
    difficultyResult = `( <span class="danger">${game.i18n.localize(
      "WoDA20.Fail"
    )}</span> )`;
    if (successes>0) {
      difficultyResult = `( <span class="success">${game.i18n.localize(
        "WoDA20.Success"
      )}</span> )`;
    }
    if (successes<0) {
      difficultyResult = `( <span class="botch">${game.i18n.localize(
        "Botch!!!"
      )}</span> )`;
    }
  }

  label = `<p class="roll-label capitalize">${label}</p>`;


  //if (!successes && difficulty > 0) {
  //label =
  //  label +
  //`<p class="roll-content result-bestial">${game.i18n.localize(
  //  "WoDA20.BestialFailure"
  //)}</p>`;
  //  }
  //if (!successes && difficulty === 0) {
  //label =
  //label +
  ///`<p class="roll-content result-bestial result-possible">${game.i18n.localize(
  //  "WoDA20.PossibleBestialFailure"
  //)}</p>`;
  //}
  if (chanceDie) {
    label = label +
      `<p class="roll-content result-bestial"> Chance die </p>`;
  }
  label = label + `<p class="roll-label result-success">Difficulty: ${difficulty}</p>`
  label =
    label +
    `<p class="roll-label result-success">${game.i18n.localize(
      "WoDA20.Successes"
    )}: ${successes} ${difficultyResult}</p>`;

  rollsSUM.terms[0].results.forEach((dice) => {
    label =
      label +
      `<img src="systems/woda20/assets/images/diceimg_${dice.result}.png" alt="Normal Fail" class="roll-img normal-dice" />`;
  });

  label = label + "<br>";

  rollsSUM.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    content: label,
  });
}

