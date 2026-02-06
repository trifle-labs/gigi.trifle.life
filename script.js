// GiGi personal site — minimal vanilla JS

// Copy install command
function copyInstall(text, card) {
  navigator.clipboard.writeText(text).then(() => {
    card.classList.add('copied');
    const cmd = card.querySelector('.skill-cmd');
    const orig = cmd.textContent;
    cmd.textContent = 'copied!';
    setTimeout(() => {
      cmd.textContent = orig;
      card.classList.remove('copied');
    }, 1500);
  });
}

(function () {
  const toggle = document.getElementById('mode-toggle');
  const labelHuman = document.getElementById('label-human');
  const labelAgent = document.getElementById('label-agent');
  const agentPre = document.getElementById('agent-json');
  const copyBtn = document.getElementById('copy-btn');
  const tooltip = document.getElementById('tooltip');
  let agentData = null;

  // Toggle handler
  function setMode(agent) {
    document.body.classList.toggle('agent-mode', agent);
    toggle.checked = agent;
    labelHuman.classList.toggle('active', !agent);
    labelAgent.classList.toggle('active', agent);
    window.location.hash = agent ? 'agent' : '';
    if (agent && !agentData) loadAgentJSON();
  }

  toggle.addEventListener('change', () => setMode(toggle.checked));

  // Check hash on load
  if (window.location.hash === '#agent') setMode(true);

  // Load and render agent.json
  function loadAgentJSON() {
    fetch('agent.json')
      .then(r => r.json())
      .then(data => {
        agentData = data;
        agentPre.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
      })
      .catch(() => {
        agentPre.textContent = '{ "error": "failed to load agent.json" }';
      });
  }

  // Copy button
  copyBtn.addEventListener('click', () => {
    if (!agentData) return;
    navigator.clipboard.writeText(JSON.stringify(agentData, null, 2)).then(() => {
      copyBtn.textContent = 'copied!';
      setTimeout(() => { copyBtn.textContent = 'copy json'; }, 1500);
    });
  });

  // Syntax highlighting for JSON
  function syntaxHighlight(json) {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = 'json-num';
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'json-key' : 'json-str';
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );
  }

  // Skill chip tooltips
  document.querySelectorAll('.skill-chip[data-desc]').forEach(chip => {
    chip.addEventListener('mouseenter', e => {
      tooltip.textContent = chip.dataset.desc;
      tooltip.classList.add('visible');
      positionTooltip(e);
    });

    chip.addEventListener('mousemove', positionTooltip);

    chip.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });

  function positionTooltip(e) {
    const x = e.clientX + 12;
    const y = e.clientY + 16;
    const rect = tooltip.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 16;
    const maxY = window.innerHeight - rect.height - 16;
    tooltip.style.left = Math.min(x, maxX) + 'px';
    tooltip.style.top = Math.min(y, maxY) + 'px';
  }
})();
