/* global game */

export function getBloodPotencyValues (level) {
  const BLOOD_POTENCY_VALUES = [
    {
      surge: 1,
      mend: 1,
      power: 0,
      rouse: 0,
      bane: 0
    },
    {
      surge: 2,
      mend: 1,
      power: 0,
      rouse: 1,
      bane: 2
    },
    {
      surge: 2,
      mend: 2,
      power: 1,
      rouse: 1,
      bane: 2
    },
    {
      surge: 3,
      mend: 2,
      power: 1,
      rouse: 2,
      bane: 3
    },
    {
      surge: 3,
      mend: 3,
      power: 2,
      rouse: 2,
      bane: 3
    },
    {
      surge: 4,
      mend: 3,
      power: 2,
      rouse: 3,
      bane: 4
    },
    {
      surge: 4,
      mend: 3,
      power: 3,
      rouse: 3,
      bane: 4
    },
    {
      surge: 5,
      mend: 3,
      power: 3,
      rouse: 4,
      bane: 5
    },
    {
      surge: 5,
      mend: 4,
      power: 4,
      rouse: 4,
      bane: 5
    },
    {
      surge: 6,
      mend: 4,
      power: 4,
      rouse: 5,
      bane: 6
    },
    {
      surge: 6,
      mend: 5,
      power: 5,
      rouse: 5,
      bane: 6
    }
  ]
  return BLOOD_POTENCY_VALUES[level]
}

export function getBloodPotencyText (level) {
  // TODO : Some of this could be deducted from previous array.
  const BLOOD_POTENCY_TEXT = [
    {
      surge: game.i18n.localize('WoDA20.Add1Dice'),
      mend: game.i18n.localize('WoDA20.1SuperficialDamage'),
      power: game.i18n.localize('WoDA20.None'),
      rouse: game.i18n.localize('WoDA20.None'),
      bane: '0',
      feeding: game.i18n.localize('WoDA20.NoEffect')
    },
    {
      surge: game.i18n.localize('WoDA20.Add2Dice'),
      mend: game.i18n.localize('WoDA20.1SuperficialDamage'),
      power: game.i18n.localize('WoDA20.None'),
      rouse: game.i18n.localize('WoDA20.Level1'),
      bane: '2',
      feeding: game.i18n.localize('WoDA20.NoEffect')
    },
    {
      surge: game.i18n.localize('WoDA20.Add2Dice'),
      mend: game.i18n.localize('WoDA20.2SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add1Dice'),
      rouse: game.i18n.localize('WoDA20.Level1'),
      bane: '2',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty1')
    },
    {
      surge: game.i18n.localize('WoDA20.Add3Dice'),
      mend: game.i18n.localize('WoDA20.2SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add1Dice'),
      rouse: game.i18n.localize('WoDA20.Level2'),
      bane: '3',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty2')
    },
    {
      surge: game.i18n.localize('WoDA20.Add3Dice'),
      mend: game.i18n.localize('WoDA20.3SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add2Dice'),
      rouse: game.i18n.localize('WoDA20.Level2'),
      bane: '3',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty3')
    },
    {
      surge: game.i18n.localize('WoDA20.Add4Dice'),
      mend: game.i18n.localize('WoDA20.3SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add2Dice'),
      rouse: game.i18n.localize('WoDA20.Level3'),
      bane: '4',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty4')
    },
    {
      surge: game.i18n.localize('WoDA20.Add4Dice'),
      mend: game.i18n.localize('WoDA20.3SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add3Dice'),
      rouse: game.i18n.localize('WoDA20.Level3'),
      bane: '4',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty5')
    },
    {
      surge: game.i18n.localize('WoDA20.Add5Dice'),
      mend: game.i18n.localize('WoDA20.3SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add3Dice'),
      rouse: game.i18n.localize('WoDA20.Level4'),
      bane: '5',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty5')
    },
    {
      surge: game.i18n.localize('WoDA20.Add5Dice'),
      mend: game.i18n.localize('WoDA20.4SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add4Dice'),
      rouse: game.i18n.localize('WoDA20.Level4'),
      bane: '5',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty6')
    },
    {
      surge: game.i18n.localize('WoDA20.Add6Dice'),
      mend: game.i18n.localize('WoDA20.4SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add4Dice'),
      rouse: game.i18n.localize('WoDA20.Level5'),
      bane: '6',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty6')
    },
    {
      surge: game.i18n.localize('WoDA20.Add6Dice'),
      mend: game.i18n.localize('WoDA20.5SuperficialDamage'),
      power: game.i18n.localize('WoDA20.Add5Dice'),
      rouse: game.i18n.localize('WoDA20.Level5'),
      bane: '6',
      feeding: game.i18n.localize('WoDA20.FeedingPenalty7')
    }
  ]

  return BLOOD_POTENCY_TEXT[level]
}
