import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [ageYears, setAgeYears] = useState('');
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    const runSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (searchName.trim()) params.set('name', searchName.trim());
            if (category) params.set('category', category);
            if (condition) params.set('condition', condition);
            if (ageYears) params.set('age_years', ageYears);
            const url = `${(urlConfig.backendUrl || '').replace(/\/+$/, '')}/search?${params.toString()}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error; ${response.status}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Search error: ' + error.message);
            setSearchResults([]);
        }
    };

    useEffect(() => {
        runSearch();
    }, []);

    const goToDetailsPage = (productId) => {
        navigate(`/app/details/${productId}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        runSearch();
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="mb-3">
                                <label htmlFor="search-name" className="form-label">Search by name</label>
                                <input
                                    id="search-name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter gift name..."
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="search-category" className="form-label">Category</label>
                                <select
                                    id="search-category"
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">All categories</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="search-condition" className="form-label">Condition</label>
                                <select
                                    id="search-condition"
                                    className="form-select"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                >
                                    <option value="">All conditions</option>
                                    {conditions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="search-age" className="form-label">Max age (years)</label>
                                <input
                                    id="search-age"
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    placeholder="Optional"
                                    value={ageYears}
                                    onChange={(e) => setAgeYears(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Search</button>
                        </form>
                    </div>
                    <div className="search-results">
                        <h5>Results</h5>
                        {searchResults.length === 0 ? (
                            <p className="text-muted">No gifts match your search.</p>
                        ) : (
                            <ul className="list-group">
                                {searchResults.map((gift) => (
                                    <li
                                        key={gift.id || gift._id}
                                        className="list-group-item list-group-item-action"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => goToDetailsPage(gift.id || gift._id)}
                                    >
                                        {gift.name || 'Unnamed'} {gift.condition ? `(${gift.condition})` : ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
