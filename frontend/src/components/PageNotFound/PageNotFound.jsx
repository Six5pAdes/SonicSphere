import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="four-oh-four-contain">
            <h1 className="page-not-found">404 - Page Not Found</h1>
            <h2 className="page-not-found">We are in the middle of building this page. <br /> Please check back again later.</h2>
            <img className="page-not-found" src="https://d2bzx2vuetkzse.cloudfront.net/unshoppable_producs/0aa313d3-cf7b-4e0e-8e27-59a255b2a06a.png" alt="Page Not Found" />
            <button className="return" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}

export default PageNotFound;
