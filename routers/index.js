const routes = (app)=>{
    app.use('/KnowledgeReasoning', require("./KRRouter"));
    app.use('/load', require("./loadRouter"));
    app.use('/LearningAnalytics', require("./LARouter"));
}
module.exports = routes;