const score = document.getElementById('model-score');
const scoreValue = document.getElementById('score-value');
const testResult = document.getElementById('test-result');
const threshold = document.getElementById('threshold');
const runButton = document.getElementById('run-pipeline');
const resultBadge = document.getElementById('result-badge');
const steps = document.getElementById('pipeline-steps');
const message = document.getElementById('pipeline-message');

score.addEventListener('input', () => { scoreValue.textContent = `${score.value}%`; });

runButton.addEventListener('click', () => {
  const testsPass = testResult.value === 'pass';
  const metricPass = Number(score.value) >= Number(threshold.value);
  const deploy = testsPass && metricPass;
  const rows = [
    ['1', 'Code checks', testsPass ? 'Passed' : 'Failed', testsPass],
    ['2', 'Model-quality gate', metricPass ? 'Passed' : 'Failed', metricPass],
    ['3', 'Deploy website', deploy ? 'Ready to deploy' : 'Blocked', deploy]
  ];
  steps.innerHTML = rows.map(([n, label, status, ok]) =>
    `<div class="output-step"><span class="output-icon">${n}</span><span>${label}</span><b class="${ok ? 'good' : 'bad'}">${status}</b></div>`
  ).join('');
  resultBadge.textContent = deploy ? 'GATES PASSED' : 'DEPLOYMENT BLOCKED';
  resultBadge.className = `result-badge ${deploy ? 'pass' : 'fail'}`;
  message.className = `pipeline-message ${deploy ? 'good' : 'bad'}`;
  if (deploy) {
    message.textContent = 'All configured gates passed. In a real workflow, the deployment job could now publish the tested artifact.';
  } else if (!testsPass && !metricPass) {
    message.textContent = 'The code tests failed and the example model score is below the threshold. Fix the issues and rerun the checks before release.';
  } else if (!testsPass) {
    message.textContent = 'The code tests failed. The pipeline blocks deployment even though the example score meets its threshold.';
  } else {
    message.textContent = 'The example model score is below the required threshold. The pipeline blocks release until the model passes evaluation.';
  }
});
