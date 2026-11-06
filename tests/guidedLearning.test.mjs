import test from 'node:test';import assert from 'node:assert/strict';import {GET_SCENARIOS,gradeManual,gradePythonStarter,STARTER_PYTHON,EXTRA_SCENARIOS,ALL_SCENARIOS,gradeIndependentAssignment} from '../src/guidedLearning.js';
test('manual positive status and JSON are graded against expectations',()=>{const t=GET_SCENARIOS[0];assert.equal(gradeManual(t,{status:200,data:{id:1}},'200').pass,true);assert.equal(gradeManual(t,{status:200,data:{id:2}},'200').pass,false);assert.equal(gradeManual(t,{status:404,data:{message:'Missing'}},'200').pass,false)});
test('manual negative 404 is a valid PASS',()=>{const t=GET_SCENARIOS[1];assert.equal(gradeManual(t,{status:404,data:{message:'Not found'}},'404').pass,true);assert.equal(gradeManual(t,{status:404,data:{}},'404').pass,false)});
test('prediction required before grading',()=>{assert.equal(gradeManual(GET_SCENARIOS[0],{status:200,data:{id:1}},'').pass,false)});
test('Python checker explains missing assertions and does not claim execution',()=>{const a=gradePythonStarter(STARTER_PYTHON);assert.equal(a.pass,false);assert.equal(a.checks.filter(x=>!x.ok).length,2);assert.match(a.disclaimer,/does not execute Python/)});
test('Python starter checks accept a correctly formed example',()=>{const code=STARTER_PYTHON+'assert response.status_code == 200\nassert response.json()["id"] == 1\n';assert.equal(gradePythonStarter(code).pass,true)});

test('commented-out assertions must not pass',()=>{const source='import requests\nresponse = requests.get("https://dummyjson.com/products/1")\n# assert response.status_code == 200\n# assert response.json()["id"] == 1';assert.equal(gradePythonStarter(source).pass,false)});
test('wrong API endpoint must not pass',()=>{const source='import requests\nresponse = requests.get("https://dummyjson.com/products/2")\nassert response.status_code == 200\nassert response.json()["id"] == 1';assert.equal(gradePythonStarter(source).pass,false)});

test('assertions must use the response variable from the real GET request',()=>{const code='import requests\nresult = requests.get("https://dummyjson.com/products/1")\nassert response.status_code == 200\nassert response.json()["id"] == 1';assert.equal(gradePythonStarter(code).pass,false)});
test('a different valid response variable is supported',()=>{const code='import requests\nr = requests.get("https://dummyjson.com/products/1")\nassert r.status_code == 200\nassert r.json()["id"] == 1';assert.equal(gradePythonStarter(code).pass,true)});

test('all four GET teaching scenarios exist',()=>{assert.deepEqual(GET_SCENARIOS.map(s=>s.id),['valid','missing','invalid','schema'])});
test('schema case checks required types and fields',()=>{const t=GET_SCENARIOS[3];assert.equal(gradeManual(t,{status:200,data:{id:1,title:'Phone',price:99}},'200').pass,true);assert.equal(gradeManual(t,{status:200,data:{id:1,title:'Phone',price:'99'}},'200').pass,false);assert.equal(gradeManual(t,{status:200,data:{id:1,title:'',price:99}},'200').pass,false)});
test('invalid identifier is a valid negative test when 404 and message returned',()=>{assert.equal(gradeManual(GET_SCENARIOS[2],{status:404,data:{message:'Not found'}},'404').pass,true)});

test('guided learning covers CRUD and unauthenticated negative scenario',()=>{assert.deepEqual(EXTRA_SCENARIOS.map(x=>x.method),['POST','PUT','PATCH','DELETE','GET']);assert.equal(ALL_SCENARIOS.length,9)});

test('independent assessment requires live execution, evaluated evidence, exact JSON assertion and reasoning',()=>{
 const scenario=ALL_SCENARIOS[1],response={mode:'LIVE',status:404,data:{message:'Product not found'}};
 const base={scenario,response,prediction:'404',field:'message',value:'Product not found',reasonChoice:'expected-negative',evaluated:true};
 assert.equal(gradeIndependentAssignment(base).pass,true);
 for(const change of [{response:{...response,mode:'SIMULATED'}},{evaluated:false},{value:''},{value:'wrong'},{field:'id'},{reasonChoice:'any-error'},{prediction:'200'},{scenario:ALL_SCENARIOS[0]}]){
  assert.equal(gradeIndependentAssignment({...base,...change}).pass,false,JSON.stringify(change));
 }
});
test('all nine guided scenarios have valid grading contracts',()=>{
 const samples=[
 {status:200,data:{id:1,title:'Product',price:10}},
 {status:404,data:{message:'Not found'}},
 {status:404,data:{message:'Not found'}},
 {status:200,data:{id:1,title:'Product',price:10}},
 {status:201,data:{title:'QA Learning Product'}},
 {status:200,data:{title:'QA Replacement'}},
 {status:200,data:{title:'QA Updated'}},
 {status:200,data:{isDeleted:true}},
 {status:401,data:{message:'Unauthorized'}}
 ];
 ALL_SCENARIOS.forEach((scenario,index)=>assert.equal(gradeManual(scenario,samples[index],String(scenario.expectedStatus)).pass,true,scenario.id));
});
