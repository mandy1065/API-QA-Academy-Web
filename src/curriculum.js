// Curriculum adapted from mandy1065/API-QA-Academy lessons.py; extended with Python and Playwright.
const original = [
['What is an API?','GET','/products/1','Identify the client, server, endpoint, request and response.'],
['Client, Server & Endpoint','GET','/products/1','Explain the difference between the host and endpoint path.'],
['Request and Response','GET','/products/1','Identify method, URL, headers, status and response body.'],
['HTTP Methods','POST','/products/add','Match GET, POST, PUT, PATCH and DELETE to CRUD operations.'],
['Status Codes','GET','/products/999999','Explain why an expected 404 is a passing negative test.'],
['JSON Basics for API Testers','GET','/users/1','Find strings, numbers, booleans, objects and arrays.'],
['Headers','GET','/products/1','Explain Accept, Content-Type and Authorization.'],
['Path vs Query Parameters','GET','/products?limit=3&skip=0','Compare a resource ID with pagination parameters.'],
['Authentication Concepts','POST','/auth/login','Explain authentication versus authorization.'],
['Manual GET Testing','GET','/products/1','Verify status, response body, types and important fields.'],
['Manual POST Testing','POST','/products/add','Submit a JSON body and verify the returned fields.'],
['Manual PUT & PATCH Testing','PATCH','/products/1','Compare full and partial updates.'],
['Manual DELETE Testing','DELETE','/products/1','Validate the deletion response and its indicators.'],
['Manual JSON Validation','GET','/products/1','Verify keys, values, types and nested JSON.'],
['Manual Authentication Testing','POST','/auth/login','Design positive and negative login tests.'],
['API Test Case Design','GET','/products/1','Write positive, negative and boundary test cases.'],
['Python requests Library','GET','/products/1','Write requests.get() and inspect status_code.'],
['Automate GET Testing','GET','/products/1','Assert the status and product ID in Python.'],
['Status Code Assertions','GET','/products/999999','Assert an expected 404 response.'],
['JSON Assertions','GET','/products/1','Assert JSON types and important fields.'],
['POST Automation','POST','/products/add','Automate creation-style response checks.'],
['PUT & PATCH Automation','PATCH','/products/1','Automate partial updates with JSON payloads.'],
['DELETE Automation','DELETE','/products/1','Automate deletion indicator assertions.'],
['Headers in Automation','GET','/products/1','Assert the Content-Type header.'],
['Query Parameter Automation','GET','/products?limit=3&skip=0','Validate pagination and query parameters.'],
['Authentication Automation','POST','/auth/login','Explain secure token capture and reuse.'],
['Bearer Token & Protected Requests','GET','/auth/me','Test authorized and unauthorized access.'],
['Negative Automation','GET','/products/999999','Test missing resources and invalid requests.'],
['Pytest Basics','GET','/products/1','Create discoverable test_ functions.'],
['Fixtures','GET','/products/1','Reuse setup with pytest fixtures.'],
['Parametrization','GET','/products/1','Run one test for multiple inputs.'],
['Reusable API Functions','GET','/products/1','Separate request clients from assertions.'],
['Timeouts & Error Handling','GET','/products/1','Use timeouts and meaningful failure messages.'],
['Test Data Management','POST','/products/add','Organize reusable payloads and test data.'],
['API Automation Framework','GET','/products/1','Organize config, clients, tests and reports.'],
['Final Project — Production-Style API Suite','GET','/products/1','Build and run 12 API tests across CRUD, auth and negative cases.']
];
const python = [
['Python setup and VS Code','Install Python, create a virtual environment and run a script.'],['Variables and print','Store expected and actual results in variables.'],['Strings and f-strings','Format API URLs and readable assertion messages.'],['Numbers and booleans','Understand status codes and boolean conditions.'],['Lists and indexing','Inspect a list of returned products.'],['Dictionaries and JSON','Access keys in a JSON-like dictionary.'],['If, elif and else','Choose a result based on a condition.'],['For loops','Check multiple IDs with a loop.'],['While loops and retries','Explain retry limits without hiding defects.'],['Functions and return values','Create a reusable status validator.'],['Exceptions and errors','Understand KeyError, timeout and JSON errors.'],['Modules and imports','Separate test data and helper functions.'],['Classes and OOP','Create a small ProductClient class.'],['Assertions and pytest','Turn a requirement into a test assertion.'],['Python QA mini project','Combine variables, loops, dictionaries and functions.']
];
const playwright = [
['Install Playwright Python','Install pytest-playwright and Chromium.'],['APIRequestContext','Create an isolated Playwright API request context.'],['Playwright GET assertions','Verify response.status and response.json().'],['Playwright POST and PATCH','Send JSON payloads and validate returned fields.'],['Playwright DELETE and negative cases','Verify deletion indicators and expected errors.'],['Authentication and storage state','Reuse authenticated state without exposing tokens.'],['pytest fixtures with Playwright','Share request context and base URL safely.'],['Parameterized API tests','Test multiple IDs with pytest.mark.parametrize.'],['Browser navigation and locators','Use page.goto and role-based locators.'],['UI forms and assertions','Fill inputs and assert visible outcomes.'],['Page Object Model','Extract reusable page interactions.'],['API + UI capstone and CI','Run API and browser tests in GitHub Actions.']
];
const stage=(i)=>i<9?'API Foundations':i<16?'Manual API Testing':i<28?'Python API Automation':'Advanced pytest';
export const lessons=[
 ...original.map((x,i)=>({id:`L${String(i+1).padStart(2,'0')}`,stage:stage(i),title:x[0],method:x[1],path:x[2],objective:x[3],kind:'api',difficulty:i<16?'Beginner':'Intermediate'})),
 ...python.map((x,i)=>({id:`P${String(i+1).padStart(2,'0')}`,stage:'Python for QA',title:x[0],method:'GET',path:'/products/1',objective:x[1],kind:'python',difficulty:'Beginner'})),
 ...playwright.map((x,i)=>({id:`W${String(i+1).padStart(2,'0')}`,stage:'Playwright Python',title:x[0],method:'GET',path:'/products/1',objective:x[1],kind:'playwright',difficulty:'Advanced'}))
];
export const stages=[...new Set(lessons.map(x=>x.stage))];
export const product={id:1,title:'Essence Mascara Lash Princess',price:9.99,stock:99,category:'beauty',rating:4.94};
export function mockRequest(method,path,body={}){
 const start=Date.now();let status=200,data={},headers={'content-type':'application/json; charset=utf-8'};
 if(path.startsWith('/auth/login')){if(method!=='POST'){status=405;data={message:'Method not allowed'}}else if(body.username==='emilys'&&body.password==='emilyspass'){data={id:1,username:'emilys',accessToken:'DEMO_TOKEN_NOT_REAL'}}else{status=400;data={message:'Invalid credentials'}}}
 else if(path.startsWith('/auth/me')){status=401;data={message:'Unauthorized: demo request has no valid session'}}
 else if(path.startsWith('/products')){
 const u=new URL(path,'https://dummyjson.com');const bits=u.pathname.split('/').filter(Boolean);const id=Number(bits[1]);
 if(bits[1]==='add'&&method==='POST'){status=201;data={id:195,...body,_simulated:true}}
 else if(bits[1]&&(!Number.isInteger(id)||id!==1)){status=404;data={message:'Product not found'}}
 else if(method==='GET'){data=bits[1]?{...product}:{products:[{...product}],total:1,skip:Number(u.searchParams.get('skip')||0),limit:Number(u.searchParams.get('limit')||30)}}
 else if(method==='DELETE'){data={...product,isDeleted:true,deletedOn:'2026-01-01T00:00:00.000Z',_simulated:true}}
 else if(method==='PATCH'||method==='PUT'){data={...product,...body,_simulated:true}}
 else{status=405;data={message:'Method not allowed'}}
 }else if(path.startsWith('/users/1')){data={id:1,firstName:'Emily',age:28,email:'emily@example.test'}}
 else{status=404;data={message:'Unknown endpoint in offline simulator'}};
 return {status,data,headers,elapsed:Math.max(1,Date.now()-start),simulated:true};
}
export function lessonDetail(l){
 const isPy=l.kind==='python',isPW=l.kind==='playwright';
 const request=`${l.method} https://dummyjson.com${l.path}`;
 let explanation=isPy?'Python is the language we use to turn manual checks into repeatable tests. Read the example, predict the output, then modify it.':isPW?'Playwright for Python can test HTTP APIs and web browsers. The examples here use pytest-style tests and run in VS Code or GitHub Actions, not in this browser.':'An API lets one application request information or an action from another. QA checks both successful and unsuccessful behavior against requirements, not just whether the request returns 200.';
 let code=isPW?`from playwright.sync_api import Playwright\n\ndef test_product_api(playwright: Playwright):\n    api = playwright.request.new_context(base_url="https://dummyjson.com")\n    try:\n        response = api.get("/products/1")\n        assert response.status == 200\n        data = response.json()\n        assert data["id"] == 1\n    finally:\n        api.dispose()`:
 isPy?`# ${l.title}\nproduct = {"id": 1, "title": "Demo product", "price": 25}\nexpected_id = 1\nactual_id = product["id"]\nassert actual_id == expected_id\nprint("PASS: product ID matches")`:
 `import requests\n\n# ${l.title}\nresponse = requests.get("https://dummyjson.com/products/1", timeout=10)\nassert response.status_code == 200\nproduct = response.json()\nassert product["id"] == 1\nprint("PASS: product ID matches")`;
 const assignment=isPW?`Write a pytest test that demonstrates: ${l.objective} Include a meaningful status assertion and a response-data assertion.`:isPy?`Practice: ${l.objective} Modify the example and explain what changes in its output.`:`Manual task: ${l.objective} Record the expected status, actual status, and at least two data checks for ${request}. Then explain how to automate the same checks.`;
 const hint=isPW?'Start with a test_ function, use playwright.request.new_context(), assert response.status, and dispose the context.':isPy?'Identify the variable and data type first. Use assert to compare actual and expected.':'Send the request in the API Lab. Compare the returned status with the expected status. Inspect the JSON field types and values.';
 const quiz=l.kind==='api'?{q:'What makes an API test PASS?',options:['Every response is HTTP 200','Actual behavior matches expected behavior','The response is JSON'],correct:1}:l.kind==='python'?{q:'What does assert do in Python tests?',options:['Prints a message','Checks a condition and fails if false','Sends an HTTP request'],correct:1}:{q:'Which Playwright Python API is used to send HTTP requests?',options:['page.click()','playwright.request.new_context()','browser.screenshot()'],correct:1};
 return {explanation,request,code,assignment,hint,quiz,steps:['Understand the requirement and expected behavior','Send or simulate a request and inspect the response','Write expected-versus-actual checks','Convert the checks into automated assertions','Test a negative or boundary case and explain the result']};
}
