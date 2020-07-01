const Redis = require("ioredis");
const redisConfig = require("../config/redis");

class Cache {
  constructor() {
    this.redis = new Redis({ ...redisConfig, keyPrefix: "cache:" });
  }

  async get(key) {
    const value = await this.redis.get(key);

    return value ? JSON.parse(value) : null;
  }

  // incluir o tempo de expiração é opicional
  set(key, value, timeExp) {
    return timeExp
      ? this.redis.set(key, JSON.stringify(value), "EX", timeExp)
      : this.redis.set(key, JSON.stringify(value));
  }

  del(key) {
    return this.redis.del(key);
  }

  async delPrefix(prefix) {
    const keys = (await this.redis.keys(`cache:${prefix}:*`)).map((key) =>
      key.replace("cache:", "")
    );

    return keys.length > 0 ? this.redis.del(keys) : null;
  }
}
module.exports = new Cache();
