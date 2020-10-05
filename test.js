const jwt = require("jsonwebtoken");

const private = "W78-!,C/<+BmYqkfp!2g:eT{(^m]";

const x = jwt.sign({ name: "anitha"}, private);

const h = jwt.verify(x, private);

console.log(h);