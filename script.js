let o;
document.addEventListener("DOMContentLoaded", function () {
    const archivo = document.getElementById("archivo");
    const conteArch = document.getElementById("contArch");
    o = new transporte();
    archivo.addEventListener("change", function (event) {
        reiniciarInterfaz();
        const file = event.target.files[0];
        if (file.name.endsWith(".txt")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                let contenido = e.target.result;
                document.getElementById("mensajeInicial").style.display = 'none';
                document.getElementById("mensajeR").style.display = 'none';
                document.getElementById("tituloA").style.display = "block";
                document.getElementById("tituloR").style.display = "block";
                document.querySelector(".arch").style.marginTop = "2rem";
                document.querySelector(".selectores").style.marginTop = "2rem";
                conteArch.textContent = contenido;

                o.cargar(contenido);
                document.getElementById("numE").textContent = o.estacions;
                document.getElementById("numR").textContent = o.numRutas;
                dibujarNodo(o.grafo);
                Selector(o.grafo);

            };
            reader.readAsText(file);
        } else {
            alert("Por favor Selecciona un archivo");
        }
    });
})

document.getElementById("buscarRuta").addEventListener("click", function () {
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    if (!origen || !destino) {
        alert("Selecciona estacion de origen y destino");
        return;
    }

    cy.edges().removeClass('resaltado');

    const camino = o.dijkstra(origen, destino);
    document.getElementById("tituloRC").style.display = "block";
    const rutaDiv = document.getElementById("rutaC");
    rutaDiv.style.display = "block";

    if (camino && camino.length > 1) {
        resaltarR(camino);
        let textocamino = `El camino óptima de ${origen} a ${destino} es:\n\n`
        let costoTotal = 0;
        for (let i = 0; i < camino.length - 1; i++) {
            const nodoI = camino[i];
            const nodoF = camino[i + 1];
            let costo = null;
            for (let j = 0; j < o.grafo[nodoI].length; j++) {
                let vecino = o.grafo[nodoI][j][0];
                let valor = o.grafo[nodoI][j][1];
                if (vecino === nodoF) {
                    costo = valor;
                    break
                }
            }
            textocamino += ` ${nodoI} -> ${nodoF} (Costo: ${costo})\n`;
            costoTotal += costo;
        }

        textocamino += `\nCosto total de la ruta: ${costoTotal}`;
        rutaDiv.textContent = textocamino;


        const botonD = document.getElementById("descargar");
        botonD.style.display = "block";
        botonD.onclick = () => {
            const blob = new Blob([textocamino], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const enlace = document.createElement('a');
            enlace.href = url;
            enlace.download = `ruta_optima.txt`;
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
            URL.revokeObjectURL(url);
        };
    } else {
        document.getElementById("rutaC").textContent = "No existe una caminoválida entre las estaciones seleccionadas.";
        document.getElementById("descargar").style.display = 'none';
    }

})

function reiniciarInterfaz() {
    document.getElementById("rutaC").style.display = "none";
    document.getElementById("tituloRC").style.display = "none";
    document.getElementById("tituloA").style.display = "none";
    document.getElementById("tituloR").style.display = "none";
    document.getElementById("mensajeInicial").style.display = "block";
    document.getElementById("mensajeR").style.display = "block";
    document.getElementById("contArch").textContent = "";
    document.getElementById("origen").innerHTML = '<option value="">Estación de origen</option>';
    document.getElementById("destino").innerHTML = '<option value="">Estación de destino</option>';

    if (cy) {
        cy.destroy();
        cy = null;
    }

    const btnDesc = document.getElementById("descargar");
    if (btnDesc) btnDesc.style.display = "none";
    o = new transporte();
}

function Selector(grafo) {
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");

    origenSelect.innerHTML = '<option value="">Estación de origen</option>';
    destinoSelect.innerHTML = '<option value="">Estación de destino</option>';

    const nodos = Object.keys(grafo);
    nodos.forEach(nodo => {
        const option1 = document.createElement("option");
        option1.value = nodo;
        option1.textContent = nodo;
        origenSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = nodo;
        option2.textContent = nodo;
        destinoSelect.appendChild(option2);
    });
}
let cy;

function dibujarNodo(grafo) {
    const contenedor = document.getElementById("grafoContainer");
    contenedor.innerHTML = "";
    const nodos = Object.keys(grafo).map(nodo => ({
        data: {
            id: nodo,
            imagen: 'assets/estacion2.png'
        }
    }));
    const aristas = Object.entries(grafo).flatMap(([origen, conexiones]) =>
        conexiones.map(([destino, costo]) => ({
            data: {
                source: origen,
                target: destino,
                label: costo.toString()
            }
        }))
    );
    cy = cytoscape({
        container: contenedor,
        style: [
            {
                selector: 'node',
                style: {
                    'background-image': 'data(imagen)',
                    'background-width': '100%',
                    'background-height': '100%',
                    'background-fit': 'contain',
                    'background-color': 'transparent',
                    'background-opacity': 0,
                    'label': 'data(id)',
                    'text-outline-color': '#000000',
                    'text-outline-width': 2,
                    'color': 'white',
                    'font-size': '14px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'width': 100,
                    'height': 100,
                }
            },
            {
                selector: 'edge',
                style: {

                    'width': 5,
                    'line-color': '#212932',
                    'line-style': 'solid',
                    'target-arrow-color': ' #212932',
                    'target-arrow-shape': 'triangle',
                    'target-arrow-fill': 'filled',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '12px',
                    'color': 'white',
                    'text-background-color': '#212932',
                    'text-background-opacity': 1,
                    'text-background-padding': '2px',
                    'z-index': 0
                }
            },
            {
                selector: 'edge.resaltado',
                style: {
                    'line-color': '#fc4b08',
                    'target-arrow-color': '#fc4b08',
                    'width': 5,
                }
            }
        ],
        elements: {
            nodes: nodos,
            edges: aristas
        },
        layout: {
            name: 'circle'
        }
    });
}

function resaltarR(ruta) {
    cy.edges().removeClass('resaltado');
    for (let i = 0; i < ruta.length - 1; i++) {
        const origen = ruta[i];
        const destino = ruta[i + 1];
        const edge = cy.edges(`[source = "${origen}"][target = "${destino}"]`);
        edge.addClass("resaltado");
    }
}
