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
                let count = 1;
                let myInfo = snapshot.val();
                let dispName = myInfo.info.display;
                console.log(`The picks for ${dispName}`);
                $('.results-main').append(`
                <div class="player style="">
                    <div>${dispName}:</div>
                </div>
                `)
                for(key in myInfo.games){
                    console.log(`The KEY is: ${key}`)
                    $('.results-main').append(`
                    <div class="gameNum">
                        <div>${key}:</div>
                    </div>
                    `)
                    let some = myInfo.games[key];
                    for(index in some){
                        if(index!='time'){
                            console.log(`${index} is: ${some[index]}`);
                            $('.results-main').append(`<br><p>${index}: ${some[index]}<br>`)
                        }
                    
                    }
                    
                }
                
                // if(myInfo.games['Game1']){
                //     $('.game-result-box').append(`
                //         <p> ${dispName} dice que -> Russia: ${myInfo.games['Game1']['Russia']} - ${myInfo.games['Game1']['Saudi Arabia']} Saudi Arabia </p><br/>
                //     `)
                // }
                
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