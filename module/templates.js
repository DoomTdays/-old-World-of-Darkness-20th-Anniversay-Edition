/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  console.log("Schrecknet : loading subroutines");
  // Define template paths to load
  const templatePaths = [
    // Actor Sheet Partials
    "systems/woda20/templates/actor/parts/profile-img.html",
    "systems/woda20/templates/actor/parts/exp.html",
    "systems/woda20/templates/actor/parts/health.html",
    "systems/woda20/templates/actor/parts/willpower.html",
    "systems/woda20/templates/actor/parts/stats.html",
    "systems/woda20/templates/actor/parts/vampire-bloodpool.html",
    "systems/woda20/templates/actor/parts/vampire-disciplines.html",
    "systems/woda20/templates/actor/parts/vampire-features.html",
    "systems/woda20/templates/actor/parts/vampire-possessions.html",
    "systems/woda20/templates/actor/parts/vampire-biography.html",
    "systems/woda20/templates/actor/parts/ghoul-biography.html",
    "systems/woda20/templates/actor/parts/werewolf-gnosis.html",
    "systems/woda20/templates/actor/parts/werewolf-rage.html",
    "systems/woda20/templates/actor/parts/werewolf-gifts.html",
    "systems/woda20/templates/actor/parts/werewolf-features.html",
    "systems/woda20/templates/actor/parts/werewolf-possessions.html",
    "systems/woda20/templates/actor/parts/werewolf-biography.html",
    "systems/woda20/templates/actor/parts/mage-arete.html",
    "systems/woda20/templates/actor/parts/mage-magic.html",
    "systems/woda20/templates/actor/parts/mage-features.html",
    "systems/woda20/templates/actor/parts/mage-possessions.html",
    "systems/woda20/templates/actor/parts/mage-biography.html",

    // Item Sheet Partials
    "systems/woda20/templates/item/parts/attributes.html",
    "systems/woda20/templates/item/parts/skills.html",
    "systems/woda20/templates/item/parts/disciplines.html",
  ];

  /* Load the template parts
     That function is part of foundry, not founding it here is normal
  */
  return loadTemplates(templatePaths); // eslint-disable-line no-undef
};
