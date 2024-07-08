const { get } = require("../routers/loadRouter");

const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();

const loadController = {
  ///Lấy môn học
  getCourseName: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT DISTINCT ?CourseID ?CourseName
            WHERE {
                ?Course rdf:type ont:Course.
                ?Course ont:hasID ?CourseID; ont:hasName ?CourseName.
            }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          CourseID: bindingObject.CourseID
            ? bindingObject.CourseID.value
            : undefined,
          CourseName: bindingObject.CourseName
            ? bindingObject.CourseName.value
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
  // getActivityByCourse: async (req, res) => {
  //   try {
  //     const store = req.app.locals.store;
  //     const { name } = req.body;
  //     console.log(req.body);
  //     const query = `
  //           PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
  //           SELECT DISTINCT ?hasName ?hasDescription
  //           WHERE {
  //               ?Course ont:hasName "${name}"^^xsd:string.
  //               ?Course ont:hasLearningGoal ?LearningGoal.
  //               ?LearningGoal ont:includes ?LearningOutcome.
  //               ?Topic ont:hasLearningOutcome ?LearningOutcome.
  //               ?LOAlignment ont:achieves ?LearningOutcome.
  //               ?LOAlignment ont:involves ?Activity.
  //               ?Activity ont:hasName ?hasName.
  //               ?Activity ont:hasDescription ?hasDescription.
  //           }`;
  //     const bindingsStream = await myEngine.queryBindings(query, {
  //       sources: [store],
  //     });
  //     const bindings = await bindingsStream.toArray();
  //     const formattedResults = bindings.map((binding) => {
  //       const bindingObject = Object.fromEntries(binding.entries);
  //       return {
  //         hasName: bindingObject.hasName
  //           ? bindingObject.hasName.value
  //           : undefined,
  //         hasDescription: bindingObject.hasDescription
  //           ? bindingObject.hasDescription.value
  //           : undefined,
  //       };
  //     });
  //     res.status(200).json(formattedResults);
  //   } catch (error) {
  //     console.error("Error: ", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // },

  //Lấy danh sách Topic thuộc Course
  getTopicByCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
      const query = `
            PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT DISTINCT ?TopicID (COALESCE(?Name, "") AS ?TopicName) ?TopicDescription
            WHERE {
              {
                BIND ("${name}" AS ?inputName)
                FILTER (?inputName = "")
                ?Topic rdf:type ont:Topic.
              }
              UNION
              {
                BIND ("${name}" AS ?inputName)
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
            : undefined,
          TopicDescription: bindingObject.TopicDescription
            ? bindingObject.TopicDescription.value
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
  getLearnerByGroupCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name,Group } = req.body;
      const query = `
        PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT DISTINCT ?LearnerID ?LearnerName ?LearnerSchoolYear
        WHERE {
          BIND ("${name}" AS ?inputCourseName)
          BIND ("${Group}" AS ?inputGroup)
          {
            FILTER (?inputCourseName = "" && ?inputGroup = "")
            ?Learner rdf:type ont:Learner.
          }
          UNION
          {
            FILTER (?inputCourseName != "" && ?inputGroup = "")
            ?Course ont:hasName ?inputCourseName.
            ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
            ?Learner ont:belongsTo ?Group.
          }
          UNION
          {
            FILTER (?inputCourseName = "" && ?inputGroup != "")
            ?Group ont:hasName ?inputGroup.
            ?Learner ont:belongsTo ?Group.
          }
          ?Learner ont:hasID ?LearnerID;ont:hasName ?LearnerName; ont:hasSchoolYear ?LearnerSchoolYear.
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
          LearnerSchoolYear: bindingObject.LearnerSchoolYear
            ? bindingObject.LearnerSchoolYear.value
            : undefined,
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
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT DISTINCT ?GroupID ?GroupName
        WHERE {
          BIND ("${name}" AS ?inputName)
          {
            
            FILTER (?inputName = "")
            ?Group rdf:type ont:Group.
          }
          UNION
          {
            
            FILTER (?inputName != "")
            ?Course ont:hasName ?inputName.
            ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
          }
          ?Group ont:hasID ?GroupID; ont:hasName ?GroupName.
        }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          GroupID: bindingObject.GroupID
            ? bindingObject.GroupID.value
            : undefined,
          GroupName: bindingObject.GroupName
            ? bindingObject.GroupName.value
            : undefined,
        };
      });
      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Lấy danh sách LearningOutcome
  getLearningOutcomeByCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
      const query = `
        PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT DISTINCT ?LearningOutcomeID ?LearningOutcomeName ?LearningOutcomeDescription
        BIND ("${name}" AS ?inputName)
          {
            
            FILTER (?inputName = "")
            ?LearningOutcome rdf:type ont:LearningOutcome.
          }
          UNION
          {
            FILTER (?inputName != "")
            ?Course ont:hasName ?inputName.
            ?Course ont:hasLearningGoal ?LearningGoal.
            ?LearningGoal ont:includes ?LearningOutcome.
          }

        }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          LearningOutcomeID: bindingObject.LearningOutcomeID
            ? bindingObject.LearningOutcomeID.value
            : undefined,
          LearningOutcomeName: bindingObject.LearningOutcomeName
            ? bindingObject.LearningOutcomeName.value
            : undefined,
          LearningOutcomeDescription: bindingObject.LearningOutcomeDescription
            ? bindingObject.LearningOutcomeDescription.value
            : undefined,
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
