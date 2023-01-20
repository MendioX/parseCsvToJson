let sectorCount = [];

function parseToMinits(time) {
   let minits = 0;
   for (let i = 0; i < time.length; i++) {
        
      switch (i) {
         //posicion 0 = horas - del vector
         case 0:
            
            minits += time[i]*60;
            break;
            //posicion 1 = min - del vector
         case 1:
            minits += time[i];
            break;
            //posicion 2 = seg - del vector
         case 2:
           minits += Math.round(time[i]/60);
            break;
      }
   }

   return minits;
}

function sumarTimeNac(time,arrAux2,NameregJson){

   arrAux2.map(element => {

   if (element.nameSector == NameregJson) {
      
         
         element["timeCallNac"] += parseToMinits(time);          
         element["count"] += 1;
   }
      
   });

}

function sumarTimeInt(time,arrAux2,NameregJson){

   arrAux2.map(element => {
   
      if (element.nameSector == NameregJson) {
         element["timeCallInt"] += parseToMinits(time);          
         element["count"] += 1;}
         
      });
   
   }
   


function checkNameReg(NameregJson,arrAux2) {
   let flag = false;
   arrAux2.map(element => {
   if (element.nameSector == NameregJson) {
      flag = true;
      return flag;
   }
    
});
return flag; 
}

function checkArrayEmpty(time){

   if (time.length == 3) {
      return true;
   }else{
      return(false)
   }

}

function filtroNumero(registro,arrAux2){
   const fieldTime='talk time'; 
   const fieldTel='number';
   let objTemp = {
      nameSector : "",

   }        
   
   // if (((/out|SALIENTES/gi).test(registro.queue)) && sectorCount.hasOwnProperty(registro.queue) == false)
   if (((/out|SALIENTES/gi).test(registro.queue)) && checkNameReg(registro.queue,arrAux2) == false)
   {
       if((/^00/).test(registro.number))
       {

          let time = registro[fieldTime].split(":").map(Number);//array 3 pos [H,Min,Seg]
       if (checkArrayEmpty(time))
         {
           // sectorCount[registro.queue.toString()] = {count:1, timeCallNac: [0,0,0],timeCallInt :time};  
            objTemp["nameSector"]= registro.queue;
            objTemp["count"] = 1;
            objTemp["timeCallNac"] = 0;
            objTemp["timeCallInt"] = parseToMinits(time);
            arrAux2.push(objTemp);
         }
          

       }else{
         let time = registro[fieldTime].split(":").map(Number);//array 3 pos [H,Min,Seg]
         if (checkArrayEmpty(time))
         {
           // sectorCount[registro.queue.toString()] = {count:1, timeCallNac: time,timeCallInt :[0,0,0]};
            objTemp["nameSector"]= registro.queue; 
            objTemp["count"] = 1;
            objTemp["timeCallNac"] = parseToMinits(time);
            objTemp["timeCallInt"] = 0;
            arrAux2.push(objTemp);
            //console.log(sectorCount[0].count)
         }
       }
    
   }
      if(checkNameReg(registro.queue,arrAux2) == true) 
      {
         if ((/^00/).test(registro.number)) {
         let time = registro[fieldTime].split(":").map(Number);
            
         if (checkArrayEmpty(time))
         {

           sumarTimeInt(time,arrAux2,registro.queue)

         }
         
            
         }else{
         let time = registro[fieldTime].split(":").map(Number);
         if (checkArrayEmpty(time))
         {
            sumarTimeNac(time,arrAux2,registro.queue)
         }
           
      }
      }
}


function cargarJSON(myJson){
    // fetch(myJson)
    // .then(respuesta => respuesta.json())//indicamos formato de obtencion de info
    // .then(registro =>{
         myJson.map(registro => {
         
            filtroNumero(registro,sectorCount);
      
         });
        console.log(sectorCount[0])
        //})//mostamos info
        calculoPorcentaje(sectorCount)
}


//console.log(checkArrayEmpty([0]));



/*-------------------- Convertimos el texto a JSON y luego lo pasamos a la funcion para filtrado ------------------*/ 
function convertJson(archivo,nombreArchivo){
  // console.log(archivo);
 //const fs = require('fs');
//if (process.argv[2] === undefined) {
  if (archivo === undefined) {
         console.error(`Usage: node toJasonn.js <file.csv>`);
         process.exit(1);
    }
 
 
 //const filename = process.argv[2];
 const filename = nombreArchivo;
 //console.log(filename);
 //const fileText = fs.readFileSync(filename).toString();
 const fileText = archivo;
 let reg = /\"|\'/g;
 let allLines = fileText.replace(reg,"");
 allLines = allLines.split('\n');
 //console.log(allLines);
 const header = allLines[0];
 const dataLines = allLines.slice(1);
 const fieldNames= header.split(',');
 
 let objList = [];
 
 for (let i = 0; i < dataLines.length; i++) {
     let obj = {};
     const data = dataLines[i].split(',');
     for (let j = 0; j < fieldNames.length; j++) {
         const fieldName =fieldNames[j].toLowerCase();
         obj[fieldName] = data[j];   
     }  
     objList.push(obj);  
 }
 //console.log(objList);
 cargarJSON(objList);
 const jsonText = JSON.stringify(objList);
 //const outputFilename = filename.replace(".csv",".json");
 //fs.writeFileSync(outputFilename, jsonText);
 }


/*-------------------- cargamos CSV leemos y lo pasamos a funcion para convertir a JSON -------------------*/ 

function abrirArchivo(evento){
    let archivo = evento.target.files[0];

    if (archivo) {
        let reader = new FileReader();

        reader.onload = function(e){

            let contenido = e.target.result;
           // console.log(contenido);
            convertJson(contenido, evento.target.files[0].name);
        }

        reader.readAsText(archivo);
        document.getElementById('mensaje').innerText = "Se cargo el archivo: " + evento.target.files[0].name;
        
        
     } else {
        document.getElementById('mensaje').innerText = "No se ha seleccionado archivo. ";
        
    }
}

window.addEventListener('load',()=>{
    document.getElementById('uploadFile').addEventListener('change', abrirArchivo);
})


function calcPorcentDpto(depto, minTotales){
   let calc =(depto.timeCallInt + depto.timeCallNac)*100/minTotales;
   return (calc.toFixed(2));

}

function calcPorcentMonto(monto,auxPorc){

   return ((auxPorc*monto/100).toFixed(2))
}

function calculoPorcentaje(arrLlamadas){

   let totalNac = 0;
   let totalInt = 0;
   let temp = "";
   
   let minTotalTemp ="";
   let monto = parseInt(document.getElementById("valorFactura").value); 
   console.log((monto) );
   
   arrLlamadas.map(depto =>{

      totalNac += depto.timeCallNac;
      totalInt += depto.timeCallInt;
     
   })

   let minTotales = totalNac + totalInt;
   console.log(minTotales)
 arrLlamadas.forEach(dpto => {
   let auxPorc = calcPorcentDpto(dpto, minTotales);
   console.log(auxPorc)
   temp += "<tr>"
   temp += "<td>"+dpto.nameSector+"</td>"
   temp += "<td>"+dpto.timeCallNac+"</td>"
   temp += "<td>"+dpto.timeCallInt+"</td>"
   temp += "<td>"+dpto.count+"</td>"
   temp += "<td> % "+auxPorc+"</td>"
   temp += "<td> $ "+calcPorcentMonto(monto,auxPorc)+"</td>"
   temp += "</tr>"

 });

 minTotalTemp = "<label id=\"total\"> Minutos totales: "+(totalInt+totalNac)+"</label>";
 document.getElementById("newLabel").innerHTML = minTotalTemp;
 document.getElementById("bodytable").innerHTML = temp;
 
}



document.querySelector('#calcular').addEventListener('click',calculoPorcentaje(sectorCount))
//console.log((sectorCount.names()));

console.log(sectorCount);