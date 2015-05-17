var Group = new (require('../../models/Group'))();

exports.listGroups = function *listGroups () {
    var groups = yield Group.query().run();

    this.respond(groups);
};

exports.getGroup = function *getGroup () {
    var group = yield Group.find(this.params.groupId);

    this.respond(group);
};

exports.createGroup = function *createGroup () {
    var group = yield Group.insert(this.request.body);

    this.respond({groupId: group.generated_keys[0]});
};

exports.updateGroup = function *updateGroup () {
    var group = yield Group.find(this.params.groupId);

    yield group.update(this.request.body);

    this.respond({});
};

exports.deleteGroup = function *deleteGroup () {
    var group = yield Group.delete(this.params.groupId);

    this.respond(group);
};