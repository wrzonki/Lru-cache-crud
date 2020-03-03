class Cache {
    constructor (limit) {
        this.limit = limit || false; //maximum limit of a cache
        this.cache = {};
        this.order = []; //array of keys in order from newest to oldest
        this.cacheLen = 0; //current cache.length
    };

    create(key, value) {
        try {
            if (this.cache[key] !== undefined) throw new Error('Item already exists.');
            if (!this.limit) {
                this.cache[key] = value;
                return;
            }
            this.cache[key] = value;
            this.order.unshift(key);
            this.cacheLen += 1;
            if (this.cacheLen > this.limit) {
                console.warn('Cache overflown');
                delete this.cache[this.order.pop()];
            }
        } catch (error) {
            console.warn(error.stack);
        }
    };

    read(key) {
        try {
            if (this.cache[key] === undefined) throw new Error('Item does not exists.');
            if (!this.limit) return this.cache[key];
            let index = this.order.indexOf(key);
            let renewedItem = this.order.splice(index, 1);
            this.order.unshift(renewedItem[0])
        } catch (error) {
            console.warn(error.stack);
        }
    };

    update(key, value) {
        try {
            if (this.cache[key] === undefined) throw new Error('Item does not exists.');
            if (!this.limit) {
                this.cache[key] = value;
                return;
            }
            let index = this.order.indexOf(key);
            let renewedItem = this.order.splice(index, 1);
            this.order.unshift(renewedItem[0])
        } catch (error) {
            console.warn(error.stack);
        }
    };

    delete(key) {
        delete this.cache[key]
    };
};

/**
 * Tests
 */

let simpleCache = new Cache();

simpleCache.create('1', '1');
simpleCache.create('1', '1'); // Item already exists.
simpleCache.create('2', '2');
simpleCache.read('2'); // 2
simpleCache.read('3'); //Item does not exists.
simpleCache.update('2', 'modified');
simpleCache.delete('1')

let overflowLimitCache = new Cache(4);

overflowLimitCache.create('1', '1'); // [1]
overflowLimitCache.create('2', '2'); // [2,1]
overflowLimitCache.create('3', '3'); // [3,2,1]
overflowLimitCache.create('4', '4'); // [4,3,2,1] limit!
overflowLimitCache.create('5', '5'); // [5,4,3,2] 1 is dropped!
overflowLimitCache.read('2'); // [2,5,4,3] 2 is refreshed!
overflowLimitCache.update('5', 'modified'); // [5,2,4,3] 5 is refreshed

