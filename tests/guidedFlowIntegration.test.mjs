import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('all guided evaluation and saving paths use ALL_SCENARIOS',()=>{
 assert.equal(source.includes('GET_SCENARIOS[scenarioIndex]'),false);
 assert.match(source,/gradeManual\(ALL_SCENARIOS\[scenarioIndex\],manualResult,lockedPrediction\)/);
});
test('prediction is locked at request time and cannot be edited after execution',()=>{
 assert.match(source,/lockedPrediction=manualPrediction/);
 assert.match(source,/lockedPrediction\?'disabled'/);
 assert.match(source,/manualFeedback=gradeManual\(ALL_SCENARIOS\[scenarioIndex\],manualResult,lockedPrediction\)/);
});
test('answer is only revealed after manual evaluation',()=>{
 assert.match(source,/manualFeedback\?'<p><b>Documented expected status:/);
 assert.doesNotMatch(source,/<h3>3\. Predict expected results<\/h3><p>Expected HTTP/);
});
test('independent assignment requires conceptual choice and exact JSON assertion',()=>{
 assert.match(source,/reasonChoice:assessmentReasonChoice/);
 assert.match(source,/value:assessmentValue/);
 assert.match(source,/evaluated:!!manualFeedback&&manualFeedback.pass/);
});
