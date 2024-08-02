let ss=0,mm=0,hh=0,dd=0;
let start = document.querySelector(".start");
let pause = document.querySelector(".pause");
let reset = document.querySelector(".reset");
let laprn = document.querySelector(".lap");

let isTimeRunning = false;
let isPaused = false;
let finaltimeadded=false;
let isReset = true;

let rounds = document.querySelector(".rnds");
let round_n,roundnum;

let roundNumber =1;
let lapNumber =1;
let noRound = true;
let roundsContainer = document.querySelector(".container");

let sec = document.querySelector(".ss");
let min = document.querySelector(".mm");
let hr = document.querySelector(".hh");
let day = document.querySelector(".dd");
function count()
{
    ss++;
    if(ss<60)
    {
        if(ss<10)
            sec.innerHTML=`0${ss}`;
        else
            sec.innerHTML=ss;
    }
    else{
        ss=0;
        mm++;
        if(mm<10)
            min.innerHTML=`0${mm}`;
        else if(mm<60)
            min.innerHTML=mm;
        else
        {
            hh++;
            mm=0;
            if(hh<10)
                hr.innerHTML=`0${hh}`;
            else if(hh<24)
                hr.innerHTML=hh;
            else
            {
                dd++;
                hh=0;
                day.innerHTML=dd;
            }
        }
    }
}
let timer;
function startCount(){
    if(!isTimeRunning)
    {
        timer = setInterval(count,1000);
        isTimeRunning=true;
        isPaused=false;
        isReset=false;
        addLap();
    }
}
function pauseCount(){
    if(isTimeRunning && !isPaused)
    {
        clearInterval(timer);
        isTimeRunning=false;
        isPaused=true;
    }
}
function resetCount(){
    pauseCount();
    noRound=true;
    lapNumber=1;
    if(!finaltimeadded && !isReset)
    {
        addFinalTime();
    }
    ss=mm=dd=hh=0;
    sec.innerHTML="00";
    min.innerHTML="00";
    hr.innerHTML="00";
    day.innerHTML="00";
    isReset=true;
    /* finishRound(); */
}
function addFinalTime(){
    let final = document.createElement("div");
    final.classList.add("totaltime");
    final.innerText = `Total Time - ${dd}:${hh}:${mm}:${ss}`;
    round_n.append(final);
    finaltimeadded=false;
}
function addLap(){
    if(!isTimeRunning)
    return;

    if(noRound)
    {
        round_n = document.createElement("div");
        cls = `round-${roundNumber}`;
        round_n.classList.add("rounds");

        roundnum = document.createElement("div");
        roundnum.classList.add("rnd_no");
        roundnum.innerHTML=`Round ${roundNumber}`;
        roundNumber++;
        round_n.append(roundnum);
        roundsContainer.append(round_n);
        noRound=false;
    }
    
        /*
        lap stores numbers of laps inside round 
        */
        let lap= document.createElement("div");
        lap.setAttribute("class","laps");
        /*
        lapnum stores count of laps
        laptime displays time inside a lap
        */
        let lapnum = document.createElement("div");
        lapnum.setAttribute("class","lapno");
        lapnum.innerText = lapNumber;
        lapNumber++;
        let laptime = document.createElement("div");
        laptime.setAttribute("class","laptime");
        laptime.innerText = `${dd} : ${hh} : ${mm} : ${ss}`;

        lap.append(lapnum);
        lap.append(laptime);
        round_n.append(lap);
}

start.onclick = startCount;
pause.onclick = pauseCount;
reset.onclick = resetCount;
laprn.onclick = addLap;