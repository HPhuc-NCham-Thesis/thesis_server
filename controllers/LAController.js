const QueryEngine = require("@comunica/query-sparql").QueryEngine;
const myEngine = new QueryEngine();

//Learning Analytics
const LAController = {
  //Tỉ lệ đạt so với tỉ lệ tham gia theo từng chuẩn đầu ra của một môn học trong một lớp
  LearningOutcomeAnalysis: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, group } = req.body;
      if (!name || !group) {
        return res.status(400).json({ message: "name và group là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
      SELECT ?LearningOutcomeName
            (COUNT(DISTINCT ?Learner) AS ?totalLearners)
            (SUM(IF(?hasValue > 5, 1, 0)) AS ?totalLearnersWithValueGreaterThan5)
      WHERE {
        ?Course ont:hasName "${name}"^^xsd:string.
        ?Group ont:hasID "${group}"^^xsd:string.
        ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
        ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
        ?Learner ont:belongsTo ?Group.
        ?Assessment ont:evaluates ?Learner; ont:belongsWith ?Activity.
        ?LearningOutcome ont:hasName ?LearningOutcomeName.
        ?Activity ont:hasID ?ActID.
        ?Assessment ont:hasValue ?hasValue.
        FILTER regex(?ActID, "^10006\\\\.T[0-9]{3}$")
      }
      GROUP BY ?LearningOutcomeName`;
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
          totalLearners: bindingObject.totalLearners
            ? bindingObject.totalLearners.value
            : undefined,
          totalLearnersWithValueGreaterThan5:
            bindingObject.totalLearnersWithValueGreaterThan5
              ? bindingObject.totalLearnersWithValueGreaterThan5.value
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
  //
  //Tỉ lệ có điểm >5 của một hoạt động trong một môn học của một lớp
  ActivityAnalysis: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, group } = req.body;
      if (!name || !group) {
        return res.status(400).json({ message: "name, group là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
      SELECT ?ActivityName
            (COUNT(DISTINCT ?Learner) AS ?totalLearners)
            (SUM(IF(?hasValue > 5, 1, 0)) AS ?totalLearnersWithValueGreaterThan5)
      WHERE {
        ?Course ont:hasName "${name}"^^xsd:string.
        ?Group ont:hasID "${group}"^^xsd:string.
        ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
        ?Learner ont:belongsTo ?Group.
        ?Assessment ont:evaluates ?Learner; ont:belongsWith ?Activity.
        ?Assessment ont:hasValue ?hasValue.
        ?Activity ont:hasDescription ?ActivityName.
      }
      GROUP BY ?ActivityName`;
      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindings = await bindingsStream.toArray();
      const formattedResults = bindings.map((binding) => {
        const bindingObject = Object.fromEntries(binding.entries);
        return {
          ActivityName: bindingObject.ActivityName
            ? bindingObject.ActivityName.value
            : undefined,
          totalLearners: bindingObject.totalLearners
            ? bindingObject.totalLearners.value
            : undefined,
          totalLearnersWithValueGreaterThan5:
            bindingObject.totalLearnersWithValueGreaterThan5
              ? bindingObject.totalLearnersWithValueGreaterThan5.value
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
  //Điểm từng activity của sinh viên trong một môn học của một lớp so với điểm trung bình của activity đó của lớp
  ActivityAvgAnalysis: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, group, learner } = req.body;
      if (!name || !group || !learner) {
        return res
          .status(400)
          .json({ message: "name, group, learner là bắt buộc" });
      }

      const query = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT ?ActivityName (ROUND(AVG(?hasValue)*100)/100 AS ?averageScore)
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Group ont:hasID "${group}"^^xsd:string.
      ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
      ?Learner ont:belongsTo ?Group.
      ?Assessment ont:evaluates ?Learner; ont:belongsWith ?Activity.
      ?Assessment ont:hasValue ?hasValue.
      ?Activity ont:hasDescription ?ActivityName.
    }
    GROUP BY ?ActivityName`;

      const query1 = `
    PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
    SELECT ?ActivityName ?hasValue
    WHERE {
      ?Course ont:hasName "${name}"^^xsd:string.
      ?Group ont:hasID "${group}"^^xsd:string.
      ?Learner ont:hasID "${learner}"^^xsd:string.
      ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
      ?Learner ont:belongsTo ?Group.
      ?Assessment ont:evaluates ?Learner; ont:belongsWith ?Activity.
      ?Assessment ont:hasValue ?hasValue.
      ?Activity ont:hasDescription ?ActivityName.
    }
    GROUP BY ?ActivityName ?hasValue`;

      const bindingsStream = await myEngine.queryBindings(query, {
        sources: [store],
      });
      const bindingsStream1 = await myEngine.queryBindings(query1, {
        sources: [store],
      });

      const bindings = await bindingsStream.toArray();
      const bindings1 = await bindingsStream1.toArray();

      const activityMap = new Map();

      bindings.forEach((binding) => {
        const activityName = binding.get("ActivityName").value;
        const averageScore = binding.get("averageScore").value;
        activityMap.set(activityName, {
          ActivityName: activityName,
          averageScore: averageScore,
          LearnerScores: "",
        });
      });

      bindings1.forEach((binding) => {
        const activityName = binding.get("ActivityName").value;
        const hasValue = binding.get("hasValue").value;
        if (activityMap.has(activityName)) {
          activityMap.get(activityName).LearnerScores = hasValue;
        }
      });

      const results = Array.from(activityMap.values());

      res.status(200).json({
        message: "Truy vấn đã được thực thi",
        results,
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = LAController;
