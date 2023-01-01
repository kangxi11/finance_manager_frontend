export class BaseTransaction {    
    getId() {}
    getDesc() {}
    getDate() {}
    getIncome() {}
    getCost() {}
    getCategory() {}
}

export class CIBCTransaction extends BaseTransaction{
    constructor(transaction) {
        super();
        this.date = transaction[0];
        this.desc = transaction[1];
        this.cost = transaction[2];
        this.income = transaction[3];
        this.category = "";
        this.id = [this.date, this.desc, this.cost, this.income].join('');
    }

    getId() {
        return this.id;
    }

    getDesc() {
        return this.desc;
    }

    getDate() {
        return this.date;
    }

    getIncome() {
        return this.income;
    }

    getCost() {
        return this.cost;
    }

    getCategory() {
        return this.category;
    }

    setId(id) {
        this.id = id;
    }

    setDesc(desc) {
        this.desc = desc;
    }

    setDate(date) {
        this.date = date;
    }

    setIncome(income) {
        this.income = income;
    }

    setCost(cost) {
        this.cost = cost;
    }

    setCategory(category) {
        this.category = category;
    }


    isCost() {
        return this.cost === 0
    }

    getJSON() {
        return {
            "transaction": this.id,
            "desc": this.desc,
            "date": this.date,
            "income": this.income,
            "cost": this.cost,
            "category": this.category
        }
    }
}