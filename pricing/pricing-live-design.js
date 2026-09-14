const faqItems = [...document.querySelectorAll('#faq details')];
const includedServiceCards = [...document.querySelectorAll('#included article')];
const planCards = [...document.querySelectorAll('#plans .pricing-plan-card')];
const sectionGrid = document.querySelector('.marrow-section-grid');
const plansSection = document.querySelector('#plans');

const firstMonthOffers = [
  {
    title: '入门版',
    firstPrice: '$49',
    regularPrice: '$89 / 月',
    savings: '省 $40',
    description: '适合一个人开始使用。首个付费月 $49，之后每月 $89。',
  },
  {
    title: '成长版',
    firstPrice: '$99',
    regularPrice: '$199 / 月',
    savings: '省 $100',
    description: '适合成长中的团队。首个付费月 $99，之后每月 $199。',
  },
];

firstMonthOffers.forEach((offer) => {
  const card = planCards.find((candidate) => candidate.querySelector('h3')?.textContent.trim() === offer.title);
  const title = card?.querySelector('h3');
  const description = title?.nextElementSibling;
  const price = description?.nextElementSibling;
  if (!card || !description || !price) return;

  description.textContent = offer.description;
  price.classList.add('pricing-offer-row');
  price.setAttribute(
    'aria-label',
    `${offer.title}首个付费月 ${offer.firstPrice}，之后每月 ${offer.regularPrice.replace(' / 月', '')}，首月${offer.savings}`,
  );

  const currentPrice = document.createElement('span');
  currentPrice.className = 'pricing-offer-current';
  currentPrice.textContent = offer.firstPrice;

  const period = document.createElement('span');
  period.className = 'pricing-offer-period';
  period.textContent = '/ 首月';

  const regularPrice = document.createElement('del');
  regularPrice.className = 'pricing-offer-regular';
  regularPrice.textContent = offer.regularPrice;

  const savings = document.createElement('span');
  savings.className = 'pricing-offer-savings';
  savings.textContent = offer.savings;

  price.replaceChildren(currentPrice, period, regularPrice, savings);
});

const monthlyPriceAnswer = faqItems[0]?.querySelector('div p');
if (monthlyPriceAnswer) {
  monthlyPriceAnswer.textContent = '入门版首个付费月 $49，之后每月 $89。成长版首个付费月 $99，之后每月 $199。企业套餐根据实际需求报价。月费包含各套餐列出的数据容量、服务额度与团队席位。所有价格均为美元。';
}

const discountMetaDescription = '对比 Hologrow 入门版、成长版与企业套餐。入门版首个付费月 $49，之后每月 $89；成长版首个付费月 $99，之后每月 $199。免费试用 14 天。';
document.querySelector('meta[name="description"]')?.setAttribute('content', discountMetaDescription);
document.querySelector('meta[property="og:description"]')?.setAttribute('content', discountMetaDescription);
document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', discountMetaDescription);

document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
  try {
    const entries = JSON.parse(script.textContent);
    const records = Array.isArray(entries) ? entries : [entries];
    records.forEach((record) => {
      if (record['@type'] === 'FAQPage') {
        const priceQuestion = record.mainEntity?.find((item) => item.name === 'Hologrow 每月多少钱？');
        if (priceQuestion?.acceptedAnswer) priceQuestion.acceptedAnswer.text = monthlyPriceAnswer?.textContent;
      }
    });
    script.textContent = JSON.stringify(entries);
  } catch {
    // Leave unrelated structured data untouched if it cannot be parsed.
  }
});

const syncPricingRailStart = () => {
  if (!sectionGrid || !plansSection) return;
  const gridTop = sectionGrid.getBoundingClientRect().top;
  const plansBottom = plansSection.getBoundingClientRect().bottom;
  sectionGrid.style.setProperty(
    '--pricing-rail-start',
    `${Math.max(18, plansBottom - gridTop)}px`,
  );
};

syncPricingRailStart();

if ('ResizeObserver' in window && sectionGrid && plansSection) {
  const railResizeObserver = new ResizeObserver(syncPricingRailStart);
  railResizeObserver.observe(plansSection);
}

window.addEventListener('load', syncPricingRailStart, { once: true });
window.addEventListener('resize', syncPricingRailStart);

includedServiceCards.forEach((card) => {
  const iconSlot = card.querySelector(':scope > div:first-child > span');
  if (!iconSlot) return;

  const icon = document.createElement('img');
  icon.src = '/hologrow/pricing/product/marrow/service-card-shield-check.svg';
  icon.alt = '';
  icon.width = 20;
  icon.height = 20;
  icon.setAttribute('aria-hidden', 'true');
  iconSlot.replaceChildren(icon);
});

faqItems.forEach((item) => {
  item.setAttribute('name', 'pricing-faq');
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
