export function initialLanguage(storage, browserLanguage = 'en') {
  try { const saved = storage?.getItem('EyeDle.Language'); if (saved === 'zh' || saved === 'en') return saved; } catch {}
  return browserLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}
const chinese = {
  'A little time for your eyes.': '给眼睛一点休息时间。',
  'Play with your front camera. Face the screen in comfortable light.': '使用前置相机游玩。请在光线舒适的地方面向屏幕。',
  'Start playing': '开始游玩',
  'Open in Safari on iPhone. No account needed.': '在 iPhone 的 Safari 中打开即可，无需账号。',
  'Camera processing stays on this device.': '相机画面只在本机处理。',
  'No images or video are saved or uploaded.': '不会保存或上传照片、视频。',
  'Camera paused.': '相机已暂停。',
  'Resume camera': '恢复相机',
  'EyeDle game': 'EyeDle 护眼工坊',
  'The game files could not be loaded.': '游戏文件未能加载，请刷新后重试。',
  'The game loader could not be loaded.': '游戏启动失败，请刷新后重试。',
  'Allow the front camera to start.': '请允许使用前置相机。',
  'Camera permission was denied. Allow the camera in Safari, then try again.': '相机权限未开启。请在 Safari 中允许使用相机，再试一次。',
  'Camera paused. Resume when you are ready.': '相机已暂停，准备好后点“恢复相机”。',
  'Loading eye recognition…': '正在准备眼部识别…',
  'Camera stopped. Tap Resume camera to continue.': '相机已停止，点“恢复相机”继续。'
};
export function translate(text, language) {
  if (language !== 'zh') return text;
  if (chinese[text]) return chinese[text];
  if (text.startsWith('Loading EyeDle… ')) return text.replace('Loading EyeDle… ', '正在加载 EyeDle… ');
  if (text.startsWith('Eye recognition stopped: ')) return '眼部识别已暂停，请恢复相机后重试。';
  return text;
}
