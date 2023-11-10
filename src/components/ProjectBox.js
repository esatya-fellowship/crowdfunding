import React from 'react';
import { Card, ProgressBar, ListGroup, ListGroupItem } from 'react-bootstrap';
import { weiToEth } from '../utils';

const TOKEN_SYMBOL = 'BNB';

export default function ProjectBox({ project }) {
    return (
        <>
            <Card.Body>
                {project && project.exists ? (
                    <span
                        className="btn btn-success"
                        style={{
                            position: 'absolute',
                            top: '7px',
                            left: '-10px',
                        }}
                    >
                        Open
                    </span>
                ) : (
                    <span
                        className="btn btn-danger"
                        style={{
                            position: 'absolute',
                            top: '7px',
                            left: '-10px',
                        }}
                    >
                        Closed
                    </span>
                )}
                <Card.Title>{project && project.name ? project.name.toString() : '-'}</Card.Title>
                <Card.Text>
                    <em>{project && project.desc ? project.desc.toString() : '0'}</em>
                </Card.Text>
                <ProgressBar animated now={project.percent} label={`${project.percent}%`} />
                <ListGroup className="list-group-flush">
                    <ListGroupItem>
                        {project && project.daysLeft && project.daysLeft >= 0
                            ? project.daysLeft
                            : '-'}
                        <em> Days Left</em>
                    </ListGroupItem>
                    <ListGroupItem>
                        Target/Collected:&nbsp;
                        {project && project.target && project.balance
                            ? `${weiToEth(project.target)}
                        / ${String(weiToEth(project.balance))}`
                            : '-'}
                        <em> {TOKEN_SYMBOL}</em>
                    </ListGroupItem>
                    <ListGroupItem>
                        <small className="text-muted">
                            <em style={{ fontSize: '0.9em' }}>
                                Organized By: {project && project.owner ? project.owner : '-'}
                            </em>
                        </small>
                    </ListGroupItem>
                </ListGroup>
            </Card.Body>
        </>
    );
}
