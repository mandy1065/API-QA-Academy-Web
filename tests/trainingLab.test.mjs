import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateResponse,sendTrainingRequest} from '../src/trainingLab.js';

test('evaluates successful status and nested response fields',()=>{
  const r={status:200,data:{products:[{id:1}]}};
  assert.equal(evaluateResponse(r,200,'products.0.id').pass,true);
  assert.equal(evaluateResponse(r,201,'products.0.id').pass,false);
  assert.equal(evaluateResponse(r,200,'products.0.missing').pass,false);
});
test('expected negative HTTP response can pass',()=>{
  assert.equal(evaluateResponse({status:404,data:{message:'Not found'}},404,'message').pass,true);
});
test('rejects malformed assertions and missing responses',()=>{
  assert.equal(evaluateResponse(null,200,'').pass,false);
  assert.equal(evaluateResponse({status:200,data:{}},999,'').pass,false);
});
test('blocks arbitrary external URLs before making network calls',async()=>{
  await assert.rejects(sendTrainingRequest('GET','/https://evil.example',{}, {live:true}),/approved/);
  await assert.rejects(sendTrainingRequest('GET','/products/../admin',{}, {live:true}),/approved/);
});
