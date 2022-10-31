
        const url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

        const miformulario = document.querySelector('form');
        miformulario.addEventListener('submit',eve=>{
            eve.preventDefault();
            const data = {};

            for (let element of miformulario.elements) {
                if(element.name.length>0)
                {
                    data[element.name] = element.value;
                }
            }

            fetch(url+'login',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{'Content-Type':'application/json'}
            }).
            then(resp=>resp.json()).
            then(({msg,token})=>{
                if(msg) {return console.error(msg);}
                localStorage.setItem('token',token);
                window.location = 'chat.html';
            }).
            catch(err=>console.log(err));
        })


        function onSignIn(googleUser) {

            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

            var id_token = googleUser.getAuthResponse().id_token;
            const data = { id_token };

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode:'cors',
                cache:'default',
                body: JSON.stringify( data )
            };
            var myRequest = new Request(url+'google', options);

            fetch(myRequest)
            .then( resp => resp.json() )
            .then( data => console.log( 'Nuestro server', data ) )
            .catch(console.warn );
            
        }

        function signOut() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            });
        }


