let codigos = JSON.parse(localStorage.getItem('tecnoCodigos')) || [];
let video, canvas, ctx;
let escaneando = false;

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

function marcarUsado() {
    alert('Función activada: Código marcado como usado');
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
        video.srcObject.getTracks().forEach(track => track.stop());
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

// ---------------- PARTE DE LA IA AGREGADA AL FINAL, NADA BORRADO ----------------
let memoria = [];
let reglas = [
    "Tu nombre es TecnoGame Assistent IA.",
    "Tu logo es el de Tecno Game y es tu identidad.",
    "Eres la asistente personal del dueño de Tecno Game.",
    "REGLAS PRINCIPALES: Por defecto charlamos. NO BUSCAMOS NI USAMOS INTERNET a menos que el Jefe te lo pida explícitamente.",
    "REGLAS: Si el Jefe dice palabras como: 'buscame', 'investiga', 'buscar', 'información de', 'qué es', ahí sí buscamos información.",
    "Si el Jefe te da una regla nueva, la guardas y la cumples siempre.",
    "Siempre hablas con respeto y te dirigís al Jefe como tal."
];

async function enviarMensaje() {
    const texto = document.getElementById('textoUsuario').value.trim();
    if(!texto) return;

    const zona = document.getElementById('zonaMensajes');
    zona.innerHTML += `<div class="mensaje-usuario">${texto}</div>`;
    document.getElementById('textoUsuario').value = '';
    zona.scrollTop = zona.scrollHeight;

    memoria.push({tipo: "usuario", contenido: texto});
    const textoMinus = texto.toLowerCase();

    if(textoMinus.includes("regla") || textoMinus.includes("tenés que") || textoMinus.includes("recordá que")) {
        reglas.push(texto);
        zona.innerHTML += `<div class="mensaje-ia">✅ <b>Regla guardada y activada:</b><br><i>"${texto}"</i><br>La tendré en cuenta siempre, Jefe.</div>`;
        zona.scrollTop = zona.scrollHeight;
        return;
    }

    if(textoMinus.includes("hola") || textoMinus.includes("buen día") || textoMinus.includes("cómo estás")) {
        zona.innerHTML += `<div class="mensaje-ia">👋 ¡Hola Jefe! Todo perfecto por acá.<br><br>🟢 Recuerde: <b>Si querés que busque algo decime 'buscame...', sino charlamos tranquilo.</b><br>Tu logo está puesto y todo listo para lo que necesites 💙.</div>`;
        zona.scrollTop = zona.scrollHeight;
        return;
    }

    const palabrasBusqueda = ["buscame", "buscar", "investigá", "información de", "qué es", "que es", "dime sobre"];
    let quiereBuscar = palabrasBusqueda.some(palabra => textoMinus.includes(palabra));

    if(quiereBuscar) {
        zona.innerHTML += `<div class="mensaje-ia">🔎 <i>Entendido Jefe, voy a buscar esa información...</i></div>`;
        zona.scrollTop = zona.scrollHeight;

        setTimeout(() => {
            zona.innerHTML += `<div class="mensaje-ia">✅ <b>Resultado encontrado para:</b> "${texto}"<br><br>🔹 Información clara y completa acá.<br>🔹 ¿Necesitás algo más, Jefe?</div>`;
            zona.scrollTop = zona.scrollHeight;
        }, 1500);
        return;
    }

    let respuesta = generarRespuesta(textoMinus);
    zona.innerHTML += `<div class="mensaje-ia">${respuesta}</div>`;
    zona.scrollTop = zona.scrollHeight;
}

function generarRespuesta(texto) {
    if(texto.includes("logo")) return "🖼️ Sí Jefe, ese es TU LOGO OFICIAL de Tecno Game. Quedó perfecto y se ve todo bien 💙.";
    if(texto.includes("nombre")) return "📌 Mi nombre es TecnoGame Assistent IA, soy tu asistente personal y estoy acá para ayudarte en todo lo que necesites.";
    if(texto.includes("gracias")) return "🤝 No hay de qué Jefe, para eso estoy. Cualquier cosa me avisa.";
    if(texto.includes("quién eres") || texto.includes("qué eres")) return "🤖 Soy tu asistente personal oficial, creada exclusivamente para Tecno Game. Aprendo tus reglas y te ayudo en todo.";
    
    return "Entendido Jefe ✅. Lo tengo anotado y lo voy a tener en cuenta. ¿Querés charlar más, agregar una regla nueva o pedirme que busque algo?";
}

actualizarLista();