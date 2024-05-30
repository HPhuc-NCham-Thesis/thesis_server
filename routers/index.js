const routes = (app)=>{
    app.use('/sparql', require("./rdfRouter"));
    app.use('/load', require("./loadRouter"));
}
module.exports = routes;