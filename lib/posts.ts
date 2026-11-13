export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;       // ISO 格式，如 2026-10-14
  tags: string[];
  content: string;    // HTML 字符串
};

export const posts: Post[] = [
  // 最新的一篇：11月5日
  {
    slug: 'why-me-boundary-of-public-data',
    title: 'Why Me — The Boundary of Public Data, and Judgment Beyond It',
    description: 'Understanding the limits of public registry data and when you need a custom China due diligence investigation.',
    date: '2026-11-05',
    tags: ['China business background check', 'ChopCheck China company search', 'custom China due diligence investigation', 'public registry data limitation China'],
    content: `
      <p>If you have read the previous four articles, you probably understand one thing: after August 2026, Chinese supplier due diligence is no longer as simple as "find an agency to check it out." It has become work that requires distinguishing layers, understanding boundaries, and knowing what can and cannot be done.</p>
      <p>My work is built on a simple recognition: <strong>public data can answer many questions, but not all of them.</strong></p>
      <p>ChopCheck (<a href="https://www.duediligences.org" target="_blank" rel="noopener noreferrer">duediligences.org</a>) handles the first layer. You enter a company name, an English keyword, or a Unified Social Credit Code. The system cross-checks public Chinese business registry data to confirm legal status, registration details, and ownership structure, screens for publicly reported legal disputes and operational abnormalities, and returns basic credit information. Three things: identity, risk signals, basic business information. Three free lookups a week, no account required.</p>
      <p>The limitations of this layer are obvious. Public registry data will not tell you a factory’s actual production capacity, whether the ultimate controller has hidden related-party transactions through multi-layered offshore structures, or what the relationship is among three companies sharing one registered address. It can only tell you whether the company legally exists under the name you see, and whether there are obvious red flags in its public record.</p>
      <p>The second layer is a custom investigation. Its starting point is not a database; it is your specific question. Are you worried the counterparty is a shell company? Does your transaction involve an ownership structure you do not fully understand? Do the "factory photos" you received match the address and business scope in the registration information? A custom investigation works from public information and non-sensitive channels, within compliance boundaries, to assemble a picture usable for commercial judgment. It is not a master key, but it is far more reliable than spending two hours on Google yourself and deciding on gut feeling.</p>
      <p>I wrote these five articles not to tell you that Chinese suppliers are dangerous. The vast majority are normal commercial entities. But "the vast majority" is not "all," and one wrong deposit payment is enough to turn a business deal into a nightmare. Spending fifteen minutes checking public data before wiring money—or spending a little more on a custom check when the transaction structure is complex—is the cheapest risk management you can do.</p>
      <p>Start at <a href="https://www.duediligences.org" target="_blank" rel="noopener noreferrer">duediligences.org</a>. If what you need goes beyond public data, you know where to find me.</p>
    `,
  },
  // 11月4日
  {
    slug: 'the-dual-compliance-dilemma',
    title: 'The Dual Compliance Dilemma',
    description: 'Navigating the conflict between US UFLPA requirements and China blocking statutes when conducting supply chain due diligence.',
    date: '2026-11-04',
    tags: ['China US due diligence conflict', 'compliance conflict supply chain China', 'UFLPA China blocking statute', 'dual compliance China due diligence'],
    content: `
      <p>A fact often overlooked in most discussions is this: after the August countermeasures and Decree 834 are layered together, Western importers no longer face a "can I investigate" question. They face a "two legal systems are asking you to do opposite things" question.</p>
      <p>The U.S. side is clear: if you want to exclude risks related to Xinjiang supply chains, CBP expects you to provide detailed tracing evidence. The UFLPA Entity List reached 187 entities after adding 43 Chinese entities on July 31, 2026. The EU’s CSDDD and supply chain due diligence rules in Germany and France similarly require substantive review of supply chains.</p>
      <p>China’s rules point in another direction. Article 13 of Decree 834 brings domestic supply chain information collection under regulation. Article 15 allows investigations and countermeasures against foreign entities that "violate normal market trading principles" or "cause or threaten to cause substantial damage to China’s supply chain security." Decree 835 further establishes a blocking mechanism against improper extraterritorial jurisdiction measures by foreign countries; Chinese companies and individuals may, in certain circumstances, be prohibited from complying with foreign legal requirements.</p>
      <h2>What does this mean for an ordinary importer?</h2>
      <p>If you terminate a contract with a Chinese supplier because of U.S. compliance requirements, and that termination is deemed to be based on foreign sanctions rather than commercial reasons, you may face countermeasure risk on the Chinese side. If you stop providing complete tracing information to U.S. Customs to avoid Chinese risk, you may face CBP detention.</p>
      <p>This is not a black-and-white choice. Law firm recommendations focus on several directions: revise supplier contracts to clarify that "cooperating with due diligence does not require the supplier to violate Chinese law"; conduct compliance reviews before data leaves China; and keep contemporaneous records of commercial decisions to demonstrate that termination or adjustment was based on genuine commercial reasons such as cost, quality, or supply chain resilience.</p>
      <p>ChopCheck does not resolve legal conflicts, but it provides a low-risk factual foundation at the starting point of the conflict: before investing complex compliance resources, first confirm that you are dealing with a genuinely existing, normally operating company. Many transactions should be rejected at the first step and never need to reach the dilemma.</p>
      <p>Start with a standard lookup at <a href="https://www.duediligences.org" target="_blank" rel="noopener noreferrer">duediligences.org</a>. If the situation is already complex, a custom investigation is the next step.</p>
    `,
  },
  // 11月3日
  {
    slug: 'three-things-western-buyers-can-still-do',
    title: 'Three Things Western Buyers Can Still Do',
    description: 'How to verify Chinese supplier compliance and build alternative verification workflows after recent sanctions and regulatory changes.',
    date: '2026-11-03',
    tags: ['verify Chinese supplier compliance', 'alternative supplier verification after China sanctions', 'public registry check China company', 'due diligence without US auditors China'],
    content: `
      <p>If you are a Western buyer preparing to wire a deposit to a Chinese supplier, your operational checklist needs updating after August 2026. Here are three things that remain effective and risk-controlled.</p>
      <h2>First: Make public registry verification your default first step.</h2>
      <p>China has a unified social credit code system. A company’s registration status, registered capital, establishment date, business scope, and shareholder information can all be queried through public channels. This step does not depend on any sanctioned U.S. entity and does not involve sensitive cross-border data transfer. Its value lies in filtering out the most basic risks: whether the company exists, whether it is operating, whether registered capital is subscribed or paid-in, and whether the registered address matches the claimed factory address. A "manufacturer" registered in a residential apartment building will be exposed at the public data level.</p>
      <h2>Second: Separate "information collection" from "evidence building."</h2>
      <p>If your goal is to meet UFLPA or other compliance requirements, the type of evidence you need may be entirely different from "understanding your counterparty." The former often involves supply chain tracing and labor audits; the latter only requires confirming corporate identity and basic risk indicators. The August countermeasures strike the part of the former that relies on cooperation within China. Treat these two objectives separately: use public data to address counterparty risk, and use compliant channels (including solutions designed by licensed Chinese lawyers) to handle regulatory compliance evidence.</p>
      <h2>Third: Re-examine your existing due diligence vendor list.</h2>
      <p>If the audit or certification firm you use appears on the MOFCOM countermeasure list, or if its Chinese partners may face restrictions due to cooperation with listed entities, you need to build alternatives. Legal 500 analysis recommends that importers "inventory which tracing, audit, and certification providers are involved in UFLPA documentation, confirm with each how the order affects their work involving Chinese parties, and build redundancy before the next detention occurs."</p>
      <p>ChopCheck’s positioning sits precisely in this gap: standard verification covers the first item, custom investigations help clients make judgments on the third item, and the compliance architecture for the second item needs to be developed in collaboration with qualified Chinese legal counsel.</p>
      <p>A quick starting point for the first item is <a href="https://www.duediligences.org" target="_blank" rel="noopener noreferrer">duediligences.org</a>. For the third, send me a message with the company name.</p>
    `,
  },
  // 11月2日
  {
    slug: 'what-order-834-actually-prohibits',
    title: 'What Order 834 Actually Prohibits (And What It Doesn’t)',
    description: 'Understanding the legal boundaries of supply chain due diligence in China under Decree 834 and how it affects cross-border data transfers.',
    date: '2026-11-02',
    tags: ['China supply chain security regulations', 'Decree 834 due diligence China', 'is supplier audit legal in China', 'China cross-border data transfer due diligence'],
    content: `
      <p>Before discussing the August countermeasures, you must understand an earlier rule. On April 7, 2026, China’s State Council Decree No. 834, <em>Regulations on the Security of Industrial and Supply Chains</em>, took effect. Article 13 is widely interpreted as "restricting supply chain due diligence," but the accurate description is this: it does not create a new prohibitive norm. Instead, it connects supply chain information collection activities to China’s existing data security and national security regulatory framework.</p>
      <p>In other words, <strong>legal due diligence in China has always been permitted</strong>. Illegal information collection—involving state secrets, important data, or unauthorized cross-border transfer of personal information—was also illegal before Decree 834. What Decree 834 did was explicitly bring the scenario of "supply chain due diligence" into the existing regulatory scope, giving enforcement a clearer basis.</p>
      <h2>What does this mean for you?</h2>
      <p>If you are verifying corporate registration information through public channels, the risk is extremely low. If you ask a Chinese supplier to fill out a questionnaire containing detailed employee lists, production formulas, or customer information, and transmit the raw data back to the U.S., you need to pay attention to two things: first, whether this data constitutes "important data" or involves cross-border personal information; second, whether the supplier has the right to provide this information.</p>
      <p>A frequently cited practical recommendation is this: conduct a compliance review before the data leaves China. The review covers whether state secrets, important data, or personal information are involved, and whether the recipient is on a countermeasure list or malicious entity list. This sounds cumbersome, but it distinguishes between "usable due diligence" and "due diligence that gets you into trouble."</p>
      <p>ChopCheck’s standard service is safe precisely because it stays at the level of public registry data and does not trigger the complex compliance issues of cross-border data transfer. The value of a custom investigation lies in knowing where the boundaries are—and how to obtain enough information within those boundaries to make a commercial judgment.</p>
      <p>For a standard public registry check, start at <a href="https://www.duediligences.org" target="_blank" rel="noopener noreferrer">duediligences.org</a>. For boundary-sensitive situations, reach out directly.</p>
    `,
  },
  // 11月1日
  {
    slug: 'china-due-diligence-sanctions-what-now',
    title: 'The Sanctions Happened. Now What?',
    description: 'On August 5, 2026, China’s MOFCOM added six U.S. entities to its countermeasure list. What does this mean for Western importers trying to verify Chinese suppliers?',
    date: '2026-11-01',
    tags: ['China due diligence sanctions', 'what happened to US supply chain auditors in China', 'can I still verify Chinese suppliers', 'China MOFCOM countermeasure list 2026'],
    content: `
      <p>On August 5, 2026, China’s Ministry of Commerce (MOFCOM) issued Order No. 2, adding six U.S. entities to its countermeasure list. The list includes Applied DNA Sciences, Stratum Reservoir, Altana Technologies, Responsible Business Alliance, Verite Group, and Human Rights in China. The measures are straightforward: Chinese organizations and individuals are prohibited from engaging in "relevant transactions, cooperation, and other activities" with these six entities. There is no asset freeze and no travel ban, but the term "relevant transactions" remains undefined.</p>
      <p>What does this mean for Western importers?</p>
      <p>Four of these six entities provide services that, for the past few years, U.S. Customs and Border Protection (CBP) has repeatedly told importers to submit as evidence in UFLPA detention cases: DNA tracing, isotope analysis, supply chain mapping, and labor audits. If you rely on any of them to build your supplier compliance file, your chain of evidence may suddenly be unenforceable on the Chinese side.</p>
      <p>But the more significant signal is not the list itself. In a same-day statement, a MOFCOM spokesperson explicitly linked this countermeasure to the U.S. Department of Homeland Security’s July 31 addition of 43 Chinese entities to the UFLPA Entity List. This is a reciprocal response, and supply chain tracing services happen to be caught in the middle.</p>
      <h2>So, can you still verify Chinese suppliers?</h2>
      <p>Yes. But the answer to "how" and "who" has changed.</p>
      <p>Public company registry data—registration status, ownership structure, legal representative, whether registered capital is paid-in, and public litigation records—remains accessible and does not depend on any entity on the countermeasure list. ChopCheck’s standard verification is built precisely on this layer of public data. Its limitation is that it cannot see what actually happens inside the factory, but its advantage is that it does not touch the sensitive nerves of Chinese regulators.</p>
      <p>What has genuinely changed is how deep-dive investigations are executed. In the past, you could commission a U.S. firm to conduct a supply chain audit. Now, you need to confirm whether that firm is on the list and whether its Chinese partners can still legally cooperate. If your due diligence plan lacks any China-based compliance perspective, the execution risk after August 2026 needs to be reassessed.</p>
      <p>If you just need a baseline reality check before wiring a deposit, you can run a standard lookup at <a href="https://www.duediligences.org" target="_blank" rel="noopener noreferrer">duediligences.org</a>. If your situation is more complex, that is a conversation for a custom investigation.</p>
    `,
  },
  // 最早的一篇：10月14日
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
  }
];