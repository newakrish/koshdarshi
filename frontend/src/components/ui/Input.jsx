import React from 'react';
import './Input.css';

const Input = ({ label, id, error, ...props }) => {
    return (
        <div className="input-wrapper">
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};

export default Input;
