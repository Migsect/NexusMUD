"use strict";

var SocketHandler = function(socket)
{
  var self = this;
  Object.defineProperties(self,
  {
    socket:
    {
      value: socket
    },
    updateHandlers:
    {
      value: new Map()
    }
  });

  /* Setting up all the message receivers */
  socket.on("update", function(message)
  {
    self.onUpdate(message);
  });
};

Object.defineProperties(SocketHandler.prototype,
{
  sendCommand:
  {
    /**
     * Sends a command to the server to execute.
     * Commands are generally initiated by the user.
     * 
     * @param  {String}   command  The command name.
     * @param  {Object}   data     A JSON object that holds data to be used in the command.
     * @param  {Function} callback A callback function for the command's result.
     *                             The callback contains a status code (HTTP) and a result body.
     */
    value: function(command, data, callback)
    {
      this.socket.emit("command",
      {
        command: command,
        data: data
      }, callback ? callback : null);
    }
  },
  addHandler:
  {
    value: function(updateType, callback)
    {
      if (!this.updateHandlers.has(updateType))
      {
        this.updateHandlers.set(updateType, []);
      }
      var handlerList = this.updateHandlers.get(updateType);
      handlerList.push(callback);
    }
  },
  onUpdate:
  {
    value: function(updateEvent)
    {
      /* Checking to see if the update has a type (needs to have a type) */
      if (!this.updateHandlers.has(updateEvent.type))
      {
        return;
      }
      /* Getting and looping throw all the handlers */
      var handlers = this.updateHandlers.get(updateEvent.type);
      handlers.forEach(function(handler)
      {
        /* Passing all the handlers the data sent with the update */
        handler(updateEvent.data);
      });
    }
  },
  register:
  {
    value: function(characterId)
    {

      /* Registering a new client */
      this.socket.emit("register", characterId);
    }
  }
});

module.exports = SocketHandler;