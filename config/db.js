const fs = require('fs').promises;
const { Readable } = require('stream');
const rdfxmlParser = require('rdfxml-streaming-parser').RdfXmlParser;
const { Store } = require('n3');

const loadRDFFile = async () => {
    const filePath = "E:\\Năm 4\\KLTN\\Source\\KnowledgeModel.rdf";  
    try {
        // Đọc nội dung của tệp RDF
        const rdfData = await fs.readFile(filePath, "utf8");

        // Khởi tạo một RDF Stream từ nội dung RDF
        const rdfStream = Readable.from([rdfData]);
        const parser = new rdfxmlParser();
        const store = new Store();

        rdfStream.pipe(parser)
            .on('data', quad => {
                store.addQuad(quad);
            })
            .on('error', error => {
                console.error(`Error parsing RDF data: ${error}`);
                throw error;
            });

        // Đợi cho đến khi tất cả dữ liệu đã được phân tích và lưu trữ
        await new Promise((resolve, reject) => {
            parser.on('end', resolve);
            parser.on('error', reject);
        });
        return store;
    } catch (error) {
        console.error(`Error loading RDF data from RDF file: ${error}`);
        throw error;
    }
};

module.exports = loadRDFFile;