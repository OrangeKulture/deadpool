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

    // Firebase References
    const dbRef = firebase.database();
    const auth = firebase.auth();
    let loggedUser = null;

    // Listeners
    $('#backBTN').on('click', () => {
        window.location = 'games.html';
    })



    auth.onAuthStateChanged( firebaseUser => {
        if(firebaseUser){
            loggedUser = firebaseUser.uid;

            dbRef.ref('profiles').on('child_added', snapshot => {
                snapshot.forEach(item => {
                    let entry = item.val();
                    let name = entry.display;
                    console.log(name);
                    // if(entry.Game1){
                    //     if(entry.Game1.Game1!=true){
                    //         console.log(entry.Game1);
                    //     }
                    // }
                })
            })

            // Username display
            dbRef.ref("profiles/"+loggedUser+"/info")
            .on('child_added', (snap) => {
                let dispName = snap.val();
                $('#dispUser').text(dispName);
            })

            // Total points display
            dbRef.ref("profiles/"+loggedUser+"/points")
            .on('child_added', (snap) => {
                let totalPoints = snap.val();
                $('.user-points').text(totalPoints);
            })

        } else {
            window.location = 'index.html';
        }
    })



});