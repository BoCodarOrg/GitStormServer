import React from 'react';

interface Props {
    branch: string,
    branches: [string]
}

const PullRequest: React.FC<Props> = (props) => {
    return (
        <div>
            <h1>Pullrequest to {props.branch}</h1>
            {props.branch} from {`  `}
            <select>
                {
                    props.branches.map((item, index) => {
                        return <option value={index}>{item}</option>
                    })
                }
            </select>
            <br />
            <label>
                Pull request title: {` `}
                <input placeholder="Pull request title" type="text" name="title" />
            </label>
            <br />
            <label>Pull Request Description</label>
            <br />
            <textarea style={{ width: 400, height: 150, resize: 'none' }}>
                Describe your pull request...
            </textarea>
            <br />
            <button>Create pull request</button>
        </div>
    )

}

export default PullRequest;