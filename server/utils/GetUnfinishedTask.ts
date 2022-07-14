export {}

const GetUnfinishedTask = (finished : any,unfinished : any) => {

    let result = [];
    for(let x = 0 ; x < unfinished.length ; x++){
        for ( let z = 0 ; z < unfinished[x].Classroom.Tasks.length ;z++){
            if(finished.some((e : any) => e.Task.id === unfinished[x].Classroom.Tasks[z].id)){
                continue;
            }
            else{
                result.push(unfinished[x].Classroom.Tasks[z]);
            }
        }
    }

return result
}
module.exports = GetUnfinishedTask;