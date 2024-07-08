const { get } = require("../routers/LARouter");

const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();
const KRController = {
    //Course Reasonning
    //Default 
    getCourseInfoDefault: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?LearningGoalName ?LearningGoalDescription ?LearningOutcomeName ?LearningOutcomeDescription ?LearningLevelName ?LearningLevelDescription 
            WHERE {
            ?Course ont:hasName "${name}"^^xsd:string.
            ?Course ont:hasLearningGoal ?LearningGoal.
            ?LearningGoal ont:includes ?LearningOutcome.
            ?Topic ont:hasLearningOutcome ?LearningOutcome.
            ?LearningOutcome ont:targets ?LearningLevel.
            ?LearningGoal ont:hasName ?LearningGoalName; ont:hasDescription ?LearningGoalDescription.
            ?LearningOutcome ont:hasName ?LearningOutcomeName; ont:hasDescription ?LearningOutcomeDescription.
            ?LearningLevel ont:hasName ?LearningLevelName; ont:hasDescription ?LearningLevelDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    LearningGoalName: bindingObject.LearningGoalName
                        ? bindingObject.LearningGoalName.value
                        : undefined,
                    LearningGoalDescription: bindingObject.LearningGoalDescription
                        ? bindingObject.LearningGoalDescription.value
                        : undefined,
                    LearningOutcomeName: bindingObject.LearningOutcomeName
                        ? bindingObject.LearningOutcomeName.value
                        : undefined,
                    LearningOutcomeDescription: bindingObject.LearningOutcomeDescription
                        ? bindingObject.LearningOutcomeDescription.value
                        : undefined,
                    LearningLevelName: bindingObject.LearningLevelName
                        ? bindingObject.LearningLevelName.value
                        : undefined,
                    LearningLevelDescription: bindingObject.LearningLevelDescription
                        ? bindingObject.LearningLevelDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //LearningGoal
    getLearningGoalOfCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?LearningGoalName ?LearningGoalDescription 
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?LearningGoal ont:hasName ?LearningGoalName; ont:hasDescription ?LearningGoalDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    LearningGoalName: bindingObject.LearningGoalName
                        ? bindingObject.LearningGoalName.value
                        : undefined,
                    LearningGoalDescription: bindingObject.LearningGoalDescription
                        ? bindingObject.LearningGoalDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //LearningOutcome
    getLearningOutcomeOfCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?LearningOutcomeName ?LearningOutcomeDescription 
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?LearningGoal ont:includes ?LearningOutcome.
                ?LearningOutcome ont:hasName ?LearningOutcomeName; ont:hasDescription ?LearningOutcomeDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    LearningOutcomeName: bindingObject.LearningOutcomeName
                        ? bindingObject.LearningOutcomeName.value
                        : undefined,
                    LearningOutcomeDescription: bindingObject.LearningOutcomeDescription
                        ? bindingObject.LearningOutcomeDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //Topic
    getTopicOfCourse: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?TopicID (COALESCE(?Name, "") AS ?TopicName) ?TopicDescription
            WHERE {
            BIND ("${name}" AS ?inputName)
            {
                FILTER (?inputName = "")
                ?Topic rdf:type ont:Topic.
            }
            UNION
            {
                FILTER (?inputName != "")
                ?Course ont:hasName ?inputName.
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?LearningGoal ont:includes ?LearningOutcome.
                ?Topic ont:hasLearningOutcome ?LearningOutcome.
            }  
            ?Topic ont:hasID ?TopicID; ont:hasDescription ?TopicDescription.
            OPTIONAL { ?Topic ont:hasName ?Name. }
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    TopicID: bindingObject.TopicID
                        ? bindingObject.TopicID.value
                        : undefined,
                    TopicName: bindingObject.TopicName
                        ? bindingObject.TopicName.value
                        : null,
                    TopicDescription: bindingObject.TopicDescription
                        ? bindingObject.TopicDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //TopicReasoning
    //Default
    getTopicInfoDefault: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name, Topic } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?LearningOutcomeName ?LearningOutcomeDescription 
            WHERE {
                BIND ("${name}" AS ?inputName)
                ?Topic ont:hasDescription "${Topic}"^^xsd:string.
                {
                    FILTER (?inputName = "")
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                }
                UNION
                {
                    FILTER (?inputName != "")
                    ?Course ont:hasName ?inputName.
                    ?Course ont:hasLearningGoal ?LearningGoal.
                    ?LearningGoal ont:includes ?LearningOutcome.
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                }
                ?LearningOutcome ont:hasName ?LearningOutcomeName; ont:hasDescription ?LearningOutcomeDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    LearningOutcomeName: bindingObject.LearningOutcomeName
                        ? bindingObject.LearningOutcomeName.value
                        : undefined,
                    LearningOutcomeDescription: bindingObject.LearningOutcomeDescription
                        ? bindingObject.LearningOutcomeDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //Activity
    getActivityOfTopic: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name, Topic } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?ActivityName ?ActivityDescription
            WHERE {
                BIND ("${name}" AS ?inputName)
                ?Topic ont:hasDescription "${Topic}"^^xsd:string.
                {
                    FILTER (?inputName = "")
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                    ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
                }
                UNION
                {
                    FILTER (?inputName != "")
                    ?Course ont:hasName ?inputName.
                    ?Course ont:hasLearningGoal ?LearningGoal.
                    ?LearningGoal ont:includes ?LearningOutcome.
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                    ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
                }
                ?Activity ont:hasName ?ActivityName;ont:hasType ?ActivityType; ont:hasDescription ?ActivityDescription.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    ActivityName: bindingObject.ActivityName
                        ? bindingObject.ActivityName.value
                        : null,
                    ActivityDescription: bindingObject.ActivityDescription
                        ? bindingObject.ActivityDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //GroupReasoning
    //Learner
    getLearnerOfGroup: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name, Group } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?LearnerID ?LearnerName
            WHERE {
                BIND ("${name}" AS ?inputName)
                ?Group ont:hasID "${Group}"^^xsd:string.
                {
                    FILTER (?inputName = "")
                    ?Learner ont:belongsTo ?Group.
                }
                UNION
                {
                    FILTER (?inputName != "")
                    ?Course ont:hasName ?inputName.
                    ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
                    ?Learner ont:belongsTo ?Group.
                }
                ?Learner ont:hasID ?LearnerID; ont:hasName ?LearnerName.
                }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    LearnerID: bindingObject.LearnerID
                        ? bindingObject.LearnerID.value
                        : undefined,
                    LearnerName: bindingObject.LearnerName
                        ? bindingObject.LearnerName.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },

    //Learner Reasoning
    //Default
    getLearnerInfoDefault: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name, Group, Learner } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?AssessmentID ?AssessmentResult
            WHERE {
                BIND ("${name}" AS ?inputName)
                BIND ("${Group}" AS ?inputGroup)
                ?Learner ont:hasID "${Learner}"^^xsd:string.
                {
                    FILTER (?inputName = "" && ?inputGroup = "")
                    ?Assessment ont:evaluates ?Learner.
                }
                UNION
                {
                    FILTER (?inputName != "" && ?inputGroup = "")
                    ?Course ont:hasName ?inputName.
                    ?Group ont:hasID ?inputGroup.
                    ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
                    ?Learner ont:belongsTo ?Group.
                    ?Assessment ont:evaluates ?Learner.
                }
                ?Assessment ont:hasID ?AssessmentID; ont:hasValue ?AssessmentResult.
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    AssessmentID: bindingObject.AssessmentID
                        ? bindingObject.AssessmentID.value
                        : undefined,
                    AssessmentResult: bindingObject.AssessmentResult
                        ? bindingObject.AssessmentResult.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },
    
    //LearningOutcome
    //Default
    getLearningOutcomeInfoDefault: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name, LearningOutcome } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?LearningGoalID ?LearningGoalName ?LearningGoalDescription ?LearningLevelID ?LearningLevelName ?LearningLevelDescription ?LearningLevelType 
            WHERE {
                BIND ("${name}" AS ?inputName)
                ?LearningOutcome ont:hasName "${LearningOutcome}"^^xsd:string.

                {
                    FILTER (?inputName = "")
                    ?LearningOutcome ont:targets ?LearningLevel.
                    ?LearningGoal ont:includes ?LearningOutcome.
                    ?LearningOutcome ont:targets ?LearningLevel.
                }
                UNION
                {
                    FILTER (?inputName != "")
                    ?Course ont:hasName ?inputName.
                    ?Course ont:hasLearningGoal ?LearningGoal.
                    ?LearningGoal ont:includes ?LearningOutcome.
                    ?LearningOutcome ont:targets ?LearningLevel.
                }
                ?LearningGoal ont:hasID ?LearningGoalID; ont:hasName ?LearningGoalName; ont:hasDescription ?LearningGoalDescription.
                ?LearningLevel ont:hasID ?LearningLevelID; ont:hasName ?LearningLevelName; ont:hasDescription ?LearningLevelDescription; ont:hasType ?LearningLevelType.
            
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    LearningGoalID: bindingObject.LearningGoalID
                        ? bindingObject.LearningGoalID.value
                        : undefined,
                    LearningGoalName: bindingObject.LearningGoalName
                        ? bindingObject.LearningGoalName.value
                        : undefined,
                    LearningGoalDescription: bindingObject.LearningGoalDescription
                        ? bindingObject.LearningGoalDescription.value
                        : undefined,
                    LearningLevelID: bindingObject.LearningLevelID
                        ? bindingObject.LearningLevelID.value
                        : undefined,
                    LearningLevelName: bindingObject.LearningLevelName
                        ? bindingObject.LearningLevelName.value
                        : undefined,
                    LearningLevelDescription: bindingObject.LearningLevelDescription
                        ? bindingObject.LearningLevelDescription.value
                        : undefined,
                    LearningLevelType: bindingObject.LearningLevelType
                        ? bindingObject.LearningLevelType.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },
    getTopicOfLearningOutcome: async (req, res) => {
        try {
            const store = req.app.locals.store;
            const { name, LearningOutcome } = req.body;
            const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?TopicID (COALESCE(?Name, "") AS ?TopicName) ?TopicDescription
            WHERE {
                BIND ("${name}" AS ?inputName)
                ?LearningOutcome ont:hasName "${LearningOutcome}"^^xsd:string.

                {
                    FILTER (?inputName = "")
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                }
                UNION
                {
                    FILTER (?inputName != "")
                    ?Course ont:hasName ?inputName.
                    ?Course ont:hasLearningGoal ?LearningGoal.
                    ?LearningGoal ont:includes ?LearningOutcome.
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                }
                ?Topic ont:hasID ?TopicID; ont:hasDescription ?TopicDescription.
                OPTIONAL { ?Topic ont:hasName ?Name. }
            }`;
            const bindingsStream = await myEngine.queryBindings(query, {
                sources: [store],
            });
            const bindings = await bindingsStream.toArray();
            const formattedResults = bindings.map((binding) => {
                const bindingObject = Object.fromEntries(binding.entries);
                return {
                    TopicID: bindingObject.TopicID
                        ? bindingObject.TopicID.value
                        : undefined,
                    TopicName: bindingObject.TopicName
                        ? bindingObject.TopicName.value
                        : null,
                    TopicDescription: bindingObject.TopicDescription
                        ? bindingObject.TopicDescription.value
                        : undefined,
                };
            });
            res.status(200).json({
                message: "Truy vấn đã được thực thi",
                results: formattedResults,
            });
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: error.message });
        }
    },
};
module.exports = KRController;
