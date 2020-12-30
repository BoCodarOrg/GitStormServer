import React from 'react';

interface Props {
    branch: string,
    toBranch: string
}

const PullRequest: React.FC<Props> = (props) => {
    return <h1>{props.branch} to {props.toBranch}</h1>
}

export default PullRequest;