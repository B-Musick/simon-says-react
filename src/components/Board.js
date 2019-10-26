let React = require('react');
let Button = require('./Button');

class Board extends React.Component {
    state = {
        buttons: ['red', 'blue', 'green', 'yellow'], // Holds the color of the buttons
        pattern: [], // This will hold the pattern the user clicks
        patternToMatch: [], // holds the pattern that should flash
        playGame: false // Used for when user presses button to play game
    };

    componentDidUpdate(prevProps,prevState){
        
        if (!prevState.playGame && this.state.playGame){
            this.addColorToPattern();
        }
    }
    addColorToPattern=()=>{
        // This will add a new pattern to the pattern array

        // Pick random value between 0 and 3 which will be index of color chosen
        let randomVal = Math.floor(Math.random()*4); // Choose value between 0 and 3
        let randomColor = this.state.buttons[randomVal];
        console.log(randomColor)
        this.setState(prevState=>({
            patternToMatch: [...prevState.patternToMatch,randomColor]
        }));
    }
    compareClicks=()=>{
        // This will compare the clicks the person made and the pattern
        // If pattern was successful, then call addColorToPattern
        console.log(this.state.patternToMatch.every((val, index) => {return val === this.state.pattern[index] }))
        // return this.state.patternToMatch.every((val, index) => { val === this.state.pattern[index] });
    }
    startGame=()=>{
        this.setState({
            playGame:true
        })
    }
    handleClick=(val)=>{
        // This will place the click pattern into an array
        // Need to set a time after they first click and certain time they have to 
        // click between clicks
        // Once time runs out, call compareClicks no matter what then determine if arrays match or not
        this.setState(prevState=>({
            pattern: [...prevState.pattern,val]
        }));
        setTimeout(()=>{
            // Give them 2s to press the nextbutton
            this.compareClicks();
        },2000)
    }

    render() {
        console.log(this.state.patternToMatch);
        console.log(this.state.playGame)
        return (
            <div>
                <Button color={this.state.buttons[0]} handleClick={this.handleClick}/>
                <Button color={this.state.buttons[1]} handleClick={this.handleClick} />
                <Button color={this.state.buttons[2]} handleClick={this.handleClick} />
                <Button color={this.state.buttons[3]} handleClick={this.handleClick} />
                <button onClick={this.startGame}>Play Game</button>
            </div>
        )
    }
}

module.exports = Board;