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
export function gradePythonStarter(source){
 const checks=[
 {name:'Import requests',ok:/^\s*import\s+requests\b/m.test(source),fix:'Add: import requests'},
 {name:'Send GET request',ok:/requests\.get\s*\(/.test(source),fix:'Call requests.get("https://dummyjson.com/products/1", timeout=10).'},
 {name:'Check status 200',ok:/assert\s+\w+\.status_code\s*==\s*200/.test(source),fix:'Assert the response status, for example: assert response.status_code == 200'},
 {name:'Check JSON product ID',ok:/assert\s+\w+\.json\(\)\s*\[\s*['"]id['"]\s*\]\s*==\s*1/.test(source),fix:'Assert the returned product ID: assert response.json()["id"] == 1'}
 ];
 return {pass:checks.every(x=>x.ok),checks,disclaimer:'Static starter-code checks only. This does not execute Python or prove that the test passes against the API.'};
}
export const STARTER_PYTHON='import requests\n\nresponse = requests.get("https://dummyjson.com/products/1", timeout=10)\nprint(response.status_code)\nprint(response.json())\n\n# Add your assertions below\n';
