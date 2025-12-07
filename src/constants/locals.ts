import { Pub } from '../type/locals';

export const COLORS = {
  nearBlack: '#0A0A0A',
  richBlack: '#1A1A1A',
  deepCharcoal: '#2a2a2a',
  warmWhite: '#F5F5F0',
  softCream: '#E8E8DD',
  mutedGrey: '#9CA3AF',
  satinGold: '#f8d548', // Updated to bright yellow
  precisionGreen: '#10B981',
  burgundyRed: '#8B1A1A',
};

export const MOCK_PUBS: Pub[] = [
  {
    id: '1',
    place_id: '1',
    name: "McGillin's Olde Ale House",
    address: "1310 Drury St, Philadelphia, PA",
    lat: 39.9504,
    lng: -75.1632,
    topSplit: { score: 94.2, username: "stoutman" },
    qualityRating: 4.3,
    pintsLogged: 23,
    avgPrice: 7.50,
    leaderboard: [
      { rank: 1, username: "stoutman", score: 94.2 },
      { rank: 2, username: "pintking", score: 91.7 },
      { rank: 3, username: "foamchaser", score: 89.3 },
      { rank: 4, username: "guinnhead", score: 87.1 },
      { rank: 5, username: "blackstuff", score: 85.9 },
    ],
    stats: {
      head: { average: 4.6, percentGood: 87 },
      taste: { average: 4.2, percentGood: 75 },
      temperature: { average: 4.0, percentGood: 60 }
    }
  },
  {
    id: '2',
    place_id: '2',
    name: "Fergie's Pub",
    address: "1214 Sansom St, Philadelphia, PA",
    lat: 39.9508,
    lng: -75.1607,
    topSplit: { score: 91.8, username: "pintking" },
    qualityRating: 4.5,
    pintsLogged: 47,
    avgPrice: 8.00,
    leaderboard: [
      { rank: 1, username: "pintking", score: 91.8 },
      { rank: 2, username: "dublinlad", score: 88.4 },
    ],
    stats: {
      head: { average: 4.3, percentGood: 82 },
      taste: { average: 4.7, percentGood: 95 },
      temperature: { average: 4.4, percentGood: 88 }
    }
  },
  {
    id: '3',
    place_id: '3',
    name: "The Irish Pub",
    address: "2007 Walnut St, Philadelphia, PA",
    lat: 39.9502,
    lng: -75.1731,
    topSplit: null,
    qualityRating: null,
    pintsLogged: 0,
    avgPrice: null,
    leaderboard: []
  },
  {
    id: '4',
    place_id: '4',
    name: "Fado Irish Pub",
    address: "1500 Locust St, Philadelphia, PA",
    lat: 39.9490,
    lng: -75.1656,
    topSplit: { score: 88.1, username: "cloverleaf" },
    qualityRating: 4.1,
    pintsLogged: 12,
    avgPrice: 9.00,
    leaderboard: [
       { rank: 1, username: "cloverleaf", score: 88.1 },
    ],
    stats: {
      head: { average: 3.9, percentGood: 50 },
      taste: { average: 4.0, percentGood: 65 },
      temperature: { average: 4.4, percentGood: 92 }
    }
  }
];