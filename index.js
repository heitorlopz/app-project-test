//após instalar o express e a dependência nodemon em ambiente de produção, vamos criar o index.js e importar o express e depois criar o app

const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

//let requests = 0;


//middleware global
//Crie um middleware global chamado em todas requisições que imprime (console.log) uma contagem de quantas requisições foram feitas na aplicação até então;

server.use((req, res, next) => {

  //requests++;
  console.count("Número de requisições");

  next();

});

function checkIdExists(req, res, next) {

  const { id } = req.params;

  const projectId = projects.find(p => p.id == id);

  if(!projectId){
    return res.status(400).json({error: 'ID does not exist'});
  }
  return next();
}


//Rota que lista todos projetos e suas tarefas
server.get('/projects', (req, res) => {

  return res.json(projects);

});

//A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota
server.put('/projects/:id', checkIdExists, (req, res) => {

  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);

});


// A rota deve receber id e title dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; 
//Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.
server.post('/projects', (req, res)=>{

  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(projects);

})


// A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', checkIdExists, (req, res) => {
  
  const { id } = req.params;
  
  //não usa o find, pois o find retorna o valor do elemento do array, enquanto o findindex retorna o index
  const projectIndex = projects.findIndex(p => p.id == id);
  //metodo splice funciona assim -> ele percorre o vetor até o index passado (primeiro parametro) e deleta o tanto de posições informadas no segundo parametro
  
  projects.splice(projectIndex, 1);
  
  //so envia o status da resposta

  return res.json(projects);
  //return res.send();
  
})

//A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post('/projects/:id/tasks', checkIdExists, (req, res)=>{
  
  const { id } = req.params;
  const { title } = req.body;
  
  //projects[id].tasks.push(title);
  
  const project = projects.find(p => p.id == id);
  
  project.tasks.push(title);
  
  return res.json(projects);
  
});



  server.listen(3003);