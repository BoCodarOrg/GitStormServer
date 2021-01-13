require('dotenv').config();

export default{
    dirFiles: process.env.DIR_FILES,
    passGit: process.env.PASS_GIT,
    userGit: process.env.USER_GIT
}