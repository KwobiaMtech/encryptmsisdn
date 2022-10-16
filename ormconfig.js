"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.dataSource = exports.connectionSource = void 0;
var typeorm_1 = require("typeorm");
var path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var dotenv = require('dotenv');
dotenv.config();
var env = process.env;
var entities = [path.join(__dirname, 'src/**/*.entity.{js,ts}')];
var migrations = [path.join(__dirname, 'dist/migrations/*.{js,ts}')];
var url = new URL(env.DATABASE_URL);
var sslmode = url.searchParams.get('sslmode');
var db = url.pathname.replace('/', '');
var connection = __assign({ type: 'postgres', host: url.hostname, port: Number(url.port), username: url.username, password: decodeURIComponent(url.password), database: env.NODE_ENV === 'test' ? db.replace('encrypt', 'encrypt-test') : db, synchronize: true, migrationsRun: false, dropSchema: false, logging: env.TYPEORM_LOGGING === 'true', entities: entities, migrations: migrations }, (sslmode === 'require' && {
    ssl: {
        rejectUnauthorized: false
    }
}));
exports.connectionSource = connection;
exports.dataSource = new typeorm_1.DataSource(connection);
