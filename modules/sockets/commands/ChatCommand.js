"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Command = require("../Command");

var ChatCommand = function()
{
  Command.call(this, "chatcommand");
  var self = this;
  Object.defineProperties(self,
  {});
};

Util.inherit(Command, ChatCommand);
Object.defineProperties(ChatCommand.prototype,
{
  execute:
  {
    value: function(client, data)
    {

      /* Constructs a message aying the command was not found */
      var commandNotFound = function()
      {
        return ["Could not find the command '" + data.command.toLowerCase() + "'.",
          "Use '/help' for a list of commands."
        ];
      };
      var commandImproper = function()
      {
        return ["The command '" + data.command.toLowerCase() + "' was improperly executed.",
          "Use '/help " + data.command.toLowerCase() + "' for the command's usage."
        ];
      };

      var commands = require("./commands");
      var command = commands.get(data.command.toLowerCase());
      if (Util.isNull(command))
      {
        return commandNotFound();
      }
      var args = data.arguments;

      /* Executing the command and getting the result */
      var result = command.executeWithArray(client, args);
      /* If the result is null or less than 0 then it says the command doesn't exist */
      if (Util.isNull(result))
      {
        return commandNotFound();
      }
      else if (result < 0)
      {
        switch (result)
        {
          case -1:
            return commandNotFound();
          case -2:
            return commandImproper();
          default:
            return commandNotFound();
        }
      }
      return result;
    }
  }
});

module.exports = ChatCommand;
