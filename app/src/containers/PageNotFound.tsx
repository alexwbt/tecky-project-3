import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


const PageNotFound: React.FC = () => {
    document.title = "BlockDojo - Page Not Found"
    return <div className="container">
        <div className="row justify-content-center p-5 text-white">
            <FontAwesomeIcon className="text-center col-12" style={{fontSize: 100}} icon={faExclamationTriangle} />
            <p className="text-center col-12" style={{fontSize: 100}}>Error 404</p>
            <p className="text-center col-12" style={{fontSize: 25}}>Woops. Looks like this page doesn't exist.</p>
        </div>
    </div>
};
export default PageNotFound;

