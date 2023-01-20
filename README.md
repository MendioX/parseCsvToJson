# parseCsvToJson
Pasaje de csv a json https://mendiox.github.io/parseCsvToJson/
</br>
Este sitio nos permite cargar un archivo .CSV de una centralita Asterisk.
</br>
Cargamos archivo y luego (en este caso) filtra los registros por queue ya que en mi arquitectura los salientes tienen una queue y es lo que se pondera para facturar.

</br>
Importante: 
</br>
<ul>
  <li> Usar registro del total de llamadas del mes.</li>
<li> Primero colocar valor de factura y luego cargar .CSV (hay que fixear eso)</li>
</ul>
  </br>
Mejoras a futuro:
</br>
<ul>
<li>Optimizacion de algoritmo y reevaluar la ponderacion para el prorrateo.</li>
<li>Mejorar interface y estilo del sitio.</li>
</ul>
