"use strict";

const Logger = require(process.cwd() + "/modules/Logger");
const PluginManager = require(process.cwd() + "/modules/Plugins/PluginManager");

const templates = require(process.cwd() + "/templates/templates");

const pageTemplate = templates(process.cwd() + "/pages/creation/creation");
const tabTemplate = templates(process.cwd() + "/pages/creation/creation_tab");

const formTemplate = templates(process.cwd() + "/pages/creation/creation_form");

module.exports = function renderer()
{
    const tabs = PluginManager.creationSections.map((section) =>
    {
        return tabTemplate(
        {
            id: section.id,
            name: section.name
        });
    });

    const forms = PluginManager.creationSections.map((section, index) =>
    {
        return formTemplate(
        {
            name: section.name,
            id: section.id,
            body: section.form,
            hidden: index > 0
        });
    });

    return pageTemplate(
    {
        tabs: tabs.join(""),
        forms: forms.join("")
    });
};
