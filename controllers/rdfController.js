const QueryEngine = require("@comunica/query-sparql").QueryEngine;

const myEngine = new QueryEngine();
const rdfController = {
  Learner: async (req, res) => {
    try {
      const store = req.app.locals.store; // Truy cập store từ req.app.locals
      const { id, Topic, LO } = req.body;
      console.log(req.body);

      if (!id || !Topic || !LO) {
        return res
          .status(400)
          .json({ message: "id, Topic, và LO là bắt buộc" });
      }

      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT DISTINCT ?hasID ?hasLearnerFullname ?hasActivityItemResult
      WHERE {
        ?Course ont:hasID "${id}"^^xsd:string.
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
      const { id, Topic, LO } = req.body;
      if (!id || !Topic || !LO) {
        return res
          .status(400)
          .json({ message: "id, Topic, và LO là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasActivityType ?hasActivityDescription
      WHERE {
          ?Course ont:hasID "${id}"^^xsd:string.
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
      console.log(bindings.map(binding => Array.from(binding.entries)));

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
      const{id,idsv}=req.body;
      if(!id || !idsv){
        return res.status(400).json({message: "id và idsv là bắt buộc"});
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT DISTINCT ?hasTopicDescription ?hasLearningOutcomeText ?hasActivityItemResult
      WHERE {
        ?Course ont:hasID "${id}"^^xsd:string.
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
      console.log(bindings.map(binding => Array.from(binding.entries)));
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
  ActivityResult : async (req, res) => {
    try {
      const store = req.app.locals.store; 
      const{id,ActID,idsv}=req.body;
      console.log(req.body);
      if(!id || !ActID || !idsv){
        return res.status(400).json({message: "id, ActID và idsv là bắt buộc"});
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasActivityDescription ?hasID ?hasActivityItemDescription ?hasActivityItemResult
      WHERE {
        ?Course ont:hasID "${id}"^^xsd:string.
        ?Activity ont:hasID "${ActID}"^^xsd:string.
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
      console.log(bindings.map(binding => Array.from(binding.entries)));
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasActivityDescription: bindingObject.hasActivityDescription
            ? bindingObject.hasActivityDescription.value
            : undefined,
          hasID: bindingObject.hasID
            ? bindingObject.hasID.value
            : undefined,
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
  Topic_LearningOutcome: async (req, res) => {
    try {
      const store = req.app.locals.store; 
      const {id,ActID}=req.body;

      const query = `
      PREFIX ont: <http://www.semanticweb.org/user/ontologies/2024/2/untitled-ontology-6#>
      SELECT ?hasTopicDescription ?hasLearningOutcomeText
      WHERE {
        ?Course ont:hasID "${id}"^^xsd:string.
        ?Activity ont:hasID "${ActID}"^^xsd:string.
        ?Course ont:contains ?Topic.
        ?Activity ont:relatedTo ?Topic.
        ?Activity ont:aimsToAchieve ?Learning_Outcome.
        ?Topic ont:hasTopicDescription ?hasTopicDescription.
        ?Learning_Outcome ont:hasLearningOutcomeText ?hasLearningOutcomeText.
      }`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      console.log(bindings.map(binding => Array.from(binding.entries)));
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          hasTopicDescription: bindingObject.hasTopicDescription
            ? bindingObject.hasTopicDescription.value
            : undefined,
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
    }catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  Level_LearningOutcome: async (req, res) => {
    try {
      const store = req.app.locals.store; 
      const{name,Topic}=req.body;
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
          hasID: bindingObject.hasID
            ? bindingObject.hasID.value
            : undefined,
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
    }catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  SubTopic: async (req, res) => {
    try {
      const store = req.app.locals.store; 
      const{name,Topic}=req.body;
      if (!name || !Topic) {
        return res.status(400).json({message: "name,Topic là bắt buộc"});
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
    }catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = rdfController;
