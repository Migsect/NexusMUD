"use strict";

var baseSize = 6;

module.exports = [
{
  id: "eyeColor",
  type: "variation",
  name: "Eye Color",
  transforms: []
},
{
  id: "hairColor",
  type: "variation",
  name: "Hair Color",
  transforms: []
},
{
  id: "skinColor",
  type: "variation",
  name: "Skin Color",
  transforms: []
},
{
  id: "bodyType",
  type: "variation",
  name: "Body Type",
  transforms: []
},
{
  id: "height",
  type: "range",
  name: "Height",
  unit: "Feet",
  transforms: [
  {
    target: "agility",
    transform: function(value, source)
    {
      var height = source.stats.getStat(source, "height");
      return value * Math.pow(1.25, (baseSize / height) - 1);
    }
  },
  {
    target: "strength",
    transform: function(value, source)
    {
      var height = source.stats.getStat(source, "height");
      return value * Math.pow(1.25, (height / baseSize) - 1);
    }
  },
  {
    target: "stamina",
    transform: function(value, source)
    {
      var height = source.stats.getStat(source, "height");
      return value * Math.pow(1.05, (baseSize / height) - 1);
    }
  }]
}];
