import React from 'react';
import '../../assets/styles/SearchBar.css';

const SearchResults = ({ searchResults, recsResponse, isLoading }) => {
    // Function to render search results
    const renderSearchResults = () => {
        if (isLoading) {
            return <p>Loading search results...</p>;
        }

        if (!searchResults || searchResults.length === 0) {
            return <p>No search results found.</p>;
        }

        return (
            <ul>
                {searchResults.map((result, index) => (
                    <li key={index}>
                        <h5>{result.title}</h5>
                        <p>{result.summary}</p>
                    </li>
                ))}
            </ul>
        );
    };

    // Function to render recommendation results
    const renderRecsResults = () => {
        if (!recsResponse || recsResponse.length === 0) {
            return null; // or <p>No recommendations available.</p> if you prefer
        }

        return (
            <div>
                <h4>Recommendations:</h4>
                <ul>
                    {recsResponse.map((rec, index) => (
                        <li key={index}>
                            <h5>{rec.title}</h5>
                            <p>{rec.summary}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="search-results">
            <section>
                <h3>Search Results</h3>
                {renderSearchResults()}
            </section>
            <section>
                {renderRecsResults()}
            </section>
        </div>
    );
};

export default SearchResults;
