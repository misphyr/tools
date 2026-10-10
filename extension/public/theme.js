// Aplica o tema salvo antes da pintura para evitar flash de cores (MV3 não aceita script inline)
try {
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
} catch (e) {}
