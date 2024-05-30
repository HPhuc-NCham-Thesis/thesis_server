const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();

const loadController = {
    LoadCourseLO: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const query1 = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasCourseName 
            WHERE {
                ?Course ont:hasCourseName ?hasCourseName.
            }`;
            const bindingsStream1 = await myEngine.queryBindings(query1, {
                sources: [store],
              });
            const bindings1 = await bindingsStream1.toArray();
            const formattedResults1 = bindings1.map((binding1) => {
                const bindingObject = Object.fromEntries(binding1.entries);
                return {
                    hasCourseName: bindingObject.hasCourseName 
                        ? bindingObject.hasCourseName.value 
                        : undefined,
              };
            });
            const query = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasLearningOutcomeText
            WHERE {
                ?Learning_Outcome ont:hasLearningOutcomeText ?hasLearningOutcomeText.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasLearningOutcomeText: bindingObject.hasLearningOutcomeText 
                        ? bindingObject.hasLearningOutcomeText.value 
                        : undefined,
              };
            });
            const list =[formattedResults1, formattedResults];
            res.status(200).json(list);
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },
    LoadCourseName: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasCourseName 
            WHERE {
                ?Course ont:hasCourseName ?hasCourseName.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasCourseName: bindingObject.hasCourseName 
                        ? bindingObject.hasCourseName.value 
                        : undefined,
              };
            });
            res.status(200).json(formattedResults);
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }   
    },
    getTopicByCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const {name} = req.body;
            console.log(req.body);
            const query = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasTopicDescription
            WHERE {
                ?Course ont:hasCourseName "${name}"^^xsd:string.
                ?Course ont:contains ?Topic.
                ?Topic ont:hasTopicDescription ?hasTopicDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasTopicDescription: bindingObject.hasTopicDescription 
                        ? bindingObject.hasTopicDescription.value 
                        : undefined,
              };
            });
            res.status(200).json(formattedResults);
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }   
    },
    getActivityByCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const {name} = req.body;
            console.log(req.body);
            const query = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasActivityDescription
            WHERE {
                ?Course ont:hasCourseName "${name}"^^xsd:string.
                ?Course ont:contains ?Topic.
                ?Activity ont:relatedTo ?Topic.
                ?Activity ont:hasActivityDescription ?hasActivityDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasActivityDescription: bindingObject.hasActivityDescription 
                        ? bindingObject.hasActivityDescription.value 
                        : undefined,
              };
            });
            res.status(200).json(formattedResults);
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },
    loadLearnerByActivity: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const {Act} = req.body;
            console.log(req.body);
            const query = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasID
            WHERE {
                ?Activity ont:hasActivityDescription "${Act}"^^xsd:string.
                ?Course ont:contains ?Topic.
                ?Activity ont:relatedTo ?Topic.
                ?Activity ont:belongsTo ?Learner.
                ?Learner ont:hasID ?hasID.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasID: bindingObject.hasID 
                        ? bindingObject.hasID.value 
                        : undefined,
              };
            });
            res.status(200).json(formattedResults);
        }catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = loadController;
