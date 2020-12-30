import React from 'react';
import { ModelResult } from '../util/parseToObject'

interface Props {
    data: [ModelResult],
    branch: string
}

const Commit: React.FC<Props> = ({ data, branch }) => {
    return (
        <div>
            <h1>{branch}</h1>
            <table border="1">
                <tr>
                    <th>Commit</th>
                    <th>Message</th>
                    <th>Author</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th></th>
                </tr>
                {
                    data.map(item => (
                        <tr key={item.commit}>
                            <th>{item.commit?.substring(0, 7) || ''}</th>
                            <th>{item.message || ''}</th>
                            <th>{item.author}</th>
                            <th>{item.email}</th>
                            <th>{item.date}</th>
                            <th>
                                <button>view source</button>
                            </th>
                        </tr>

                    ))
                }
            </table>
        </div>
    )
}

export default Commit;