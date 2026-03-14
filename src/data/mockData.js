export const wasteTypes = [
  { type: 'Plastic', icon: '🧴', color: '#3b82f6', pts: 5, count: 450, trend: '+12%' },
  { type: 'Glass',   icon: '🫙', color: '#8b5cf6', pts: 7, count: 210, trend: '+8%' },
  { type: 'Paper',   icon: '📄', color: '#f59e0b', pts: 4, count: 330, trend: '+5%' },
  { type: 'Organic', icon: '🌿', color: '#22c55e', pts: 3, count: 190, trend: '+15%' },
];

export const zones = [
  { name: 'Agdal',    value: 92, type: 'Plastic' },
  { name: 'Hay Riad', value: 78, type: 'Organic' },
  { name: 'Akkari',   value: 65, type: 'Paper' },
  { name: 'Yacoub',   value: 55, type: 'Glass' },
  { name: 'Hassan',   value: 80, type: 'Plastic' },
  { name: 'Souissi',  value: 40, type: 'Organic' },
];

export const heatmap = [
  [2, 3, 5, 7, 6, 4, 3],
  [1, 4, 8, 9, 7, 5, 2],
  [3, 5, 6, 8, 9, 6, 4],
  [2, 3, 5, 6, 8, 7, 5],
  [1, 2, 4, 5, 7, 8, 6],
];

export const liveActivities = [
  { user: 'Sara M.',    action: 'Recycled plastic bottle', pts: '+5', time: '2m ago',  type: 'plastic' },
  { user: 'Omar K.',    action: 'Recycled glass jar',      pts: '+7', time: '5m ago',  type: 'glass' },
  { user: 'Laila B.',   action: 'Recycled cardboard',      pts: '+4', time: '8m ago',  type: 'paper' },
  { user: 'Youssef A.', action: 'Organic deposit',         pts: '+3', time: '12m ago', type: 'organic' },
  { user: 'Nadia R.',   action: 'Recycled plastic bag',    pts: '+5', time: '15m ago', type: 'plastic' },
];

export const bins = [
  { id: 1, type: 'Plastic', icon: '🧴', color: '#29b6f6', x: '28%', y: '35%', dist: '120m', addr: 'Rue Patrice Lumumba', status: 'OK', capacity: 45 },
  { id: 2, type: 'Glass', icon: '🫙', color: '#ab47bc', x: '52%', y: '25%', dist: '280m', addr: 'Ave Hassan II', status: 'OK', capacity: 78 },
  { id: 3, type: 'Paper', icon: '📄', color: '#ffb300', x: '70%', y: '50%', dist: '430m', addr: 'Blvd Mohammed V', status: 'FULL', capacity: 93 },
  { id: 4, type: 'Organic', icon: '🌿', color: '#00e676', x: '38%', y: '65%', dist: '190m', addr: 'Rue de la Paix', status: 'OK', capacity: 32 },
  { id: 5, type: 'Plastic', icon: '🧴', color: '#29b6f6', x: '80%', y: '30%', dist: '610m', addr: 'Ave Allal Ben Abdallah', status: 'LOW', capacity: 12 },
  { id: 6, type: 'Glass', icon: '🫙', color: '#ab47bc', x: '20%', y: '72%', dist: '350m', addr: 'Rue Tariq Ibn Ziad', status: 'OK', capacity: 55 },
];

export const history = [
  { type: 'Plastic', icon: '🧴', color: '#29b6f6', pts: 5, date: 'Today 14:32', bin: 'Bin #34 · Agdal', verified: true },
  { type: 'Glass', icon: '🫙', color: '#ab47bc', pts: 7, date: 'Today 11:10', bin: 'Bin #12 · Hassan', verified: true },
  { type: 'Paper', icon: '📄', color: '#ffb300', pts: 4, date: 'Yesterday 16:45', bin: 'Bin #8 · Hay Riad', verified: true },
  { type: 'Organic', icon: '🌿', color: '#00e676', pts: 3, date: 'Yesterday 10:22', bin: 'Bin #21 · Souissi', verified: true },
  { type: 'Plastic', icon: '🧴', color: '#29b6f6', pts: 5, date: 'Mon 09:15', bin: 'Bin #34 · Agdal', verified: true },
  { type: 'Glass', icon: '🫙', color: '#ab47bc', pts: 7, date: 'Sun 13:40', bin: 'Bin #6 · Akkari', verified: true },
  { type: 'Paper', icon: '📄', color: '#ffb300', pts: 4, date: 'Sat 17:00', bin: 'Bin #8 · Hay Riad', verified: false },
];

export const rewards = [
  { id: 'marjane', name: 'Marjane Voucher 30 MAD', pts: 200, icon: '🛒', color: '#29b6f6', cat: 'Shopping', stock: 45 },
  { id: 'iam', name: 'IAM Credit 10 MAD', pts: 150, icon: '📱', color: '#ab47bc', cat: 'Telecom', stock: Infinity },
  { id: 'oncf', name: 'ONCF Train Ticket', pts: 300, icon: '🚆', color: '#00bfa5', cat: 'Transport', stock: 12 },
  { id: 'bus', name: 'City Bus Pass 3 Days', pts: 180, icon: '🚌', color: '#ffb300', cat: 'Transport', stock: Infinity },
  { id: 'coffee', name: 'Café Bacha Coffee', pts: 100, icon: '☕', color: '#ff8a65', cat: 'Food', stock: 30 },
  { id: 'electricity', name: 'Electricity Credit', pts: 400, icon: '⚡', color: '#ffd54f', cat: 'Utility', stock: 20 },
];

export const notifications = [
  { id: 1, type: 'reward', title: '+5 points earned', msg: 'Plastic bottle verified at Bin #34, Agdal', time: '2m ago', read: false, icon: '🏆' },
  { id: 2, type: 'achieve', title: 'Achievement unlocked!', msg: 'Eco Starter — recycled your first 10 items', time: '1h ago', read: false, icon: '🎖️' },
  { id: 3, type: 'reminder', title: 'Ready to recycle?', msg: 'Bin #12 near you is 32% full — good time to go', time: '3h ago', read: true, icon: '♻️' },
  { id: 4, type: 'challenge', title: 'Challenge milestone!', msg: 'Community reached 750/1000 bottles this week', time: '5h ago', read: true, icon: '🎯' },
  { id: 5, type: 'reward', title: '+7 points earned', msg: 'Glass jar verified at Bin #12, Hassan', time: 'Yesterday', read: true, icon: '🏆' },
  { id: 6, type: 'remind', title: 'Weekly recap', msg: 'You recycled 12 items this week — keep it up!', time: '2d ago', read: true, icon: '📊' },
];

export const challenges = [
  { id: 'plastic', title: 'Plastic Week Rush', desc: 'Recycle 1,000 plastic bottles city-wide', current: 748, goal: 1000, deadline: '3 days left', reward: '+50 bonus pts', color: '#29b6f6', icon: '🧴' },
  { id: 'paper', title: 'Green Office Drive', desc: 'Recycle 500 paper items from offices', current: 312, goal: 500, deadline: '5 days left', reward: '+30 bonus pts', color: '#ffb300', icon: '📄' },
  { id: 'glass', title: 'Glass Collective', desc: '500 glass items recycled in Agdal zone', current: 189, goal: 500, deadline: '1 week left', reward: '+40 bonus pts', color: '#ab47bc', icon: '🫙' },
  { id: 'organic', title: 'Organic Impact', desc: 'Produce 200m³ of biogas from organics', current: 120, goal: 200, deadline: '10 days left', reward: '+60 bonus pts', color: '#00e676', icon: '🌿' },
];

export const leaderboard = [
  { name: 'Ahmed K.', pts: 3420, items: 684, rank: 1, you: false, city: 'Rabat' },
  { name: 'Sara M.', pts: 1245, items: 249, rank: 2, you: true, city: 'Rabat' },
  { name: 'Omar B.', pts: 1180, items: 236, rank: 3, you: false, city: 'Salé' },
  { name: 'Laila S.', pts: 980, items: 196, rank: 4, you: false, city: 'Rabat' },
  { name: 'Youssef A.', pts: 750, items: 150, rank: 5, you: false, city: 'Rabat' },
  { name: 'Fatima H.', pts: 620, items: 124, rank: 6, you: false, city: 'Salé' },
  { name: 'Mehdi Z.', pts: 510, items: 102, rank: 7, you: false, city: 'Rabat' },
  { name: 'Nadia R.', pts: 430, items: 86, rank: 8, you: false, city: 'Temara' },
];

export const binStatus = [
  { id: 34, type: 'Plastic', icon: '🧴', color: '#29b6f6', loc: 'Agdal, Rue Lumumba', deposits: 450, capacity: 45, status: 'OK', lastSync: '2m ago' },
  { id: 12, type: 'Glass', icon: '🫙', color: '#ab47bc', loc: 'Hassan, Ave Hassan II', deposits: 210, capacity: 78, status: 'HIGH', lastSync: '4m ago' },
  { id: 8, type: 'Paper', icon: '📄', color: '#ffb300', loc: 'Hay Riad, Blvd Zerktouni', deposits: 330, capacity: 93, status: 'FULL', lastSync: '1m ago' },
  { id: 21, type: 'Organic', icon: '🌿', color: '#00e676', loc: 'Souissi, Rue de la Paix', deposits: 190, capacity: 32, status: 'OK', lastSync: '6m ago' },
  { id: 5, type: 'Plastic', icon: '🧴', color: '#29b6f6', loc: 'Akkari, Rue Tariq', deposits: 88, capacity: 12, status: 'LOW', lastSync: '10m ago' },
  { id: 7, type: 'Glass', icon: '🫙', color: '#ab47bc', loc: 'Yacoub, Ave Nations', deposits: 175, capacity: 55, status: 'OK', lastSync: '3m ago' },
];

export const impactByType = [
  { name: 'Plastic', items: 42, color: '#29b6f6' },
  { name: 'Glass', items: 25, color: '#ab47bc' },
  { name: 'Paper', items: 21, color: '#ffb300' },
  { name: 'Organic', items: 12, color: '#00e676' },
];

export const monthlyDeposits = [
  { month: 'Jan', deposits: 120 },
  { month: 'Feb', deposits: 145 },
  { month: 'Mar', deposits: 132 },
  { month: 'Apr', deposits: 180 },
  { month: 'May', deposits: 165 },
  { month: 'Jun', deposits: 210 },
  { month: 'Jul', deposits: 195 },
  { month: 'Aug', deposits: 240 },
  { month: 'Sep', deposits: 220 },
  { month: 'Oct', deposits: 280 },
  { month: 'Nov', deposits: 260 },
  { month: 'Dec', deposits: 290 },
];

