const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();
const KRController = {
  //1. Tìm kiếm các môn học (Course) giúp đạt được một chuẩn đầu ra (LO) nhất định cho một kỹ năng/kiến thức (Topic) nhất định.
  // (không có subTopic)
  getCourseAchieveLOOfTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { Topic, Level } = req.body;
      if (!Topic || !Level) {
        return res.status(400).json({ message: "Topic và Level là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
      SELECT DISTINCT ?hasID ?hasName
      WHERE {
        ?Topic ont:hasDescription "${Topic}"^^xsd:string.
        ?LearningLevel ont:hasName "${Level}"^^xsd:string.
        ?Course ont:hasLearningGoal ?LearningGoal.
        ?LearningGoal ont:includes ?LearningOutcome.
        ?Topic ont:hasLearningOutcome ?LearningOutcome.
        ?LearningOutcome ont:targets ?LearningLevel.
        ?Course ont:hasID ?hasID.
        ?Course ont:hasName ?hasName.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
          hasName: bindingObject.hasName
            ? bindingObject.hasName.value
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

  //2. Tìm kiếm các chuẩn đầu ra (LO) cho một môn học nhất định?
  getLOAndTopicForCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "name là bắt buộc" });
      }
      const query = `
  PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
  SELECT ?hasName ?hasDescription
  WHERE {
    ?Course ont:hasName "${name}"^^xsd:string.
    ?Course ont:hasLearningGoal ?LearningGoal.
    ?LearningGoal ont:includes ?LearningOutcome.
    ?Topic ont:hasLearningOutcome ?LearningOutcome.
    ?LearningOutcome ont:hasName ?hasName.
    ?Topic ont:hasDescription ?hasDescription.
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
          hasDescription: bindingObject.hasDescription
            ? bindingObject.hasDescription.value
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

  //3. Tìm kiếm mức độ cần đạt được cho 1 topic trong một môn học?
  getLevelNeedAchieveForTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic } = req.body;
      if (!name || !Topic) {
        return res.status(400).json({ message: "name và Topic là bắt buộc" });
      }
      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT ?hasName ?hasType ?hasDescription
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Topic ont:hasDescription "${Topic}"^^xsd:string.
      ?Course ont:hasLearningGoal ?LearningGoal.
      ?LearningGoal ont:includes ?LearningOutcome.
      ?Topic ont:hasLearningOutcome ?LearningOutcome.
      ?LearningOutcome ont:targets ?hasLearningLevel.
      ?LearningLevel ont:hasName ?hasName.
      ?LearningLevel ont:hasType ?hasType.
      ?LearningLevel ont:hasDescription ?hasDescription.
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
          hasType: bindingObject.hasType
            ? bindingObject.hasType.value
            : undefined,
          hasDescription: bindingObject.hasDescription
            ? bindingObject.hasDescription.value
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

  //4. Tìm kiếm các Activity cần thực hiện để đạt được chuẩn đầu ra cho một topic.
  getActivityNeedAchieveLOOfTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic, Level } = req.body;
      if (!name || !Topic || !Level) {
        return res
          .status(400)
          .json({ message: "name, Topic và Level là bắt buộc" });
      }
      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT ?hasType (GROUP_CONCAT(DISTINCT ?hasDescription; separator=", ") AS ?Descriptions)
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Topic ont:hasDescription "${Topic}"^^xsd:string.
      ?LearningLevel ont:hasName "${Level}"^^xsd:string.
      ?Course ont:hasLearningGoal ?LearningGoal.
      ?LearningGoal ont:includes ?LearningOutcome.
      ?Topic ont:hasLearningOutcome ?LearningOutcome.
      ?LearningOutcome ont:targets ?LearningLevel.
      ?LOAlignment ont:achieves ?LearningOutcome; 
                  ont:involves ?Activity.
      ?Activity ont:hasType ?hasType.
      ?Activity ont:hasDescription ?hasDescription.
    }
    GROUP BY ?hasType
    `;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasType: bindingObject.hasType
            ? bindingObject.hasType.value
            : undefined,
          Descriptions: bindingObject.Descriptions
            ? bindingObject.Descriptions.value
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

  //5. Ứng với một Activity, cho biết sinh viên có thể đạt được chuẩn đầu ra cho các topic nào
  getLearnerAchievesLOAndTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, activity } = req.body;
      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT DISTINCT ?hasDescription ?hasName
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Activity ont:hasDescription "${activity}"^^xsd:string.
      ?Course ont:hasLearningGoal ?LearningGoal.
      ?LearningGoal ont:includes ?LearningOutcome.
      ?LearningOutcomr ont:targets ?LearningLevel.
      ?Topic ont:hasLearningOutcome ?LearningOutcome.
      ?LOAlignment ont:achieves ?LearningOutcome.
      ?LOAlignment ont:involves ?Activity.
      ?Topic ont:hasDescription ?hasDescription.
      ?LearningLevel ont:hasName ?hasName.
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
          hasName: bindingObject.hasName
            ? bindingObject.hasName.value
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

  //6. Cho biết ứng với mỗi Activity, thông tin assessement cho 1 sinh viên cụ thể?
  getAssessmentForLearner: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, activity, id } = req.body;
      if (!name || !activity || !id) {
        return res
          .status(400)
          .json({ message: "name, activity và id là bắt buộc" });
      }
      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT DISTINCT ?hasValue ?hasName ?hasLVName
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Activity ont:hasDescription "${activity}"^^xsd:string.
      ?Learner ont:hasID "${id}"^^xsd:string.
      ?Course ont:hasLearningGoal ?LearningGoal.
      ?LearningGoal ont:includes ?LearningOutcome.
      ?LearningOutcome ont:targets ?LearningLevel.
      ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
      ?Assessment ont:belongsWith ?Activity; ont:evaluates ?Learner.
      ?Assessment ont:hasValue ?hasValue.
      ?LearningOutcome ont:hasName ?hasName.
      ?LearningLevel ont:hasName ?hasLVName.
    }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasValue: bindingObject.hasValue
            ? bindingObject.hasValue.value
            : undefined,
          hasName: bindingObject.hasName
            ? bindingObject.hasName.value
            : undefined,
          hasLVName: bindingObject.hasLVName
            ? bindingObject.hasLVName.value
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

  //7. Cho biết sinh viên đã đạt được các chuẩn đầu ra nào trong một môn học.
  getLOLearnerAchievesInCourse: async (req, res) => { 
    try {
      const store = req.app.locals.store;
      const { name, id } = req.body;
      if (!name || !id) {
        return res.status(400).json({ message: "name và id là bắt buộc" });
      }
      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT DISTINCT ?hasTopicDescription ?hasDescription ?hasLVName
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Learner ont:hasID "${id}"^^xsd:string.
      ?Course ont:hasLearningGoal ?LearningGoal.
      ?LearningGoal ont:includes ?LearningOutcome.
      ?Topic ont:hasLearningOutcome ?LearningOutcome.
      ?LearningOutcome ont:targets ?LearningLevel.
      ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
      ?Assessment ont:belongsWith ?Activity; ont:evaluates ?Learner.
      ?Assessment ont:hasValue ?hasValue.
      ?Activity ont:hasID ?hasID.
      ?LearningOutcome ont:hasDescription ?hasDescription.
      ?LearningLevel ont:hasName ?hasLVName.
      ?Topic ont:hasDescription ?hasTopicDescription.
      FILTER(?hasValue >= 5)
    }
    ORDER BY ?hasTopicDescription ?hasDescription ?hasLVName`;
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
          hasDescription: bindingObject.hasDescription
            ? bindingObject.hasDescription.value
            : undefined,
          hasLVName: bindingObject.hasLVName
            ? bindingObject.hasLVName.value
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

  //8. Cho biết một một đầu ra ứng với 1 topic, sinh viên nào đã đạt.
  getLearnerAchievesLOOfTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic, Level } = req.body;
      if (!name || !Topic|| !Level) {
        return res.status(400).json({ message: "name, Topic và Level là bắt buộc" });
      }
      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT DISTINCT ?hasLearnerID ?LearnerName
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Topic ont:hasDescription "${Topic}"^^xsd:string.
      ?LearningLevel ont:hasName "${Level}"^^xsd:string.
      ?Course ont:hasLearningGoal ?LearningGoal.
      ?LearningGoal ont:includes ?LearningOutcome.
      ?Topic ont:hasLearningOutcome ?LearningOutcome.
      ?LearningOutcome ont:targets ?LearningLevel.
      ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
      ?Assessment ont:belongsWith ?Activity; ont:evaluates ?Learner.
      ?Assessment ont:hasValue ?hasValue.
      ?Activity ont:hasID ?hasID.
      ?Learner ont:hasID ?hasLearnerID; ont:hasName ?LearnerName.
      FILTER regex(?hasID, "^10006\\\\.T[0-9]{3}$")
      FILTER(?hasValue >= 5)
    }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasLearnerID: bindingObject.hasLearnerID
            ? bindingObject.hasLearnerID.value
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
};

module.exports = KRController;
