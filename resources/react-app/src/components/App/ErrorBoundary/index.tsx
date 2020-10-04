import React from 'react';
import SplashScreen from '../SplashScreen';

export default class ErrorBoundary extends React.Component<
  { returnTo: string },
  { hasError: boolean; message: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  componentDidCatch(error: Error) {
    // Display fallback UI
    this.setState({ hasError: true, message: error.message });
  }

  render() {
    const { hasError, message } = this.state;
    const { children, returnTo } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <SplashScreen
          type="danger"
          message={message}
          button={{ label: 'Retour', path: returnTo || '/' }}
        />
      );
    }
    return children;
  }
}
