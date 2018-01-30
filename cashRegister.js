/* validates if a number is integer */
function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

/*Cash register object*/
let CashRegister = function() {
  const denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  const coinNames = [
    "one hundred",
    "twenty",
    "ten",
    "five",
    "one",
    "quarter",
    "dime",
    "nickel",
    "penny"
  ];
  let inCashRegister = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let totalmoney = 0;

  return {
    getDenominations: function() {
      return denominations;
    },

    getcoinNames: function() {
      return coinNames;
    },

    getInCashRegister: function() {
      return inCashRegister;
    },

    getTotalmoney: function() {
      return totalmoney;
    },

    setInCashRegister: function(value) {
      inCashRegister = value;
      return true;
    },

    increaseTotalmoney: function(value) {
      totalmoney = parseFloat(value) + parseFloat(totalmoney);
    }
  };
};

/*Initialize CashRegister*/
function initCashRegister(initialDenominations) {
  let result = {
    message: "",
    status: 0 // 0= fail 1 = success
  };

  if (!Array.isArray(initialDenominations) || initialDenominations.lenght < 9) {
    initialDenominations.forEach(function(denomination) {
      if (!isInt(denomination)) {
        result.message = "All denominations must be integer";
        return result;
      }
    });
    result.message = "Initialization failed";
    return result;
  }

  let todaysCashRegister = CashRegister();
  todaysCashRegister.setInCashRegister(initialDenominations);

  const denominations = todaysCashRegister.getDenominations();
  let total = initialDenominations.reduce(function(a, b, x) {
    return a + b * denominations[x];
  }, 0);

  todaysCashRegister.increaseTotalmoney(total);

  return todaysCashRegister;
}

function makePayment(price, cash, thisCashRegister) {
  const denominations = thisCashRegister.getDenominations();
  const coinNames = thisCashRegister.getcoinNames();
  let inCashRegister = thisCashRegister.getInCashRegister();
  let result = {
    message: "",
    change: [],
    changeDue: 0,
    status: 0 // 0= fail 1 = success
  };

  let total = cash.reduce(function(a, b, x) {
    return a + b * denominations[x];
  }, 0);

  if (price > total) {
    result.message = "You don't have enough cash.";
    result.status = 0;
    return result;
  }
  let changeDue = total - price;
  let toReturn = changeDue;

  let change = [];

  denominations.forEach(function(denomination, i) {
    let coinsToAdd = 0;

    if (denomination <= toReturn) {
      while (toReturn >= denomination && inCashRegister[i] > 0) {
        coinsToAdd++;
        inCashRegister[i]--;
        toReturn = toReturn - denomination;
        toReturn = Number(Math.round(toReturn + "e2") + "e-2");
      }

      change.push([coinNames[i], coinsToAdd]);
    } else {
      change.push([coinNames[i], 0]);
    }
  });

  if (toReturn > 0) {
    result.message = "Insufficient Funds";
    result.status = 0;
    return result;
  } else {
    //Ads new cash received to cashier
    denominations.forEach(function(denomination, i) {
      if (cash[i] > 0) {
        inCashRegister[i] = parseInt(inCashRegister[i]) + parseInt(cash[i]);
      }
    });

    thisCashRegister.setInCashRegister(inCashRegister);

    //Ads new money to total
    thisCashRegister.increaseTotalmoney(price);
  }

  result.message = "Closed";
  result.status = 1;
  result.change = change;
  result.changeDue = changeDue;
  return result;
}

function square(thisCashRegister) {
  let result = {};
  result.total = thisCashRegister.getTotalmoney();
  const denominations = thisCashRegister.getDenominations();
  const inCashRegister = thisCashRegister.getInCashRegister();
  result.totalInRegister = inCashRegister.reduce(function(a, b, x) {
    return a + b * denominations[x];
  }, 0);

  return result;
}
