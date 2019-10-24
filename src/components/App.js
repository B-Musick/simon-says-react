let React = require('react');
let Board = require('./Board');

class App extends React.Component{
    state={};
    render(){
        return(
            <Board />
        )
    }
}

module.exports = App;