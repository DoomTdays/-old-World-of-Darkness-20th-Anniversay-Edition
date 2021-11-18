/* global DEFAULT_TOKEN, ActorSheet, game, mergeObject, duplicate, renderTemplate, ChatMessage */

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class CoterieActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["woda20", "sheet", "actor", "coterie"],
      template: "systems/woda20/templates/actor/coterie-sheet.html",
      width: 800,
      height: 700,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "features",
        },
      ],
    });
  }

  constructor(actor, options) {
    super(actor, options);
    this.locked = true;
    this.isCharacter = false;
  }

  /** @override */
  get template() {
    if (!game.user.isGM && this.actor.limited)
      return "systems/woda20/templates/actor/limited-sheet.html";
    return "systems/woda20/templates/actor/coterie-sheet.html";
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.locked = this.locked;
    data.isCharacter = this.isCharacter;
    data.sheetType = `${game.i18n.localize("WoDA20.Coterie")}`;

    data.dtypes = ["String", "Number", "Boolean"];

    // Prepare items.
    if (this.actor.data.type === "coterie") {
      this._prepareItems(data);
    }

    return data;
  }

  /**
   * Organize and classify Disciplines for Vampire & Ghoul sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(sheetData) {
    const actorData = sheetData.actor;

    const backgrounds = {
      mybackground: []
    };
    const othertraits = {
      myothertrait: []
    };

    for (const i of sheetData.items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === "othertrait") {
        // Append to other trait.
        othertraits["myothertrait"].push(i)
      } else if (i.type === "background") {
        // Append to background.
        backgrounds["mybackground"].push(i)
      }
    }
  
    actorData.othertraits = othertraits;
    actorData.backgrounds = backgrounds;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    this._setupDotCounters(html);
    html.find(".generationLocked").click(this._onLockGeneration.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // lock button
    html.find(".lock-btn").click(this._onToggleLocked.bind(this));

    // ressource dots
    html
      .find(".resource-value > .resource-value-step")
      .click(this._onDotCounterChange.bind(this));
    html
      .find(".resource-value > .resource-value-empty")
      .click(this._onDotCounterEmpty.bind(this));

    // Add Inventory Item
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Send Inventory Item to Chat
    html.find(".item-chat").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      renderTemplate(
        "systems/woda20/templates/actor/parts/chat-message.html",
        {
          name: item.data.name,
          img: item.data.img,
          description: item.data.data.description,
        }
      ).then((html) => {
        ChatMessage.create({
          content: html,
        });
      });
    });

    // Update Inventory Item
    html.find(".item-edit").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find(".item-delete").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Collapsible Features and Powers
    const coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.parentElement.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  }

  _setupDotCounters(html) {
    html.find(".resource-value").each(function () {
      const value = Number(this.dataset.value);
      $(this)
        .find(".resource-value-step")
        .each(function (i) {
          if (i + 1 <= value) {
            $(this).addClass("active");
          }
        });
    });
    html.find(".resource-value-static").each(function () {
      const value = Number(this.dataset.value);
      $(this)
        .find(".resource-value-static-step")
        .each(function (i) {
          if (i + 1 <= value) {
            $(this).addClass("active");
          }
        });
    });
  }

  _onToggleLocked(event) {
    event.preventDefault();
    this.locked = !this.locked;
    this._render();
  }

  _onLockGeneration(event) {
    event.preventDefault();
    const actorData = duplicate(this.actor);
    console.log("KURWA");
    actorData.data.headers.generationLocked=!actorData.data.headers.generationLocked;
    this.actor.update(actorData);
    console.log("Poniżej");
    console.log(this.actor.data);
    this._render();

  }

  _onDotCounterChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const index = Number(dataset.index);
    const parent = $(element.parentNode);
    const fieldStrings = parent[0].dataset.name;
    const fields = fieldStrings.split(".");
    const steps = parent.find(".resource-value-step");

    if (this.locked && !parent.has(".hunger-value").length) return;

    if (index < 0 || index > steps.length) {
      return;
    }

    steps.removeClass("active");
    steps.each(function (i) {
      if (i <= index) {
        $(this).addClass("active");
      }
    });
    this._assignToActorField(fields, index + 1);
  }

  _onDotCounterEmpty(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const parent = $(element.parentNode);
    const fieldStrings = parent[0].dataset.name;
    const fields = fieldStrings.split(".");
    const steps = parent.find(".resource-value-empty");

    if (this.locked && !parent.has(".hunger-value").length) return;

    steps.removeClass("active");
    this._assignToActorField(fields, 0);
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @protected
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    if (type === "specialty") {
      data.skill = "academics";
    }
    if (type === "boon") {
      data.boontype = "Trivial";
    }
    if (type === "merit") {
      data.merittype = "";
      data.meritcost = "0";
    }
    if (type === "flaw") {
      data.flawtype = "";
      data.flawbonus = "0";
    }
    if (type === "derangement") {
      data.derangementtype = "0";
    }
    if (type === "bloodbond") {
      data.bloodbondrating = "0";
    }
    if (type === "weapon") {
      data.type = "";
      data.diff = "0";
      data.damage = "0";
      data.range = "0";
      data.rate = "0";
      data.clip = "0";
      data.conceal = "0";
    }
    if (type === "gear") {
      data.geartype = "-";
    }
    if (type === "equipment") {
      data.equipmenttype = "personal";
      data.equipmentlocation = "unknown";
    }
    if (type === "feedingground") {
      data.feedinggroundlocation = "unknown";
    }
    if (type === "fetish") {
      data.fetishelevel = "0";
      data.fetishegnosis = "0";
    }
    if (type === "vehicle") {
      data.vehicletype = "unknown";
      data.vehiclemaneuver = "0";
      data.vehiclesafespeed = "0 kph";
      data.vehiclemaxspeed = "0 kph";
    }
    if (type === "customRoll") {
      data.dice1 = "strength";
      data.dice2 = "athletics";
    }
    // Initialize a default name.
    const name = this.getItemDefaultName(type, data);
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data.type;

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  getItemDefaultName(type, data) {
    if (type === "feature") {
      return `${game.i18n.localize("WoDA20." + data.featuretype.capitalize())}`;
    }
    return `${game.i18n.localize("WoDA20." + type.capitalize())}`;
  }

  // There's gotta be a better way to do this but for the life of me I can't figure it out
  _assignToActorField(fields, value) {
    const actorData = duplicate(this.actor);
    // update actor owned items
    if (fields.length === 2 && fields[0] === "items") {
      for (const i of actorData.items) {
        if (fields[1] === i._id) {
          i.data.points = value;
          break;
        }
      }
    } else {
      const lastField = fields.pop();
      fields.reduce((data, field) => data[field], actorData)[lastField] = value;
    }
    this.actor.update(actorData);
  }
}
