import cheerio from 'cheerio';
import fs from 'fs';

let Socket = null;

const dirName = 'gpx-data/';
let trackingState = {};

/**
 * Hàm emit trạng thái tracking location qua socket
 * @param {String} routeName 
 * @param {Array} routeNodes 
 * @param {Number} currentIndex 
 */
const emitRoute = (routeName, routeNodes, currentIndex) => {
    if (currentIndex === routeNodes.lenght) {
        return setTimeout(() => {
            emitRoute(routeName, routeNodes, 0, chuyenxeID);
        }, 3000);
    }
    trackingState = Object.assign(trackingState, {
        [routeName]: routeNodes[currentIndex]
    });

    Socket.emit('locationUpdate', trackingState);

    // random range 500-1000
    const delayTime = Math.random() * (1000 - 500) + 500;

    return setTimeout(() => {
        emitRoute(routeName, routeNodes, ++currentIndex);
    }, delayTime);
}
/**
 * Đọc tọa độ của file gpx và tracking lên map và emit về cho client
 * @param {socket} io - Đối tượng socket
 */
/* eslint-disable no-console */
const run = io => {
    Socket = io;
    fs.readdir(dirName, (err, filenames) => {
        if (err) {
            console.log('===============================');
            console.log(err);
            console.log('===============================');
            return;
        }
        filenames.forEach(filename => {
            // Kiểm tra định dạng file, chỉ chấp nhận *.gpx( đinh dạng file trich xuất tọa độ của google map)
            const fileExtension = filename.split('.').pop();
            if (fileExtension !== 'gpx') return;
            fs.readFile(dirName + filename, 'utf-8', (e, content) => {
                if (e) {
                    console.log('===============================');
                    console.log(e);
                    console.log('===============================');
                    return;
                }
                // đẩy nội dung của file gpx vào trackingState
                trackingState = Object.assign(trackingState, {
                    [filename]: { lat: 0, lng: 0 }
                });
                // Parse XML với cheerio
                const $ = cheerio.load(content, {
                    normalizeWhitespace: true,
                    xmlMode: true
                });

                // chuyển đổi xmlNode object sang object trong js {lat: ..., lng: ...} 
                const routeNodes = $('wpt').map((i, node) => ({
                    lat: Number($(node).attr('lat')),
                    lng: Number($(node).attr('lon'))
                })).get();

                // emit route to client
                if (routeNodes.length > 0) {
                    emitRoute(filename, routeNodes, 0)
                }
            });
        });
    });
}

const checkOneChuyen= (io, chuyenxeID)=>{
    Socket = io;
    fs.readFile(`${dirName}${chuyenxeID}.gpx`,(err,content)=>{
        if(err){
            console.log('===============================');
            console.log(err);
            console.log('===============================');
            return;
        }

        trackingState = Object.assign(trackingState, {
            [chuyenxeID]: { lat: 0, lng: 0 }
        });
         // Parse XML với cheerio
         const $ = cheerio.load(content, {
            normalizeWhitespace: true,
            xmlMode: true
        });

        // chuyển đổi xmlNode object sang object trong js {lat: ..., lng: ...} 
        const routeNodes = $('wpt').map((i, node) => ({
            lat: Number($(node).attr('lat')),
            lng: Number($(node).attr('lon'))
        })).get();

        // emit route to client
        if (routeNodes.length > 0) {
            emitRoute(chuyenxeID, routeNodes, 0,)
        }

    })
}
export default run;
