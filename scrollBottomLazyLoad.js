getRandomIntFromIterval = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

start = 0
interval = setInterval(function(){ 
    start += getRandomIntFromIterval(1000,4000)
    window.scroll({top: start});
}, getRandomIntFromIterval(0.5,1.5));


clearInterval(interval)