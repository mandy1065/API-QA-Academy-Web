// Browser-safe, allowlisted HTTP learning lab. No arbitrary URL fetching.
export async function sendTrainingRequest(method,path,body,{live=false}={}){
  if(!live) throw new Error('Use the existing simulator for offline mode.');
  const allowed=['GET','POST','PUT','PATCH','DELETE'];
  if(!allowed.includes(method))throw new Error('Unsupported HTTP method.');
  if(!/^\/(products|users|posts|todos|auth)(\/|\?|$)/.test(path)||path.includes('://')||path.includes('..')||/[#\\]/.test(path))throw new Error('Only approved DummyJSON training paths are allowed.');
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  const started=performance.now();
  try{
    const headers={'Accept':'application/json'};
    const opts={method,headers,signal:controller.signal};
    if(['POST','PUT','PATCH'].includes(method)){
      headers['Content-Type']='application/json';
      opts.body=JSON.stringify(body);
    }
    const response=await fetch('https://dummyjson.com'+path,opts);
    const raw=await response.text();
    let data;try{data=JSON.parse(raw)}catch{data={raw}};
    return {status:response.status,data,elapsed:Math.round(performance.now()-started),headers:Object.fromEntries(response.headers.entries()),mode:'LIVE'};
  }finally{clearTimeout(timer)}
}
export function evaluateResponse(response,expectedStatus,requiredField){
  if(!response)return {pass:false,message:'Send a request before evaluating.'};
  const status=Number(expectedStatus);
  if(!Number.isInteger(status)||status<100||status>599)return {pass:false,message:'Enter a valid HTTP status code (100–599).'};
  const statusOk=response.status===status;
  const path=(requiredField||'').trim();
  const value=path?path.split('.').reduce((obj,key)=>obj!=null?obj[key]:undefined,response.data):undefined;
  const fieldOk=!path||value!==undefined;
  return {pass:statusOk&&fieldOk,message:statusOk?(fieldOk?'Both checks passed. Expected status and response field match.':`Field "${path}" is missing. Inspect the JSON keys and try again.`):`Expected HTTP ${status}, but received HTTP ${response.status}. A negative test can pass when you correctly expect an error status.`};
}
