var config = require('../config');
var r = require('rethinkdbdash')({db: config.rethinkdb.db});
var _ = require('lodash');

var Model = function () {
    this.table = null;
    this.fillable = [];
    this.props = {};
};

Model.prototype.setProps = function (props) {
    this.props = props;

    return this;
};

Model.prototype.fill = function (data) {
    this.props = _.pick(data, this.fillable);

    return this;
};

Model.prototype.query = function () {

    return r.table(this.table);
};

Model.prototype.insert = function (data) {
    this.setProps(_.pick(data, this.fillable));

    return this.query().insert(this.props).run();
};

Model.prototype.update = function (data) {
    data = _.pick(data, this.fillable);

    return this.query().get(this.props.id).update(data).run();
};

Model.prototype.delete = function (id) {
    id = id || this.props.id;

    return this.query().get(id).delete().run();
};

Model.prototype.find = function (id) {
    return new Promise(function (resolve, reject) {
        //resolve({test: 'fake user', id: id, self: this});
        this.query().get(id).run(function (err, record) {
            (err && reject(err));

            resolve(this.setProps(record));
        }.bind(this), function (err) {
            reject(err);
        }.bind(this));
    }.bind(this));
};


Model.prototype.getProps = function () {
    return this.props;
};

module.exports = Model;