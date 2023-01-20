# parseCsvToJason
Pasaje de csv a json 
</br>
Este sitio nos permite cargar un archivo .CSV de una centralita Asterisk.
</br>
Cargamos archivo y luego (en este caso) filtra los registros por queue ya que en mi arquitectura los salientes tienen una queue y es lo que se pondera para facturar.

</br>
Importante: 
- Usar registro del total de llamadas del mes.
- Primero colocar valor de factura y luego cargar .CSV (hay que fixear eso)
</br>
Mejoras a futuro:
-Optimizacion de algoritmo y reevaluar la ponderacion para el prorrateo.
-Mejorar interface y estilo del sitio.
