import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const server=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4179','--strictPort'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const scenarios=[
 ['GET','/products/1',200,{id:1,title:'Demo',price:10}],
 ['GET','/products/999999',404,{message:'Product not found'}],
 ['GET','/products/not-a-number',404,{message:'Product not found'}],
 ['GET','/products/1',200,{id:1,title:'Demo',price:10}],
 ['POST','/products/add',201,{title:'QA Learning Product'}],
 ['PUT','/products/1',200,{title:'QA Replacement'}],
 ['PATCH','/products/1',200,{title:'QA Updated'}],
 ['DELETE','/products/1',200,{isDeleted:true}],
 ['GET','/auth/me',401,{message:'Unauthorized'}]
];
try{
 await page.route('https://dummyjson.com/**',route=>{
  const request=route.request();
  const path=new URL(request.url()).pathname;
  const item=scenarios.find(x=>x[0]===request.method()&&x[1]===path);
  if(!item)throw new Error('Unexpected request: '+request.method()+' '+path);
  return route.fulfill({status:item[2],contentType:'application/json',body:JSON.stringify(item[3])});
 });
 let loaded=false;
 for(let i=0;i<30;i++){try{await page.goto('http://127.0.0.1:4179/',{waitUntil:'domcontentloaded',timeout:1500});loaded=true;break}catch{await new Promise(resolve=>setTimeout(resolve,300))}}
 assert.ok(loaded,'Vite dev server did not start');
 await page.locator('[data-academy="manual"]').click();
 assert.equal(await page.locator('[data-scenario]').count(),9);
 for(let i=0;i<scenarios.length;i++){
  await page.locator('[data-scenario="'+i+'"]').click();
  const expected=String(scenarios[i][2]);
  await page.locator('#manualPrediction').selectOption(expected);
  await page.locator('#guidedRun').click();
  await page.getByText('Actual response · HTTP '+expected).waitFor({timeout:15000});
  assert.equal(await page.locator('#manualPrediction').isDisabled(),true,'prediction must be locked');
  await page.locator('#guidedCheck').click();
  await page.locator('#guidedSaveCase').waitFor();
  assert.equal(await page.locator('#guidedSaveCase').isDisabled(),false,'scenario '+i+' did not pass grading');
  await page.locator('#guidedSaveCase').click();
 }
 await page.locator('[data-scenario="1"]').click();
 await page.locator('#manualPrediction').selectOption('404');
 await page.locator('#guidedRun').click();
 await page.getByText('Actual response · HTTP 404').waitFor({timeout:15000});
 await page.locator('#guidedCheck').click();
 await page.locator('#assessmentField').fill('message');
 await page.locator('#assessmentValue').fill('Product not found');
 await page.locator('#assessmentReasonChoice').selectOption('expected-negative');
 await page.locator('#assessmentReason').fill('HTTP 404 matches the negative test requirement, and the JSON message confirms the product was not found.');
 await page.locator('#assessmentSubmit').click();
 assert.match(await page.locator('.academy-feedback').last().innerText(),/PASS/);
 console.log('PASS: all nine scenarios execute, grade and save; prediction lock and independent assessment verified in Chromium');
}finally{await browser.close();server.kill('SIGTERM')}
