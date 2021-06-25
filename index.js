var x = document.createElement("BUTTON");
var y = document.createElement("BUTTON");
var z = document.createElement('a');
x.innerHTML = "Start";                  
document.body.appendChild(x); 
y.innerHTML = "Stop";                  
document.body.appendChild(y); 




const handleRecord = function ({stream, mimeType}) {
    // to collect stream chunks
    let recordedChunks = [];
    let a
    stopped = false;
    const mediaRecorder = new MediaRecorder(stream);
  
    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
      // shouldStop => forceStop by user
      if (shouldStop === true && stopped === false) {
        mediaRecorder.stop(); 
        stopped = true;
      }
    };
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: mimeType
      });


      var v = document.createElement('video');
      v.src = URL.createObjectURL(blob) 
      v.controls = "controls"
      z.innerHTML = "Download"
      z.setAttribute('href', URL.createObjectURL(blob) );
      z.setAttribute('download',"Recorded File");
      console.log(z);
   
     

    }
    
  
   mediaRecorder.start(200); // here 200ms is interval of chunk collection
    y.addEventListener("click",()=>{
        mediaRecorder.stop();
        document.body.appendChild(z);
    })
  };

async function recordScreen() {
    const mimeType = 'video/webm';
    shouldStop = false;
    const constraints = {
      video: true
    };
    const displayStream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
    // voiceStream for recording voice with screen recording
    const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()]
    const stream = new MediaStream(tracks);
    handleRecord({stream, mimeType})
  }
  x.addEventListener("click",()=>{
    recordScreen();
  })
