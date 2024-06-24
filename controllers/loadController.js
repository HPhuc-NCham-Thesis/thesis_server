const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();

const loadController = {
    LoadTopicLO: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const query1 = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasTopicDescription 
            WHERE {
                ?Topic ont:hasTopicDescription ?hasTopicDescription.
            }`;
            const bindingsStream1 = await myEngine.queryBindings(query1, {
                sources: [store],
              });
            const bindings1 = await bindingsStream1.toArray();
            const formattedResults1 = bindings1.map((binding1) => {
                const bindingObject = Object.fromEntries(binding1.entries);
                return {
                    hasTopicDescription: bindingObject.hasTopicDescription 
                        ? bindingObject.hasTopicDescription.value 
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
///Lấy tên môn học
    LoadCourseName: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?hasName 
            WHERE {
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?Course ont:hasName ?hasName.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasName: bindingObject.hasName 
                        ? bindingObject.hasName.value 
                        : undefined,
              };
            });
            res.status(200).json(formattedResults);
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }   
    },
//
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
//Lấy danh sách hoạt động thuộc môn học
    getActivityByCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const {name} = req.body;
            console.log(req.body);
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?hadID ?hasName
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?LearningGoal ont:includes ?LearningOutcome.
                ?Topic ont:hasLearningOutcome ?LearningOutcome.
                ?LOAlignment ont:achieves ?LearningOutcome.
                ?LOAlignment ont:involves ?Activity.
                ?Activity ont:hasID ?hadID.
                ?Activity ont:hasName ?hasName.
            }
            GROUP BY ?hadID ?hasName`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
              });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    hasName: bindingObject.hasName 
                        ? bindingObject.hasName.value 
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
    },
    loadLearnerByCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const {name} = req.body;
            console.log(req.body);
            const query = `
            PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
            SELECT DISTINCT ?hasID
            WHERE {
                ?Course ont:hasCourseName "${name}"^^xsd:string.
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
    },
//Lấy danh sách các group có tham gia course
getGroupByCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const {name} = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?hasID
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Enrollment ont:enrolls ?Course;
                            ont:relates ?Group.
                ?Group ont:hasID ?hasID.
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
    },
};

module.exports = loadController;
