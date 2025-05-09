document.addEventListener("DOMContentLoaded", function () {
    const selectFecha = document.getElementById("fecha");
    const visual = document.getElementById("selectorFechaVisual");
    const spanVisual = document.getElementById("fechaSeleccionada");
    const hoy = new Date();

    // Cargar opciones de fecha (hoy + 2 días)
    for (let i = 0; i <= 2; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);

        const valor = fecha.toISOString().split('T')[0];

        const texto = new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(fecha);

        const opcion = document.createElement("option");
        opcion.value = valor;
        opcion.textContent = texto.charAt(0).toUpperCase() + texto.slice(1);

        selectFecha.appendChild(opcion);
    }

    // Mostrar select oculto al hacer clic
    visual.addEventListener("click", function () {
        selectFecha.style.display = "block";
        selectFecha.focus();
    });

    // Mostrar texto seleccionado y ocultar select
    selectFecha.addEventListener("change", function () {
        const opcionSeleccionada = selectFecha.options[selectFecha.selectedIndex];
        spanVisual.textContent = opcionSeleccionada.textContent;
        selectFecha.style.display = "none";
    });

    // Envío del formulario
    document.getElementById("formRegistro").addEventListener("submit", function (event) {
        event.preventDefault();

        const datos = {
            unidad: document.getElementById("unidad").value,
            grado: document.getElementById("grado").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            matricula: document.getElementById("matricula").value,
            celular: document.getElementById("celular").value,
            fecha: document.getElementById("fecha").value
        };

        // Validar matrícula: solo números
        if (!/^[0-9]+$/.test(datos.matricula)) {
            alert("La matrícula debe contener solo números.");
            return;
        }

        // Validar celular: debe empezar con 09 y tener 9 dígitos
        if (!/^09[0-9]{7}$/.test(datos.celular)) {
            alert("El celular debe comenzar con 09 y tener 9 dígitos.");
            return;
        }

        // Formatear fecha para el backend (Miércoles 07 de mayo de 2025)
        const textoFecha = new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(new Date(datos.fecha)).replace(/^\w/, c => c.toUpperCase());

        // Enviar al backend para actualizar el contador
        fetch("http://localhost:3000/api/contar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fechaFormateada: textoFecha })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error al actualizar el contador.");
                }
                console.log("Contador actualizado para:", textoFecha);
            })
            .catch(err => {
                console.error("Error al contactar con el servidor:", err);
            });

        console.log("Datos enviados:", datos);
        alert("Sus datos han sido enviados correctamente");

        // Resetear el formulario
        document.getElementById("formRegistro").reset();
        spanVisual.textContent = "Seleccionar fecha";
    });
});
