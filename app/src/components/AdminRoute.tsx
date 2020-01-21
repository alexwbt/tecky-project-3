import * as React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from '../store';

interface IAdminRouteProps extends RouteProps {
    authenticated: boolean | null;
    role: number;
    componentProps?: any;
}

const AdminRoute = ({ component, authenticated, role, componentProps, ...rest }: IAdminRouteProps) => {
    const Component = component;
    if (Component == null || authenticated === null) {
        return null;
    }
    let render: (props: any) => JSX.Element;
    if (authenticated && role === 1) {
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
    authenticated: state.auth.authenticated,
    role: state.auth.role
});
export default connect(mapStateToProps)(AdminRoute);
