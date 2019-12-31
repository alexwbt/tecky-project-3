import { IRootState } from './store';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as React from 'react';

interface IPrivateRouteProps extends RouteProps {
    authenticated: boolean;
}

const PrivateRoute = ({ component, authenticated, ...rest }: IPrivateRouteProps) => {
    const Component = component;
    if (Component == null) {
        return null;
    }
    let render: (props: any) => JSX.Element;
    if (authenticated) {
        render = (props: any) => <Component {...props} />
    } else {
        render = (props: any) => <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }} />
    }
    return <Route {...rest} render={render} />
};

const mapStateToProps = (state: IRootState) => ({
    authenticated: state.auth.authenticated
});
export default connect(mapStateToProps)(PrivateRoute);
