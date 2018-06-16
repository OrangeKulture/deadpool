$(document).ready(function(){

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyCVM_-RTKoQnQXnpCoks08-s5s5FjcGDzk",
        authDomain: "world-cup-pool-82286.firebaseapp.com",
        databaseURL: "https://world-cup-pool-82286.firebaseio.com",
        projectId: "world-cup-pool-82286",
        storageBucket: "world-cup-pool-82286.appspot.com",
        messagingSenderId: "152044465811"
    };
    firebase.initializeApp(config);

    // Database references

    const dbRef = firebase.database();
    

    // Save values
    const logEmail = document.getElementById('log-email');
    const logPwd = document.getElementById('log-pwd');
    const logBtn = document.getElementById('log-btn');
    const createName = document.getElementById('create-name');
    const createLast = document.getElementById('create-last');
    const createEmail = document.getElementById('create-email');
    const createPwd = document.getElementById('create-pwd');
    const createBtn = document.getElementById('create-btn');
    const auth = firebase.auth();


    // Listeners
    createBtn.addEventListener('click', e => {

        let name = createName.value;
        let lastName = createLast.value;
        let userName = name+" "+lastName;
        let email = createEmail.value;
        let pwd = createPwd.value;
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(email,pwd)
        .then(user => {
            let newUser = user.user.uid;
            dbRef.ref('/profiles/'+newUser+'/info')
            .set({
                'display': userName
            })
        })
        .catch(e => {
            console.log(e.error);
            toastr.error(e.message);
        });


    });

    logBtn.addEventListener('click', e => {
        let email = logEmail.value;
        let pwd = logPwd.value;
        
        auth.signInWithEmailAndPassword(email, pwd)
        .catch(e => {
            console.log(e.code);
            toastr.error(e.message);
        })
    })


        // Real time listener
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
                window.location = "games.html";
            }else {}
        });


})