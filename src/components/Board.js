let React = require('react');
let Button = require('./Button');

class Board extends React.Component {
    state = {
        buttons: ['red', 'blue', 'green', 'yellow'], // Holds the color of the buttons
        pattern: [], // This will hold the pattern the user clicks
        patternToMatch: [] // holds the pattern that should flash
    };

    addColorToPattern=()=>{
        // This will add a new pattern to the pattern array

        // Pick random value between 0 and 3 which will be index of color chosen
        let randomVal = Math.floor(Math.random()*4); // Choose value between 0 and 3
        let randomColor = this.props.buttons[randomVal];
        this.setState(prevState=>({
            patternToMatch: [...prevState,randomColor]
        }));
    }
    compareClicks(){
        // This will compare the clicks the person made and the pattern
        // If pattern was successful, then call addColorToPattern
        // return this.state.patternToMatch.every(val=>{val===this.state.pattern});
    }
    handleClick=(val)=>{
        // This will place the click pattern into an array
        // Need to set a time after they first click and certain time they have to 
        // click between clicks
        // Once time runs out, call compareClicks no matter what then determine if arrays match or not
        this.setState(prevState=>({
            pattern: [...prevState.pattern,val]
        }));
        // setTimeout(()=>{
        //     // Give them 2s to press the nextbutton
        //     this.compareClicks();
        // },2000)
    }

    render() {
        console.log(this.state.pattern);
        return (
            <div>
                <Button color={this.state.buttons[0]} handleClick={this.handleClick}/>
                <Button color={this.state.buttons[1]} handleClick={this.handleClick} />
                <Button color={this.state.buttons[2]} handleClick={this.handleClick} />
                <Button color={this.state.buttons[3]} handleClick={this.handleClick} />
            </div>
        )
    }
}

module.exports = Board;