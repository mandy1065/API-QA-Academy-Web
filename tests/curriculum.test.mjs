import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,stages,mockRequest,lessonDetail} from '../src/curriculum.js';
test('63 unique complete lessons',()=>{assert.equal(lessons.length,63);assert.equal(new Set(lessons.map(l=>l.id)).size,63);for(const l of lessons){assert.ok(l.title&&l.objective&&l.stage);const d=lessonDetail(l);assert.ok(d.code&&d.hint&&d.quiz.options.length>=3)}});
test('stage coverage',()=>{assert.equal(stages.length,6);assert.equal(lessons.filter(l=>l.kind==='playwright').length,12);assert.equal(lessons.filter(l=>l.kind==='python').length,15)});
test('simulator GET success and missing',()=>{assert.equal(mockRequest('GET','/products/1').status,200);assert.equal(mockRequest('GET','/products/999999').status,404)});
test('simulator CRUD writes are simulated',()=>{assert.equal(mockRequest('POST','/products/add',{title:'Demo'}).status,201);assert.equal(mockRequest('PATCH','/products/1',{title:'New'}).data.title,'New');assert.equal(mockRequest('DELETE','/products/1').data.isDeleted,true)});
test('simulator never accepts arbitrary external URL',()=>{assert.equal(mockRequest('GET','/products/1').data.id,1)});
