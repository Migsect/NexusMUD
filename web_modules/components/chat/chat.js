"use strict";

var Utils = require("../../utils");

var mainTemplate = require("./templates/chat.html");
var historyItemTemplate = require("./templates/history-item.html");

require("./styles/chat.css");

/**
 * Creates a chat object to be used by the user to send messages to the server.
 * Needs a div to reside in as well as a socket to send its messages through.
 * 
 * @param {String} divId  The div to construct the chat component in.
 * @param {Socket} socket The socket that will be used to send messages over.
 * @param {Integer} historyMax The maximum number of history items to keep.
 */
var Chat = function(divId, socketHandler, historyMax)
{
  var self = this;
  /* Defining the main properties */
  Object.defineProperties(self,
  {
    view:
    {
      value: document.getElementById(divId)
    },
    socketHandler:
    {
      value: socketHandler
    },
    historyMax:
    {
      value: historyMax
    },
    messages:
    {
      value: []
    },
    messageNumber:
    {
      writable: true,
      value: 0
    }
  });

  /* Setting up the div element */
  self.view.appendChild(Utils.htmlToElement(mainTemplate()));

  Object.defineProperties(self,
  {
    content:
    {
      value: self.view.querySelector(".chat-content")
    },
    history:
    {
      value: self.view.querySelector(".chat-history")
    },
    inputContent:
    {
      value: self.view.querySelector(".chat-input-text")
    },
    inputButton:
    {
      value: self.view.querySelector(".chat-input-button")
    }
  });

  /* Setting up the listener for the inputButton */
  self.inputButton.addEventListener("click", function()
  {
    self.sendMessage();
  });

  /* Setting up key listener for the inputContent */
  self.inputContent.addEventListener("keydown", function(event)
  {
    if (event.keyCode == 13)
    {
      self.sendMessage();
      event.preventDefault();
    }
  });

  /* Setting up this to receive a message from the "chat" update */
  socketHandler.addHandler("chat", function(data)
  {
    self.receiveMessage(data);
  });

};

Object.defineProperties(Chat.prototype,
{
  sendMessage:
  {
    /**
     * Sends a message.
     * @param  {[type]} message The message object to send. Does not need all info.
     */
    value: function()
    {
      var self = this;

      var content = this.inputContent.value;
      this.inputContent.value = "";

      if (content.trim().length <= 0)
      {
        return;
      }

      /* Checking to see if the content is a chat command*/
      if (content.startsWith("/"))
      {
        var splitCommand = content.substr(1).split(/ /);
        var command = splitCommand[0];
        var args = splitCommand.slice(1);

        this.socketHandler.sendCommand("chatcommand",
        {
          command: command,
          arguments: args
        }, function(results)
        {
          self.addMessage(
          {
            source: "Server",
            content: results,
            hideSource: true
          }, true);
        });
      }
      else
      {
        this.socketHandler.sendCommand("chat",
        {
          content: content
        });
      }
    }
  },
  receiveMessage:
  {
    /**
     * Receives a message and renders it in the chat history.
     * Also can be used to perform other stuff.
     * 
     * @param  {[type]} message A message object received from the server.
     */
    value: function(message)
    {
      this.addMessage(message);
    }
  },
  removeMessage:
  {
    /**
     * Removes the specified message from the message list.
     * This removes both the element in the DOM as well as removes it from
     * the memory.
     * 
     * @param  {Integer} number The number-id of the message to remove.
     */
    value: function(number)
    {
      var element = self.view.querySelector("#history-item-" + number);
    }
  },
  addMessage:
  {
    /**
     * Adds a message to the chat history.
     * This will also add a "messageCount" variable to the message. This will be
     * an identifier for the message when it is in the history.
     *
     * @param {Object} message The message to add to the history
     * @param {Boolean} dirty This means to add to the history an element that 
     *                        won't be cleaned of html. This will default to false.
     *                        This is useful for some commands that want HTML formatting.
     */
    value: function(message, dirty)
    {
      /* Setting the messages number before adding it to the list and then incrementing it */
      message.number = this.messageNumber++;
      /* Adding the message to the list */
      this.messages.push(message);

      var setupContent = function(content)
      {
        if (dirty)
        {
          return content.replace(/([^\s-]{5})([^\s-]{5})/g, "$1&shy;$2");
        }
        return Utils.escapeHTML(content).replace(/([^\s-]{5})([^\s-]{5})/g, "$1&shy;$2");
      };

      /* If the element is an array, we need to setup each element and then join with newlines*/
      var content = message.content.constructor === Array ? content = message.content.map(function(element)
      {
        return setupContent(element);
      }).join("<br>") : setupContent(message.content);

      /* Creating the html node */
      var historyItemNode = Utils.htmlToElement(historyItemTemplate(
      {
        hideSource: typeof message.hideSource == "undefined" ? false : message.hideSource,
        isSelf: typeof message.isSelf == "undefined" ? false : message.isSelf,
        source: message.source,
        content: content,
        number: message.number
      }));

      /* Adding the history item to the history */
      this.history.appendChild(historyItemNode);

      /* Automatically scrolling the view to the new element when a message is added */
      this.content.scrollTop = this.content.scrollHeight;
    }
  }
});

module.exports = Chat;
