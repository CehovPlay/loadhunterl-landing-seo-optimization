import { spawn } from "node:child_process"
const [, , url, w, h, expr] = process.argv
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new","--no-sandbox","--hide-scrollbars","--remote-debugging-port=9334","--user-data-dir=/tmp/lh-cdp-eval","about:blank"],{stdio:"ignore"})
const sleep = (ms) => new Promise(r=>setTimeout(r,ms))
async function main(){
  let target=null
  for(let i=0;i<40&&!target;i++){ await sleep(250); try{ const r=await fetch("http://127.0.0.1:9334/json/list"); target=(await r.json()).find(t=>t.type==="page") }catch{} }
  const ws=new WebSocket(target.webSocketDebuggerUrl); let id=0; const pending=new Map()
  ws.addEventListener("message",e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id)}})
  await new Promise(r=>ws.addEventListener("open",r))
  const send=(method,params={})=>new Promise(res=>{const n=++id;pending.set(n,res);ws.send(JSON.stringify({id:n,method,params}))})
  await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride",{width:Number(w),height:Number(h),deviceScaleFactor:1,mobile:Number(w)<768})
  await send("Page.navigate",{url}); await sleep(4000)
  if(process.env.SCROLL){ await send("Runtime.evaluate",{expression:`window.scrollTo(0,${Number(process.env.SCROLL)})`}); await sleep(1500) }
  const r=await send("Runtime.evaluate",{expression:expr,returnByValue:true})
  console.log(JSON.stringify(r.result?.value ?? r, null, 2))
  ws.close(); chrome.kill()
}
main().catch(e=>{console.error(e);chrome.kill();process.exit(1)})
