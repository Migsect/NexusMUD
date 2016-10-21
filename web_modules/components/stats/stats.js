"use strict";

/* Used Modules */
var WebUtils = require("../../utils");

/* Templates */
var mainTemplate = require("./templates/stats.html");
var barTemplate = require("./templates/bar.html");
var attributeTemplate = require("./templates/attribute.html");

/* CSS styles */
require("./styles/stats.css");

var StatComponent = function(divId, socketHandler, client)
{
  var self = this;
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
    client:
    {
      value: client
    },
    cache:
    {
      value: null
    },
    bars:
    {
      /** @type {Map} Map of Id strings to the HTMLObject */
      value: new Map()
    },
    attributes:
    {
      /** @type {Map} Map of Id strings to the HTMLObject */
      value: new Map()
    }
  });

  /* Setting up the div element */
  self.view.appendChild(WebUtils.htmlToElement(mainTemplate()));

  /* Assigning components */
  Object.defineProperties(self,
  {
    barContainer:
    {
      value: self.view.querySelector(".stats-bars")
    },
    attributesContainer:
    {
      value: self.view.querySelector(".stats-attributes")
    }
  });

  self.socketHandler.sendCommand("stats",
    {
      request: "attributes"
    },
    function(data)
    {
      self.setAttribute(data);
    });
  // self.setAttribute(
  // {
  //   id: "test_id_0",
  //   name: "test_name_0",
  //   value: "test_value_0 ",
  //   hidden: false,

  //   children: [
  //   {
  //     id: "test_id_1",
  //     name: "test_name_1",
  //     value: "test_value_1",
  //     hidden: false,
  //     children: [
  //     {
  //       id: "test_id_3",
  //       name: "test_name_3",
  //       value: "test_value_3",
  //       hidden: true,
  //       children: []
  //     },
  //     {
  //       id: "test_id_4",
  //       name: "test_name_4",
  //       value: "test_value_4",
  //       hidden: true,
  //       children: []
  //     }]
  //   },
  //   {
  //     id: "test_id_2",
  //     name: "test_name_2",
  //     value: "test_value_2",
  //     hidden: false,
  //     children: [
  //     {
  //       id: "test_id_5",
  //       name: "test_name_5",
  //       value: "test_value_5",
  //       hidden: true,
  //       children: []
  //     },
  //     {
  //       id: "test_id_6",
  //       name: "test_name_6",
  //       value: "test_value_6",
  //       hidden: true,
  //       children: []
  //     }]
  //   }]
  // });

  /* Setting up the socket handler */
  socketHandler.addHandler("stats", function(data)
  {
    /* If its an array then we're going to loop it for receivings */
    if (Array.isArray(data))
    {
      data.forEach(function(element)
      {
        self.receiveUpdate(element);
      });
    }
    else
    {
      self.receiveUpdate(data);
    }
  });
};

Object.defineProperties(StatComponent.prototype,
{
  receiveUpdate:
  {
    value: function(updateData)
    {
      var self = this;
      if (updateData.type == "attributes")
      {
        self.setAttribute(updateData.content);
      }
      else if (updateData.type == "setbar")
      {

      }
      /* Otherwise do nothing, maybe throw an Error */
    }
  },
  setAttribute:
  {
    /**
     * Sets the attribute provided in the data.
     * The data expects to have an id and some other parameters for an attribut
     * such as the value and any children.
     * 
     * @param  {Object} attributeData The attribute's data
     * @param  {HTMLNode} parent The parent node of this attribute, null for the first time.
     *                           If this is defined then the element will be hidden.
     * @param  {Number} level The level at which the attribute will be displayed at.
     */
    value: function(attributeData, parent, level)
    {
      var self = this;
      level = level ? level : 0;

      var attributeElement = WebUtils.htmlToElement(attributeTemplate(
      {
        id: attributeData.id,
        name: attributeData.name,
        value: attributeData.value,
        color: attributeData.color ? attributeData.color : "#666666",
        children: attributeData.children ? attributeData.children.map(function(child)
        {
          return child.id;
        }).join(",") : "",
        level: 8 * level,
        hidden: typeof attributeData.hidden != "undefined" ? attributeData.hidden : typeof parent != "undefined"
      }));

      /* Adding the element to the attribute container */
      if (self.attributes.has(attributeData.id))
      {
        /* If the container already has an element, we need to replace it */
        self.attributesContainer.replaceChild(
          attributeElement,
          self.attributes.get(attributeData.id));
      }
      else if (parent)
      {
        self.attributesContainer.insertBefore(attributeElement, parent.nextSibling);
      }
      else
      {
        /* Otherwise we add it onto the end */
        self.attributesContainer.appendChild(attributeElement);
      }

      /* Regardless we need to set the map value to the new element value */
      self.attributes.set(attributeData.id, attributeElement);

      /* Adding the event listeners */
      attributeElement.addEventListener("click", function()
      {
        /* Retrieves all the children nodes */
        var getChildrenNodes = function(element)
        {
          return element.dataset.children.split(",").map(function(child)
          {
            return self.attributes.get(child);
          }).filter(function(child)
          {
            return !(typeof child == "undefined" || child === null);
          });
        };
        /* Recursively hides all children */
        var hideChildren = function(element)
        {
          var children = getChildrenNodes(element);
          children.forEach(function(child)
          {
            child.classList.add("hidden");
            hideChildren(child);
          });
        };
        /* Just shows the children */
        var showChildren = function(element)
        {
          var children = getChildrenNodes(element);
          children.forEach(function(child)
          {
            child.classList.remove("hidden");
          });
        };

        /* Calculting if we do show the children or not */
        if (getChildrenNodes(attributeElement).some(function(child)
          {
            return child.classList.contains("hidden");
          }))
        {
          showChildren(attributeElement);
        }
        else
        {
          hideChildren(attributeElement);
        }
      });

      /* If there are children we will now add them (but they are hidden by default */
      if (attributeData.children)
      {
        attributeData.children.forEach(function(childData)
        {
          self.setAttribute(childData, attributeElement, level + 1);
        });
      }

    }
  },
  setBar:
  {
    value: function(barData) {

    }
  }

});

module.exports = StatComponent;