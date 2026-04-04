// ===== Headsup B2B – Sales Scorecard FY25-26 Data =====

var DATA = {
  monthly: [
    { month: "Apr'25", gmv: 11.2,  gp: 0.31, txns: 98  },
    { month: "May'25", gmv: 12.8,  gp: 0.38, txns: 112 },
    { month: "Jun'25", gmv: 14.1,  gp: 0.42, txns: 128 },
    { month: "Jul'25", gmv: 13.5,  gp: 0.40, txns: 121 },
    { month: "Aug'25", gmv: 15.7,  gp: 0.48, txns: 145 },
    { month: "Sep'25", gmv: 16.3,  gp: 0.52, txns: 156 },
    { month: "Oct'25", gmv: 17.9,  gp: 0.58, txns: 178 },
    { month: "Nov'25", gmv: 16.9,  gp: 0.955, txns: 168 },
    { month: "Dec'25", gmv: 19.4,  gp: 0.62, txns: 198 },
    { month: "Jan'26", gmv: 24.9,  gp: 0.78, txns: 352 },
    { month: "Feb'26", gmv: 18.2,  gp: 0.56, txns: 272 },
    { month: "Mar'26", gmv: 16.2,  gp: 0.24, txns: 165 }
  ],

  team: [
    { name: "Sumit",       gp: 122.4 },
    { name: "Ravi",        gp: 98.7  },
    { name: "Priya",       gp: 87.3  },
    { name: "Ankit",       gp: 72.1  },
    { name: "Neha",        gp: 65.8  },
    { name: "Vikram",      gp: 52.4  },
    { name: "Deepak",      gp: 41.6  },
    { name: "Meera",       gp: 33.2  },
    { name: "Arjun",       gp: 24.5  },
    { name: "Kavita",      gp: 18.9  },
    { name: "Rohit",       gp: 14.2  },
    { name: "Sonal",       gp: 10.8  }
  ],

  categories: [
    { name: "Biomass",       gmv: 68.4,  gp: 1.52, margin: 2.22 },
    { name: "Agri Comm.",    gmv: 42.1,  gp: 1.28, margin: 3.04 },
    { name: "Coal",          gmv: 35.6,  gp: 0.89, margin: 2.50 },
    { name: "Minerals",      gmv: 22.3,  gp: 0.78, margin: 3.50 },
    { name: "Metals",        gmv: 14.8,  gp: 0.64, margin: 4.32 },
    { name: "HM Pole",       gmv: 7.2,   gp: 1.15, margin: 15.98 },
    { name: "Chemicals",     gmv: 4.5,   gp: 0.12, margin: 2.67 },
    { name: "Others",        gmv: 2.2,   gp: 0.06, margin: 2.73 }
  ],

  // Top 5 contributors breakdown (in Lakhs)
  contributions: [
    { name: "Sumit",  total: 122.4, sales: 36.72, procurement: 36.72, others: 36.72, salesOps: 12.24 },
    { name: "Ravi",   total: 98.7,  sales: 29.61, procurement: 29.61, others: 29.61, salesOps: 9.87  },
    { name: "Priya",  total: 87.3,  sales: 26.19, procurement: 26.19, others: 26.19, salesOps: 8.73  },
    { name: "Ankit",  total: 72.1,  sales: 21.63, procurement: 21.63, others: 21.63, salesOps: 7.21  },
    { name: "Neha",   total: 65.8,  sales: 19.74, procurement: 19.74, others: 19.74, salesOps: 6.58  }
  ]
};
