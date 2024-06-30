const { get } = require("../routers/loadRouter");

const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();

const loadController = {
  ///Lấy tên môn học
  getCourseName: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT DISTINCT ?hasName 
            WHERE {
                ?Course rdf:type ont:Course.
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

  //Lấy danh sách hoạt động thuộc môn học
  getActivityByCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
      console.log(req.body);
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?hadID ?hasName ?hasDescription
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?LearningGoal ont:includes ?LearningOutcome.
                ?Topic ont:hasLearningOutcome ?LearningOutcome.
                ?LOAlignment ont:achieves ?LearningOutcome.
                ?LOAlignment ont:involves ?Activity.
                ?Activity ont:hasID ?hadID.
                ?Activity ont:hasName ?hasName.
                ?Activity ont:hasDescription ?hasDescription.
            }
            GROUP BY ?hadID ?hasName ?hasDescription`;
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
  //Lấy danh sách Topic
  getListTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT DISTINCT ?hasDescription
            WHERE {
                ?Topic rdf:type ont:Topic.
                ?Topic ont:hasDescription ?hasDescription.
            }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
            hasDescription: bindingObject.hasDescription
                ? bindingObject.hasDescription.value
                : undefined,
            };
      });
      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Lấy danh sách Level theo topic
    getLevelByTopic: async (req, res) => {
        try {
        const store = req.app.locals.store;
        const { Topic } = req.body;
        const query = `
                PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
                SELECT DISTINCT ?hasLevel
                WHERE {
                    ?Topic ont:hasDescription "${Topic}"^^xsd:string.
                    ?Topic ont:hasLearningOutcome ?LearningOutcome.
                    ?LearningOutcome ont:targets ?LearningLevel.
                    ?LearningLevel ont:hasName ?hasLevel.
                }`;
        const bindingsStream = await myEngine.queryBindings(query, {
            sources: [store],
        });
        const bindings = await bindingsStream.toArray();
        const formattedResults = bindings.map((binding) => {
            const bindingObject = Object.fromEntries(binding.entries);
            return {
            hasLevel: bindingObject.hasLevel
                ? bindingObject.hasLevel.value
                : undefined,
            };
        });
        res.status(200).json(formattedResults);
        } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: error.message });
        }
    },
  
  //Lấy danh sách Topic thuộc Course
  getTopicByCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?hasDescription
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Course ont:hasLearningGoal ?LearningGoal.
                ?LearningGoal ont:includes ?LearningOutcome.
                ?Topic ont:hasLearningOutcome ?LearningOutcome.
                ?Topic ont:hasDescription ?hasDescription.
            }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasDescription: bindingObject.hasDescription
            ? bindingObject.hasDescription.value
            : undefined,
        };
      });
      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Lấy danh sách Learner tham gia Course
  getLearnerByCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            SELECT DISTINCT ?hasID
            WHERE {
                ?Course ont:hasName "${name}"^^xsd:string.
                ?Enrollment ont:enrolls ?Course;
                            ont:relates ?Group.
                ?Learner ont:belongsTo ?Group.
                ?Learner ont:hasID ?hasID.
            }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
        };
      });
      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Lấy danh sách các group có tham gia course
  getGroupByCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
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
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
        };
      });
      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = loadController;
