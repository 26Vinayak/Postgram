const {ApolloServer,PubSub} = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const Post  = require('./models/Post.js');
const User = require('./models/User.js');
const {MONGODB} = require('./config.js');
const typeDefs = require('./graphql/typeDef.js');
const resolvers = require('./graphql/resolvers');


const pubsub = new PubSub();

const PORT = process.env.port || 5000;
//Start ApolloServer
const server = new ApolloServer({
    typeDefs,   //Definition     
    resolvers,  //Resolvers
    context:({req})=>({req,pubsub})
});





mongoose.connect(MONGODB,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    return server.listen({port:PORT});
}).then((res)=>{
    console.log(`Server running at ${res.url}`);;
}).catch(err =>{
    console.error(err);
});



