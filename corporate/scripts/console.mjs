import { spawn } from "node:child_process"
const [, , url, w, h] = process.argv
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new","--no-sandbox","--remote-debugging-port=9335","--user-data-dir=/tmp/lh-cdp-console","about:blank"],{stdio:"ignore"})
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms))
async function main(){
  let t=null
  for(let i=0;i<40&&!t;i++){await sleep(250);try{const r=await fetch("http://127.0.0.1:9335/json/list");t=(await r.json()).find(x=>x.type==="page")}catch{}}
  const ws=new WebSocket(t.webSocketDebuggerUrl); let id=0; const p=new Map(); const logs=[]
  ws.addEventListener("message",e=>{const m=JSON.parse(e.data)
    if(m.id&&p.has(m.id)){p.get(m.id)(m.result);p.delete(m.id)}
    if(m.method==="Runtime.consoleAPICalled")logs.push([m.params.type,(m.params.args||[]).map(a=>a.value??a.description).join(" ").slice(0,300)])
    if(m.method==="Runtime.exceptionThrown")logs.push(["exception",JSON.stringify(m.params.exceptionDetails).slice(0,400)])})
  await new Promise(r=>ws.addEventListener("open",r))
  const send=(method,params={})=>new Promise(res=>{const n=++id;p.set(n,res);ws.send(JSON.stringify({id:n,method,params}))})
  await send("Runtime.enable"); await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride",{width:Number(w),height:Number(h),deviceScaleFactor:1,mobile:false})
  await send("Page.navigate",{url}); await sleep(5000)
  await send("Runtime.evaluate",{expression:"window.scrollTo(0,2000)"}); await sleep(1500)
  console.log(JSON.stringify(logs,null,1))
  ws.close();chrome.kill()
}
main().catch(e=>{console.error(e);chrome.kill();process.exit(1)})
