const n=40;
const array=[];
init();/*call init as soon as we open the webpage so that we dont need to clcik the init to show bars, we automatically get the bars when we open teh webpage */
let audioCtx=null;

function playNote(freq){
        if(audioCtx==null){
            audioCtx=new(AudioContext||webkitAudioContext||window.webkitAuudiContext)();
        }

    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);/*stop after duration */
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(0,audioCtx.currentTime+dur);
    osc.connect(node);/*node connected to destination whihc is usually your speakers */
    node.connect(audioCtx.destination);
}
function init(){
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    showBars();
}

function play(){
    const copy=[...array];
   const moves=bubbleSort(copy);
   animate(moves);
}

function animate(moves){
    if(moves.length==0){
        showBars();/*showbars without any paramenter, so when show bars() without any paramenter, indices are undefined so the background color of bars will not remina red, they will chnage to black*/
        return;}  
    const move=moves.shift(0);/*shift method takes out the first elemnt of the moves array which is  pair of swapped elements which
                            gets stired in const [i,j] */
    const[i,j]=move.indices;
    if(move.type=="swap")
   { [array[i],array[j]]=[array[j],array[i]];}
    playNote(200+array[i]*500)/*linear interpolation */
    playNote(200+array[j]*500)
    showBars(move);
    setTimeout(function(){
        animate(moves);/*calling animate fn again with a timeout */
    },50);/*every 50ms we get an update in the animation */
}

function bubbleSort(array){
    const moves=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
           // moves.push({indices:[i-1,i],type:"comp"});
            if(array[i-1]>array[i]){
                swapped=true;
                moves.push({indices:[i-1,i],type:"swap"});/*moves array contain object- a pair of indices of the swapped elements and type of swap*/
                [array[i-1],array[i]]=[array[i],array[i-1]];
             }
        }
    }while(swapped);
    return moves;
}
function showBars(move){
    container.innerHTML="";/*important to clear the bars first . when we call bubble sort it shows the non sorted bars plus the sorted bars, to avoid this we first need to clear the container to empty. */
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%" //value of arr[i]*100 and percentage of the height of the container
        bar.classList.add("bar");/*bar class defined in css with properties-width=20px,backgroundcolor=black*/ 
       if(move && move.indices.includes(i)){
        bar.style.backgroundColor=move.type=="swap"?"red":"blue";
       }
        container.appendChild(bar);
    } 
}