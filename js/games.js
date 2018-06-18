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
            $(`#g${array[i]}s1`).prop('disabled',true);
            $(`#g${array[i]}s2`).prop('disabled',true);
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
    
    $('.game-btn > button').on('click',(e) => {
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

            // populate submitted picks
            // dbRef.ref('profiles/'+loggedUser+'/games')
            // .once('value', (snap) => {
            //     snap.forEach((game) => {
            //         for(const team in game){
            //             console.log(team);
            //         }
            //     })
            // })


            // Predictions already entered
            let childRef = dbRef.ref(`profiles/${loggedUser}/hasBet`);
            childRef.on('child_added', (snap) => {
                snap.forEach((child)=>{
                    playedGames.push(child.key.slice(4));

                    // dbRef.ref(`profiles/${loggedUser}/games/${child.key}`)
                    // .once('value', (snap) => {
                    //     let obj = snap.val();
                    //     for(let key in obj){
                    //         let team1 = $(`#g${child.key.slice(4)}t1`);
                    //         let team2 = `#g${child.key.slice(4)}t1`
                    //         console.log(key);
                    //     }
                    // })
                }) 
            })

            // Games which have already been predicted are disabled
            childRef.once('value', (snap) => {
                snap.forEach((child)=>{
                    let restrictGame = child.key.slice(4)
                    $(`#g${restrictGame}s1`).prop('disabled',true);
                    $(`#g${restrictGame}s2`).prop('disabled',true);
                    $(`#${restrictGame}`).prop('disabled',true);
                }) 
            })
            
            
        }else {
            window.location = "index.html";
        }
    });

    


})