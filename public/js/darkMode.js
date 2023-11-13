const switchMode = document.querySelector('.switch')
const body = document.querySelector('body')
const luna = document.querySelector('.luna')
const sol = document.querySelector('.sol')




function agruparEventListener() {
    document.addEventListener('DOMContentLoaded', (() =>{
        cargarModoOscuro()
    }));
    switchMode.addEventListener('click', cambiarModo);
}
agruparEventListener();



function cargarModoOscuro() {
    const modoOscuroActivado = localStorage.getItem('modoOscuro') === 'true';

    if (modoOscuroActivado) {
        activarModoOscuro();
    }
}


function activarModoOscuro(){
    body.classList.add('dark')
    sol.classList.remove('oculto')
    switchMode.classList.add('dark');
    luna.classList.add('oculto')

    localStorage.setItem('modoOscuro', 'true')
}

function desactivarModoOscuro(){
    body.classList.remove('dark')
    sol.classList.add('oculto')
    switchMode.classList.remove('dark');
    luna.classList.remove('oculto')

    localStorage.setItem('modoOscuro','false')
}

function cambiarModo(){
    if(body.classList.contains('dark')){
        desactivarModoOscuro()
    }else{
        activarModoOscuro()
    }
}