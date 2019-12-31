import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


const PageNotFound: React.FC = () => {
    return <div className="container">
        <div className="row justify-content-center p-5">
            <FontAwesomeIcon className="text-muted text-center col-12" style={{fontSize: 100}} icon={faExclamationTriangle} />
            <p className="text-muted text-center col-12" style={{fontSize: 100}}>Error 404</p>
            <p className="text-muted text-center col-12" style={{fontSize: 25}}>Woops. Looks like this page doesn't exist.</p>
        </div>
    </div>
};
export default PageNotFound;

