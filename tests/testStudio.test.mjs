import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCase,generateTests,DEFAULT_CASES} from '../src/testStudio.js';

test('manual case validates supported training endpoints',()=>{
 const item=validateCase({...DEFAULT_CASES[0],expectedStatus:'200'});
 assert.equal(item.expectedStatus,200);
 assert.throws(()=>validateCase({...item,path:'https://evil.example'}));
 assert.throws(()=>validateCase({...item,body:'{invalid'}));
 assert.throws(()=>validateCase({...item,expectedStatus:900}));
});
test('generates Python pytest code for CRUD and negative cases',()=>{
 const code=generateTests(DEFAULT_CASES,'requests');
 assert.match(code,/requests\.request/);
 assert.match(code,/assert response\.status_code == 404/);
 assert.match(code,/json\.loads/);
 assert.match(code,/def test_tc_001_0/);
});
test('generates Playwright API tests with disposal',()=>{
 const code=generateTests(DEFAULT_CASES.slice(0,2),'playwright');
 assert.match(code,/context\.fetch/);
 assert.match(code,/context\.dispose\(\)/);
 assert.match(code,/assert response\.status == 404/);
});
