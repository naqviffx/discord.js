'use strict';

const Base = require('./Base');

/**
 * Represents an Entitlement
 * @extends {Base}
 */
class Entitlement extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the entitlement
     * @type {Snowflake}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    if ('sku_id' in data) {
      /**
       * The id of the associated SKU
       */
      this.skuId = data.sku_id;
    }

    if ('user_id' in data) {
      /**
       * The id of the user that is granted access to this entitlement's SKU
       * @type {Snowflake}
       */
      this.userId = data.user_id;
    }

    if ('guild_id' in data) {
      /**
       * The id of the guild that is granted access to this entitlement's SKU
       * @type {?Snowflake}
       */
      this.guildId = data.guild_id;
    } else {
      this.guildId ??= null;
    }

    if ('application_id' in data) {
      /**
       * The id of the parent application
       * @type {Snowflake}
       */
      this.applicationId = data.application_id;
    }

    if ('type' in data) {
      /**
       * The type of this entitlement
       * @type {EntitlementType}
       */
      this.type = data.type;
    }

    if ('deleted' in data) {
      /**
       * Whether this entitlement was deleted
       * @type {boolean}
       */
      this.deleted = data.deleted;
    }

    if ('created_at' in data) {
      /**
       * The start date at which this entitlement is valid
       * <info>This is `null` for test entitlements</info>
       * @type {?Date}
       */
      this.startsAt = Date.parse(data.starts_at);
    } else {
      this.startsAt ??= null;
    }

    if ('ends_at' in data) {
      /**
       * The end date at which this entitlement is no longer valid
       * <info>This is `null` for test entitlements</info>
       * @type {?Date}
       */
      this.endsAt = Date.parse(data.ends_at);
    } else {
      this.endsAt ??= null;
    }
  }

  /**
   * The guild that is granted access to this entitlement's SKU
   * @type {?Guild}
   */
  get guild() {
    if (!this.guildId) return null;
    return this.client.guilds.cache.get(this.guildId) ?? null;
  }

  /**
   * Returns whether this entitlement is active
   * @returns {boolean}
   */
  isActive() {
    return !this.deleted && (!this.endsAt || this.endsAt.getTime() > Date.now());
  }

  /**
   * Whether this entitlement is a user subscription
   * @returns {boolean}
   */
  isUserSubscription() {
    return this.guildId === null;
  }

  /**
   * Whether this entitlement is a guild subscription
   * @returns {boolean}
   */
  isGuildSubscription() {
    return this.guildId !== null;
  }

  /**
   * Fetches the user that is granted access to this entitlement's SKU
   * @returns {Promise<User>}
   */
  fetchUser() {
    return this.client.users.fetch(this.userId);
  }
}

exports.Entitlement = Entitlement;
