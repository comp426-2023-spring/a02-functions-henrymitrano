#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";
import process from "process";


const timezone = moment.tz.guess();

var val = minimist(process.argv.slice(2))
if (val.h){
    let message = 'Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE' +
        '-h            Show this help message and exit.' +
    '-n, -s        Latitude: N positive; S negative.' +
    '-e, -w        Longitude: E positive; W negative.' +
    '-z            Time zone: uses tz.guess() from moment-timezone by default.' +
    '-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.' +
    '-j            Echo pretty JSON from open-meteo API and exit.'
    console.log(message);
    process.exit(0);
}
let lat = (-1) * val.w || val.e;
lat = Number(lat).toFixed(2);
let long = (-1) * val.s || val.n;
long = Number(long).toFixed(2);
const response_api = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&timezone=" + timezone + "&daily=precipitation_hours");
const data = await response_api.json();
const days = val.d;
if(val.j){
    console.log(data);
    process.exit(0);
}
const rain_present = data.daily.precipitation_hours[days];
if(rain_present > 0){
    process.stdout.write("You might need your galoshes");
}
else{
    process.stdout.write("You will not need your galoshes");
}
if(days == 0){
    console.log(" today.")
} else if(days > 1){
    console.log("in" + days + " days.")
} else{
    console.log(" tomorrow.")
}
