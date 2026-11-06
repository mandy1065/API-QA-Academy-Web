// Guided, evidence-based exercises for the first manual-to-automation learning journey.
// Grading is deliberately scoped to concrete observable results, not arbitrary Python execution.
export const GET_SCENARIOS=[
 {id:'valid',title:'Valid product ID',method:'GET',path:'/products/1',expectedStatus:200,field:'id',value:1,why:'A known product ID must return that product. Verify the response status and id.'},
 {id:'missing',title:'Missing product ID',method:'GET',path:'/products/999999',expectedStatus:404,field:'message',value:null,why:'A product ID that does not exist must return a not-found response.'},
 {id:'invalid',title:'Invalid product ID',method:'GET',path:'/products/not-a-number',expectedStatus:404,field:'message',value:null,why:'An invalid identifier should be rejected or not found. DummyJSON currently uses 404; compare observed behavior to its contract.'},
 {id:'schema',title:'Response structure',method:'GET',path:'/products/1',expectedStatus:200,field:'title',value:null,requiredFields:['id','title','price'],why:'A product response must contain an integer id, a nonempty title, and a numeric price.'}
];
export const EXTRA_SCENARIOS=[
 {id:'post',title:'POST create product',method:'POST',path:'/products/add',body:{title:'QA Learning Product',price:25},expectedStatus:201,field:'title',value:'QA Learning Product',why:'Creating a product should return HTTP 201 and the submitted title. DummyJSON simulates writes; no persistent database change.'},
 {id:'put',title:'PUT replace product',method:'PUT',path:'/products/1',body:{title:'QA Replacement',price:35},expectedStatus:200,field:'title',value:'QA Replacement',why:'PUT replaces a product representation. DummyJSON simulates the update.'},
 {id:'patch',title:'PATCH update title',method:'PATCH',path:'/products/1',body:{title:'QA Updated'},expectedStatus:200,field:'title',value:'QA Updated',why:'PATCH changes selected fields. DummyJSON simulates the update.'},
 {id:'delete',title:'DELETE product',method:'DELETE',path:'/products/1',expectedStatus:200,field:'isDeleted',value:true,why:'The simulated delete response should contain isDeleted=true.'},
 {id:'auth-negative',title:'Authentication: protected resource',method:'GET',path:'/auth/me',expectedStatus:401,field:'message',value:null,why:'An unauthenticated request should not return protected user data. Compare the observed status to the documented contract.'}
];
export const ALL_SCENARIOS=[...GET_SCENARIOS,...EXTRA_SCENARIOS];
export function gradeIndependentAssignment({scenario,response,prediction,field,value,reasonChoice,evaluated}){
 if(!scenario||scenario.id!=='missing')return {pass:false,message:'Select the assigned missing-product scenario.'};
 if(!response||response.mode!=='LIVE')return {pass:false,message:'Execute a real live API request first.'};
 if(!evaluated)return {pass:false,message:'Evaluate and record your manual test before assessment.'};
 if(!prediction||Number(prediction)!==scenario.expectedStatus||response.status!==scenario.expectedStatus)return {pass:false,message:'Expected and actual HTTP status must both match the requirement.'};
 if(field!=='message')return {pass:false,message:'Select the response field that explains why the resource was not found.'};
 const actual=findField(response.data,field);
 if(!actual.found||typeof actual.value!=='string'||!actual.value.trim())return {pass:false,message:'The live response must contain a nonempty error message.'};
 if(!value||String(value).trim()!==String(actual.value).trim())return {pass:false,message:'Enter the exact observed message as your JSON assertion.'};
 if(reasonChoice!=='expected-negative')return {pass:false,message:'A negative test passes when the documented error behavior is observed, not simply because the API returned an error.'};
 return {pass:true,message:'PASS: live request, expected negative status, exact JSON assertion, recorded evaluation and reasoning all verified.'};
}
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
 if(scenario.requiredFields){for(const field of scenario.requiredFields){const check=findField(response.data,field);if(!check.found)return {pass:false,message:'Required schema field missing: '+field};if(field==='id'&&!Number.isInteger(check.value))return {pass:false,message:'Schema mismatch: id must be an integer.'};if(field==='title'&&(typeof check.value!=='string'||!check.value.trim()))return {pass:false,message:'Schema mismatch: title must be a nonempty string.'};if(field==='price'&&(typeof check.value!=='number'||!Number.isFinite(check.value)))return {pass:false,message:'Schema mismatch: price must be numeric.'};}}return {pass:true,message:'PASS: status and JSON contract match the expected behavior. Record the evidence and save this test case.'};
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
 const statusPattern=variable?new RegExp('\\bassert\\s+'+variable+'\\.status_code\\s*==\\s*200\\b'):null;
 const idPattern=variable?new RegExp('\\bassert\\s+'+variable+'\\.json\\(\\)\\s*\\[\\s*[\\x22\\x27]id[\\x22\\x27]\\s*\\]\\s*==\\s*1\\b'):null;
 const checks=[
 {name:'Import requests',ok:/^\s*import\s+requests\b/m.test(clean),fix:'Add: import requests'},
 {name:'GET the correct product endpoint',ok:!!variable,fix:'Use requests.get("https://dummyjson.com/products/1", timeout=10).'},
 {name:'Assert HTTP 200',ok:!!statusPattern?.test(clean),fix:'Add: assert response.status_code == 200'},
 {name:'Assert product ID 1',ok:!!idPattern?.test(clean),fix:'Add: assert response.json()["id"] == 1'}
 ];
 return {pass:checks.every(x=>x.ok),checks,disclaimer:'STRUCTURE CHECK ONLY: this does not execute Python, prove variable references are correct, or verify the API. Run pytest locally to verify the test.'};
}
export const STARTER_PYTHON='import requests\n\nresponse = requests.get("https://dummyjson.com/products/1", timeout=10)\nprint(response.status_code)\nprint(response.json())\n\n# Add your assertions below\n';

export const PYTEST_GET_EXAMPLE = [
'# Save as test_product_get.py',
'# Install: python -m pip install pytest requests',
'# Run: python -m pytest -v test_product_get.py',
'# An actual PASS requires executing pytest; the browser cannot run this file.',
'import pytest',
'import requests',
'',
'BASE_URL = "https://dummyjson.com"',
'',
'def test_existing_product():',
'    response = requests.get(BASE_URL + "/products/1", timeout=10)',
'    assert response.status_code == 200',
'    data = response.json()',
'    assert data["id"] == 1',
'',
'@pytest.mark.parametrize("path", ["/products/999999", "/products/not-a-number"])',
'def test_missing_or_invalid_product(path):',
'    response = requests.get(BASE_URL + path, timeout=10)',
'    assert response.status_code == 404',
'    assert "message" in response.json()',
'',
'def test_product_response_structure():',
'    response = requests.get(BASE_URL + "/products/1", timeout=10)',
'    assert response.status_code == 200',
'    data = response.json()',
'    assert isinstance(data["id"], int)',
'    assert isinstance(data["title"], str) and data["title"].strip()',
'    assert isinstance(data["price"], (int, float))',
'',
'# NEXT LESSON: move BASE_URL into configuration and reuse requests.Session',
'# NEXT LESSON: pytest fixtures and reusable API clients',
''].join('\n');
