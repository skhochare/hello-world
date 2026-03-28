import React from 'react'

const WithLoading = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isLoading: true
            };
        }

        componentDidMount() {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                });
            }, 2000);
        }

        render() {
            if (this.state.isLoading) {
                return <div>Loading...</div>
            }

            return <WrappedComponent {...this.props} />
        }
    }
};

export default WithLoading;