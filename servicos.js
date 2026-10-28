const whatsappNumber = document.documentElement.dataset.whatsappNumber;
const message = 'Olá! Vim pelo site da DC Digital e quero entender qual serviço faz sentido para o meu negócio.';
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.href = whatsappUrl;
  link.target = '_blank';
  link.rel = 'noreferrer';
});
