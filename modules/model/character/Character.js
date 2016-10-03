"use strict";

var uuid = require("node-uuid");

var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var dbUtils = require(process.cwd() + "/modules/DatabaseUtil");

var Util = require(process.cwd() + "/modules/Util");
var Attributes = require("./DataModels/Attributes");
var SpeciesSex = require("./DataModels/SpeciesSex");
var Descriptors = require("./DataModels/Descriptors");
var Name = require("./DataModels/Name");
var Location = require(process.cwd() + "/modules/location/Location");

/**
 * The character schema is represented by a character id and the character's data.
 * The character data can be anything ranging from their name to an attribute.*Because the character model may change,
 we make use of a conglomerated data attribute 
 * to store a character's varied data.
 */
var CharacterSchema = Schema(
{
  /** @type {UUID} The unique ID of the character that is allowed to be shown on the front end. */
  id:
  {
    type: String,
    required: true
  },
  /** @type {ObjectId.Account} The objectId of the account this character belongs to. */
  accountId:
  {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  /** @type {Name Schema} An object that stores name information about the character */
  name:
  {
    type: Name.schema,
    required: true
  },
  /** @type {Attributes Schema} An object that stores or calculates the attributes of a character */
  attributes:
  {
    type: Attributes.schema,
    required: true
  },
  /** @type {SpeciesSex Schema} An objet that stores the species-sex of the character */
  speciesSex:
  {
    type: SpeciesSex.schema,
    require: true
  },
  /** @type {Decriptors Schema} An object that stores all the descriptors of the character */
  descriptors:
  {
    type: Descriptors.schema,
    require: true
  },
  /** @type {String} A location path that depicts the location of the character. */
  locationPath:
  {
    type: String
  }
});

/* Defining listeners on the database */
/* Too complicated for now, going to instead do a check on each tick
 * If tick rates become too slow, we'll revert this back to the original
 * but that may wish to make a wrapper class around the data models when we do.
 */
// dbUtils.defineObserverPattern(CharacterSchema, "change");

/**
 * Retrieves the location object for the character.
 * This transforms the path into a location by using the location graph.
 * 
 * @return {Location} The location object the character is in.
 */
CharacterSchema.methods.getLocation = function()
{
  return Location.getLocation(this.locationPath);
};

/**
 * Attempts to retrieve data from the data maps of the character.
 * These data maps can be narrowed down using the type parameter.
 * The three types are "attribute", "descriptor", and "stat".
 *
 * It will search by an order of constraints on the data. As such it will
 * search through attributes, then descriptors, and then stats.  If nothing is
 * found it will return null.
 * 
 * @param  {String} key  The key to search for
 * @param  {String} type The data type to search in
 * @return {Object}      The data retrieved. This will be an object depicting the
 *                           source and the value retrieved.
 */
CharacterSchema.methods.getData = function(key, type)
{
  var searchAttributes = function()
  {
    /* TODO perfom a search */
  };
  var searchDescriptors = function()
  {
    /* TODO perfom a search */
  };
  var searchStats = function()
  {
    /* TODO perfom a search */
  };

  if (Util.isNull(type))
  {
    /* TODO perform a search on everything */
  }
  else
  {
    switch (type)
    {
      case "stat":
        return searchAttributes();
      case "descriptor":
        return searchDescriptors();
      case "attribute":
        return searchStats();
    }
    return null;
  }
};

/**
 * Gets attribute data of the player.  Attribute data will only return for valid
 * attribute types and if it is a valid type then it will generally return something.
 * The only case where it will not return anything (null) is when the key is not a 
 * valid attribute type.
 * 
 * @param  {String} key The attribute type
 * @return {Number}     The value of the attribute or null if the key was not an attribute
 */
CharacterSchema.methods.getAttributeData = function(key)
{
  var result = this.getData(key, "attribute");
  if (Util.isNull(result))
  {
    return null;
  }
  return result.value;
};
/**
 * Gets the stats data associated with the key.  If the data is not yet defined
 * either through a transform, proxy, or static then this will return null.
 * 
 * @param  {String} key The key of the stat to get
 * @return {Value}     The value of the stat
 */
CharacterSchema.methods.getStatData = function(key)
{
  var result = this.getData(key, "stat");
  if (Util.isNull(result))
  {
    return null;
  }
  return result.value;
};
/**
 * Retrieves the data for a descriptor. If the descriptor is not defined then this
 * will return null.
 * 
 * @param  {String} key The key for the descriptor.
 * @return {String|Number}     The value of the descriptor.
 */
CharacterSchema.methods.getDescriptorData = function(key)
{
  var result = this.getData(key, "descriptor");
  if (Util.isNull(result))
  {
    return null;
  }
  return result.value;
};

/**
 * Retrieves all the stat transformations fro the character's different data-holding
 * objects.  For example, species and descriptors.
 *
 * This will order the transforms in the order that they should occur.
 * 
 * @param  {String} key The stat to get the transforms for.
 * @return {Transform[]} A list of the transforms.
 */
CharacterSchema.methods.getStatTransforms = function(key) {

};

var Character = Mongoose.model("Character", CharacterSchema);

module.exports = {
  schema: CharacterSchema,
  /**
   * Creates a new character under the specified accout.
   *
   * @param  {Account} account The account that the character is being made under.
   * @param  {JSON} JSON An object literal to represent the character data to use.
   * @return {CharacterModel} The character model that was created.
   */
  createCharacter: function(account, JSON)
  {
    /* Generating information */
    var id = uuid.v4();
    /* Creating the actual model */
    var character = new Character(
    {
      id: id,
      accountId: account._id,
      name: Name.createLiteral(JSON.fullName, JSON.shortName),
      attributes: Attributes.createLiteral(),
      speciesSex: SpeciesSex.createLiteral(JSON.species, JSON.sex),
      descriptors: Descriptors.createLiteral()
    });
    /* Performing attribute, location, and descriptor adding */
    var species = character.speciesSex.speciesType;
    character.location = species.startingLocation;

    /* Saving the character */
    character.save(function(err, document)
    {
      if (err) return console.error(err);
      console.log("Saved Character to Database:", document);
    });
    /* Adding the character to an account */
    account.addCharacter(character);
    return character;
  },
  getCharacter: function(query) {

  },
  getChatacterByName: function(name) {

  },
  getCharacterById: function(id) {

  }
};
