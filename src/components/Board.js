let React = require('react');
let Button = require('./Button');

class Board extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            buttons: ['red', 'blue', 'green', 'yellow'], // Holds the color of the buttons
            pattern: [], // This will hold the pattern the user clicks
            patternToMatch: [], // holds the pattern that should flash
            playGame: false, // Used for when user presses button to play game,
            stop: false, // Used to stop game
            wins: 19,
            lose: false,
            currentCount: 4,
            sounds: {
                'red': 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
                'blue': 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
                'green': 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
                'yellow': 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',

            },
            strict:false,
            win: false,// This will determine if clicks checked right after user clicks or not
            flashing: false  // Lets the game know its currently flashing blocks
        };
    }
    intervalId = 0;
    flashInterval = 0;
    
    componentDidUpdate(prevProps,prevState){
        
        // After 'Play Game' button pressed, startGame() changes playGame state
        // value to true, thus when updated, this is called and adds first color to pattern
        if (!prevState.playGame && this.state.playGame){
            // This will initialize the game, adding first color then start timer
            this.addColorToPattern();
            console.log('Started timer');
        }else if(this.state.lose){
            clearInterval(this.intervalId)
        }
    }

    restartGame=()=>{
        console.log('Restarting game');
        if(this.state.lose){
            // If player loses, can press restart and game restarts
            clearInterval(this.intervalId);
            this.setState({
                pattern: [],
                patternToMatch: [],
                stop: false,
                wins: 0,
                lose: false,
                playGame: true
            });
            
        }else{
            // If press restart during game, the game restarts
            clearInterval(this.intervalId);
            this.setState(prevState=>({
                pattern: [],
                patternToMatch: [],
                stop: false,
                wins: 0,
                lose: false,
                playGame:false
                
            }));
            setTimeout(()=>{
                this.setState({playGame:true})
            },1000);          
        }
    };

    addColorToPattern=()=>{
        // This will add a new pattern to the pattern array
        // Pick random value between 0 and 3 which will be index of color chosen
        // This is first called when player first presses playGame
        // then it is called when that round is over in compareClicks()
        let randomVal = Math.floor(Math.random()*4); // Choose value between 0 and 3
        let randomColor = this.state.buttons[randomVal];
        
        this.setState(prevState=>({
            patternToMatch: [...prevState.patternToMatch,randomColor]
        }));
        // Once the new color is added then start flashing
        setTimeout(() => {
            // When the game starts, need to flash the buttons
            if (this.state.patternToMatch.length > 0) {
                this.flashButtons();
            }
        })
    };

    compareClicks=()=>{
        // This will compare the clicks the person made and the pattern
        // If pattern was successful, then call addColorToPattern
        let compareClicks = this.state.patternToMatch.every((val, index) => {return val === this.state.pattern[index] });
        
        if(compareClicks){
           // If the clicks from user match those in storage
            this.setState(prevState => ({ playGame: false, pattern: [], stop: false, wins: prevState.wins + 1, interval: null })); // Reset the array to empty
            // If clicks matched then want to restart the game with an extra color
            setTimeout(()=>{
                
                if (this.state.wins === 20) {
                    // If user wins twenty rounds then print you win and start over (add something to screen)
                    console.log('You win!');
                    this.restartGame();
                }else{
                    // If havent hit twenty wins then add color
                    this.addColorToPattern();
                    console.log('Added color');
                }
            },500)
        }else{
            
            let loseSound = document.getElementById('lose-sound');
            // this.setState({ lose: true, playGame: false, pattern: [], stop: false, interval: null, patternToMatch: [] });

            // Play crashing sound when player loses
            loseSound.play();
            setTimeout(()=>{
                loseSound.pause();
                loseSound.currentTime = 0;
            },1400)
            console.log('You lost');
            // If strict mode then restart whole game
            if (this.state.strict) this.restartGame();
            // If not strict mode then just show buttons again
            else {
                this.setState({ lose: false, stop: false, interval: null, pattern:[] });
                this.flashButtons();
            }
            
        }
    };

    setLoss=()=>{

    }
    compareStrictClicks=(array)=>{
        // Called in handleClick() when in strict mode
        let compareClicks = array.every((val, index) => { return val === this.state.patternToMatch[index] });
        console.log('compare '+compareClicks)
        if (!compareClicks) {
            this.setState({ lose: true, playGame: false, pattern: [], stop: false, interval: null, patternToMatch: [] });
            let loseSound = document.getElementById('lose-sound');
            // Play crashing sound when player loses
            loseSound.play();
            setTimeout(() => {
                loseSound.pause();
                loseSound.currentTime = 0;
            }, 1400)
            console.log('You lost');
        }
        return compareClicks;
    };

    startGame=()=>{
        // Called when 'Play Game' button pressed
        // Will effectively allow first color to be set when componentDidUpdate is called
        this.setState({
            playGame:true
        })
    };

    startCount=()=>{
        this.setState({flashing:false})
        this.setState({currentCount:3}); // Restart the count to 4

        // Start the timer
        this.intervalId = setInterval(this.timer, 1000);
    };

    timer=()=>{
        var newCount = this.state.currentCount - 1;
        console.log(newCount);
        if(newCount>0){
            console.log(this.state)
            this.setState({currentCount:newCount});
        }
        else {
            // If count reaches 0 then stop game
            clearInterval(this.intervalId);
            this.compareClicks();
        };
    };

    flashButtons=()=>{
        this.setState({flashing:true});
        // This will go through the current pattern and flash the buttons in the 
        // patternToMatch
        let patternToMatch = this.state.patternToMatch;
        let index = 0; // Determines when to stop the interval
        this.flashInterval = setInterval(()=>{
            // Loop through the colors and display which should be pressed
            // Make button sound as well
            let colorButton = document.getElementById(patternToMatch[index]);
            let audioButton = document.getElementById(patternToMatch[index]+"-sound");
        
            if (index > 0) {
                let prevButton = document.getElementById(this.state.patternToMatch[index - 1]);
                // prevButton.style.backgroundColor = 'white';
                prevButton.style.filter = 'brightness(100%)';
            }
            // Play the button and highlight it so the pattern is showsn
            audioButton.play();
            colorButton.style.filter = 'brightness(150%)';
            
            if (index < patternToMatch.length - 1) {
                index++;
            } else {
                setTimeout(()=>{
                    // This will return the last button to its original background color
                    document.getElementById(patternToMatch[patternToMatch.length - 1]).style.filter = 'brightness(100%)';
                },1000)
                // Clear the interval so it stops looping
                clearInterval(this.flashInterval);
                setTimeout(()=>{
                    this.startCount(); // Start the timer
                },500)
                
            }
            
        },1000)
        
    };

    handleClick=(val)=>{
        if(!this.state.flashing){
            // This will place the click pattern into an array
            // Need to set a time after they first click and certain time they have to 
            // click between clicks
            // Once time runs out, call compareClicks no matter what then determine if arrays match or not
            let newPattern = [...this.state.pattern, val];

            if (this.state.strict) {
                this.compareStrictClicks(newPattern);
                // If strict, then checks after each button press
                let compare = newPattern.every((val, index) => { return val === this.state.patternToMatch[index] });

                this.setState(prevState => ({
                    pattern: [...prevState.pattern, val]
                }));
                // Plays sound when clicked and highlight as well
                if (compare) {
                    document.getElementById(val + "-sound").play();
                }

                document.getElementById(val).style.filter = 'brightness(150%)';
                // Remove the brightness to original color
                setTimeout(() => {
                    document.getElementById(val).style.filter = 'brightness(100%)';
                }, 200);


            }
            else {
                this.setState(prevState => ({
                    pattern: [...prevState.pattern, val]
                }));
                // Plays sound when clicked and highlight as well

                document.getElementById(val + "-sound").play();

                document.getElementById(val).style.filter = 'brightness(150%)';
                // Remove the brightness to original color
                setTimeout(() => {
                    document.getElementById(val).style.filter = 'brightness(100%)';
                }, 200);

            }
            // This was giving me trouble, have to clear this interval so doesnt
            // Infinitely loop
            clearInterval(this.intervalId);
            this.startCount();
        }
       
    };

    setStrict=()=>{
        this.setState(prevState=>({strict:!prevState.strict}));
    };

    render() {
        console.log(this.state.patternToMatch);
        let buttonColors = this.state.buttons;
        let buttonSounds = this.state.sounds;
        // console.log(this.state.playGame)
        return (
            <div>
                <button onClick={this.setStrict}>Strict</button>
                <button id="restart-button" onClick={this.restartGame}>Restart</button>
                <audio id="lose-sound" src="https://actions.google.com/sounds/v1/impacts/bamboo_drop_and_tumble.ogg"></audio>
                <Button color={buttonColors[0]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[0]]}/>
                <Button color={buttonColors[1]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[1]]}/>
                <Button color={buttonColors[2]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[2]]}/>
                <Button color={buttonColors[3]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[3]]}/>
                <button onClick={this.startGame}>Play Game</button>
                <div>{this.state.currentCount}</div>
            </div>
        )
    };
};

module.exports = Board;