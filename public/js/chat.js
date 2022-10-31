const url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario=null;
let socket = null;
//Referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');



const validarJWT = async()=>
{
    const token = localStorage.getItem('token')||'';

    if(token.length < 10)
    {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url,{headers:{'x-token':token}});
    const {usuario:usuarioDB,token:tokenDB} = await resp.json();
    usuario=usuarioDB;
    localStorage.setItem('token',tokenDB);

    await conectarSocket();

}

const conectarSocket = async()=>
{
    socket = io({
        'extraHeaders':{'x-token':localStorage.getItem('token')}
    });

    socket.on('recibir-mensaje',dibujarMensajes);

    socket.on('usuarios-activos',dibujarUsuarios);

    socket.on('mensaje-privado',(payload)=>{
        console.log(payload);
    });

    
}

const dibujarUsuarios = (usuarios=[])=>
{

    let htmlUsers = ``;

    usuarios.forEach(({nombre,uid})=>
        {
            htmlUsers+=`
            <li>
                  <p>
                       <h5 class="text-success">${nombre}</h5>
                       <span class="fs-6 text-muted">${uid}</span>
                  </p>

            </li>
            `;
        })

        ulUsuarios.innerHTML = htmlUsers;
}

const dibujarMensajes = (mensajes=[])=>
{

    let Mensajeshtml = ``;

    mensajes.forEach(({nombre,mensaje})=>
        {
            Mensajeshtml+=`
            <li>
                  <p>
                       <h5 class="text-primary">${nombre}</h5>
                       <span>${mensaje}</span>
                  </p>
            </li>
            `;
        })
        ulMensajes.innerHTML = Mensajeshtml;
}

txtMensaje.addEventListener('keyup',({keyCode})=>
{
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;


    if(keyCode !== 13){
        return;
    }

    if(mensaje.length<=0){return;}

    socket.emit('enviar-mensaje',{mensaje,uid});

    txtMensaje.value = '';
    txtUid.value = '';

});

const main = async ()=>
{
    await validarJWT();
}

main();

/* const socket = io(); */