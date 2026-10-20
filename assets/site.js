(() => {
  const source = new URLSearchParams(location.search);
  const allowed = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'sub_id_1', 'sub_id_2', 'sub_id_3', 'external_id'];
  for (const link of document.querySelectorAll('a[data-offer-link]')) {
    const url = new URL(link.href);
    for (const key of allowed) {
      const value = source.get(key);
      if (value && value.length <= 128) url.searchParams.set(key, value);
    }
    link.href = url.toString();
  }
  const list = document.querySelector('.partners-list');
  if (!list) return;
  const cards = [...list.querySelectorAll('.partners-item')];
  fetch('https://admin.gettraff.digital/api/rotator/moneyfast/ranking', {cache: 'no-store'})
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.enabled || !Array.isArray(data.partners)) return;
      const positions = new Map();
      for (const partner of data.partners) {
        const position = Number(partner.position);
        for (const key of [partner.key, ...(partner.match || [])]) {
          if (key && Number.isFinite(position)) positions.set(String(key).trim().toLocaleLowerCase('uk'), position);
        }
      }
      cards.sort((a, b) => (positions.get(a.dataset.offerSelector.toLocaleLowerCase('uk')) ?? 1000) - (positions.get(b.dataset.offerSelector.toLocaleLowerCase('uk')) ?? 1000));
      for (const card of cards) list.appendChild(card);
      list.dataset.rankVersion = String(data.version || '');
    })
    .catch(() => {});
})();
