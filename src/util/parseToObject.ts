export interface ModelResult {
    commit: string,
    message: string,
    author: string,
    email: string,
    date: string
}
export default function parseToObject(data: string): [ModelResult] {
    const result: any = [];
    const dataArray = data.split('\n');
    const emptyIndex = dataArray.indexOf('');
    dataArray.splice(emptyIndex, 1);
    data.split('\n').map(item=>{
        if(item !== ''){
            const obj = JSON.parse(item);
            result.push(obj);
        }
    })
    return result;
}