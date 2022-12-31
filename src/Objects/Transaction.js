class Transaction {    
    getTransactionId() {}
    getTransactionName() {}
    getTransactionDate() {}
    getIncome() {}
    getCost() {}
}

export class CIBCTransaction extends Transaction{
    constructor(transaction) {
        super();
        this.date = transaction[0];
        this.name = transaction[1];
        this.cost = transaction[2];
        this.income = transaction[3];
        this.id = [this.date, this.name, this.cost, this.income].join('');
    }

    getTransactionId() {
        return this.id;
    }

    getTransactionName() {
        return this.name;
    }

    getTransactionDate() {
        return this.date;
    }

    getIncome() {
        return this.income;
    }

    getCost() {
        return this.cost;
    }

    isCost() {
        return this.cost === 0
    }
}