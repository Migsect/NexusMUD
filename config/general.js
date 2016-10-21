"use strict";

module.exports = {
  database:
  {
    url: "mongodb://localhost/devtest"
  },
  sessions:
  {
    secret: "macro dogos",
    maxAge: 86400000
  },
  admin:
  {
    email: "radmin",
    username: "radmin",
    password: "radmin"
  },
  characterCreation:
  {
    maxAttributeChoices: 5,
    attributeChoiceMultiplier: 1.2,
    minimumLongNameLength: 6
  },
  stats:
  {
    attributeMidTier: 2,
    combatResources: [
    {
      id: "health",
      showBar: true
    },
    {
      id: "energy",
      showBar: true
    },
    {
      id: "willpower",
      showBar: true
    },
    {
      id: "mana",
      showBar: true
    }]
  }
};