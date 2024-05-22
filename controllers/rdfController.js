const { DataFactory, Parser } = require('n3');
const loadRDFFile = require('../config/db');

let store;

loadRDFFile();

const rdfController = {
  Learner: async (req, res) => {
    const { id, Topic, LO } = req.body;

    if (!id || !Topic || !LO) {
      return res.status(400).json({ message: 'id, Topic, and LO are required' });
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

    const parser = new Parser();
    const quads = store.getQuads(null, null, null, null);
    const result = parser.parse(query);

    // Placeholder for executing the parsed query on the store
    // Here you would need a SPARQL engine capable of executing the parsed query against the store
    // This part depends on the specific SPARQL engine/library you are using.

    res.status(200).json({ message: 'Query executed', result });
  }
};

module.exports = rdfController;
