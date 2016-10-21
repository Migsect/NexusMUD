"use strict";

module.exports = [
{
  name: "Might",
  id: "might",
  tag: "MIGHT",
  children: [],
  color: "#ff2600"
},
{
  name: "Tolerance",
  id: "tolerance",
  tag: "TOLER",
  children: [],
  color: "#ffa600",
  transforms: [
  {
    target: "health_max",
    transform: function(value, character)
    {
      return Math.ceil(100 * character.getStat("tolerance"));
    }
  }]
},
{
  name: "Strength",
  id: "strength",
  tag: "STRE",
  children: [
    "might",
    "tolerance"
  ],
  color: "#ff6600"
},
{
  name: "Dexterity",
  id: "dexterity",
  tag: "DEXTR",
  children: [],
  color: "#5ebb00"
},
{
  name: "Quickness",
  id: "quickness",
  tag: "QUICK",
  children: [],
  color: "#00bbbb",
  transforms: [
  {
    target: "energy_regen",
    transform: function(value, character)
    {
      return Math.ceil(character.getStat("quickness"));
    }
  }]
},
{
  name: "Agility",
  id: "agility",
  tag: "AGIL",
  children: [
    "quickness",
    "dexterity"
  ],
  color: "#00bb00"
},
{
  name: "Stamina",
  id: "stamina",
  tag: "STAMI",
  children: [],
  color: "#ffbf00",
  transforms: [
  {
    target: "health_regen",
    transform: function(value, character)
    {
      return Math.ceil(100 * character.getStat("stamina"));
    }
  }]
},
{
  name: "Focus",
  id: "focus",
  tag: "FOCUS",
  children: [],
  color: "#80ff00",
  transforms: [
  {
    target: "energy_max",
    transform: function(value, character)
    {
      return Math.ceil(100 * character.getStat("stamina"));
    }
  }]
},
{
  name: "Vitality",
  id: "vitality",
  tag: "VITA",
  children: [
    "stamina",
    "focus"
  ],
  color: "#ffff00"
},
{
  name: "Body",
  id: "body",
  tag: "BOD",
  children: [
    "strength",
    "agility",
    "vitality"
  ],
  color: "#53a336"
},
{
  name: "Intuition",
  id: "intuition",
  tag: "INTUI",
  children: [],
  color: "#9933ff",
  transforms: [
  {
    target: "energy_efficiency",
    transform: function(value, character)
    {
      return character.getStat("intuition") - 1;
    }
  }]
},
{
  name: "Processing",
  id: "processing",
  tag: "PROCE",
  children: [],
  color: "#33ffff"
},
{
  name: "Intelligence",
  id: "intelligence",
  tag: "INTE",
  children: [
    "processing",
    "intuition"
  ],
  color: "#3333ff"
},
{
  name: "Memory",
  id: "memory",
  tag: "MEMOR",
  children: [],
  color: "#5e00bb"
},
{
  name: "Instincts",
  id: "instincts",
  tag: "INSTI",
  children: [],
  color: "#bb005e",
  transforms: [
  {
    target: "health_efficiency",
    transform: function(value, character)
    {
      return character.getStat("instincts") - 1;
    }
  }]
},
{
  name: "Knowledge",
  id: "knowledge",
  tag: "KNOW",
  children: [
    "memory",
    "instincts"
  ],
  color: "#bb00bb"
},
{
  name: "Charm",
  id: "charm",
  tag: "CHARM",
  children: [],
  color: "ff4287"
},
{
  name: "Sociability",
  id: "sociability",
  tag: "SOCIA",
  children: [],
  color: "#ff7e42"
},
{
  name: "Charisma",
  id: "charisma",
  tag: "CHAR",
  children: [
    "sociability",
    "charm"
  ],
  color: "#ff4f42"
},
{
  name: "Mind",
  id: "mind",
  tag: "MIN",
  children: [
    "intelligence",
    "knowledge",
    "charisma"
  ],
  color: "#1c1c82"
},
{
  name: "Totality",
  id: "totality",
  tag: "TO",
  children: [
    "mind",
    "body"
  ],
  color: "#999999"
}];
