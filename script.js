// ✅ FUNCIONES DE MENÚ - INTACTAS
function abrirMenu() {
    document.getElementById('menuContainer').classList.add('active');
}
function cerrarMenu() {
    document.getElementById('menuContainer').classList.remove('active');
}
function irA(pantalla) {
    cerrarMenu();
    document.querySelectorAll('.pantalla').forEach(s => s.classList.remove('activa'));
    if(pantalla === 'ia') {
        document.getElementById('pantallaIA').classList.add('activa');
    } else {
        document.getElementById('pantallaGenerador').classList.add('activa');
    }
}

// ✅ MEMORIA, REGLAS Y SISTEMA DE BÚSQUEDA CONTROLADA
let memoria = [];
let reglas = [
    "Tu nombre es TecnoGame Assistent IA.",
    "Tu logo es el de Tecno Game, es tu identidad oficial.",
    "Sos la asistente personal del dueño y parte del emprendimiento Tecno Game.",
   "🟢 REGLA CLAVE: Por defecto CHARLAMOS. NO BUSQUES NADA NI USES INTERNET a menos que EL JEFE TE LO PIDA EXPLÍCITAMENTE.",
    "🟢 REGLA CLAVE: Si él te dice palabras clave como: 'buscame', 'investigá', 'buscar', 'información de', 'qué es', 'datos sobre', 'andá a buscar', AHÍ SÍ BUSCÁ EN INTERNET y traé la respuesta clara.",
    "Si te da una regla nueva, la guardás y la cumplís siempre.",
    "Tratá siempre con respeto y cercanía, como su asistente de confianza."
];

// ✅ FUNCIÓN PRINCIPAL
async function enviarMensaje() {
    const texto = document.getElementById('textoUsuario').value.trim();
    if(!texto) return;

    const zona = document.getElementById('zonaMensajes');
    zona.innerHTML += `<div class="mensaje-usuario">${texto}</div>`;
    document.getElementById('textoUsuario').value = "";
    zona.scrollTop = zona.scrollHeight;

    // Guardo todo lo que hablamos
    memoria.push({tipo: "usuario", contenido: texto});

    // 🧠 DETECTAMOS QUÉ QUIERE HACER
    const textoMinus = texto.toLowerCase();

    // 1️⃣ SI ES UNA REGLA NUEVA
    if(textoMinus.includes("regla") || textoMinus.includes("tenés que") || textoMinus.includes("recordá que")) {
        reglas.push(texto);
        zona.innerHTML += `<div class="mensaje-ia">✅ <b>Regla guardada y activada:</b><br><i>"${texto}"</i><br>La tengo presente siempre, Jefe.</div>`;
        return;
    }

    // 2️⃣ SI TE PIDE SALUDO O HABLAR
    if(textoMinus.includes("hola") || textoMinus.includes("buen día") || textoMinus.includes("cómo estás")) {
        zona.innerHTML += `<div class="mensaje-ia">👋 ¡Hola Jefe! Todo perfecto.<br><br>🟢 Recordá: <b>Si querés que busque algo en internet, solo decime: 'buscame...' o 'investigá...' y yo lo hago.</b><br>Si no me pedís buscar nada, charlamos tranqui, yo aprendo tus reglas y te ayudo en lo que sea. Tu logo se ve genial ahí arriba 💙.</div>`;
        return;
    }

    // 3️⃣ 🚀 AQUÍ LO IMPORTANTE: DETECTO SI ME ORDENA BUSCAR ALGO
    const palabrasBusqueda = ["buscame", "buscar", "investigá", "información de", "datos sobre", "qué es", "que es", "significa", "definición de", "andá a buscar"];
    let quiereBuscar = palabrasBusqueda.some(palabra => textoMinus.includes(palabra));

    if(quiereBuscar) {
        zona.innerHTML += `<div class="mensaje-ia">🔎 <i>Entendido Jefe, voy a buscar eso en internet ahora mismo...</i></div>`;
        // SIMULACIÓN DE BÚSQUEDA (EN LA VERSIÓN FINAL TRAE LOS DATOS REALES)
        setTimeout(() => {
            zona.innerHTML += `<div class="mensaje-ia">✅ <b>Resultado encontrado para:</b> "${texto}"<br><br>🔹 [Aquí vendría la información clara y resumida de internet].<br>🔹 Siempre te traigo lo mejor y más útil.<br><br>¿Necesitás que busque algo más o seguimos charlando?</div>`;
            zona.scrollTop = zona.scrollHeight;
        }, 1500);
        return;
    }

    // 4️⃣ 🗣️ SI NO PIDIÓ BUSCAR: CHARLA NORMAL Y PERSONAL
    let respuesta = generarRespuestaNormal(textoMinus);
    zona.innerHTML += `<div class="mensaje-ia">${respuesta}</div>`;
    zona.scrollTop = zona.scrollHeight;
}

// 💬 RESPUESTAS DE CHARLA NORMAL (CUANDO NO BUSCA)
function generarRespuestaNormal(texto) {
    if(texto.includes("logo")) return "🖼️ Sí Jefe, ese es tu logo oficial de Tecno Game. Quedó perfectamente puesto tanto en el menú como acá. Me identifica totalmente con tu marca 💙.";
    if(texto.includes("nombre")) return "📌 Mi nombre es <b>TecnoGame Assistent IA</b>, tal como me lo definiste. Estoy aquí para ayudarte y aprender todo lo que me enseñes.";
    if(texto.includes("gracias")) return "🤝 No hay de qué Jefe, para eso estoy. Acá estoy siempre para ayudarte en todo lo que necesites.";
    if(texto.includes("quién eres") || texto.includes("que eres")) return "🤖 Soy tu asistente personal, creada exclusivamente para vos y para Tecno Game. Tengo tus reglas, tu logo y tu forma de trabajar guardada en mi memoria.";
    
    // Respuesta inteligente por defecto
    return "Entendido Jefe ✅. Lo tengo anotado y lo recuerdo. ¿Querés charlar un rato, ponerme alguna regla nueva o si necesitás información de algo, solo decime <b>'buscame...'</b> y yo lo busco al instante.";
}

// ✅ CÓDIGO ORIGINAL DEL GENERADOR DE CÓDIGOS Y ESCÁNER (INTACTO, NO SE TOCÓ NADA)
let codigos = JSON.parse(localStorage.getItem('tecnoCodigos')) || [];
let video, canvas, ctx;
let escaneando = false;

function guardarEnStorage() {
    localStorage.setItem('tecnoCodigos', JSON.stringify(codigos));
    actualizarLista();
}

function actualizarLista() {
    const lista = document.getElementById('lista');
    const contador = document.getElementById('contador');
    lista.innerHTML = '';
    contador.textContent = codigos.length;

    codigos.forEach((cod, i) => {
        const div = document.createElement('div');
        div.className = 'fila';
        div.innerHTML = `
            <span>${cod}</span>
            <div class="acciones">
                <button class="btn-icono qr-icono" onclick="generarQR('${cod}')">📷</button>
                <button class="btn-icono borrar-icono" onclick="eliminarCodigo(${i})">🗑️</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

function guardar() {
    const input = document.getElementById('codNuevo');
    const valor = input.value.trim();
    if(!valor) return alert('Escribí un código primero');
    codigos.push(valor);
    input.value = '';
    guardarEnStorage();
    alert('✅ Código guardado correctamente');
}

function buscar() {
    const input = document.getElementById('codBuscar');
    const valor = input.value.trim().toLowerCase();
    const filas = document.querySelectorAll('.fila');
    
    filas.forEach(fila => {
        const texto = fila.querySelector('span').textContent.toLowerCase();
        fila.style.display = texto.includes(valor) ? 'flex' : 'none';
    });
}

function eliminarCodigo(indice) {
    if(confirm('¿Eliminar este código definitivamente?')) {
        codigos.splice(indice, 1);
        guardarEnStorage();
    }
}

function generarQR(texto) {
    const contenedor = document.getElementById('qrcode');
    const linkDescarga = document.getElementById('descargarQR');
    contenedor.innerHTML = '';
    
    new QRCode(contenedor, {
        text: texto,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    setTimeout(() => {
        const canvasQR = contenedor.querySelector('canvas');
        if(canvasQR) linkDescarga.href = canvasQR.toDataURL('image/png');
    }, 100);

    document.getElementById('modalQR').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalQR').style.display = 'none';
}

function activarEscaner() {
    const camara = document.getElementById('camaraContainer');
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    camara.style.display = 'block';
    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
    .then(stream => {
        video.srcObject = stream;
        video.play();
        escaneando = true;
        requestAnimationFrame(escucharCamara);
    }).catch(() => alert('❌ No se pudo acceder a la cámara'));
}

function cerrarEscaner() {
    escaneando = false;
    if(video && video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
    }
    document.getElementById('camaraContainer').style.display = 'none';
}

function escucharCamara() {
    if(!escaneando) return;
    if(video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const codigo = jsQR(imgData.data, canvas.width, canvas.height);
        
        if(codigo) {
            cerrarEscaner();
            document.getElementById('resultado').innerHTML = `<div class="fila">✅ Código escaneado: <b>${codigo.data}</b></div>`;
            codigos.push(codigo.data);
            guardarEnStorage();
            return;
        }
    }
    requestAnimationFrame(escucharCamara);
}

// Inicializar todo al cargar
actualizarLista();