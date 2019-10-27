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
            wins: 0,
            lose: false,
            currentCount: 4,
            sounds: {
                'red': 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
                'blue': 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
                'green': 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
                'yellow': 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',

            }
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

 

            console.log('started timer');
        }else if(this.state.lose){
            clearInterval(this.intervalId)
        }
    }
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
    }

    compareClicks=()=>{
        // This will compare the clicks the person made and the pattern
        // If pattern was successful, then call addColorToPattern
        let compareClicks = this.state.patternToMatch.every((val, index) => {return val === this.state.pattern[index] });
        
        if(compareClicks){
           // If the clicks from user match those in storage
            this.setState(prevState => ({ playGame: false, pattern: [], stop: false, wins: prevState.wins + 1, interval: null })); // Reset the array to empty
            // If clicks matched then want to restart the game with an extra color
            this.addColorToPattern();
            
            console.log('Added color');
        }else{
            this.setState({ lose: true, playGame: false, pattern: [], stop: false, interval: null});
            console.log('You lost');
        }
    }

    startGame=()=>{
        // Called when 'Play Game' button pressed
        // Will effectively allow first color to be set when componentDidUpdate is called
        this.setState({
            playGame:true
        })
    }

    startCount=()=>{
        this.setState({currentCount:4}); // Restart the count to 4

        // Start the timer
        this.intervalId = setInterval(this.timer, 1000);
    }

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
            console.log('game over '+newCount);
            console.log(this.state)
        };
    }

    flashButtons=()=>{
        // This will go through the current pattern and flash the buttons in the 
        // patternToMatch
        let patternToMatch = this.state.patternToMatch;
        let index = 0;
        let doneLoop = false;
        this.flashInterval = setInterval(()=>{
            console.log('color')
            // Loop through the colors and display which should be pressed
            // Make button sound as well
            
            let colorButton = document.getElementById(patternToMatch[index]);
            let audioButton = document.getElementById(patternToMatch[index]+"-sound");
            console.log(audioButton +" audio");
            if (index > 0) {
                let prevButton = document.getElementById(this.state.patternToMatch[index - 1]);
                prevButton.style.backgroundColor = 'white';
            }

            colorButton.style.backgroundColor = 'red';
            audioButton.play();
            

                    // colorButton.style.filter = 'brightness(150%)';
            
            if (index < patternToMatch.length - 1) {
                index++;
            } else {
                setTimeout(()=>{
                    // This will return the last button to its original background color
                    document.getElementById(patternToMatch[patternToMatch.length - 1]).style.backgroundColor = 'white';
                },1000)
                clearInterval(this.flashInterval);
                doneLoop = true;
                setTimeout(()=>{
                    this.startCount(); // Start the timer
                },500)
                
            }
            // colorButton.style.filter = 'brightness(100%)';
        },1000)
        
    };
    handleClick=(val)=>{
        // This will place the click pattern into an array
        // Need to set a time after they first click and certain time they have to 
        // click between clicks
        // Once time runs out, call compareClicks no matter what then determine if arrays match or not
        this.setState(prevState=>({
            pattern: [...prevState.pattern,val]
        }));
        // This was giving me trouble, have to clear this interval so doesnt
        // Infinitely loop
        clearInterval(this.intervalId);
        this.startCount();
    }

    render() {
        console.log(this.state.patternToMatch);
        let buttonColors = this.state.buttons;
        let buttonSounds = this.state.sounds;
        // console.log(this.state.playGame)
        return (
            <div>
                <Button color={buttonColors[0]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[0]]}/>
                <Button color={buttonColors[1]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[1]]}/>
                <Button color={buttonColors[2]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[2]]}/>
                <Button color={buttonColors[3]} handleClick={this.handleClick} sound={buttonSounds[buttonColors[3]]}/>
                <button onClick={this.startGame}>Play Game</button>
                <div>{this.state.currentCount}</div>
            </div>
        )
    }
}

module.exports = Board;