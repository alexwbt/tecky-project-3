import * as React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from '../store';

interface IPrivateRouteProps extends RouteProps {
    authenticated: boolean | null;
    componentProps?: any;
}

const PrivateRoute = ({ component, authenticated, componentProps, ...rest }: IPrivateRouteProps) => {
    const Component = component;
    if (Component == null || authenticated === null) {
        return null;
    }
    let render: (props: any) => JSX.Element;
    if (authenticated) {
        render = (props: any) => <Component {...props} {...componentProps} />
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
