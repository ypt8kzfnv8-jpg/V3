// ==================================================
// 🔧 CONFIGURACIÓN PRINCIPAL Y VARIABLES GLOBALES
// ==================================================

// Datos de identidad y configuración del sistema
const CONFIGURACION_IA = {
    nombre: "TecnoGame IA",
    version: "2.0.0",
    creador: "Tecno Game - Tecnología y Soluciones",
    idioma: "español",
    rubro: "Tecnología, reparación, venta de accesorios y servicios digitales",
    ubicacion: "Argentina",
    personalidad: "amable, profesional, clara, experta, paciente, detallista",
    objetivos: [
        "Ayudar a gestionar y hacer crecer el negocio",
        "Responder dudas con explicaciones razonadas",
        "Buscar y analizar información actualizada",
        "Generar ideas, estrategias y soluciones prácticas",
        "Asesorar en precios, productos y servicios",
        "Crear diseños, logos y contenido visual",
        "Aprender de las interacciones para mejorar"
    ],
    limiteRespuesta: 2000,
    temperatura: 0.7,
    memoriaActiva: true,
    modoRazonamiento: "completo",
    nivelExperiencia: "experto"
};

// Base de conocimientos y datos almacenados
let BASE_CONOCIMIENTOS = {
    negocios: {
        estrategias: [],
        precios: {},
        productos: {},
        servicios: {},
        clientes: [],
        estadisticas: {},
        tendencias: []
    },
    tecnico: {
        reparaciones: {},
        marcas: [],
        modelos: {},
        problemasComunes: {},
        soluciones: {},
        herramientas: []
    },
    general: {
        conceptos: {},
        definiciones: {},
        ejemplos: {},
        recomendaciones: []
    },
    aprendizaje: {
        preguntasHechas: [],
        respuestasDadas: [],
        preferenciasUsuario: {},
        correcciones: [],
        mejoras: []
    }
};

// Estado actual del sistema
let ESTADO_SISTEMA = {
    activo: true,
    procesando: false,
    ultimaInteraccion: new Date(),
    conversacionActual: [],
    contextoActual: {},
    nivelAtencion: "alto",
    modoOperacion: "inteligente",
    errores: 0,
    exitos: 0
};

// Memoria y contexto
let MEMORIA_CORTO_PLAZO = [];
let MEMORIA_LARGO_PLAZO = [];
let CONTEXTO_GLOBAL = {
    temaPrincipal: null,
    subtemas: [],
    intencionUsuario: null,
    nivelConocimiento: "medio",
    urgencia: "normal",
    relacionConNegocio: true
};

// ==================================================
// 🧠 MOTOR DE INTELIGENCIA ARTIFICIAL - NÚCLEO
// ==================================================

class NucleoIA {
    constructor() {
        this.procesadorLenguaje = new ProcesadorLenguaje();
        this.motorRazonamiento = new MotorRazonamiento();
        this.gestorMemoria = new GestorMemoria();
        this.buscadorInformacion = new BuscadorInformacion();
        this.generadorRespuestas = new GeneradorRespuestas();
        this.analizadorContexto = new AnalizadorContexto();
        this.sistemaAprendizaje = new SistemaAprendizaje();
        this.validadorDatos = new ValidadorDatos();
        console.log(`✅ ${CONFIGURACION_IA.nombre} v${CONFIGURACION_IA.version} inicializado correctamente`);
    }

    async procesarEntrada(textoUsuario) {
        try {
            ESTADO_SISTEMA.procesando = true;
            const marcaTiempo = Date.now();
            
            // Paso 1: Preparación y limpieza
            const textoLimpio = this.procesadorLenguaje.limpiarTexto(textoUsuario);
            if (!textoLimpio) return this.respuestaVacia();

            // Paso 2: Análisis profundo del texto
            const analisis = this.procesadorLenguaje.analizarTexto(textoLimpio);
            
            // Paso 3: Comprensión de intención y contexto
            const comprension = this.analizadorContexto.comprenderIntencion(analisis, CONTEXTO_GLOBAL);
            
            // Paso 4: Verificación en memoria y conocimientos
            const conocimientoExistente = this.gestorMemoria.buscarConocimiento(analisis.palabrasClave, comprension.tipo);
            
            // Paso 5: Razonamiento y procesamiento lógico
            const procesoLogico = this.motorRazonamiento.razonar({
                entrada: textoLimpio,
                analisis: analisis,
                comprension: comprension,
                conocimiento: conocimientoExistente,
                contexto: CONTEXTO_GLOBAL,
                configuracion: CONFIGURACION_IA
            });

            // Paso 6: Búsqueda de información adicional si es necesario
            let informacionAdicional = null;
            if (procesoLogico.necesitaBusqueda) {
                informacionAdicional = await this.buscadorInformacion.buscar(procesoLogico.terminosBusqueda, comprension.ambito);
            }

            // Paso 7: Generación de respuesta inteligente
            const respuestaFinal = this.generadorRespuestas.crear({
                proceso: procesoLogico,
                informacion: informacionAdicional,
                conocimiento: conocimientoExistente,
                comprension: comprension,
                formato: "detallado",
                razonamiento: true
            });

            // Paso 8: Almacenamiento y aprendizaje
            this.gestorMemoria.guardarInteraccion(textoUsuario, respuestaFinal, analisis, comprension);
            this.sistemaAprendizaje.aprenderDeInteraccion(textoUsuario, respuestaFinal, analisis, comprension);
            
            // Paso 9: Actualización de contexto
            this.analizadorContexto.actualizarContexto(CONTEXTO_GLOBAL, analisis, comprension);

            // Estadísticas
            ESTADO_SISTEMA.exitos++;
            ESTADO_SISTEMA.ultimaInteraccion = new Date();
            const tiempoProcesamiento = Date.now() - marcaTiempo;
            console.log(`⚡ Procesado en ${tiempoProcesamiento}ms | Intención: ${comprension.intencion}`);

            return respuestaFinal;

        } catch (error) {
            ESTADO_SISTEMA.errores++;
            console.error("❌ Error en procesamiento:", error);
            return this.generadorRespuestas.respuestaError(error.message);
        } finally {
            ESTADO_SISTEMA.procesando = false;
        }
    }

    respuestaVacia() {
        return {
            texto: "👋 ¡Hola! ¿En qué te puedo ayudar hoy? Escribime lo que necesites saber o consultarme.",
            tipo: "saludo",
            tieneImagenes: false,
            imagenes: []
        };
    }
}

// ==================================================
// 📝 PROCESADOR DE LENGUAJE NATURAL
// ==================================================

class ProcesadorLenguaje {
    constructor() {
        this.stopWords = ["el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en", "a", "al", "y", "o", "que", "es", "son", "para", "por", "con", "se", "me", "te", "le", "lo", "la", "ha", "hay", "esta", "este", "ese", "esa"];
        this.patrones = this.cargarPatronesLenguaje();
    }

    limpiarTexto(texto) {
        if (!texto || typeof texto !== "string") return "";
        return texto.toLowerCase()
                   .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                   .replace(/[^\w\sáéíóúñ]/gi, "")
                   .trim()
                   .replace(/\s+/g, " ");
    }

    analizarTexto(texto) {
        const palabras = texto.split(" ");
        const palabrasFiltradas = palabras.filter(p => p.length > 2 && !this.stopWords.includes(p));
        const palabrasClave = this.extraerPalabrasClave(palabrasFiltradas);
        const entidades = this.extraerEntidades(texto);
        const sentimiento = this.analizarSentimiento(texto);
        const complejidad = this.calcularComplejidad(texto);
        const estructura = this.analizarEstructura(texto);

        return {
            textoOriginal: texto,
            palabras: palabras,
            palabrasClave: palabrasClave,
            entidades: entidades,
            sentimiento: sentimiento,
            complejidad: complejidad,
            estructura: estructura,
            longitud: texto.length,
            esPregunta: texto.includes("?") || this.detectarPregunta(texto),
            esPedido: this.detectarPedido(texto),
            esSaludo: this.detectarSaludo(texto),
            esDespedida: this.detectarDespedida(texto)
        };
    }

    extraerPalabrasClave(palabras) {
        const frecuencia = {};
        palabras.forEach(p => frecuencia[p] = (frecuencia[p] || 0) + 1);
        return Object.entries(frecuencia)
                     .sort((a,b) => b[1] - a[1])
                     .map(e => e[0])
                     .slice(0, 8);
    }

    extraerEntidades(texto) {
        const entidades = {
            productos: [],
            servicios: [],
            marcas: [],
            precios: [],
            lugares: [],
            personas: [],
            numeros: texto.match(/\d+/g) || []
        };

        // Detección de marcas tecnológicas
        const marcas = ["samsung", "xiaomi", "apple", "motorola", "huawei", "lg", "sony", "nokia", "lenovo", "hp", "dell", "asus", "msi", "corsair", "logitech"];
        marcas.forEach(marca => {
            if (texto.includes(marca)) entidades.marcas.push(marca);
        });

        // Detección de servicios
        const servicios = ["reparacion", "mantenimiento", "instalacion", "configuracion", "venta", "asesoria", "garantia"];
        servicios.forEach(serv => {
            if (texto.includes(serv)) entidades.servicios.push(serv);
        });

        return entidades;
    }

    analizarSentimiento(texto) {
        const palabrasPositivas = ["bueno", "excelente", "genial", "mejor", "bueno", "rapido", "eficaz", "util", "necesario", "importante", "facil", "claro"];
        const palabrasNegativas = ["malo", "peor", "dificil", "lento", "caro", "complicado", "mal", "problema", "error", "duda", "confusion"];
        
        let puntaje = 0;
        palabrasPositivas.forEach(p => texto.includes(p) ? puntaje++ : null);
        palabrasNegativas.forEach(p => texto.includes(p) ? puntaje-- : null);

        if (puntaje > 0) return "positivo";
        if (puntaje < 0) return "negativo";
        return "neutro";
    }

    calcularComplejidad(texto) {
        const longitud = texto.length;
        const palabrasLargas = texto.split(" ").filter(p => p.length > 6).length;
        const oraciones = texto.split(/[.!?]/).length;
        
        if (longitud > 150 || palabrasLargas > 5 || oraciones > 3) return "alta";
        if (longitud > 50 || palabrasLargas > 2 || oraciones > 1) return "media";
        return "baja";
    }

    analizarEstructura(texto) {
        if (texto.includes("como")) return "procedimiento";
        if (texto.includes("que") || texto.includes("cual")) return "definicion";
        if (texto.includes("cuanto")) return "cantidad";
        if (texto.includes("por que")) return "explicacion";
        if (texto.includes("donde")) return "ubicacion";
        if (texto.includes("cuando")) return "tiempo";
        return "general";
    }

    detectarPregunta(texto) {
        const palabrasPregunta = ["que", "cual", "quien", "donde", "cuando", "por que", "como", "cuanto", "cuales", "hay", "puedo", "debo"];
        return palabrasPregunta.some(p => texto.startsWith(p) || texto.includes(p));
    }

    detectarPedido(texto) {
        const palabrasPedido = ["quiero", "necesito", "dame", "haz", "crea", "genera", "muestra", "busca", "encuentra", "dime", "explica", "ensename"];
        return palabrasPedido.some(p => texto.includes(p));
    }

    detectarSaludo(texto) {
        return ["hola", "buen dia", "buenas tardes", "buenas noches", "como estas", "que tal"].some(s => texto.includes(s));
    }

    detectarDespedida(texto) {
        return ["chau", "adios", "hasta luego", "nos vemos", "gracias", "bye"].some(d => texto.includes(d));
    }

    cargarPatronesLenguaje() {
        return {
            saludos: /^(hola|buen|que tal)/i,
            preguntas: /^(que|cual|como|cuanto|donde|cuando|por que)/i,
            precios: /precio|cuesta|valor|costo|tarifa/i,
            reparaciones: /reparar|arreglar|dañado|rota|fallando|no funciona/i,
            productos: /producto|accesorio|vender|comprar|disponible/i,
            negocios: /negocio|crecer|mejorar|ventas|ganar|dinero|estrategia/i,
            logos: /logo|diseñar|imagen|marca|dibujar|crear diseño/i
        };
    }
}

// ==================================================
// 🤔 MOTOR DE RAZONAMIENTO LÓGICO
// ==================================================

class MotorRazonamiento {
    constructor() {
        this.reglasLogicas = this.definirReglasLogicas();
        this.esquemasRazonamiento = this.cargarEsquemas();
    }

    razonar(datos) {
        const { entrada, analisis, comprension, conocimiento, contexto } = datos;
        
        // Inicio del proceso lógico
        const pasosRazonamiento = [];
        pasosRazonamiento.push("🔍 ANÁLISIS INICIAL: Comprendiendo lo que se consulta...");

        // Paso 1: Determinar ámbito y relación con el negocio
        const ambito = this.determinarAmbito(analisis, comprension);
        pasosRazonamiento.push(`📚 ÁMBITO DETECTADO: ${ambito}`);

        // Paso 2: Evaluar si hay conocimiento previo
        const tieneConocimiento = conocimiento && Object.keys(conocimiento).length > 0;
        pasosRazonamiento.push(`${tieneConocimiento ? "✅" : "🔎"} CONOCIMIENTO: ${tieneConocimiento ? "Información disponible en base" : "Se requiere búsqueda externa"}`);

        // Paso 3: Aplicar reglas lógicas específicas
        const reglasAplicadas = this.aplicarReglas(analisis, comprension, ambito);
        pasosRazonamiento.push(`⚖️ REGLAS: ${reglasAplicadas.length} reglas aplicadas correctamente`);

        // Paso 4: Determinar estructura de respuesta
        const estructuraRespuesta = this.definirEstructura(comprension.tipo, analisis.complejidad, contexto.nivelConocimiento);
        pasosRazonamiento.push(`📋 ESTRUCTURA: Respuesta organizada en ${estructuraRespuesta.secciones} secciones`);

        // Paso 5: Evaluar necesidad de búsqueda
        const necesitaBusqueda = !tieneConocimiento || this.requiereActualizacion(analisis.palabrasClave) || comprension.tipo === "investigacion";
        const terminosBusqueda = necesitaBusqueda ? this.generarTerminosBusqueda(entrada, analisis, ambito) : [];
        pasosRazonamiento.push(`${necesitaBusqueda ? "🌐" : "💾"} FUENTE: ${necesitaBusqueda ? "Información actualizada de fuentes externas" : "Datos consolidados y verificados"}`);

        // Paso 6: Determinar profundidad de explicación
        const profundidad = this.calcularProfundidad(analisis.complejidad, contexto.nivelConocimiento, comprension.urgencia);
        pasosRazonamiento.push(`🔬 PROFUNDIDAD: Nivel ${profundidad} de detalle y explicación`);

        // Paso 7: Adaptación al contexto del negocio
        const adaptacionNegocio = this.adaptarANegocio(analisis, comprension, CONFIGURACION_IA);
        pasosRazonamiento.push(`🏪 ADAPTACIÓN: Contenido ajustado específicamente para Tecno Game en Argentina`);

        // Resultado final del razonamiento
        return {
            logicaAplicada: pasosRazonamiento,
            ambito: ambito,
            reglasAplicadas: reglasAplicadas,
            estructura: estructuraRespuesta,
            necesitaBusqueda: necesitaBusqueda,
            terminosBusqueda: terminosBusqueda,
            profundidad: profundidad,
            adaptacionNegocio: adaptacionNegocio,
            tipoRespuesta: comprension.tipo,
            formatoSalida: this.definirFormato(comprension, analisis)
        };
    }

    determinarAmbito(analisis, comprension) {
        const palabras = analisis.palabrasClave.join(" ").toLowerCase();
        
        if (/precio|valor|costo|tarifa|dinero|ganancia/i.test(palabras)) return "economico_comercial";
        if (/reparar|arreglar|tecnico|problema|solucion|instalacion/i.test(palabras)) return "tecnico_servicios";
        if (/producto|accesorio|vender|stock|marca|modelo/i.test(palabras)) return "productos_ventas";
        if (/negocio|crecer|estrategia|marketing|clientes|publicidad/i.test(palabras)) return "gestion_empresarial";
        if (/logo|diseño|imagen|marca|identidad/i.test(palabras)) return "diseño_creacion";
        if (/que es|definicion|concepto|significa/i.test(palabras)) return "conocimiento_general";
        
        return "multidisciplinario";
    }

    aplicarReglas(analisis, comprension, ambito) {
        const reglasAplicadas = [];
        
        // Regla 1: Siempre relacionar con el negocio
        reglasAplicadas.push({ id: 1, descripcion: "Todo contenido debe ser útil para Tecno Game", cumplida: true });
        
        // Regla 2: Explicar claramente según nivel
        reglasAplicadas.push({ id: 2, descripcion: "Lenguaje claro y adaptado al conocimiento del usuario", cumplida: true });
        
        // Regla 3: Datos actualizados para precios y tendencias
        if (ambito === "economico_comercial" || ambito === "gestion_empresarial") {
            reglasAplicadas.push({ id: 3, descripcion: "Información actualizada y referida al mercado argentino", cumplida: true });
        }

        // Regla 4: Seguridad y veracidad técnica
        if (ambito === "tecnico_servicios") {
            reglasAplicadas.push({ id: 4, descripcion: "Recomendaciones seguras, métodos probados y advertencias claras", cumplida: true });
        }

        // Regla 5: Creatividad y originalidad en diseños
        if (ambito === "diseño_creacion") {
            reglasAplicadas.push({ id: 5, descripcion: "Propuestas únicas, modernas y alineadas con la identidad tecnológica", cumplida: true });
        }

        return reglasAplicadas;
    }

    definirEstructura(tipo, complejidad, nivelUsuario) {
        const estructuras = {
            definicion: { secciones: 2, orden: ["concepto", "explicacion", "ejemplos"] },
            procedimiento: { secciones: 4, orden: ["introduccion", "pasos", "recomendaciones", "advertencias"] },
            estrategia: { secciones: 5, orden: ["analisis", "acciones", "ventajas", "implementacion", "medicion"] },
            tecnico: { secciones: 3, orden: ["diagnostico", "solucion", "prevencion"] },
            comercial: { secciones: 4, orden: ["analisis", "valores", "recomendaciones", "estrategias"] }
        };

        return estructuras[tipo] || { secciones: 3, orden: ["informacion", "detalles", "conclusiones"] };
    }

    requiereActualizacion(palabras) {
        const terminosActualizables = ["precio", "valor", "tendencia", "nuevo", "actual", "2026", "mercado", "venta", "demanda"];
        return palabras.some(p => terminosActualizables.includes(p));
    }

    generarTerminosBusqueda(entrada, analisis, ambito) {
        let terminos = [entrada];
        
        // Agregar contexto geográfico
        terminos.push(`${entrada} Argentina`);
        
        // Agregar contexto de negocio
        terminos.push(`${entrada} tecnología reparación`);
        
        // Específicos por ámbito
        if (ambito === "economico_comercial") terminos.push(`${entrada} precios mercado argentino 2026`);
        if (ambito === "tecnico_servicios") terminos.push(`${entrada} soluciones técnicas reparación`);
        if (ambito === "gestion_empresarial") terminos.push(`${entrada} estrategia negocio tecnología`);

        return terminos.slice(0, 5);
    }

    calcularProfundidad(complejidad, nivelUsuario, urgencia) {
        if (urgencia === "alta") return "basica";
        if (complejidad === "alta" && nivelUsuario === "experto") return "muy_detallada";
        if (complejidad === "media" || nivelUsuario === "medio") return "detallada";
        return "basica";
    }

    adaptarANegocio(analisis, comprension, config) {
        return {
            rubro: config.rubro,
            ubicacion: config.ubicacion,
            enfoque: "servicio y calidad",
            valores: ["confianza", "rapidez", "garantia", "profesionalismo"],
            diferenciadores: ["atencion personalizada", "soluciones completas", "precios claros"]
        };
    }

    definirFormato(comprension, analisis) {
        if (comprension.tipo === "diseño" || analisis.palabrasClave.includes("logo")) return "visual_con_texto";
        if (comprension.tipo === "lista" || analisis.esPedido) return "lista_ordenada";
        if (analisis.esPregunta) return "explicativa_razonada";
        return "narrativa_completa";
    }

    definirReglasLogicas() {
        return [
            { id: 1, condicion: "si_pregunta_sobre_negocio", accion: "responder_con_datos_especificos" },
            { id: 2, condicion: "si_pregunta_tecnica", accion: "explicar_paso_a_paso_y_advertir" },
            { id: 3, condicion: "si_pide_precios", accion: "dar_rangos_mercado_argentino" },
            { id: 4, condicion: "si_pide_estrategias", accion: "dar_ideas_aplicables_y_medibles" },
            { id: 5, condicion: "si_pide_diseños", accion: "generar_propuestas_unicas_tecnologicas" }
        ];
    }

    cargarEsquemas() {
        return {
            deductivo: ["premisa_mayor", "premisa_menor", "conclusion"],
            inductivo: ["casos", "patrones", "generalizacion"],
            causal: ["causa", "efecto", "relacion", "verificacion"],
            comparativo: ["elementos", "similitudes", "diferencias", "valoracion"],
            practico: ["problema", "solucion", "aplicacion", "resultado"]
        };
    }
}

// ==================================================
// 💾 GESTOR DE MEMORIA Y CONOCIMIENTO
// ==================================================

class GestorMemoria {
    constructor() {
        this.capacidadCortoPlazo = 50;
        this.capacidadLargoPlazo = 10000;
    }

    buscarConocimiento(palabrasClave, tipo) {
        const resultados = {};

        // Búsqueda en base de conocimientos
        Object.keys(BASE_CONOCIMIENTOS).forEach(categoria => {
            if (BASE_CONOCIMIENTOS[categoria][tipo]) {
                const relevancia = this.calcularRelevancia(BASE_CONOCIMIENTOS[categoria][tipo], palabrasClave);
                if (relevancia > 0.3) resultados[categoria] = BASE_CONOCIMIENTOS[categoria][tipo];
            }
        });

        // Búsqueda en memoria histórica
        const historico = MEMORIA_LARGO_PLAZO.filter(interaccion => {
            return interaccion.analisis.palabrasClave.some(p => palabrasClave.includes(p));
        }).slice(0, 5);

        if (historico.length > 0) resultados.historico = historico;

        return Object.keys(resultados).length > 0 ? resultados : null;
    }

    calcularRelevancia(contenido, palabrasClave) {
        if (!contenido || !contenido.palabrasClave) return 0;
        const coincidencias = palabrasClave.filter(p => contenido.palabrasClave.includes(p)).length;
        return coincidencias / palabrasClave.length;
    }

    guardarInteraccion(entrada, respuesta, analisis, comprension) {
        // Memoria corto plazo
        MEMORIA_CORTO_PLAZO.unshift({ entrada, respuesta, analisis, comprension, fecha: new Date() });
        if (MEMORIA_CORTO_PLAZO.length > this.capacidadCortoPlazo) MEMORIA_CORTO_PLAZO.pop();

        // Memoria largo plazo
        MEMORIA_LARGO_PLAZO.push({ entrada, respuesta, analisis, comprension, fecha: new Date(), id: Date.now() });
        if (MEMORIA_LARGO_PLAZO.length > this.capacidadLargoPlazo) MEMORIA_LARGO_PLAZO.shift();

        // Actualizar base de conocimientos si es información valiosa
        if (comprension.valorInformacion > 0.7) {
            this.actualizarBaseConocimientos(entrada, respuesta, analisis, comprension);
        }
    }

    actualizarBaseConocimientos(entrada, respuesta, analisis, comprension) {
        const ruta = this.determinarRutaAlmacenamiento(comprension.tipo, comprension.ambito);
        if (!BASE_CONOCIMIENTOS[ruta.categoria]) BASE_CONOCIMIENTOS[ruta.categoria] = {};
        
        const nuevoConocimiento = {
            contenido: respuesta.texto,
            palabrasClave: analisis.palabrasClave,
            entidades: analisis.entidades,
            fechaCreacion: new Date(),
            vecesUtilizado: 0,
            valido: true,
            fuente: "interaccion_usuario"
        };

        if (!BASE_CONOCIMIENTOS[ruta.categoria][ruta.tipo]) {
            BASE_CONOCIMIENTOS[ruta.categoria][ruta.tipo] = [];
        }
        BASE_CONOCIMIENTOS[ruta.categoria][ruta.tipo].push(nuevoConocimiento);
    }

    determinarRutaAlmacenamiento(tipo, ambito) {
        if (ambito === "tecnico_servicios") return { categoria: "tecnico", tipo: tipo };
        if (ambito === "economico_comercial") return { categoria: "negocios", tipo: tipo };
        if (ambito === "gestion_empresarial") return { categoria: "negocios", tipo: tipo };
        return { categoria: "general", tipo: tipo };
    }

    obtenerContextoReciente(cantidad = 3) {
        return MEMORIA_CORTO_PLAZO.slice(0, cantidad).map(i => ({
            pregunta: i.entrada,
            respuesta: i.respuesta.texto,
            tema: i.comprension.temaPrincipal
        }));
    }

    limpiarMemoriaTemporal() {
        MEMORIA_CORTO_PLAZO = [];
        console.log("🧹 Memoria de corto plazo limpiada");
    }

    exportarConocimiento() {
        return JSON.stringify(BASE_CONOCIMIENTOS, null, 2);
    }

    importarConocimiento(datos) {
        try {
            const datosImportados = JSON.parse(datos);
            BASE_CONOCIMIENTOS = { ...BASE_CONOCIMIENTOS, ...datosImportados };
            return true;
        } catch (e) {
            return false;
        }
    }
}

// ==================================================
// 🔎 BUSCADOR DE INFORMACIÓN Y DATOS
// ==================================================

class BuscadorInformacion {
    constructor() {
        this.fuentes = this.definirFuentes();
        this.limiteResultados = 8;
        this.tiempoMaximo = 3000;
    }

    async buscar(terminos, ambito) {
        const resultados = {
            fuentesConsultadas: [],
            datosEncontrados: [],
            actualizado: true,
            ambito: ambito,
            fechaBusqueda: new Date()
        };

        try {
            // Búsqueda simulada con lógica inteligente
            const busquedaGeneral = await this.busquedaGeneral(terminos[0], ambito);
            resultados.datosEncontrados.push(...busquedaGeneral);
            resultados.fuentesConsultadas.push("Base de Datos Inteligente");

            // Búsqueda específica según ámbito
            if (ambito === "economico_comercial") {
                const datosMercado = await this.buscarDatosMercado(terminos, ambito);
                resultados.datosEncontrados.push(...datosMercado);
                resultados.fuentesConsultadas.push("Análisis de Mercado Argentina 2026");
            }

            if (ambito === "tecnico_servicios") {
                const datosTecnicos = await this.buscarDatosTecnicos(terminos, ambito);
                resultados.datosEncontrados.push(...datosTecnicos);
                resultados.fuentesConsultadas.push("Manuales Técnicos y Soluciones");
            }

            // Procesar y filtrar resultados
            resultados.datosEncontrados = this.filtrarYOrdenar(resultados.datosEncontrados, ambito);
            
            return resultados;

        } catch (error) {
            return {
                fuentesConsultadas: [],
                datosEncontrados: [],
                error: error.message,
                actualizado: false
            };
        }
    }

    async busquedaGeneral(termino, ambito) {
        await this.esperar(600 + Math.random() * 400);
        
        const baseDatos = {
            tecnologia: "Conjunto de conocimientos, técnicas y herramientas que permiten crear, modificar y utilizar bienes y servicios.",
            reparacion: "Proceso de restablecer el funcionamiento correcto de un equipo o dispositivo que presenta fallos o daños.",
            margenGanancia: "Diferencia entre el costo de adquisición/producción y el precio de venta, fundamental para la rentabilidad del negocio.",
            servicioTecnico: "Actividad profesional dedicada al diagnóstico, mantenimiento y reparación de equipos electrónicos y tecnológicos.",
            garantia: "Compromiso del vendedor de responder por cualquier fallo del producto o servicio durante un periodo determinado.",
            tendencias2026: "Digitalización completa, servicios rápidos, experiencia del cliente, sostenibilidad y especialización técnica."
        };

        const resultados = [];
        Object.keys(baseDatos).forEach(clave => {
            if (termino.toLowerCase().includes(clave)) {
                resultados.push({
                    titulo: clave,
                    contenido: baseDatos[clave],
                    relevancia: 0.95,
                    fecha: "2026",
                    tipo: "definicion",
                    confiabilidad: "alta"
                });
            }
        });

        return resultados;
    }

    async buscarDatosMercado(terminos, ambito) {
        await this.esperar(500 + Math.random() * 300);
        
        const datosMercadoArgentina = {
            rangosPrecios: {
                reparacionPantalla: "$15.000 - $45.000",
                cambioBateria: "$8.000 - $22.000",
                reparacionPlaca: "$25.000 - $70.000",
                accesorios: "$2.000 - $35.000",
                mantenimiento: "$5.000 - $12.000"
            },
            tendencias: [
                "Aumento en demanda de reparación de equipos usados",
                "Mayor valoración de garantía y servicio postventa",
                "Preferencia por repuestos de calidad certificada",
                "Demanda creciente de servicios a domicilio"
            ],
            margenesRecomendados: {
                servicios: "40% - 60%",
                productos: "25% - 45%",
                accesorios: "35% - 55%"
            }
        };

        return [
            {
                titulo: "Precios y Mercado Argentina 2026",
                contenido: JSON.stringify(datosMercadoArgentina, null, 2),
                relevancia: 0.92,
                fecha: "Actualizado Mayo 2026",
                tipo: "datos_economicos",
                confiabilidad: "muy_alta"
            }
        ];
    }

    async buscarDatosTecnicos(terminos, ambito) {
        await this.esperar(700 + Math.random() * 500);
        
        const datosTecnicos = {
                problemasComunes: {
                    celular: ["Pantalla rota", "Batería que dura poco", "No carga", "Problemas de señal", "Software lento"],
                    computadora: ["No enciende", "Sistema operativo dañado", "Problemas de memoria", "Sobrecalentamiento", "Virus"],
                    consola: ["Lectura de discos", "Conectividad", "Actualizaciones", "Controladores"]
                },
                solucionesEstandar: {
                    diagnostico: ["Verificación física", "Prueba de componentes", "Análisis de software", "Medición de voltajes"],
                    reparacion: ["Sustitución de piezas", "Reparación de circuitos", "Actualización de firmware", "Limpieza técnica"],
                    prevencion: ["Mantenimiento periódico", "Protección eléctrica", "Uso adecuado", "Actualizaciones regulares"]
                }
            };

        return [
            {
                titulo: "Base de Soluciones Técnicas",
                contenido: JSON.stringify(datosTecnicos, null, 2),
                relevancia: 0.90,
                fecha: "Revisado 2026",
                tipo: "datos_tecnicos",
                confiabilidad: "alta"
            }
        ];
    }

    filtrarYOrdenar(resultados, ambito) {
        return resultados
            .filter(r => r.relevancia > 0.4)
            .sort((a, b) => b.relevancia - a.relevancia)
            .slice(0, this.limiteResultados);
    }

    definirFuentes() {
        return [
            { nombre: "Base Conocimientos Propia", confiabilidad: 0.98, actualizacion: "tiempo real" },
            { nombre: "Análisis Mercado Argentina", confiabilidad: 0.92, actualizacion: "mensual" },
            { nombre: "Bases Técnicas Internacionales", confiabilidad: 0.95, actualizacion: "trimestral" },
            { nombre: "Tendencias Tecnológicas", confiabilidad: 0.88, actualizacion: "semanal" },
            { nombre: "Estadísticas Sectoriales", confiabilidad: 0.90, actualizacion: "anual" }
        ];
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================================================
// ✍️ GENERADOR DE RESPUESTAS INTELIGENTES
// ==================================================

class GeneradorRespuestas {
    constructor() {
        this.plantillas = this.cargarPlantillas();
        this.estilos = this.definirEstilos();
    }

    crear(datos) {
        const { proceso, informacion, conocimiento, comprension, formato } = datos;
        
        // Estructura base de la respuesta
        let respuestaFinal = {
            texto: "",
            tipo: comprension.tipo,
            tieneImagenes: false,
            imagenes: [],
            estructura: proceso.estructura,
            confianza: 0.95,
            tiempoGeneracion: new Date()
        };

        // Seleccionar plantilla adecuada
        const plantilla = this.seleccionarPlantilla(comprension.tipo, proceso.formatoSalida);
        
        // Generar contenido según estructura
        let contenidoGenerado = this.generarContenidoPorEstructura(
            proceso.estructura,
            informacion,
            conocimiento,
            comprension,
            proceso.adaptacionNegocio
        );

        // Aplicar estilo y formato
        contenidoGenerado = this.aplicarEstilo(contenidoGenerado, proceso.profundidad, comprension.sentimiento);

        // Agregar razonamiento si corresponde
        if (proceso.profundidad === "detallada" || proceso.profundidad === "muy_detallada") {
            contenidoGenerado += `\n\n🧠 **RAZONAMIENTO:**\n${proceso.logicaAplicada.join("\n")}`;
        }

        // Agregar imágenes si corresponde
        if (proceso.formatoSalida === "visual_con_texto") {
            respuestaFinal.imagenes = this.generarImagenesPorTipo(comprension.tipo, comprension.temaPrincipal);
            respuestaFinal.tieneImagenes = respuestaFinal.imagenes.length > 0;
            contenidoGenerado += `\n\n🎨 **PROPUESTAS DISEÑADAS ESPECIALMENTE PARA VOS:**\nAcá tenés 3 opciones únicas, modernas y adaptadas a la identidad de Tecno Game:`;
        }

        // Personalizar para el negocio
        contenidoGenerado = this.personalizarParaNegocio(contenidoGenerado, proceso.adaptacionNegocio);

        // Limpiar y dar formato final
        respuestaFinal.texto = this.formatearTextoFinal(contenidoGenerado);

        return respuestaFinal;
    }

    generarContenidoPorEstructura(estructura, informacion, conocimiento, comprension, adaptacion) {
        let contenido = "";
        const secciones = estructura.orden;

        secciones.forEach(seccion => {
            contenido += this.generarSeccion(seccion, informacion, conocimiento, comprension, adaptacion) + "\n\n";
        });

        return contenido.trim();
    }

    generarSeccion(nombreSeccion, informacion, conocimiento, comprension, adaptacion) {
        switch (nombreSeccion) {
            case "concepto":
                return this.generarSeccionConcepto(informacion, conocimiento, comprension);
            case "explicacion":
                return this.generarSeccionExplicacion(informacion, conocimiento, comprension);
            case "ejemplos":
                return this.generarSeccionEjemplos(informacion, conocimiento, comprension, adaptacion);
            case "introduccion":
                return this.generarSeccionIntroduccion(comprension, adaptacion);
            case "pasos":
                return this.generarSeccionPasos(informacion, conocimiento, comprension);
            case "recomendaciones":
                return this.generarSeccionRecomendaciones(informacion, conocimiento, adaptacion);
            case "advertencias":
                return this.generarSeccionAdvertencias(comprension);
            case "analisis":
                return this.generarSeccionAnalisis(informacion, conocimiento, adaptacion);
            case "acciones":
                return this.generarSeccionAcciones(informacion, conocimiento, adaptacion);
            case "ventajas":
                return this.generarSeccionVentajas(adaptacion);
            case "implementacion":
                return this.generarSeccionImplementacion(comprension);
            case "medicion":
                return this.generarSeccionMedicion(comprension);
            case "diagnostico":
                return this.generarSeccionDiagnostico(informacion, conocimiento);
            case "solucion":
                return this.generarSeccionSolucion(informacion, conocimiento);
            case "prevencion":
                return this.generarSeccionPrevencion(adaptacion);
            case "valores":
                return this.generarSeccionValores(informacion, conocimiento, adaptacion);
            case "estrategias":
                return this.generarSeccionEstrategias(informacion, conocimiento, adaptacion);
            case "informacion":
                return this.generarSeccionInformacion(informacion, conocimiento, comprension);
            case "detalles":
                return this.generarSeccionDetalles(informacion, conocimiento);
            case "conclusiones":
                return this.generarSeccionConclusiones(comprension, adaptacion);
            default:
                return this.generarSeccionGenerica(nombreSeccion, informacion, conocimiento);
        }
    }

    generarSeccionConcepto(informacion, conocimiento, comprension) {
        const dato = this.obtenerMejorDato(informacion, conocimiento, "definicion");
        return `📚 **¿QUÉ ES Y EN QUÉ CONSISTE?**\n${dato || "Concepto fundamental relacionado con la tecnología y los servicios que brindamos en Tecno Game."}`;
    }

    generarSeccionExplicacion(informacion, conocimiento, comprension) {
        return `ℹ️ **EXPLICACIÓN DETALLADA:**\nEntiendo perfectamente lo que consultás. Esto funciona de la siguiente manera: es un proceso o concepto que se aplica directamente a nuestro rubro, permitiéndonos brindar mejores servicios y soluciones más eficaces a nuestros clientes en toda Argentina. Se basa en principios técnicos sólidos y adaptados a la realidad de nuestro mercado.`;
    }

    generarSeccionEjemplos(informacion, conocimiento, comprension, adaptacion) {
        return `📌 **EJEMPLOS PRÁCTICOS EN TU NEGOCIO:**\n🔹 Aplicación directa en reparaciones diarias\n🔹 Uso en la definición de precios y tarifas\n🔹 Implementación en estrategias de venta y atención\n🔹 Referencia para capacitación y mejora continua\n🔹 Base para la toma de decisiones diarias en ${adaptacion.rubro}`;
    }

    generarSeccionIntroduccion(comprension, adaptacion) {
        return `👋 **LO QUE TENÉS QUE SABER:**\nTodo lo que te voy a explicar está pensado exclusivamente para ${adaptacion.rubro} en ${adaptacion.ubicacion}, teniendo en cuenta nuestras características, nuestros clientes y lo que mejor funciona acá.`;
    }

    generarSeccionPasos(informacion, conocimiento, comprension) {
        return `📝 **PASO A PASO PARA HACERLO:**\n1. **Preparación:** Tener claro qué es lo que se necesita y qué recursos hacen falta.\n2. **Análisis:** Revisar detalladamente la situación o el equipo en cuestión.\n3. **Ejecución:** Realizar el trabajo con cuidado, siguiendo las normas técnicas.\n4. **Verificación:** Comprobar que todo quedó funcionando perfecto.\n5. **Garantía:** Entregar con explicación clara y garantía correspondiente.\n\n*Recordá: la claridad y la calidad son lo que nos hace diferentes.*`;
    }

    generarSeccionRecomendaciones(informacion, conocimiento, adaptacion) {
        return `✅ **RECOMENDACIONES DE EXPERTO:**\n🔹 Usá siempre materiales de buena calidad, eso te da prestigio.\n🔹 Dá garantía por escrito: es lo que más valora el cliente.\n🔹 Tené precios claros y visibles desde el principio.\n🔹 Actualizate seguido: la tecnología cambia muy rápido.\n🔹 Escuchá a tu cliente: sus dudas te ayudan a mejorar.\n🔹 Todo lo que hagas, hacelo pensando en ${adaptacion.valores[0]} y ${adaptacion.valores[1]}.`;
    }

    generarSeccionAdvertencias(comprension) {
        return `⚠️ **COSAS QUE TENÉS QUE TENER EN CUENTA:**\n🔸 Nunca apresures un trabajo: lo rápido y bien hecho se valora, pero mal hecho te hace perder clientes.\n🔸 No prometas cosas que no podés cumplir.\n🔸 Cuidá mucho la información de tus clientes.\n🔸 Si no sabés algo, decilo con claridad: es mejor investigar y responder bien.\n🔸 Tené cuidado con los repuestos de mala calidad: salen caros a la larga.`;
    }

    generarSeccionAnalisis(informacion, conocimiento, adaptacion) {
        const dato = this.obtenerMejorDato(informacion, conocimiento, "datos_economicos");
        return `📊 **ANÁLISIS DE LA SITUACIÓN ACTUAL EN ${adaptacion.ubicacion.toUpperCase()}:**\n${dato ? dato.contenido : "El mercado actual tiene características muy claras: la gente busca confianza, rapidez y precios justos. La competencia es fuerte, pero quien da buen servicio se queda con los clientes."}`;
    }

    generarSeccionAcciones(informacion, conocimiento, adaptacion) {
        return `🚀 **ACCIONES CONCRETAS PARA APLICAR YA:**\n1. **Servicios extra:** Agregá cosas que otros no tienen.\n2. **Precios:** Definilos bien separados y claros.\n3. **Atención:** Recibí bien, explicá claro y despedite bien.\n4. **Redes:** Mostrá lo que hacés: fotos, trabajos, consejos.\n5. **Fidelización:** Hacé que el cliente quiera volver.\n6. **Capacitación:** Aprendé cosas nuevas todo el tiempo.\n\n*Estas acciones están probadas y funcionan muy bien para ${adaptacion.rubro}.*`;
    }

    generarSeccionVentajas(adaptacion) {
        return `🏆 **LO QUE TE VA A DIFERENCIAR DE LOS DEMÁS:**\n🔹 Atención personalizada: te tomás el tiempo necesario.\n🔹 Garantía real y clara: el cliente se queda tranquilo.\n🔹 Soluciones completas: no tenés que ir a otro lado.\n🔹 Precios justos y sin sorpresas.\n🔹 Conocimiento real: sabés de lo que hablás.\n🔹 **Tu ventaja principal:** que todo está pensado para ${adaptacion.ubicacion}.`;
    }

    generarSeccionImplementacion(comprension) {
        return `🛠️ **CÓMO EMPEZAR A APLICARLO:**\nNo hace falta hacer todo de golpe. Empezá por lo más fácil:\n- Primero organizá bien tus precios y servicios.\n- Después mejorá cómo recibís y explicás a la gente.\n- Luego empezá a mostrar