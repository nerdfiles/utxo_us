module.exports = (grunt) ->

  # Load grunt tasks automatically
  require('load-grunt-tasks') grunt

  # Time how long tasks take. Can help when optimizing build times
  require('time-grunt') grunt

  # Configurable paths for the application
  appConfig =
    app: require('./bower.json').appPath or 'app'
    dist: 'dist'

  # Define the configuration for all the tasks
  grunt.initConfig
    yeoman: appConfig

    watch:

      bower:
        files: [ 'bower.json' ]
        tasks: [
          #'wiredep'
        ]

      js:
        files: [ '<%= yeoman.app %>/scripts/{,*/}*.js' ]
        tasks: [
          #'newer:jshint:all'
        ]
        options: livereload: '<%= connect.options.livereload %>'

      jsTest:
        files: [ 'test/spec/{,*/}*.js' ]
        tasks: [
          'newer:jshint:test'
          'karma'
        ]

      compass:
        files: [ '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}' ]
        tasks: [
          'compass:server'
          'autoprefixer'
        ]

      gruntfile:
        files: [ 'Gruntfile.js' ]
        task: [
          'coffee:build'
        ]

      livereload:
        options:
          livereload: '<%= connect.options.livereload %>'
        files: [
          '<%= yeoman.app %>/{,*/}*.html'
          '.tmp/styles/{,*/}*.css'
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
        tasks: [
          'shell:collectStatic'
        ]

    coffee:

      glob_to_multiple:
        options:
          base: true
          sourceMap: true
        expand : true
        flatten : false
        cwd : "./app"
        dest : "./app"
        ext : ".js"
        src : [
          "**/*.coffee"
          "**/*.spec.coffee"
          "**/*.unit.coffee"
        ]

      build:
        options:
          base: true
        cwd : "./"
        dest : "./"
        ext : ".js"
        src : [
          "Gruntfile.coffee"
        ]

    shell:
        collectStatic:
            command: [
                'sh /Users/nerdfiles/Projects/utxo_us/shell-scripts/collectstatic.sh'
            ].join('')

    connect:
      options:
        port: 9000
        hostname: 'localhost'
        livereload: 35730
      livereload: options:
        open: true
        middleware: (connect) ->
          [
            connect.static('.tmp')
            connect().use('/bower_components', connect.static('./app/static/bower_components'))
            connect().use('/app/styles', connect.static('./app/styles'))
            connect.static(appConfig.app)
          ]
      test: options:
        port: 9001
        middleware: (connect) ->
          [
            connect.static('.tmp')
            connect.static('test')
            connect().use('/bower_components', connect.static('./app/static/bower_components'))
            connect.static(appConfig.app)
          ]
      dist: options:
        open: true
        base: '<%= yeoman.dist %>'

    jshint:
      options:
        jshintrc: '.jshintrc'
        reporter: require('jshint-stylish')
      all: src: [
        'Gruntfile.js'
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
      test:
        options: jshintrc: 'test/.jshintrc'
        src: [ 'test/spec/{,*/}*.js' ]
    clean:
      dist: files: [ {
        dot: true
        src: [
          '.tmp'
          '<%= yeoman.dist %>/{,*/}*'
          '!<%= yeoman.dist %>/.git{,*/}*'
        ]
      } ]
      server: '.tmp'

    autoprefixer:
      options: browsers: [ 'last 1 version' ]
      server:
        options: map: true
        files: [ {
          expand: true
          cwd: '.tmp/styles/'
          src: '{,*/}*.css'
          dest: '.tmp/styles/'
        } ]
      dist: files: [ {
        expand: true
        cwd: '.tmp/styles/'
        src: '{,*/}*.css'
        dest: '.tmp/styles/'
      } ]

    wiredep:
      options: cwd: ''
      app:
        #src: [ '<%= yeoman.app %>/index.html' ] # Original angularfire template to be used within generator-django-axiacore
        src: [ '<%= yeoman.app %>/templates/layout/base.html' ]
        ignorePath: /\.\.\//
      test:
        devDependencies: true
        src: '<%= karma.unit.configFile %>'
        ignorePath: /\.\.\//
        fileTypes: js:
          block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi
          detect: js: /'(.*\.js)'/gi
          replace: js: '\'{{filePath}}\','
      sass:
        src: [ '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}' ]
        ignorePath: /(\.\.\/){1,2}bower_components\//

    compass:
      options:
        sassDir                 : '<%= yeoman.app %>/styles'
        #cssDir                 : '.tmp/styles'
        cssDir                  : '<%= yeoman.app %>/styles'
        generatedImagesDir      : '.tmp/images/generated'
        imagesDir               : '<%= yeoman.app %>/images'
        javascriptsDir          : '<%= yeoman.app %>/scripts'
        fontsDir                : '<%= yeoman.app %>/styles/fonts'
        importPath              : './app/static/bower_components'
        httpImagesPath          : '/images'
        httpGeneratedImagesPath : '/images/generated'
        httpFontsPath           : '/styles/fonts'
        relativeAssets          : false
        assetCacheBuster        : false
        raw                     : 'Sass::Script::Number.precision = 10\n'
      dist:
        options:
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
      server:
        options:
          sassDir                 : '<%= yeoman.app %>/styles'
          #cssDir                 : '.tmp/styles'
          cssDir                  : '<%= yeoman.app %>/styles'
          generatedImagesDir      : '.tmp/images/generated'
          imagesDir               : '<%= yeoman.app %>/images'
          javascriptsDir          : '<%= yeoman.app %>/scripts'
          fontsDir                : '<%= yeoman.app %>/styles/fonts'
          importPath              : './app/static/bower_components'
          httpImagesPath          : '/images'
          httpGeneratedImagesPath : '/images/generated'
          httpFontsPath           : '/styles/fonts'
          relativeAssets          : false
          assetCacheBuster        : false
          raw                     : 'Sass::Script::Number.precision = 10\n'
          sourcemap: true

    filerev: dist: src: [
      '<%= yeoman.dist %>/scripts/{,*/}*.js'
      '<%= yeoman.dist %>/styles/{,*/}*.css'
      '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
      '<%= yeoman.dist %>/styles/fonts/*'
    ]

    useminPrepare:
      #html: '<%= yeoman.app %>/index.html' # Original angularfire template to be used within generator-django-axiacore
      html: '<%= yeoman.app %>/templates/layout/base.html'
      options:
        dest: '<%= yeoman.dist %>'
        flow: html:
          steps:
            js: [
              'concat'
              'uglifyjs'
            ]
            css: [ 'cssmin' ]
          post: {}

    usemin:
      html: [ '<%= yeoman.dist %>/{,*/}*.html' ]
      css: [ '<%= yeoman.dist %>/styles/{,*/}*.css' ]
      options: assetsDirs: [
        '<%= yeoman.dist %>'
        '<%= yeoman.dist %>/images'
        '<%= yeoman.dist %>/styles'
      ]

    imagemin: dist: files: [ {
      expand: true
      cwd: '<%= yeoman.app %>/images'
      src: '{,*/}*.{png,jpg,jpeg,gif}'
      dest: '<%= yeoman.dist %>/images'
    } ]

    svgmin: dist: files: [ {
      expand: true
      cwd: '<%= yeoman.app %>/images'
      src: '{,*/}*.svg'
      dest: '<%= yeoman.dist %>/images'
    } ]

    htmlmin: dist:
      options:
        collapseWhitespace: true
        conservativeCollapse: true
        collapseBooleanAttributes: true
        removeCommentsFromCDATA: true
        removeOptionalTags: true
      files: [ {
        expand: true
        cwd: '<%= yeoman.dist %>'
        src: [
          '*.html'
          'views/{,*/}*.html'
          'partials/{,*/}*.html'
        ]
        dest: '<%= yeoman.dist %>'
      } ]

    ngAnnotate: dist: files: [ {
      expand: true
      cwd: '.tmp/concat/scripts'
      src: '*.js'
      dest: '.tmp/concat/scripts'
    } ]

    cdnify: dist: html: [ '<%= yeoman.dist %>/*.html' ]

    copy:
      dist: files: [
        {
          expand: true
          dot: true
          cwd: '<%= yeoman.app %>'
          dest: '<%= yeoman.dist %>'
          src: [
            '*.{ico,png,txt}'
            '.htaccess'
            '*.html'
            'partials/{,*/}*.html'
            'views/{,*/}*.html'
            'images/{,*/}*.{webp}'
            'styles/fonts/{,*/}*.*'
          ]
        }
        {
          expand: true
          cwd: '.tmp/images'
          dest: '<%= yeoman.dist %>/images'
          src: [ 'generated/*' ]
        }
        {
          expand: true
          cwd: '.'
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*'
          dest: '<%= yeoman.dist %>'
        }
      ]
      styles:
        expand: true
        cwd: '<%= yeoman.app %>/styles'
        dest: '.tmp/styles/'
        src: '{,*/}*.css'

    concurrent:
      options:
        limit: 64
      server: [
        'compass:server'
      ]
      test: [
        'compass'
      ]
      dist: [
        'compass:dist'
        'imagemin'
        'svgmin'
      ]

    karma: unit:
      configFile: 'test/karma.conf.js'
      singleRun: true

  grunt.registerTask 'serve', 'Compile then start a connect web server', (target) ->

    if target == 'dist'
      return grunt.task.run([
        'build'
        'connect:dist:keepalive'
      ])

    grunt.task.run [
      'clean:server'
      #'wiredep'
      #'concurrent:server'
      'autoprefixer:server'
      #'connect:livereload'
      'watch'
    ]

    return

  grunt.registerTask 'server', 'DEPRECATED TASK. Use the "serve" task instead', (target) ->
    grunt.log.warn 'The `server` task has been deprecated. Use `grunt serve` to start a server.'
    grunt.task.run [ 'serve:' + target ]
    return

  # @example 'test/spec/{,*/}*.js'
  # @example 'test/spec/**/*.js'

  grunt.registerTask 'test', [
    'clean:server'
    #'wiredep'
    'concurrent:test'
    'autoprefixer'
    'connect:test'
    'karma'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    #'wiredep'
    'useminPrepare'
    'concurrent:dist'
    'autoprefixer'
    'concat'
    'ngAnnotate'
    'copy:dist'
    'cdnify'
    'cssmin'
    'uglify'
    'filerev'
    'usemin'
    'htmlmin'
  ]

  grunt.registerTask 'default', [
    #'newer:jshint'
    'test'
    'build'
  ]

  return
