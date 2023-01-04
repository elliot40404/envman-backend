// initiate replica set

let config = {
    _id: 'dbrs',
    version: 1,
    members: [
        {
            _id: 1,
            host: 'db:27017',
            priority: 2,
        },
        {
            _id: 2,
            host: 'db2:27017',
            priority: 1,
        },
        {
            _id: 3,
            host: 'db3:27017',
            priority: 1,
        },
    ],
};
rs.initiate(config, { force: true });
rs.status();
db.createUser({
    user: 'admin',
    pwd: 'admin',
    roles: [{ role: 'root', db: 'admin' }],
});
