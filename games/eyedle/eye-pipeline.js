async function defaultDetector() {
  const {FaceLandmarker,FilesetResolver}=await import('./vendor/mediapipe/vision_bundle.js');
  const files=await FilesetResolver.forVisionTasks('./vendor/mediapipe/wasm');
  const options={baseOptions:{modelAssetPath:'./models/face_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:true,outputFacialTransformationMatrixes:true};
  try {return await FaceLandmarker.createFromOptions(files,options)}
  catch {options.baseOptions.delegate='CPU';return await FaceLandmarker.createFromOptions(files,options)}
}

export function createEyePipeline({video,canvas,onFrame,onLoss,onStatus=()=>{},detectorFactory=defaultDetector,cameraProvider=constraints=>navigator.mediaDevices.getUserMedia(constraints),schedule=callback=>requestAnimationFrame(callback),cancel=id=>cancelAnimationFrame(id)}) {
  let generation=0,stream=null,detector=null,animation=0,active=false,starting=false,lastTime=-1,lastVideoTime=-1;
  const context=canvas.getContext('2d');
  const closeStream=value=>value?.getTracks().forEach(track=>track.stop());
  function stop() {
    generation++;active=false;starting=false;
    if(animation)cancel(animation);animation=0;
    const previous=stream;stream=null;closeStream(previous);
    video.pause();video.srcObject=null;
    detector?.close();detector=null;
    context?.clearRect(0,0,canvas.width,canvas.height);
    onLoss();
  }
  async function start() {
    if(active||starting)return active;
    starting=true;const token=++generation;
    let candidate=null,task=null;
    try {
      candidate=await cameraProvider({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:24,max:30}},audio:false});
      if(token!==generation){closeStream(candidate);return false}
      stream=candidate;video.srcObject=stream;
      await video.play();
      if(token!==generation){closeStream(candidate);return false}
      onStatus('Loading eye recognition…');
      task=await detectorFactory();
      if(token!==generation){task.close();closeStream(candidate);return false}
      detector=task;active=true;starting=false;lastTime=-1;lastVideoTime=-1;
      const track=stream.getVideoTracks?.()[0];
      track?.addEventListener?.('ended',()=>{if(token===generation&&active){stop();onStatus('Camera stopped. Tap Resume camera to continue.')}});
      animation=schedule(loop);
      return true;
    } catch(error) {
      task?.close();closeStream(candidate);
      if(token!==generation)return false;
      stop();throw error;
    }
  }
  function loop(now) {
    if(!active)return;
    animation=schedule(loop);
    if(video.readyState<2||now-lastTime<1000/15||video.currentTime===lastVideoTime)return;
    lastTime=now;lastVideoTime=video.currentTime;
    const scale=Math.min(1,640/Math.max(video.videoWidth,video.videoHeight));
    const width=Math.max(1,Math.round(video.videoWidth*scale)),height=Math.max(1,Math.round(video.videoHeight*scale));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
    try {
      // Mirror the pixels before inference, exactly like the native front-camera runner.
      context.setTransform(-1,0,0,1,width,0);
      context.drawImage(video,0,0,width,height);
      context.setTransform(1,0,0,1,0,0);
      const result=detector.detectForVideo(canvas,now);
      const landmarks=result.faceLandmarks?.[0];
      if(!landmarks?.length){onLoss();return}
      onFrame({frame:{faceCount:result.faceLandmarks.length,landmarks:landmarks.map(({x,y,z})=>({x,y,z})),blendshapes:(result.faceBlendshapes?.[0]?.categories??[]).map(({categoryName,score})=>({categoryName,score}))},matrix:result.facialTransformationMatrixes?.[0]?.data?Array.from(result.facialTransformationMatrixes[0].data):null});
    } catch(error) {stop();onStatus('Eye recognition stopped: '+error.message)}
  }
  return {start,stop,get active(){return active},get starting(){return starting}};
}
