import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
                // fetch all gifts
                const fetchGifts = async () => {
                    try {
                        let url = `${urlConfig.backendUrl || ''}/gifts`
                        const response = await fetch(url);
                        if (!response.ok) {
                            //something went wrong
                            throw new Error(`HTTP error; ${response.status}`)
                        }
                        const data = await response.json();
                        setGifts(data);
                    } catch (error) {
                        console.log('Fetch error: ' + error.message);
                    }
                };
        
                fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/details/${productId}`); // Write your code below this line

      };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        if (timestamp == null) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift, index) => (
                    <div key={gift.id || gift._id || index} className="col-md-4 mb-4">
                        <div className="card product-card">
                            <div className="image-placeholder">
                                 {(gift.image || gift.image_url) ? (
                                 <img src={gift.image || gift.image_url} alt={gift.name || 'Gift'} className="card-img-top" />
                                 ) : (
                                 <div className="no-image-available">No Image Available</div>
                                 )}
                            </div>

                            <div className="card-body">
                                <h5 className="card-title">{gift.name || 'Unnamed'}</h5>
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition || '—'}
                                </p>
                                <p className="card-text">{formatDate(gift.date_added)}</p>

                                <button onClick={() => goToDetailsPage(gift.id || gift._id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
