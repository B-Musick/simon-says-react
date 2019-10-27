let React = require('react');

class Button extends React.Component {
    constructor(props){
        super(props);
    }
    state = {color:this.props.color};

    handleClick=(e)=>{
        // When this button is clicked pass it up to the Board to store in the pattern array
        // Gets the id of the button (which is the color) and passes to Board
        this.props.handleClick(e.target.id);
    }

    render() {
        return (
            <div id={this.props.color} onClick={this.handleClick}>
                {this.props.color}
                <audio key={this.props.color} id={this.props.color + "-sound"} src={this.props.sound}></audio>
            
            </div>
        )
    }
}

module.exports = Button;