// Manual test case capture and automation generation. Browser-only, no secrets stored.
export const CASE_KEY = 'api-qa-academy-manual-cases-v1';
export const DEFAULT_CASES = [
 {id:'TC-001',name:'Existing product',method:'GET',path:'/products/1',body:'',expectedStatus:200,field:'id',expectedValue:'1',category:'Positive'},
 {id:'TC-002',name:'Missing product',method:'GET',path:'/products/999999',body:'',expectedStatus:404,field:'message',expectedValue:'',category:'Negative'},
 {id:'TC-003',name:'Create product',method:'POST',path:'/products/add',body:'{"title":"QA Product","price":25}',expectedStatus:201,field:'title',expectedValue:'QA Product',category:'CRUD'},
 {id:'TC-004',name:'Partial product update',method:'PATCH',path:'/products/1',body:'{"title":"Updated Product"}',expectedStatus:200,field:'title',expectedValue:'Updated Product',category:'CRUD'},
 {id:'TC-005',name:'Delete product',method:'DELETE',path:'/products/1',body:'',expectedStatus:200,field:'isDeleted',expectedValue:'true',category:'CRUD'}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function loadCases(){try{const v=JSON.parse(localStorage.getItem(CASE_KEY));return Array.isArray(v)?v:DEFAULT_CASES.map(x=>({...x}))}catch{return DEFAULT_CASES.map(x=>({...x}))}}
export function saveCases(items){localStorage.setItem(CASE_KEY,JSON.stringify(items))}
export function validateCase(t){
 if(!['GET','POST','PUT','PATCH','DELETE'].includes(t.method))throw Error('Choose a supported HTTP method');
 if(!/^\/(products|users|posts|todos|auth)(\/|\?|$)/.test(t.path)||t.path.includes('://')||t.path.includes('..'))throw Error('Use a supported relative training API path');
 const status=Number(t.expectedStatus);if(!Number.isInteger(status)||status<100||status>599)throw Error('Expected status must be 100–599');
 if(t.body?.trim()){try{JSON.parse(t.body)}catch{throw Error('Request body must contain valid JSON')}}
 return {...t,expectedStatus:status};
}
export function testCasePanel(items){
 return `<div class="studio-grid"><section class="panel-card"><div class="section-label">MANUAL TESTING / TEST DESIGN</div><h2>Capture a manual API test case</h2><p class="muted">Start with the requirement, identify positive and negative scenarios, run them in API Lab, and save expected results here. Capturing a case does not prove it passed.</p>
 <form id="caseForm" class="case-form"><div class="field"><label for="caseName">Scenario name</label><input id="caseName" required placeholder="e.g. Missing product returns 404" maxlength="120"></div>
 <div class="case-row"><div class="field"><label for="caseMethod">HTTP method</label><select id="caseMethod">${['GET','POST','PUT','PATCH','DELETE'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label for="caseCategory">Test category</label><select id="caseCategory">${['Positive','Negative','Boundary','CRUD','Authentication','Schema'].map(x=>`<option>${x}</option>`).join('')}</select></div></div>
 <div class="field"><label for="casePath">Endpoint path</label><input id="casePath" required value="/products/1" spellcheck="false"></div>
 <div class="field"><label for="caseBody">JSON request body (optional)</label><textarea id="caseBody" rows="3" spellcheck="false" placeholder='{"title":"QA Product"}'></textarea></div>
 <div class="case-row"><div class="field"><label for="caseStatus">Expected HTTP status</label><input id="caseStatus" type="number" min="100" max="599" value="200" required></div><div class="field"><label for="caseField">Required JSON field</label><input id="caseField" placeholder="id or products.0.id"></div></div>
 <div class="field"><label for="caseValue">Expected JSON value (optional)</label><input id="caseValue" placeholder="1"></div><button type="submit" class="primary">+ Capture test case</button><div id="caseFeedback" role="status"></div></form>
 <div class="callout"><b>Manual testing checklist</b><p>Understand the requirement → choose test data → predict expected results → execute in API Lab → compare actual and expected → record evidence → report defects. Repeat for invalid IDs, missing fields, wrong types, authentication, and boundaries.</p></div></section>
 <section class="panel-card"><div class="section-label">REUSABLE TEST REPOSITORY</div><h2>My manual test cases <span class="case-count">(${items.length})</span></h2><p class="muted">Select cases to turn into automated tests. Each case keeps its own method, endpoint, payload, and assertions.</p><div class="case-list">${items.map(t=>`<div class="case-item"><label><input type="checkbox" class="case-select" value="${esc(t.id)}" checked> <strong>${esc(t.name)}</strong></label><div class="case-details"><span class="case-tag">${esc(t.method)}</span> <code>${esc(t.path)}</code> <span>Expected ${t.expectedStatus}</span> <span>${esc(t.category)}</span></div><div class="case-details"><span>JSON field: ${esc(t.field||'—')}</span><button class="case-delete" data-remove-case="${esc(t.id)}" type="button">Remove</button></div></div>`).join('')}</div><div class="lab-actions"><button id="exportCases" class="secondary">↓ Export test cases JSON</button><button id="openAutomation" class="primary">Automate selected cases →</button></div></section></div>`;
}
export function automationPanel(items,ids,framework){
 const selected=items.filter(t=>ids.includes(t.id));
 return `<div class="studio-grid"><section class="panel-card"><div class="section-label">AUTOMATION / FROM MANUAL TESTS</div><h2>Start with one test. Build a framework later.</h2><p class="lead">Your captured manual test cases become executable Python tests. Learn requests and assertions first, then pytest, then Playwright and reusable clients.</p>
 <ol class="steps"><li>Run one GET request in Python and print its response.</li><li>Assert the HTTP status and a JSON field.</li><li>Automate positive, negative, and CRUD cases.</li><li>Introduce pytest parametrization, fixtures, and reusable helpers.</li><li>Move to Playwright APIRequestContext, reports, and GitHub Actions.</li></ol>
 <div class="field"><label for="automationFramework">Automation approach</label><select id="automationFramework"><option value="requests" ${framework==='requests'?'selected':''}>Python requests + pytest (start here)</option><option value="playwright" ${framework==='playwright'?'selected':''}>Playwright Python + pytest</option></select></div>
 <h3>Selected test cases (${selected.length})</h3><div class="case-list">${items.map(t=>`<label class="automation-case"><input type="checkbox" class="automation-select" value="${esc(t.id)}" ${ids.includes(t.id)?'checked':''}> ${esc(t.id)} — ${esc(t.name)}</label>`).join('')}</div><div class="callout"><b>Framework comes after fundamentals</b><p>Next: config and environment variables, API client layer, pytest fixtures, test data, parametrization, schema checks, reports, CI/CD and a capstone project.</p></div></section>
 <section class="panel-card"><div class="section-label">GENERATED STARTER TESTS</div><h2>Python test code</h2><p class="muted">Generated from selected manual cases. Review assertions and API behavior before treating the test as verified.</p><div class="code-header"><span>test_manual_cases.py</span><button id="copyAutomation">Copy code</button></div><pre class="code automation-code"><code id="automationCode">${esc(generateTests(selected,framework))}</code></pre><div class="lab-actions"><button id="downloadAutomation" class="primary">↓ Download Python tests</button><button id="backToManual" class="secondary">← Manual testing</button></div><p class="muted">Code is generated, not executed in the browser. Install Python and dependencies, then run pytest locally. The DummyJSON training API simulates writes; no persistent CRUD behavior is guaranteed.</p></section></div>`;
}
export function generateTests(items,framework='requests'){
 const usePw=framework==='playwright';
 const header=usePw?'import json\nimport pytest\nfrom playwright.sync_api import Playwright\n':'import json\nimport pytest\nimport requests\n';
 const tests=items.map((t,i)=>{
 const name='test_'+String(t.id).toLowerCase().replace(/[^a-z0-9]+/g,'_')+'_'+i;
 const payload=t.body?.trim()?JSON.stringify(t.body.trim()):null;
 const pre=usePw?'    context = playwright.request.new_context(base_url=BASE_URL)\n    try:\n':'';
 const indent=usePw?'        ':'    ';
 const request=usePw?`${indent}response = context.fetch(${JSON.stringify(t.path)}, method=${JSON.stringify(t.method)}${payload?', data='+'json.loads('+payload+')' :''})\n`:`${indent}response = requests.request(${JSON.stringify(t.method)}, BASE_URL + ${JSON.stringify(t.path)}${payload?', json='+JSON.stringify(JSON.parse(t.body)) :''}, timeout=10)\n`;
 const status=`${indent}assert response.${usePw?'status':'status_code'} == ${t.expectedStatus}\n`;
 const field=t.field?.trim();
 const assertField=field?`${indent}data = response.json()\n${indent}actual = data\n${field.split('.').map(part=>`${indent}actual = actual[${/^\d+$/.test(part)?part:JSON.stringify(part)}]\n`).join('')}${t.expectedValue!==''?`${indent}assert str(actual).lower() == ${JSON.stringify(String(t.expectedValue).toLowerCase())}\n`:''}`:'';
 return `\n# ${t.id}: ${t.name.replace(/[\r\n#]/g,' ')}\ndef ${name}(${usePw?'playwright: Playwright':''}):\n${pre}${request}${status}${assertField}${usePw?'    finally:\n        context.dispose()\n':''}`;
 }).join('\n');
 return '# Generated starter tests from manual API cases\n# Install: pip install pytest '+(usePw?'playwright':'requests')+'\n# Run: pytest -v test_manual_cases.py\n\n'+header+'\nBASE_URL = "https://dummyjson.com"\n'+(tests||'\n# Select a manual test case to generate tests.\n');
}
