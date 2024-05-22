const fs = require('fs').promises;
const { Readable } = require('stream');
const rdfxmlParser = require('rdfxml-streaming-parser').RdfXmlParser;
const { DataFactory, Store } = require('n3');

const loadRDFFile = async () => {
    const filePath = 'E:\\Năm 4\\KLTN\\Source\\ONT.owx';
    const outputFilePath = 'store.json';
  try {
    const data = await fs.readFile(filePath, 'utf8');

    const rdfStream = new Readable({
      read() {
        this.push(data);
        this.push(null);
      }
    });

    const store = new Store();

    const parser = new rdfxmlParser();

    await new Promise((resolve, reject) => {
      rdfStream.pipe(parser)
        .on('data', quad => store.addQuad(quad))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log('Ontology data successfully loaded into N3 store.');

    const serializedStore = JSON.stringify(store.getQuads(null, null, null, null));
    await fs.writeFile(outputFilePath, serializedStore);
    console.log('RDF store saved to ' + outputFilePath);

  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

module.exports = loadRDFFile;
