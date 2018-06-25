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
    let loggedUser = null;
    let playedGames = [];

    //Board restriction handler
    const restrictBoard = (array) => {
        for(let i = 0;i<array.length;i++){
            $(`#g${array[i]}s1`).prop('readonly',true);
            $(`#g${array[i]}s2`).prop('readonly',true);
            $(`#${array[i]}`).prop('disabled',true);
        }
    }

    // Database reference
    const dbRef = firebase.database();

    // Save values
    const logoutBtn = document.getElementById('logout');
    const auth = firebase.auth();

    // Listeners
    logoutBtn.addEventListener('click', e => {
        auth.signOut();
        window.location = "index.html";
    })

    // $('#results').on('click', () => {
    //     window.location = 'results.html';
    // })
    
    $('.game-btn > button').on('click', e => {
        if(!e) e = window.event;
        let gameSelect = e.target.id;
        let gameNumber = `Game${gameSelect}`;
        let score1 = document.getElementById(`g${gameSelect}s1`);
        let score2 = document.getElementById(`g${gameSelect}s2`);        
        let myTeam1 = $(`#g${gameSelect}t1`).text();
        let myTeam2 = $(`#g${gameSelect}t2`).text();

        let myScore1 = score1.value;
        let myScore2 = score2.value;

        if(myScore1 === "" || myScore2 === "" || isNaN(myScore1) || isNaN(myScore2)) {
            toastr.warning('Please fill out the scores correctly before submitting'); 
            return false;
        }else {

            dbRef.ref(`profiles/${loggedUser}/games/${gameNumber}`)
            .set({
                [myTeam1]: myScore1,
                [myTeam2]: myScore2,
                'time': Date.now(),
            });
            toastr.success('Your results have been saved!');  
        }
        let childRef = dbRef.ref(`profiles/${loggedUser}/hasBet`);
        childRef.child(gameNumber).set({
            [gameNumber]: true
        })
        restrictBoard(playedGames);
    })
    

    //Real time listener
    auth.onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            loggedUser = firebaseUser.uid;
            toastr.success('You are now logged in!')

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

            // Predictions already entered
            let childRef = dbRef.ref(`profiles/${loggedUser}/hasBet`);
            childRef.on('child_added', (snap) => {
                snap.forEach((child)=>{
                    const primeKey = child.key.slice(4);
                    playedGames.push(primeKey);
                    let board = dbRef.ref(`profiles/${loggedUser}/games`).child(child.key)
                    .once('value',(snap) => {
                        let game = snap.val();
                        for(const key in game){
                            let firstTeam = $(`#g${primeKey}t1`).text();
                            let secondTeam = $(`#g${primeKey}t2`).text();
                            if(firstTeam===key){
                                $(`#g${primeKey}s1`).val(game[key]);
                            }else if(secondTeam===key){
                                $(`#g${primeKey}s2`).val(game[key]);
                            }
                        }
                    })
                }) 
            })

            childRef.once('value', (snap) => {
                snap.forEach((child)=>{
                    let restrictGame = child.key.slice(4)
                    $(`#g${restrictGame}s1`).prop('readonly',true);
                    $(`#g${restrictGame}s2`).prop('readonly',true);
                    $(`#${restrictGame}`).prop('disabled',true);
                }) 
            })


            
            
        }else {
            window.location = "index.html";
        }
    });

    


})