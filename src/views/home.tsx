import React, { useEffect, useState } from 'react';

import Folder from './components/folder'

interface Props {
    data: [string]
}

const Home: React.FC<Props> = ({ data }) => {
    return (
        <div>
            <Folder data={data} />
        </div>
    )
}

export default Home;