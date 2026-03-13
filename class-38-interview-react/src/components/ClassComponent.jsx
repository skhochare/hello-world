import React from "react";

// Define a class-based component
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>
    }
}

export default Welcome;