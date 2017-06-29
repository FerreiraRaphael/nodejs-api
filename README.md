# Building a javascript dev env

### Editor config

Using .editorconfig for enforcing for indention

### Package Management
 
Using yarn as the package manager

### Web Server

Using express for the web server

### Transpiling

Transpiling js to ES6/ES7 with babel

### Build

Building with webpack and express using the webpack-dev-middleware

### Linting

Linting process using eslint and eslint:recommended extension
 
### Testing and CI

Testing process with mocha, chai and jsdom, and for CI, I`m using TravisCI  

### HTTP

Using whatwg-fetch for fetching data with http, and json-server and json-schema-faker for mocking the API

### Production Build 

Using a webpack config for the production using the following plugins :

   - CommonsChunkPlugin for spliting bundles.
   - WebpackMd5Hash for cache bursting.
   - ExtractTextPlugin for creating a css bundle separately.
   - HtmlWebpackPlugin for minify the html index and injecting bundles.
   - DedupePlugin for eliminate duplicate packages when generating bundle.
   - UglifyJsPlugin for minify JS.
