export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;       // ISO 格式，如 2026-10-14
  tags: string[];
  content: string;    // HTML 字符串
};

export const posts: Post[] = [
  {
    slug: 'how-to-check-chinese-company-risk',
    title: 'How to Check a Chinese Company’s Risk Before You Pay',
    description:
      'A practical guide to reading Chinese company registration data, operating status, and enforcement records before signing a contract.',
    date: '2026-10-14',
    tags: ['due diligence', 'china', 'risk'],
    content: `
      <p>When you're about to sign with a Chinese supplier, the registration record is the first place to look. It tells you whether the company still legally exists, who controls it, and whether it has been penalized.</p>
      <h2>Start with operating status</h2>
      <p>A status of 存续 or 在业 means the company is active. 吊销 means its license was revoked. 注销 means it was formally deregistered. Never wire money to a company whose status is anything other than active.</p>
      <h2>Check the registered capital</h2>
      <p>Registered capital is a commitment, not cash in the bank. Paid-in capital is what has actually been deposited. When the two numbers diverge widely, treat the company as thinly capitalized.</p>
      <h2>Read the enforcement records</h2>
      <p>Court enforcement records and dishonest-debtor listings are the strongest red flags. A single active enforcement case can freeze the company's bank accounts without warning.</p>
    `,
  },
];