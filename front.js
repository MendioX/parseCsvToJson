
document.querySelector('.file-upload').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#uploadFile').click();
});

function exportTable (tableId,filename =''){

    let dowloadLink ;
    let dataType = 'application/vnd.ms-excel';
    let tableSelect = document.getElementById(tableId);
    let tableHTML = tableSelect.outerHTML.replace(/ /g,'%20')

    filename = filename?filename+'.xls':'excel_data.xls';
    
    dowloadLink = document.createElement("a");

    document.body.appendChild(dowloadLink);

    if(navigator.msSaveOrOpenBlob){
        let blob = new Blob(['ufeff',tableHTML],{
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob,filename);
    }else{
        dowloadLink.href='data:'+dataType+', '+tableHTML;
        dowloadLink.download=filename;

        dowloadLink.click();
    }
}