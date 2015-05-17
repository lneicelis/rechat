var config = require('../config');
var r = require('rethinkdbdash')(config.rethinkdb);
var _ = require('lodash');
var logger = require('../logger');

var Model = function () {

};
Model.prototype.describe = function (desc) {
    Object.defineProperty(this, '_table', {
        configurable: false,
        enumerable: false,
        value: desc.table
    });

    Object.defineProperty(this, '_fillable', {
        configurable: false,
        enumerable: false,
        value: desc.fillable || null
    });

    Object.defineProperty(this, '_readable', {
        configurable: false,
        enumerable: false,
        value: desc.readable || null
    });
};

Model.prototype.setProps = function (props) {
    _.merge(this, props);

    return this;
};

Model.prototype.fill = function (data) {
    if (this._fillable) {
        data = _.pick(data, this._fillable);
    }

    if (this._readable) {
        data = _.omit(data, this._readable);
    }

    _.merge(this, data);

    return this;
};

Model.prototype.query = function () {

    return r.table(this._table);
};

Model.prototype.insert = function (data) {
    this.fill(data);

    return this.query().insert(this).run();
};

Model.prototype.update = function (data) {
    this.fill(data);

    return this.query().get(this.id).update(this).run();
};

Model.prototype.delete = function (id) {
    id = id || this.id;

    return this.query().get(id).delete().run();
};

Model.prototype.find = function (id) {
    return new Promise(function (resolve, reject) {
        this.query().get(id).run(function (err, record) {
            if (err || !record) {
                (err && logger.error(err));
                (!record && logger.warn('Model with ID: %s not found!', id));

                reject(err || 'Record not found!');
            }

            resolve(this.setProps(record));
        }.bind(this), function (err) {
            reject(err);
        }.bind(this));
    }.bind(this));
};

Model.prototype.fetchJoin = function (query, model, direction) {
    return new Promise(function (resolve, reject) {
        var instance;
        var models = [];
        var direction = 'right' || direction;

        if (model && _.isFunction(model)) {
            instance = new (model)();
        }

        query.run(function (err, records) {
            (err && reject(err) && logger.warn('fetchFromRight failed!'));

            records.forEach(function (record) {
                if (instance && instance instanceof Model) {
                    models.push((new (model)()).setProps(record[direction]));
                } else {
                    models.push(record[direction])
                }
            });

            resolve(models);
        }.bind(this));
    });
};

module.exports = Model;