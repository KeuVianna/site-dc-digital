const whatsappNumber = document.documentElement.dataset.whatsappNumber || '5577999172059';
const defaultMessage = 'Olá! Vim pelo site da DC Digital e quero entender qual serviço faz sentido para o meu negócio.';

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  const customMessage = link.getAttribute('data-whatsapp-text') || defaultMessage;
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  link.target = '_blank';
  link.rel = 'noreferrer';
});
