import React from 'react';
import { Button } from 'react-bootstrap';

export default function ActionBar({ handleShow }) {
    return (
        <>
            <div className="row">
                <div className="col-md-10 col-sm-6">
                    <h2>Our Latest Projects</h2>
                </div>
                <div className="col-md-2 col-sm-6">
                    <Button variant="primary" className="float-right" onClick={handleShow}>
                        Add New Project
                    </Button>
                </div>
            </div>
        </>
    );
}
