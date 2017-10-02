import cheerio from 'cheerio';
import fs from 'fs';

let Socket = null;

let trackingState = {};

/**
 * H
 * @param {String} routeName 
 * @param {Array} routeNodes 
 * @param {Number} currentIndex 
 */
const emitRoute = (routeName, routeNodes, currentIndex) => {
    if (currentIndex === routeNodes.lenght) {
        return setTimeout(() => {
            emitRoute(routeName, routeNodes, 0);
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
