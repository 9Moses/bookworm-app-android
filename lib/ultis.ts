export function formatDate(dataString:any){
//format date nicely
const data = new Date(dataString);
return data.toLocaleDateString( 'en-Us',{
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})
}

//function will convert the createdat to this format: "may 2025"
export function formatMemberSince(dataString:any){
    const date = new Date(dataString);
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();
    return `${month} ${year}`
}

//function will convert the created to this format: "May 15, 2025"
export function formatPublish(dataString: any){
    const date = new Date(dataString);
    const month = date.toLocaleString('default', {month: 'long'})
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`
}