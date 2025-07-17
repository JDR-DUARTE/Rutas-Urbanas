class transporte{
    constructor(){
        this.estacions=0;
        this.numRutas=0;
        this.grafo={};
    }
    cargar(contenido){
        this.estacions=0;
        this.numRutas=0;
        this.grafo={};
        if (typeof contenido !== 'string') {
            console.error("El contenido recibido no es una cadena:", contenido);
            return;
         }

        let linea = contenido.trim();
        linea = linea.split('\n');

        for(let i=0;i<linea.length;i++){
            if(i==0){
                let partes=linea[i].split(" ");
                this.estacions=Number(partes[0]);
                this.numRutas=Number(partes[1]);
            }else{
                let l=linea[i].split(" ");
                if(!this.grafo[l[1]]){
                    this.grafo[l[1]]=[];
                }
                if (!this.grafo[l[0]]){
                    this.grafo[l[0]]=[];
                    this.grafo[l[0]].push([l[1],Number(l[2])]);
                }else{
                    this.grafo[l[0]].push([l[1],Number(l[2])]);
                }
            }
        }

        for(let clave in this.grafo){
            console.log(clave);
            this.grafo[clave].forEach(([destino,costo]) => {
                console.log(`destino ${destino},costo ${costo}`);
            });
        }

    }

    dijkstra(origen,destino){
        const costo={};
        const prede={};
        const visitados = new Set();
        let cola=[];

        for (let nodo in this.grafo){
            costo[nodo]=Infinity;
            prede[nodo]=null;
        }
        costo[origen]=0;
        cola.push([origen,0]);

        while(cola.length>0){
            cola.sort((a,b)=> a[1]-b[1]);
            let nodoActual = cola.shift();
            let nodoID=nodoActual[0];

            if (visitados.has(nodoID)){
                continue
            }else{
                visitados.add(nodoID);
            }
            if (nodoID===destino){
                break;
            }
            for(let [veci,valor] of this.grafo[nodoID]){
                let costoAlveci = costo[nodoID]+valor;
                
                if(costoAlveci<costo[veci]){
                    costo[veci]=costoAlveci;
                    prede[veci]=nodoID;
                    cola.push([veci,costoAlveci]);
                }
            }
        }
        if(costo[destino]===Infinity){
            console.log("No hay ruta posible")
            return null;
        }else{
            let camino=[];
            let nodo=destino;
            while(nodo!==null){
                camino.unshift(nodo);
                nodo=prede[nodo];
            }
            return camino;
        }
    }
}

