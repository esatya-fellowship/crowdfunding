import React, { useState } from 'react';
import { Row, Col, Modal, Button, Card, Dropdown, DropdownButton, Alert } from 'react-bootstrap';

import ActionBar from './ActionBar';
import ProjectBox from './ProjectBox';
import { calculateDaysLeft, calculatePercentage, ethToWei } from '../utils';

const BORDER_DESINGS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];

function Main({ closeProject, createProject, fundProject, projects }) {
    const updatedProject = projects.map((p) => {
        p.percent = p.balance ? calculatePercentage(p.balance, p.target) : 0;
        p.daysLeft = p.endDate ? calculateDaysLeft(p.endDate) : '0';
        return p;
    });

    // Handle Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Form Handle
    const nameRef = React.useRef();
    const descRef = React.useRef();
    const endDateRef = React.useRef();
    const targetRef = React.useRef();
    const [targetAmt, setTargetAmt] = useState('');

    const handleTargetChange = (evt) => {
        const decimalPattern = /^[+-]?\d*(?:[.,]\d*)?$/;
        if (decimalPattern.test(evt.target.value)) setTargetAmt(evt.target.value);
    };

    return (
        <div id="content" className="mt-2">
            <div>
                <Modal
                    size="lg"
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form
                            id="addNewProject"
                            onSubmit={(event) => {
                                event.preventDefault();
                                const name = nameRef.current.value;
                                const desc = descRef.current.value;
                                const closingDate = new Date(endDateRef.current.value).valueOf();
                                const target = ethToWei(targetRef.current.value.toString());
                                createProject(name, desc, closingDate, target);
                            }}
                        >
                            <Row>
                                <Col>
                                    <div className="form-group mr-sm-2 mb-sm-2">
                                        <label htmlFor="projectName">Project Name</label>
                                        <input
                                            id="projectName"
                                            type="text"
                                            ref={nameRef}
                                            className="form-control"
                                            placeholder="Project Name"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group mr-sm-2 mb-sm-2">
                                        <label htmlFor="closingDate">Project Closing Date</label>
                                        <input
                                            id="closingDate"
                                            className="form-control"
                                            type="datetime-local"
                                            ref={endDateRef}
                                            placeholder="Closing Date"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group mr-sm-2 mb-sm-2">
                                        <label htmlFor="projectTarget">Target Amount (BNB)</label>
                                        <input
                                            id="projectTarget"
                                            type="text"
                                            ref={targetRef}
                                            className="form-control"
                                            placeholder="Project Target"
                                            maxLength={9}
                                            pattern="[+-]?\d+(?:[.,]\d+)?"
                                            onChange={(e) => handleTargetChange(e)}
                                            value={targetAmt}
                                            required
                                        />
                                    </div>
                                </Col>
                                <div className="form-group mr-sm-2 mb-sm-2">
                                    <input
                                        id="projectDesc"
                                        type="text"
                                        ref={descRef}
                                        className="form-control"
                                        placeholder="Project Description"
                                        required
                                    />
                                </div>
                            </Row>
                            <input className="btn btn-danger m-2" type="reset" value="Reset" />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" form="addNewProject" variant="primary">
                            Add Project
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <ActionBar handleShow={handleShow} />

            <div className="container-fluid justify-content-center">
                <div className="row text-center">
                    {updatedProject && updatedProject.length > 0 ? (
                        updatedProject.map((project) => (
                            <div className="col-md-4" key={project.id}>
                                <Card
                                    border={
                                        BORDER_DESINGS[
                                            Math.floor(Math.random() * BORDER_DESINGS.length)
                                        ]
                                    }
                                    className="m-2"
                                >
                                    <ProjectBox project={project} />

                                    {project && project.exists ? (
                                        <Card.Footer className="bg-white">
                                            <div className="row p-2">
                                                <div className="col-md-6">
                                                    <div className="input-group mb-3">
                                                        <div className="input-group-prepend">
                                                            <span
                                                                className="input-group-text"
                                                                id="basic-addon1"
                                                            >
                                                                <i
                                                                    className="fab fa-ethereum"
                                                                    style={{ fontSize: '1.5em' }}
                                                                />
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={project.id}
                                                            name={project.id}
                                                            maxLength="9"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <Button
                                                        name={project.id}
                                                        style={{ color: 'white', float: 'left' }}
                                                        variant={
                                                            BORDER_DESINGS[
                                                                Math.floor(
                                                                    Math.random() *
                                                                        BORDER_DESINGS.length,
                                                                )
                                                            ]
                                                        }
                                                        onClick={(e) => {
                                                            fundProject(
                                                                e.target.name,
                                                                document.getElementById(
                                                                    `${project.id}`,
                                                                ).value,
                                                            );
                                                            document.getElementById(
                                                                `${project.id}`,
                                                            ).value = '';
                                                        }}
                                                    >
                                                        Donate
                                                    </Button>
                                                    <DropdownButton
                                                        id="dropdown-basic"
                                                        variant="light"
                                                        title=""
                                                        className="float-right"
                                                        style={{ marginLeft: '80%' }}
                                                    >
                                                        <Dropdown.Item
                                                            as="button"
                                                            name={project.id}
                                                            onClick={(e) => {
                                                                closeProject(e.target.name);
                                                            }}
                                                        >
                                                            Close Project
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            </div>
                                        </Card.Footer>
                                    ) : (
                                        ''
                                    )}
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="p-4">
                            <Alert variant="danger">No Projects Found!</Alert>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Main;
