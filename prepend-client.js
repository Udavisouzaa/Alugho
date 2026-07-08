const fs = require('fs');
const files = [
  'src/components/landing/Features.tsx',
  'src/components/landing/Hero.tsx',
  'src/components/landing/LandingLayout.tsx',
  'src/components/landing/PricingAndCompare.tsx'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.startsWith('"use client"')) {
    fs.writeFileSync(f, '"use client";\n' + content, 'utf8');
  }
}
