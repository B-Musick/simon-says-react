let React = require('react');
let Button = require('./Button');

class Board extends React.Component {
    state = {};
    render() {
        return (
            <div>
                <Button />
                <Button />
                <Button />
                <Button />
            </div>
        )
    }
}

module.exports = Board;