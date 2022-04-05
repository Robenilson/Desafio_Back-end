const express = require("express")
const app=express();
const fs = require('fs');
const axios= require("axios")
const  bodyParser = require('body-parser')
const porta=8081
const uf =["Selecione ", "AC","AL","AP","AM","BA","	CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS",	"RR","SC","SE","TO" ]



app.use(bodyParser.urlencoded({
  extended: true
}));



 function url(value){
        return  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`;
 }





async function ler ( valueA ,valueB , exibir){
         let  c =await  valueA.map(obj1 => (obj1.microrregiao.mesorregiao.UF.nome))
         let   id;
         let   est;
         let   reg ;
         let   f ;
         let e=0;
         let result= [];
         let w='';

         while   ( e < c.length) {
                       if (c[e]==valueB){
                               id  = await  valueA.map(obj1 => (obj1.id))
                               est = await  valueA.map(obj1 => (obj1.nome))
                               reg = await  valueA.map(obj1 => (obj1.microrregiao.mesorregiao.UF.nome))
                               f   = await  valueA.map(obj1 => (obj1.microrregiao.mesorregiao.UF.regiao.nome))
                             result.push(id[e]+" - "+est[e]+" - "+reg[e]+" -  "+f[e] +" \n")
                           }
                        e++;
                      }
                    e=0
                      if ( exibir=="tela") {
                              if(e < result.length ){
                                for (let  i = 0; i < result.length; i++) {
                                      w +=   `<li>${result[i]}</li>`
                                  }
                              }else{
                                w= ` Nâo Encontrado`
                              }
                    }else if ( exibir=="arquivo") {
                              if(e < result.length ){
                                      let templete=''
                                      for (let i = 0; i < result.length; i++) {
                                          templete +=   `${result[i]}\n`
                                        }
                                      fs.writeFile(`${__dirname}/${valueB}.txt`,templete, function(erro) {if(erro) throw erro;})
                                      w= ` Salvo em ${__dirname}/${valueB}.txt`
                              }else{
                                w= ` Nâo Encontrado`
                              }
                    }else{
                      w= `Escolha  1 opçoes para exibir `

                    }
        return w

          }





function  option() {
  let op=''
  for (var i = 0; i < uf.length; i++) {
        op +=   `<option value=${uf[i]}>${uf[i]}</option>`
        }
        return op.toString()


}

function styles(){
  let templete=
   ` <style>
      .corpo{

          text-align: center;

        }


      .bt{
          border: 3px solid green;
        }

      .mg{
          margin: 25px 50px 10px ;
        }
        li{
            margin: 25px 50px 10px ;


        }
        ul{
            list-style-type: none;
        }


        .v {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #333;
        }

        .p {
            float: left;
        }

        li a {
            display: block;
            color: white;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
        }

        li a:hover {
            background-color: #111;
        }
      </style>`
return templete
}


function  part2(result) {
  let templete=`<html>
                   <head>${styles()}
                   <title>Resultados</title>
                   </head>
                   <body class="corpo">
                   <div>
                     <ul class="v">
                       <li class="p"><a class="active" href="http://localhost:${porta}/">Home</a></li>
                     </ul>
                     <div>
                     <h1>Resultados</h1>
                       <div>
                       <ul >${result}</ul>
                       </div>
                    <body>
                 </html>`
   return templete
}


 function index(){
       let templete=`<html>
                        <head> ${styles()}
                          <title>Desafio Núcleo</title>
                         </head>
                        <body class="corpo">
                          <h1>Desafio Núcleo </h1>
                          <hr>
                            <h2> Digite o Estado </h2>
                            <form  action="/estado" method="post">
                            <input class="mg" type="text" id="name" name="fname"  >
                            <label for="cars">Estado:</label>
                            <select style="width:50px;" name="uf" id="uf">${option()}</select>
                            <br>
                            <div>
                            <label for="css">Exibir na  tela </label>
                            <input type="radio" id="javascript" name="exibir" value="tela"><br>
                            <label for="css">Salvar em Arquivo </label>
                            <input type="radio" id="javascript" name="exibir" value="arquivo">
                            <div>
                            <input class="bt mg" type="submit" value="Submit">
                          </form>
                        </body>
                      </html>`
        return templete
      }


app.get("/", function(req,res){ res.send(index())})



  app.post("/estado", function(req,res){
                  axios.get(url(req.body.uf))
                      .then(result=> ler(result.data,req.body.fname, req.body.exibir ))
                      .then(result =>res.send(part2(result)))
                      .catch("Error")
            })


  app.listen(porta, function(){ console.log(`link=http://localhost:${porta}/`)});
