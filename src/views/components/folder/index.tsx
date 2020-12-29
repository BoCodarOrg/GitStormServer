import React from 'react';
interface Props {
    data: [string]
}

const Folder: React.FC<Props> = (props) => {
    return (
        <div className="container">
            <ul>
                {
                    props.data.map(item => (
                        <a href={`/${item.replace('*', '').trim()}`}><li>{item}</li></a>
                    )
                )
                }
            </ul>
        </div>
    )
}

export default Folder;