import React from 'react';

import { Container } from './style'

interface Props {
    name: string
}

const Folder: React.FC<Props> = (props) => {
    return (
        <div>
            {props.name}
        </div>
    )
}

export default Folder;