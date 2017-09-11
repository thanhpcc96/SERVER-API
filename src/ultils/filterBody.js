/**
 * Loc than cua request dam bao an toan
 * Neu trong request hop le thi cho qua
 * @export
 * @param {Object} body - request body
 * @param {Array[String]} whitelist - Doi tuong muon cho trong whitelist
 * @return {Object} body- Request filtered
 */
export function filteredBody(body, whitelist){
    const items={};
    Object.keys(body).forEach(key=>{
        if(whitelist.indexOf(key)>=0){
            items[key]= body[key]
        }
    });
    return items;
}