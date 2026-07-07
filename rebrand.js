const fs = require('fs');

const replacements = [
  { file: 'package.json', from: '"name": "rentpay"', to: '"name": "alugho"' },
  { file: 'src/app/layout.tsx', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/page.tsx', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/login/page.tsx', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/signup/page.tsx', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/portal/layout.tsx', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/dashboard/layout.tsx', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/dashboard/layout.tsx', from: '>\n                R\n              </div>', to: '>\n                A\n              </div>' },
  { file: 'src/app/dashboard/page.tsx', from: 'O RentPay', to: 'O Alugho' },
  { file: 'src/app/dashboard/tenants/actions.ts', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/dashboard/maintenance/actions.ts', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/api/cron/daily/route.ts', from: 'RentPay', to: 'Alugho' },
  { file: 'src/app/api/cron/daily/route.ts', from: 'rentpay.com', to: 'alugho.com' },
  { file: 'src/app/api/cron/reminders/route.ts', from: 'RentPay', to: 'Alugho' },
  { file: 'src/components/UserDropdown.tsx', from: 'rentpay.com', to: 'alugho.com' },
  { file: 'src/app/portal/maintenance/actions.ts', from: 'RentPay', to: 'Alugho' }
];

for (const req of replacements) {
  let content = fs.readFileSync(req.file, 'utf8');
  content = content.split(req.from).join(req.to);
  fs.writeFileSync(req.file, content, 'utf8');
}
console.log('Rebranding applied.');
