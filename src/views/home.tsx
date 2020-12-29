import React, { useEffect, useState } from 'react';

import Folder from './components/folder'

interface Props {
    data: Array<string>
}

const Home: React.FC<Props> = ({ data }) => {
    return (
        <div>
            {data.map(item => <Folder name={item} />)}
        </div>
    )
}

export default Home;