"use strict";

const Plugin = require(process.cwd() + "/modules/Plugins/Plugin");
const Classification = require("./modules/Classification");
const Aspect = require("./modules/ClassificationsAspect");

function compileDocumentation(classification, parentId = null) {
    const information = [];
    information.push({
        id: parentId ? parentId + "-" + classification.id : classification.id,
        body: classification.documentation,
        type: classification.type
    });
    classification.classifications.forEach((children) => {
        children.forEach((child) => {
            const childInformation = compileDocumentation(child, classification.id);
            Array.prototype.push.apply(information, childInformation);
        });
    });

    return information;
}

class ClassificationsPlugin extends Plugin {
    onLoad() {
        const config = this.getConfig();
        config.copyDefaults();
        config.load();

        this.classifications = Classification.parseClassifications(config.toArray());
    }

    getCreationForm() {
        const formTemplate = this.getCreationTemplate();

        const species = [];
        const races = [];
        const sexes = [];
        const information = [];

        this.classifications.list.forEach((classification) => {
            Array.prototype.push.apply(information, compileDocumentation(classification));
            species.push({
                name: classification.name,
                id: classification.id
            });
            classification.getChildren("sex").forEach((sexClassification) => {
                sexes.push({
                    name: sexClassification.name,
                    id: sexClassification.id,
                    parentId: sexClassification.parent.id
                });
            });
            classification.getChildren("race").forEach((raceClassification) => {
                races.push({
                    name: raceClassification.name,
                    id: raceClassification.id,
                    parentId: raceClassification.parent.id
                });
            });
        });
        return formTemplate({
            species: species,
            races: races,
            sexes: sexes,
            information: information
        });
    }

    get aspectConstructor() {
        return Aspect;
    }
}

module.exports = ClassificationsPlugin;
