const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();
const rdfController = {
  Learner: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic, LO } = req.body;
      console.log(req.body);

      if (!name || !Topic || !LO) {
        return res
          .status(400)
          .json({ message: "CourseName, Topic, và LO là bắt buộc" });
      }

      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT DISTINCT ?hasID ?hasLearnerFullname ?hasActivityItemResult
      WHERE {
        ?Course ont:hasID "${name}"^^xsd:string.
        ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
        ?Learning_Outcome ont:hasLearningOutcomeText "${LO}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Topic ont:hasLearningOutcome ?Learning_Outcome.
        ?Activity ont:relatedTo ?Topic.
        ?Activity ont:belongsTo ?Learner.
        ?Activity ont:hasSubItem ?Activity_Item.
        ?Learner ont:hasID ?hasID.
        ?Learner ont:hasLearnerFullname ?hasLearnerFullname.
        ?Activity_Item ont:hasActivityItemResult ?hasActivityItemResult.
        FILTER (?hasActivityItemResult >= 5)
      }`;

      // Thực thi truy vấn SPARQL
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });

      // Consume results as an array (easier)
      const bindings = await bindingsStream.toArray();

      // Print out the raw bindings array with actual data
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
          hasLearnerFullname: bindingObject.hasLearnerFullname
            ? bindingObject.hasLearnerFullname.value
            : undefined,
          hasActivityItemResult: bindingObject.hasActivityItemResult
            ? bindingObject.hasActivityItemResult.value
            : undefined,
        };
      });
      console.log(formattedResults);

      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  Learning_Outcome: async (req, res) => {
    try {
      const store = req.app.locals.store; // Truy cập store từ req.app.locals
      const { name, Topic, LO } = req.body;
      if (!name || !Topic || !LO) {
        return res
          .status(400)
          .json({ message: "CourseName, Topic, và LO là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasActivityType ?hasActivityDescription
      WHERE {
          ?Course ont:hasCourseName "${name}"^^xsd:string.
          ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
          ?Learning_Outcome ont:hasLearningOutcomeText "${LO}"^^xsd:string.
          ?Course ont:contains ?Topic.
          ?Activity ont:relatedTo ?Topic.
          ?Activity ont:aimsToAchieve ?Learning_Outcome.
          ?Activity ont:hasActivityType ?hasActivityType.
          ?Activity ont:hasActivityDescription ?hasActivityDescription.
      }`;

      // Thực thi truy vấn SPARQL
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });

      // Consume results as an array (easier)
      const bindings = await bindingsStream.toArray();
      console.log(bindings.map((binding) => Array.from(binding.entries)));

      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasActivityType: bindingObject.hasActivityType
            ? bindingObject.hasActivityType.value
            : undefined,
          hasActivityDescription: bindingObject.hasActivityDescription
            ? bindingObject.hasActivityDescription.value
            : undefined,
        };
      });
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  LearningOutcome_Topic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, idsv } = req.body;
      if (!name || !idsv) {
        return res.status(400).json({ message: "id và idsv là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT DISTINCT ?hasTopicDescription ?hasLearningOutcomeText ?hasActivityItemResult
      WHERE {
        ?Course ont:hasCourseName "${name}"^^xsd:string.
        ?Learner ont:hasID "${idsv}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Topic ont:hasLearningOutcome ?Learning_Outcome.
        ?Activity ont:relatedTo ?Topic.
        ?Activity ont:belongsTo ?Learner.
        ?Activity ont:hasSubItem ?Activity_Item.
        ?Topic ont:hasTopicDescription ?hasTopicDescription.
        ?Learning_Outcome ont:hasLearningOutcomeText ?hasLearningOutcomeText.
        ?Activity_Item ont:hasActivityItemResult ?hasActivityItemResult.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      console.log(bindings.map((binding) => Array.from(binding.entries)));
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasTopicDescription: bindingObject.hasTopicDescription
            ? bindingObject.hasTopicDescription.value
            : undefined,
          hasLearningOutcomeText: bindingObject.hasLearningOutcomeText
            ? bindingObject.hasLearningOutcomeText.value
            : undefined,
          hasActivityItemResult: bindingObject.hasActivityItemResult
            ? bindingObject.hasActivityItemResult.value
            : undefined,
        };
      });
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  ActivityResult: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Act, idsv } = req.body;
      console.log(req.body);
      if (!id || !ActID || !idsv) {
        return res
          .status(400)
          .json({ message: "id, ActID và idsv là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasActivityDescription ?hasID ?hasActivityItemDescription ?hasActivityItemResult
      WHERE {
        ?Course ont:hasCourseName "${name}"^^xsd:string.
        ?Activity ont:hasActivityDescription "${Act}"^^xsd:string.
        ?Learner ont:hasID "${idsv}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Activity ont:relatedTo ?Topic.
        ?Activity ont:hasSubItem ?Activity_Item.
        ?Activity ont:belongsTo ?Learner.
        ?Activity ont:hasActivityDescription ?hasActivityDescription.
        ?Activity_Item ont:hasID ?hasID.
        ?Activity_Item ont:hasActivityItemDescription ?hasActivityItemDescription.
        ?Activity_Item ont:hasActivityItemResult ?hasActivityItemResult.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      console.log(bindings.map((binding) => Array.from(binding.entries)));
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasActivityDescription: bindingObject.hasActivityDescription
            ? bindingObject.hasActivityDescription.value
            : undefined,
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
          hasActivityItemDescription: bindingObject.hasActivityItemDescription
            ? bindingObject.hasActivityItemDescription.value
            : undefined,
          hasActivityItemResult: bindingObject.hasActivityItemResult
            ? bindingObject.hasActivityItemResult.value
            : undefined,
        };
      });
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  ////////////////////////////
  Topic_LearningOutcome: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, activity } = req.body;
      const query = `
      PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
      SELECT ?hasDescription ?hasName
      WHERE {
        ?Course ont:hasName "${name}"^^xsd:string.
        ?Activity ont:hasName "${activity}"^^xsd:string.
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
  Level_LearningOutcome: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic } = req.body;
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT DISTINCT ?hasID ?hasLearningOutcomeText
      WHERE {
        ?Course ont:hasCourseName "${name}"^^xsd:string.
        ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Topic ont:hasLearningOutcome ?Learning_Outcome.
        ?Learning_Outcome ont:hasID ?hasID.
        ?Learning_Outcome ont:hasLearningOutcomeText ?hasLearningOutcomeText.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
          hasLearningOutcomeText: bindingObject.hasLearningOutcomeText
            ? bindingObject.hasLearningOutcomeText.value
            : undefined,
        };
      });
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  // đang lỗi
  SubTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic } = req.body;
      if (!name || !Topic) {
        return res.status(400).json({ message: "name,Topic là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasTopicDescription
      WHERE {
        ?Course ont:hasCourseName "${name}"^^xsd:string.
        ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Topic ont:hasSub ?Topic.
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
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  CourseLOTopic: async (req, res) => {
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
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  LOTopicCourse: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { Topic, LO } = req.body;
      if (!Topic || !LO) {
        return res.status(400).json({ message: "Topic và LO là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasID ?hasCourseName
      WHERE {
        ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
        ?Learning_Outcome ont:hasLearningOutcomeText "${LO}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Topic ont:hasLearningOutcome ?Learning_Outcome.
        ?Course ont:hasID ?hasID.
        ?Course ont:hasCourseName ?hasCourseName.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasID: bindingObject.hasID ? bindingObject.hasID.value : undefined,
          hasCourseName: bindingObject.hasCourseName
            ? bindingObject.hasCourseName.value
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
  Course: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { LO, Topic } = req.body;
      if (!LO || !Topic) {
        return res.status(400).json({ message: "LO và Topic là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT DISTINCT ?hasCourseName
      WHERE {
        ?Learning_Outcome ont:hasLearningOutcomeText "${LO}"^^xsd:string.
        ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Activity ont:relatedTo ?Topic.
        ?Activity ont:aimsToAchieve ?Learning_Outcome.
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
      console.log(formattedResults);
      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results: formattedResults,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  //subTopic
  SubTopicOfTopic: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, Topic } = req.body;
      if (!name || !Topic) {
        return res.status(400).json({ message: "name và Topic là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasTopicDescription
      WHERE {
        ?Course ont:hasCourseName "${name}"^^xsd:string.
        ?Topic ont:hasTopicDescription "${Topic}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Topic ont:hasSub+ ?SubTopic.
        ?SubTopic ont:hasTopicDescription ?hasTopicDescription.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasSubTopic: bindingObject.hasSubTopic
            ? bindingObject.hasSubTopic.value
            : undefined,
        };
      });
      console.log(formattedResults);
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

module.exports = rdfController;
