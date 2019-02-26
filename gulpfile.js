const gulp = require('gulp')
const eslint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')
const friendlyFormatter = require('eslint-friendly-formatter')

var jsScript = 'node'
if (process.env.npm_config_argv !== undefined && process.env.npm_config_argv.indexOf('debug') > 0) {
    jsScript = 'node debug'
}

function lintOne(aim) {
    console.log('ESlint:' + aims)
    console.time('Finished eslint')
    return gulp.src(aims)
        .pipe(eslint({configFile: './.eslintrc.js'}))
        .pipe(eslint.format(friendlyFormatter))
        .pipe(eslint.results(results => {
            console.log(`- Total Results: ${results.length}`)
            console.log(`- Total Warnings: ${results.warningCount}`)
            console.log(`- Total Errors: ${results.errorCount}`)
            console.timeEnd('Finished eslint')
        }))
}

gulp.task(`ESlint`, () => {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({configFile: './.eslintrc.js'}))
        .pipe(eslint.format(friendlyFormatter))
        .pipe(eslint.results(results => {
            console.log(`- Total Results: ${results.length}`)
            console.log(`- Total Warnings: ${results.warningCount}`)
            console.log(`- Total Errors: ${results.errorCount}`)
        }))
})

gulp.task('ESlint_nodemon', ['ESlint'], function () {
    var stream = nodemon({
        script: 'build/dev-server.js',
        execMap: {
            js: jsScript
        },
        task: function (changedFiles) {
            lintOne(changedFiles)
            return []
        },
        verbose: true,
        ignore: ['build/*.js', "dist/*.js", 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js'],
        env: {
            NODE_ENV: 'development'
        },
        ext: 'js json'
    })
    
    return stream
        .on('restart', function () {
            // console.log('Application has restarted!"")
        })
        .on('crash', function () {
            console.error('Application has crashed!\n')
        })
})

gulp.task('nodemon', function () {
    return nodemon({
        script: 'build/dev-server.js',
        execMap: {
            js: jsScript
        },
        verbose: true,
        ignore: ['build/*.js', 'dist/*.js', 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js'],
        env: {
            NODE_DEV: 'development'
        },
        ext: 'js json'
    })
})

gulp.task('default', ['ESlint', 'ESlint_nodemon'], function () {
    console.log('ESlint check finished')
})