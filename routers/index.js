const routes = (app)=>{
    app.use('/sparql', require("./rdfRouter"));
}
module.exports = routes;