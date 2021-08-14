let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () { //Evenlistener se coloca sobre contenido ya existente y un event handler se utiliza para cuando se crean elementos en js
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta el Div actual segun el tab al que se presiona
    mostrarSeccion();

    // Oculta o muestra una seccion
    cambiarSeccion();

    // paginacion siguiente y anterior

    paginaSiguiente();

    paginaAnterior();

    // comprueba la pagina actual para ocultar o mostrar la pagina 
    
    botonesPaginador();

    // Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();

    // almacena el nombre de la cita en el objeto
    nombreCita();

    // alamacenar la fecha de la cita del objeto
    fechaCita();

    // Deshabilitar dias pasados
    deshabilitarFechaAnterior();
    // alamacena la hora de la cita
    horaCita();
}

function mostrarSeccion() {

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual');
    // ELiminar la clase de actual en el  tab anterior
    if (tabAnterior ) {
        tabAnterior.classList.remove('actual');
    }
    
    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
};

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);           

            // llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();
        })
    })
};

async function mostrarServicios() {
    // Una consulta es una buen lugar donde usar trycath ya que si no funciona va a segui ejercutandose el codigo
    try {

        const url = 'http://localhost:3000/Pag_AppSalon/servicios.php';
        const resultado = await fetch(url);
        const db = await resultado.json();

        // console.log(db);
        // const { servicios } = db;

        // generar el HTML

        db.forEach(servicio => {
            const { id, nombre, precio } = servicio;
            
            // DOM Scripting
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar precio de servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio')

            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idservicio = id;
            // Selecciona un servicio para la cita 
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar nombre y precio de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);


            // inyectar en HTML
            document.querySelector('#servicios').appendChild(servicioDiv)
        });
    } catch (error) {
        console.log('error');
    }
};

function seleccionarServicio(e) {
    
    let elemento;
     // Forzar que el  elemento al cual le damos click sea el Div
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
        
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) { //contains se usa para verificar si una clase exixte en un elemento 
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idservicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        // construir objeto 
        const servicioObj = {
            id: parseInt(elemento.dataset.idservicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj);
        agregarServicio(servicioObj)
    }
    
};
function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita);
}
function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);

        botonesPaginador();
    });
};

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        console.log(pagina);

        botonesPaginador();
    });
};

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); //Estamos en la pagina 3, caraga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    };

    mostrarSeccion();
};

function mostrarResumen() {
    // destructurin y despues validadcion de objeto
    const { nombre, fecha, hora, servicios } = cita;
    // seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el html previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    // mas rapido que inhert es mejor usar el metodo anterior para proyectos grandes
    

    // validadcion de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        // agregar a resumen Div
        resumenDiv.appendChild(noServicios);
        return;
    } 

    // mostraresumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>  ${hora}`;
     //  innerHTML y textcontetnt sirven para inyectar contenido pero inner acepta el formato html mientras que el otro no
    
    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios') ;

    const headingServicio = document.createElement('H3');
    headingServicio.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicio);

    let cantidad = 0;
    // iterar sobre el arreglo de servicios
    servicios.forEach(servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const nombreServicio = document.createElement('P');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$')
        // console.log(parseInt(totalServicio[1].trim()))
        cantidad += parseInt(totalServicio[1].trim())

        // colocar texto y precio en el div
        contenedorServicio.appendChild(nombreServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    
    // agregando el html para el resumen
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);
    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span>$ ${cantidad}`;
    resumenDiv.appendChild(cantidadPagar)
};

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        // validacion del nombre
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido','error')
        } else {
            const alerta = document.querySelector('.alerta');
                if (alerta) {
                    alerta.remove();
                }
            cita.nombre = nombreTexto
            // console.log(cita);
        }
        
    })
};

function mostrarAlerta(mensaje, tipo) {
    // si hay una alerta previa , no crear otra

    const alertaPrevia = document.querySelector('.alerta')
    if (alertaPrevia) {
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta')

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar eb ek HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);
    // console.log(alerta);

    // Eliminar alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
};

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();
        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no son permitidos','error')
        } else {
            cita.fecha = fechaInput.value;
        }
    });
};

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const dia = fechaAhora.getDate();
    const mes = fechaAhora.getMonth()+ 1;
    
    const fechaDeshabilitar = `${year}-${mes}-${dia}`
    inputFecha.min = fechaDeshabilitar;
};

function horaCita() {
    const inputHora = document.querySelector('#hora')
    inputHora.addEventListener('input', e => {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        // console.log(hora);

        if (hora[0] < 10 ||hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error')
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;
            // console.log('hora valida');
        }
    });
};