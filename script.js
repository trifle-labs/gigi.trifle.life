// GiGi personal site — minimal vanilla JS

// Sticker carousel
(function() {
  var stickers = [
    'artboard-1.webp','artboard-2.webp','artboard-3.webp','artboard-4.webp',
    'artboard-5.webp','artboard-6.webp','artboard-7.webp','artboard-8.webp',
    'artboard-9.webp','artboard-10.webp','artboard-11.webp','artboard-12.webp',
    'artboard-13.webp','artboard-14.webp','artboard-15.webp','artboard-16.webp',
    'artboard-16-copy.webp','artboard-16-copy-2.webp','artboard-17.webp',
    'artboard-18.webp','artboard-19.webp','artboard-20.webp','artboard-21.webp',
    'artboard-22.webp','artboard-23.webp','artboard-24.webp','artboard-25.webp',
    'artboard-26.webp','artboard-27.webp','artboard-28.webp','artboard-29.webp',
    'artboard-30.webp','artboard-31.webp','artboard-32.webp','artboard-33.webp',
    'artboard-34.webp','artboard-35.webp','artboard-36.webp','artboard-37.webp',
    'artboard-38.webp','artboard-39.webp','artboard-40.webp','artboard-41.webp',
    'artboard-42.webp','artboard-43.webp','artboard-53.webp','artboard-54.webp',
    'artboard-55.webp','artboard-56.webp','artboard-57.webp'
  ];
  var idx = Math.floor(Math.random() * stickers.length);
  var img = document.getElementById('sticker-img');
  var counter = document.getElementById('sticker-counter');
  if (!img) return;

  function update() {
    img.src = 'stickers/' + stickers[idx];
    if (counter) counter.textContent = (idx + 1) + ' / ' + stickers.length;
  }

  function next() {
    idx = (idx + 1) % stickers.length;
    update();
  }

  update();
  setInterval(next, 1500);
})();

// Tab switching for install commands
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('tab') && !e.target.classList.contains('copy-btn')) {
    const tabRow = e.target.parentElement;
    const tabs = tabRow.querySelectorAll('.tab');
    const cmd = tabRow.nextElementSibling;
    const tabName = e.target.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');

    cmd.textContent = cmd.dataset[tabName];
  }
});

// Copy command
function copyCmd(btn) {
  const cmd = btn.closest('.tab-row').nextElementSibling;
  navigator.clipboard.writeText(cmd.textContent).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'copied!';
    setTimeout(() => { btn.textContent = orig; }, 1500);
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
    fetch('.well-known/agent-card.json')
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
