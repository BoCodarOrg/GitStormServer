import React from 'react';

interface Props {
    data: [string]
}

const Home: React.FC<Props> = ({ data }) => {
    return (
        <div>
            <table border="1">
                <tr>
                    <th>Branch Name</th>
                    <th>Commits</th>
                    <th>Pull requests</th>
                </tr>
                {
                    data.reverse().map(item => {
                        return (
                            <tr>
                                <th>{item}</th>
                                <th>
                                    <a href={`/branch/${item.replace('*', "").trim()}`}><button>View commits</button></a>
                                </th>
                                <th>
                                    <a href={`/pull-request/${item.replace('*', "").trim()}`}><button>create pull requests</button></a>
                                </th>
                            </tr>

                        )
                    })
                }
            </table>
        </div>
    )
}

export default Home;