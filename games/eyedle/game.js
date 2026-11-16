import {installChunkedAssets} from './chunked-assets.js';
import {createEyePipeline} from './eye-pipeline.js';
import {initialLanguage,translate} from './localization.js';
let storage;try{storage=window.localStorage}catch{}
let language=initialLanguage(storage,navigator.language),lastMessage='Open in Safari on iPhone. No account needed.';
const languageSelect=document.querySelector('#language');
const localizedElements=[...document.querySelectorAll('#welcome h1,#welcome .card > p:not(.brand):not(#status):not(.privacy),#start,#resume-input')].map(element=>[element,element.textContent]);
function applyLanguage(){
  document.documentElement.lang=language==='zh'?'zh-CN':'en';languageSelect.value=language;
  for(const [element,text] of localizedElements)element.textContent=translate(text,language);
  document.querySelector('.privacy').replaceChildren(document.createTextNode(translate('Camera processing stays on this device.',language)),document.createElement('br'),document.createTextNode(translate('No images or video are saved or uploaded.',language)));
  document.querySelector('#unity-canvas').setAttribute('aria-label',translate('EyeDle game',language));
  message(lastMessage);send('OnLanguageChange',language);
}
const startButton=document.querySelector('#start'),resumeButton=document.querySelector('#resume-input');
const welcome=document.querySelector('#welcome'),resume=document.querySelector('#resume');
const status=document.querySelector('#status'),resumeStatus=document.querySelector('#resume-status');
let unity=null,unityPromise=null,bridgeReady=false,starting=false,played=false;
const report={camera:'Not started',frames:0,lastError:'',imagesSaved:false,imagesUploaded:false};
window.EyeDleWebInput={ready(){bridgeReady=true;send('OnLanguageChange',language)}};
window.EyeDleSetLanguage=value=>{if(value==='en'||value==='zh'){language=value;try{storage?.setItem('EyeDle.Language',language)}catch{}applyLanguage()}};
function send(method,payload=''){if(unity&&bridgeReady)unity.SendMessage('EyeDleBrowserInput',method,payload)}
function message(text){lastMessage=text;status.textContent=translate(text,language);resumeStatus.textContent=translate(text,language)}
languageSelect.addEventListener('change',()=>{language=languageSelect.value;try{storage?.setItem('EyeDle.Language',language)}catch{}applyLanguage()});
applyLanguage();
const pipeline=createEyePipeline({video:document.querySelector('#camera'),canvas:document.createElement('canvas'),
  onFrame(frame){report.frames++;report.tracking='Tracking';send('OnFrame',JSON.stringify(frame))},
  onLoss(){send('OnTrackingLost');report.camera=pipeline.active?'Running':'Paused';report.tracking=pipeline.active?'No face':'Paused'},
  onStatus(text){message(text);if(played&&!pipeline.active){resume.hidden=false;report.lastError=text}}
});
async function loadUnity() {
  if(unityPromise)return unityPromise;
  unityPromise=(async()=>{
    const response=await fetch('./build-config.json',{cache:'no-store'});
    if(!response.ok)throw Error('The game files could not be loaded.');
    const config=await response.json();
    installChunkedAssets(config.chunkedAssets, document.baseURI);
    document.querySelector('#unity-canvas').dataset.build=config.buildId??'';
    await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=config.loader;script.onload=resolve;script.onerror=()=>reject(Error('The game loader could not be loaded.'));document.head.append(script)});
    unity=await window.createUnityInstance(document.querySelector('#unity-canvas'),{...config,devicePixelRatio:Math.min(window.devicePixelRatio||1,1.5),matchWebGLToCanvasSize:true},progress=>{if(!played)message('Loading EyeDle… '+Math.round(progress*100)+'%')});
    send('OnLanguageChange',language);
    return unity;
  })();
  try {return await unityPromise}catch(error){unityPromise=null;throw error}
}
async function begin() {
  if(starting)return;
  starting=true;startButton.disabled=true;resumeButton.disabled=true;report.lastError='';
  message('Allow the front camera to start.');
  try {
    const [active]=await Promise.all([pipeline.start(),loadUnity()]);
    if(!active||!pipeline.active||document.hidden)return;
    report.camera='Running';played=true;welcome.hidden=true;resume.hidden=true;
    document.querySelector('#unity-canvas').focus();
  } catch(error) {
    pipeline.stop();report.lastError=error.message;
    message(error.name==='NotAllowedError'?'Camera permission was denied. Allow the camera in Safari, then try again.':error.message);
    if(played)resume.hidden=false;
  } finally {starting=false;startButton.disabled=false;resumeButton.disabled=false}
}
startButton.addEventListener('click',begin);resumeButton.addEventListener('click',begin);
function pause(){pipeline.stop();send('OnPageHidden');if(played){resume.hidden=false;message('Camera paused. Resume when you are ready.')}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});window.addEventListener('pagehide',pause);
if(navigator.modelContext){
  try{
    navigator.modelContext.registerTool({
      name:'read_eyedle_camera_status',
      description:'Read local camera status and frame count. Never starts a camera or returns images.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},
      annotations:{readOnlyHint:true},
      execute:async args=>{
        if(!args||typeof args!=='object'||Array.isArray(args)||Object.keys(args).length)throw Error('Expected an empty object.');
        return {content:[{type:'text',text:JSON.stringify({...report,bridgeReady,gameLoaded:!!unity,secureContext:window.isSecureContext})}]};
      }
    });
  }catch{}
}
