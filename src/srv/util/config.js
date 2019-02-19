import _ from 'lodash';

const env = process.env.NODE_ENV;
const config = env === 'development' ? require('../config-development') : require('../config-production');

export function getConfig(path, defaultValue) {
    return _.get(config, path, defaultValue);
}

