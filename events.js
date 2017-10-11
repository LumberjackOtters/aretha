var chalk        = require('chalk');

function subscriber(emitter, options) {

    var count = 0;

    emitter.on('abandoned', function (data) {
        if (options.verbose || (options['max-delay'] < 5 && !options['info-only']) ) {
            console.log(chalk.red('Package '+ data[0] +' abandoned, use https://packagist.org/packages/'+ data[1] +' instead'));
        }

        if (options['info-only']) {
            return;
        }
        if (options['max-delay'] < 5) {
            count++;
            if (count === options['max-count']) {
                process.exit(1);
            }
        }
    });
    emitter.on('unstable', function (data) {
        if (options.verbose || (options['max-delay'] < 4  && !options['info-only']) ) {
            console.log(chalk.red('Your using '+ data[0] +' with version '+ data[1] +' which is unstable'));
        }

        if (options['info-only']) {
            return;
        }
        if (options['max-delay'] < 4) {
            count++;
            if (count === options['max-count']) {
                process.exit(1);
            }
        }

    });
    emitter.on('major', function (data) {
        if (options.verbose || (options['max-delay'] < 3 && !options['info-only']) ) {
            console.log(chalk.red('Your version of '+ data[0] + ' is ' + data[1] + ' major late'));
        }

        if (options['info-only']) {
            return;
        }
        if (options['max-delay'] < 3) {
            count++;
            if (count === options['max-count']) {
                process.exit(1);
            }
        }

    });
    emitter.on('minor', function (data) {
        if (options.verbose || (options['max-delay'] < 2 && !options['info-only']) ) {
            console.log(chalk.yellow('Your version of '+ data[0] + ' is ' + data[1] + ' minor late'));
        }

        if (options['info-only']) {
            return;
        }

        if (options['max-delay'] < 2) {
            count++;
            if (count === options['max-count']) {
                process.exit(1);
            }
        }

    });
    emitter.on('patch', function (data) {
        if (options.verbose || (options['max-delay'] < 1 && !options['info-only']) ) {
            console.log(chalk.green('Your version of '+ data[0] + ' is ' + data[1] + ' patches late'));
        }

        if (options['info-only']) {
            return;
        }
        if (options['max-delay'] < 1) {
            count++;
            if (count === options['max-count']) {
                process.exit(1);
            }
        }

    });
}

function delayValue(delay) {
    switch (delay) {
        case 'abandoned':
            return 4;
        case 'unstable':
            return 3;
        case 'major':
            return 2;
        case 'minor':
            return 1;
        case 'patch':
            return 0;
        default:
            return 4;
    }
}

module.exports = {
  subscriber: subscriber,
  delayValue: delayValue
};
