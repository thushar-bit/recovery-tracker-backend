export interface RoutineTask {
  time: string
  text: string
  tag: 'health' | 'tech' | 'work' | 'recovery'
  key: string
}

export interface RoadmapTopic {
  day: string
  title: string
  desc: string
  where: string
}

export interface Phase {
  label: string
  info: string
  topics: RoadmapTopic[]
}

export const ROUTINE: RoutineTask[] = [
  { time: '7:00 AM', text: 'Wake up. Drink water immediately. Phone stays in other room.', tag: 'recovery', key: 'wake' },
  { time: '7:05 AM', text: 'Splash cold water on face. Do not lie back down.', tag: 'health', key: 'coldface' },
  { time: '7:10 AM', text: '20 min walk outside. No earphones. Just walk.', tag: 'health', key: 'walk' },
  { time: '7:30 AM', text: 'Cold shower — 3 minutes. Non-negotiable.', tag: 'recovery', key: 'shower' },
  { time: '7:50 AM', text: 'Cat-cow stretch + dead hang — 5 mins. Fixes back pain.', tag: 'health', key: 'stretch' },
  { time: '8:00 AM', text: 'Toilet time — no phone inside. Up to 60 mins fine.', tag: 'health', key: 'toilet' },
  { time: '8:30 AM', text: 'Breakfast. No screens. Eat peacefully.', tag: 'health', key: 'breakfast' },
  { time: '9:20 AM', text: 'Tech block 1 — 1 Leetcode problem. Read it, think 15 mins, hint only if stuck.', tag: 'tech', key: 'leetcode' },
  { time: '10:00 AM', text: 'Commute — tech podcast or system design audio only.', tag: 'tech', key: 'commute' },
  { time: '10:30 AM', text: 'Work starts. Drink water before you sit down.', tag: 'work', key: 'workstart' },
  { time: '1:00 PM', text: 'Lunch + 10 min walk after. Drink water before eating.', tag: 'health', key: 'lunch' },
  { time: '5:00 PM', text: 'Stand up, walk 2 mins. Back pain prevention.', tag: 'health', key: 'standbreak' },
  { time: '7:30 PM', text: 'Work ends + commute back. Tech podcast only.', tag: 'work', key: 'commute2' },
  { time: '8:30 PM', text: 'Dinner. No phone at the table.', tag: 'health', key: 'dinner' },
  { time: '9:00 PM', text: 'Tech block 2 — 25 mins only. One system design concept or tutorial.', tag: 'tech', key: 'techblock2' },
  { time: '9:30 PM', text: 'Physical book. No screens whatsoever.', tag: 'recovery', key: 'book' },
  { time: '10:00 PM', text: 'Phone goes to other room. Magnesium tablet. Sleep.', tag: 'recovery', key: 'sleep' },
]

export const PHASES: Record<number, Phase> = {
  1: {
    label: 'Phase 1',
    info: 'Months 1–3 · Fundamentals. The boring stuff that gets you hired. Master these deeply before moving on.',
    topics: [
      { day: 'Week 1', title: 'Arrays & Strings basics', desc: 'Two pointers, sliding window. Do 10 easy problems.', where: 'Leetcode + NeetCode YouTube' },
      { day: 'Week 1', title: 'Hashmaps & Sets', desc: 'Frequency counting, lookup patterns.', where: 'Leetcode' },
      { day: 'Week 2', title: 'Git fundamentals', desc: 'init, add, commit, push, pull, merge, rebase.', where: 'learngitbranching.js.org' },
      { day: 'Week 2', title: 'Linux command line basics', desc: 'ls, cd, grep, chmod, ssh, pipes, redirects.', where: 'overthewire.org (Bandit)' },
      { day: 'Week 3', title: 'Node.js core concepts', desc: 'Event loop, async/await, modules, fs, http.', where: 'nodejs.dev official docs' },
      { day: 'Week 3', title: 'Express.js REST APIs', desc: 'Routes, middleware, error handling, JSON responses.', where: 'Fireship YouTube + Express docs' },
      { day: 'Week 4', title: 'TypeScript basics', desc: 'Types, interfaces, generics, strict mode.', where: 'TypeScript Handbook (typescriptlang.org)' },
      { day: 'Week 5', title: 'SQL — SELECT, JOIN, GROUP BY', desc: 'Master joins and aggregations. Use real data.', where: 'sqlzoo.net + Mode Analytics SQL' },
      { day: 'Week 5', title: 'SQL — Indexes & Query Optimization', desc: 'EXPLAIN ANALYZE, composite indexes, slow queries.', where: 'Use.the.index.luke.com' },
      { day: 'Week 6', title: 'PostgreSQL setup + CRUD', desc: 'Schemas, constraints, transactions, sequences.', where: 'Official PostgreSQL tutorial' },
      { day: 'Week 7', title: 'Linked lists + Stacks + Queues', desc: '10 easy-medium problems each.', where: 'Leetcode + NeetCode' },
      { day: 'Week 8', title: 'Trees & Binary Search', desc: 'BFS, DFS, level order traversal.', where: 'Leetcode + NeetCode' },
      { day: 'Week 9', title: 'REST API design principles', desc: 'Status codes, versioning, pagination, auth basics.', where: 'restfulapi.net' },
      { day: 'Week 10', title: 'JWT authentication', desc: 'Login flow, access tokens, refresh tokens.', where: 'Fireship YouTube + Auth0 docs' },
      { day: 'Week 11', title: 'ORM — Prisma basics', desc: 'Models, relations, migrations.', where: 'Prisma.io official docs' },
      { day: 'Week 12', title: 'Build a full CRUD API project', desc: 'User auth + posts + comments. Deploy it.', where: 'Your own project — upload to GitHub' },
    ],
  },
  2: {
    label: 'Phase 2',
    info: 'Months 4–6 · Systems thinking. This is where you go from junior to mid-level. Most developers skip this — don\'t.',
    topics: [
      { day: 'Week 13', title: 'System design intro', desc: 'CAP theorem, latency numbers, back-of-envelope math.', where: 'ByteByteGo YouTube (Alex Xu)' },
      { day: 'Week 14', title: 'Load balancers & horizontal scaling', desc: 'Round robin, sticky sessions, health checks.', where: 'ByteByteGo + System Design Primer (GitHub)' },
      { day: 'Week 14', title: 'Caching — Redis basics', desc: 'Cache aside, write-through, TTL, eviction policies.', where: 'Redis.io docs + ByteByteGo' },
      { day: 'Week 15', title: 'Databases — SQL vs NoSQL tradeoffs', desc: 'When to use MongoDB vs PostgreSQL vs Redis.', where: 'DDIA book ch 1–3 (Martin Kleppmann)' },
      { day: 'Week 15', title: 'MongoDB basics', desc: 'Documents, collections, indexes, aggregation pipeline.', where: 'MongoDB University (free)' },
      { day: 'Week 16', title: 'Message queues — Kafka basics', desc: 'Producers, consumers, topics, partitions, use cases.', where: 'Confluent Kafka 101 (free course)' },
      { day: 'Week 17', title: 'Docker fundamentals', desc: 'Images, containers, Dockerfile, docker-compose.', where: 'Docker official docs + TechWorld with Nana YouTube' },
      { day: 'Week 18', title: 'Kubernetes basics', desc: 'Pods, deployments, services, ingress.', where: 'TechWorld with Nana — K8s full course YouTube' },
      { day: 'Week 19', title: 'AWS — IAM, EC2, S3, RDS', desc: 'Set up a real server with a database.', where: 'AWS free tier + Stephane Maarek Udemy' },
      { day: 'Week 20', title: 'AWS — API Gateway + Lambda', desc: 'Serverless functions, event triggers.', where: 'AWS docs + Fireship YouTube' },
      { day: 'Week 21', title: 'Design URL shortener', desc: 'Full design: DB, cache, load balancer, CDN.', where: 'ByteByteGo book + YouTube' },
      { day: 'Week 22', title: 'Design Twitter feed system', desc: 'Fanout, timeline generation, ranking.', where: 'System Design Primer GitHub' },
      { day: 'Week 23', title: 'Design WhatsApp / chat system', desc: 'WebSockets, message queues, delivery receipts.', where: 'ByteByteGo YouTube' },
      { day: 'Week 24', title: 'Build a system design project', desc: 'URL shortener or notification service. Full stack, deployed.', where: 'Deploy to Railway or Fly.io' },
    ],
  },
  3: {
    label: 'Phase 3',
    info: 'Months 7–12 · Stand out. Pick one specialization: AI integration OR distributed systems. Go deep, not wide.',
    topics: [
      { day: 'Month 7', title: 'Pick your specialization', desc: 'AI/ML integration into apps OR distributed systems engineering. Not both.', where: 'Decide based on your current job market' },
      { day: 'Month 7', title: 'AI track: OpenAI API basics', desc: 'Completions, embeddings, function calling, streaming.', where: 'OpenAI docs + Simon Willison blog' },
      { day: 'Month 7', title: 'AI track: Vector databases', desc: 'Pinecone or pgvector. Semantic search.', where: 'Pinecone docs + LangChain docs' },
      { day: 'Month 8', title: 'AI track: RAG systems', desc: 'Retrieval augmented generation, chunking, embeddings.', where: 'LangChain + LlamaIndex docs' },
      { day: 'Month 8', title: 'Systems track: Distributed consensus', desc: 'Raft algorithm, leader election, split brain.', where: 'DDIA ch 8–9 + Raft paper' },
      { day: 'Month 8', title: 'Systems track: Event sourcing + CQRS', desc: 'Eventual consistency, event stores, projections.', where: 'EventStore docs + Martin Fowler blog' },
      { day: 'Month 9', title: 'gRPC & Protocol Buffers', desc: 'Service definition, code generation, streaming.', where: 'gRPC official docs' },
      { day: 'Month 9', title: 'Observability — logs, metrics, traces', desc: 'Prometheus, Grafana, OpenTelemetry basics.', where: 'Grafana + OpenTelemetry docs' },
      { day: 'Month 10', title: 'CI/CD pipelines', desc: 'GitHub Actions. Auto test, build, deploy on push.', where: 'GitHub Actions docs + DevOps with Nana YouTube' },
      { day: 'Month 10', title: 'Security basics', desc: 'OWASP top 10, SQL injection, XSS, rate limiting.', where: 'OWASP.org + PortSwigger Web Security Academy' },
      { day: 'Month 11', title: 'Build project 1 — real problem', desc: 'AI-powered app or distributed service you would actually use.', where: 'Your GitHub — make it public' },
      { day: 'Month 11', title: 'Build project 2 — different domain', desc: 'If project 1 was AI, do infra. And vice versa.', where: 'Your GitHub' },
      { day: 'Month 12', title: 'Open source contribution', desc: '1 meaningful PR to a project you use. Even docs counts.', where: 'GitHub — search good first issue' },
      { day: 'Month 12', title: 'Interview prep — system design mock', desc: 'Do 5 mock interviews. Record yourself.', where: 'Pramp.com + interviewing.io' },
      { day: 'Month 12', title: 'Interview prep — DSA review', desc: 'Redo the top 50 NeetCode 150 problems.', where: 'NeetCode.io' },
    ],
  },
}
