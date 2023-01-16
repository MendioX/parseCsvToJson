let sectorCount = [];


function checkArrayEmpty(time){

   if (time.length == 3) {
      return true;
   }else{
      return(false)
   }

}

function filtroNumero(registro,sectorCount){
   const fieldTime='talk time'; 
   const fieldTel='number';
          
   
   if (((/out|SALIENTES/gi).test(registro.queue)) && sectorCount.hasOwnProperty(registro.queue) == false)
   {
       if((/^00/).test(registro.number))
       {

          let time = registro[fieldTime].split(":").map(Number);//array 3 pos [H,Min,Seg]
         if (checkArrayEmpty(time))
         {
            sectorCount[registro.queue] = {count:1, timeCallNac: [0,0,0],timeCallInt :time};  
         }
          

       }else{
         let time = registro[fieldTime].split(":").map(Number);//array 3 pos [H,Min,Seg]
         if (checkArrayEmpty(time))
         {
            sectorCount[registro.queue] = {count:1, timeCallNac: time,timeCallInt :[0,0,0]};
         }
       }
    
   }
      if(sectorCount.hasOwnProperty(registro.queue) == true) 
      {
         if ((/^00/).test(registro.number)) {
         let time = registro[fieldTime].split(":").map(Number);
            
         if (checkArrayEmpty(time))
         {

            for (let i = 0; i < time.length; i++) 
             {
            sectorCount[registro.queue].timeCallInt[i] += time[i]; 
             }

            sectorCount[registro.queue].count ++;

         }
         
            
         }else{
         let time = registro[fieldTime].split(":").map(Number);
         if (checkArrayEmpty(time))
         {

            for (let i = 0; i < time.length; i++) 
            {
               sectorCount[registro.queue].timeCallNac[i] += time[i]; 
            }
      
            sectorCount[registro.queue].count ++;
         }


         }
           
      }
   
}


function cargarJSON(myJson){
    // fetch(myJson)
    // .then(respuesta => respuesta.json())//indicamos formato de obtencion de info
    // .then(registro =>{
         myJson.forEach(registro => {
         
            filtroNumero(registro,sectorCount);
      
         });
        
        //})//mostamos info
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

console.log(sectorCount);