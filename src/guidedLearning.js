// Guided, evidence-based exercises for the first manual-to-automation learning journey.
// Grading is deliberately scoped to concrete observable results, not arbitrary Python execution.
export const GET_SCENARIOS=[
 {id:'positive',title:'Existing product',method:'GET',path:'/products/1',expectedStatus:200,field:'id',value:1,why:'The requested product exists, so the response should identify product 1.'},
 {id:'negative',title:'Missing product',method:'GET',path:'/products/999999',expectedStatus:404,field:'message',value:null,why:'An unknown product should produce a documented not-found response.'}
];
export function findField(data,path){
 if(!path)return {found:true,value:data};
 let value=data;
 for(const key of path.split('.')){if(value===null||value===undefined||!(key in Object(value)))return {found:false,value:undefined};value=value[key]}
 return {found:true,value};
}
export function gradeManual(scenario,response,prediction){
 if(!response)return {pass:false,message:'Run the request first. Then compare the actual response to the expected result.'};
 if(Number(prediction)!==scenario.expectedStatus)return {pass:false,message:'Prediction needs correction: this scenario expects HTTP '+scenario.expectedStatus+'.'};
 if(response.status!==scenario.expectedStatus)return {pass:false,message:'Actual status '+response.status+' does not match expected '+scenario.expectedStatus+'. Record a defect if this is a real API result.'};
 const result=findField(response.data,scenario.field);
 if(!result.found)return {pass:false,message:'Response is missing required JSON field "'+scenario.field+'".'};
 if(scenario.value!==null&&result.value!==scenario.value)return {pass:false,message:'Field "'+scenario.field+'" is '+JSON.stringify(result.value)+'; expected '+JSON.stringify(scenario.value)+'.'};
 return {pass:true,message:'PASS: status and JSON contract match the expected behavior. Record the evidence and save this test case.'};
}
// Static structural feedback only; never claim Python has been executed.
export function gradePythonStarter(source){
 const clean=String(source).split('\n').map(line=>{
  // Remove comments outside string literals (including full-line comments).
  let quoted=null,escaped=false,out='';
  for(const ch of line){
   if(escaped){out+=ch;escaped=false;continue}
   if(ch==='\\'&&quoted){out+=ch;escaped=true;continue}
   if((ch==='"'||ch==="'")){if(quoted===ch)quoted=null;else if(!quoted)quoted=ch;out+=ch;continue}
   if(ch==='#'&&!quoted)break;
   out+=ch;
  }
  return out;
 }).join('\n');
 const match=clean.match(/(?:^|\n)\s*(\w+)\s*=\s*requests\.get\s*\(\s*['\"]https:\/\/dummyjson\.com\/products\/1['\"]/);
 const variable=match?.[1];
 const escapeRegex=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\const checks=[
 {name:'Import requests'');
 const statusPattern=variable?new RegExp('\\bassert\\s+'+escapeRegex(variable)+'\\.status_code\\s*==\\s*200\\b'):null;
 const idPattern=variable?new RegExp('\\bassert\\s+'+escapeRegex(variable)+'\\.json\\(\\)\\s*\\[\\s*[\\\"\\\']id[\\\"\\\']\\s*\\]\\s*==\\s*1\\b'):null;
 const checks=[
 {name:'Import requests',ok:/^\s*import\s+requests\b/m.test(clean),fix:'Add: import requests'},
 {name:'GET the correct product endpoint',ok:!!variable,fix:'Use requests.get("https://dummyjson.com/products/1", timeout=10).'},
 {name:'Assert HTTP 200',ok:!!statusPattern?.test(clean),fix:'Add: assert response.status_code == 200'},
 {name:'Assert product ID 1',ok:!!idPattern?.test(clean),fix:'Add: assert response.json()["id"] == 1'}
 ];
 return {pass:checks.every(x=>x.ok),checks,disclaimer:'STRUCTURE CHECK ONLY: this does not execute Python, prove variable references are correct, or verify the API. Run pytest locally to verify the test.'};
}
export const STARTER_PYTHON='import requests\n\nresponse = requests.get("https://dummyjson.com/products/1", timeout=10)\nprint(response.status_code)\nprint(response.json())\n\n# Add your assertions below\n';
