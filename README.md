# Checkers

## Synopsis

This was a project that was completed as Part of The University of Texas at Austin Coding Bootcamp. During the course, we split up into groups and are given a couple of weeks to build something with a set of given technologies. 

We decided to build an online arcade. Our primary game is checkers in which you can play against the computer.

## What Technologies We Used

We used a variety of front and back end technologies to accomplish this.

Back End:
1. Sequelize: Sequelize helped us to validate our input, streamline our queries, and ultimately make tgeh process of interfacing with MySQL much easier;

2. Node + Express: Our Backend Routing System which allowed us to proxy requests from AWS API Gateway, set up routes for authentication, and interface with the lambda functions to create, read, update, and destory data in the mysql database;

3. AWS RDS: Amazon Web Services Hosted Our MySQL database;

4. Jade: Jade (aka Pug) was our primary templating langauge;

Front End:
1. D3: D3 was our central front-end library for creating the checkboard and pieces;

2. jQuery: DOM manipulation;

3. Auth0: A simple authentication service to allow for user registration, logging in, logging out, etc;

4. Bootstrap: General Stylign and the Grid System;

## Motivation

This project helped us cement our understanding of how full stack projects are created.

## Installation

To run this project:

```javascript
//To Install
git clone https://github.com/weatherfordmat/Checkers.git
cd Checkers
rm .git
npm install

/*
1. Go to auth0.com create an account, create a 'client', and find your keys;
2. Add Your Appropriate Keys to the Server File and the Main Jade Template
*/

//To Start
npm start

//To test (Coming Soon)
npm run test 
```

## Contributors

dnhart
JLDiebel
v8tx
weatherfordmat


## License

The MIT License (MIT)

Copyright (c) 2017 Joshua Diebel
Copyright (c) 2017 D'Ann Hart
Copyright (c) 2017 Veronica Diaz
Copyright (c) 2017 Matthew Weatherford

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.