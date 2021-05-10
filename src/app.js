const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid,} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idValidate(request, response, next){
  const {id} = request.params

  if(!isUuid(id)){
    return response.status(400).json({error: "Id invaled"})
  }

  return next()
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const repo = {
    id: uuid(), 
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo)

  return response.status(200).json(repo)
});

app.put("/repositories/:id", idValidate ,(request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body

  const indexRepositorie = repositories.findIndex(repo => repo.id === id)

  if(indexRepositorie < 0){
    return response.status(400).json({error: "repositorie not found"})
  }
  
  repositories[indexRepositorie].title = title
  repositories[indexRepositorie].url = url
  repositories[indexRepositorie].techs =techs

  return response.json(repositories[indexRepositorie])

});

app.delete("/repositories/:id", idValidate, (request, response) => {
  const {id} = request.params

  const indexRepositorie = repositories.findIndex(repo => repo.id === id)

  if(indexRepositorie < 0){
    return response.status(400).json({error: "repositorie not found"})
  }

  repositories.splice(indexRepositorie, 1)
  
  return response.status(204).send()

});

app.post("/repositories/:id/like", idValidate ,(request, response) => {
  const {id} = request.params
  
  const indexRepositorie = repositories.findIndex(repo => repo.id === id)

  if(indexRepositorie < 0){
    return response.status(400).json({error: "repositorie not found"})
  }

  repositories[indexRepositorie].likes++

  return response.status(200).json(repositories[indexRepositorie])

});

module.exports = app;
