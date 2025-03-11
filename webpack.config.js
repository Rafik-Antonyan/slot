const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets/'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
    },
};
