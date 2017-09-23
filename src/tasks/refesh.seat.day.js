/*
** tu dong refesh lai so cho ngoi, chuyen theo ngay
*/
import tripModel from '../models/trips.model';
import phancongModel from '../models/phancong.model'


export default function refeshSeat(agenda){
    agenda.define("refeshseat",(job, done)=>{
        let time= Date.now();
        time= time.setHours(6,0,0,0);
        

        for(let i=0; i<6; i++){
            
        }
    });
}