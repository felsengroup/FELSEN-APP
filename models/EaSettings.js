const mongoose = require('mongoose');

const EaSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  generalInfo: {
    licenseKey: {
      type: String,
    },
    generalInfoText: {
      type: String,
    },
  },
  moneyManagement: {
    enableDashboard: {
      type: Boolean,
    },
    enableAutoLot: {
      type: Boolean,
    },
    amountPerLot: {
      type: Number,
    },
    lotPerAmount: {
      type: Number,
    },
    fixedLotSize: {
      type: Number,
    },
    maxDailyLossPercent: {
      type: Number,
    },
  },
  technicalSettings: {
    magicNumber: {
      type: Number,
    },
    tradeComment: {
      type: String,
    },
  },
  strategySettings: {
    slPoints: {
      type: Number,
    },
    tpPoints: {
      type: Number,
    },
    ordersToSplit: {
      type: Number,
    },
  },
  trailingStopSettings: {
    trailingStartPoints: {
      type: Number,
    },
    trailingDistancePoints: {
      type: Number,
    },
  },
  smartRecovery: {
    enableRecovery: {
      type: Boolean,
    },
    recoveryMultiplier: {
      type: Number,
    },
    recoveryTriggerPoints: {
      type: Number,
    },
    enableRecoveryMultiplier: {
      type: Boolean,
    },
    recoveryMultiplierLastDayLoss: {
      type: Number,
    },
    lastDayLossThresholdPoints: {
      type: Number,
    },
  },
  filtersAndBehavior: {
    openTradeWhenInProfit: {
      type: Boolean,
    },
    useSameLotForProfitTrades: {
      type: Boolean,
    },
    enableFridayTrading: {
      type: Boolean,
    },
    closeOldestOnTrailClose: {
      type: Boolean,
    },
  },
});

module.exports = mongoose.model('EaSettings', EaSettingsSchema);
