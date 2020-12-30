import React from 'react';

// import { Container } from './styles';
interface Props {
    data: [string]
}

const Repositories: React.FC<Props> = ({data}) => {
  return (
    <div>
    <table border="1">
        <tr>
            <th>Name</th>            
        </tr>
        {
            data.reverse().map(item => {
                return (
                    <tr>
                        <th><a href={`/${item.replace('/','')}`}>{item.replace('/','')}</a></th>                        
                    </tr>

                )
            })
        }
    </table>
</div>
  );
}

export default Repositories;