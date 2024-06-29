const QueryEngine = require("@comunica/query-sparql").QueryEngine;
const myEngine = new QueryEngine();


//Learning Analytics
const LAController = {
//Tỉ lệ đạt theo từng chuẩn đầu ra của một môn học trong một lớp
  LOOfGroupAnalysis: async (req, res) => {
    try {
      const store = req.app.locals.store;
      const { name, groupID } = req.body;
      if (!name || !groupID) {
        return res.status(400).json({ message: "name và groupID là bắt buộc" });
      }
      const query = `
      PREFIX ont: <http://www.semanticweb.org/KnowledgeModel#>
      SELECT ?hasName(COUNT(DISTINCT ?Learner) AS ?total)
      WHERE {
        ?Course ont:hasName "${name}"^^xsd:string.
        ?Group ont:hasID "${groupID}"^^xsd:string.
        ?Enrollment ont:enrolls ?Course; ont:relates ?Group.
        ?Learner ont:belongsTo ?Group.
        ?Assessment ont:evaluates ?Learner;ont:belongsWith ?Activity.
        ?Course ont:hasLearningGoal ?LearningGoal.
        ?LearningGoal ont:includes ?LearningOutcome.
        ?LearningOutcome ont:targets ?LearningLevel.
        ?LOAlignment ont:achieves ?LearningOutcome; ont:involves ?Activity.
        ?LearningLevel ont:hasName ?hasName.
        ?Assessment ont:hasValue ?hasValue.
        FILTER (?hasValue>=5)
      }
      GROUP BY ?hasName`;
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
          total: bindingObject.total 
            ? bindingObject.total.value 
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
//Tỉ lệ đạt chuẩn đầu ra của một môn học đối với từng sinh viên
};
module.exports = LAController;
