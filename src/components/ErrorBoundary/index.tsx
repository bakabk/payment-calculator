import React, {Component, ReactNode} from 'react';

interface Iprops {
    children: ReactNode
}

interface IState {
    error: null | any,
    errorInfo: null | any
}

class ErrorBoundary extends Component<Iprops, IState> {
    constructor(props: any) {
        super(props);
    }

    public state: IState = {
        error: null,
        errorInfo: null
    };

    componentDidCatch(error: any, errorInfo: any) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary;