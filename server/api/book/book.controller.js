'use strict';

var _  = require('lodash');
var Promise = require("bluebird");
var request = require("request");
var Log = require('log'), log = new Log('info');

var subjects = [
  "fiction",
  "mystery",
  "thriller",
  "historical_fiction",
  "fantasy",
  "romance",
  "science_fiction",
  "horror",
  "humor",
  "nonfiction",
  "biography_&_autobiography",
  "autobiography",
  "history",
  "science",
  "technology",
  "food-coo",
  "graphic_novels",
  "poetry",
  "children",
  "motion_pictures",
  "drama"
];

function getSubject (subject){
  return new Promise(
    (resolve, reject) => {
      request.get(
        {
          url: "http://openlibrary.org/subjects/"+subject+".json",
          qs: {limit: 2},
          json: true
        },
        (err, res, subject) => {
          if(err){
            reject(err);
          }
          var works = subject.works;
          resolve(works);
        }
      );
    }
  );
}

function searchForTitle (query){
  return new Promise(
    (resolve, reject) => {
      request.get(
        {
          url: "http://openlibrary.org/search.json",
          qs: {q:query, limit:10},
          json: true
        },
        (err, res, body) => {
          if(err){
            reject(err);
          }
          var books = body.docs;
          resolve(books);
        }
      );
    }
  );
}

function getBookByOLID (olid){
  return new Promise(
    (resolve, reject) => {
      request.get(
        {
          url: "https://openlibrary.org/api/books",
          qs: {
            bibkeys: "OLID:"+olid,
            format: "json",
            jscmd: "data"
          },
          json: true
        },
        (err, res, book) => {
          if(err){
            reject(err);
          }
          resolve(book["OLID:"+olid]);
        }
      );
    }
  );
}

exports.index = function(req, res) {
  Promise.map(
    subjects,
    (sub)=>{
      return getSubject(sub);
    }
  ).then((datos)=>{
    res.json(_.flatten(datos));
  }).catch((error) => {
    log.error("On API /books, ERROR: %s",error);
    res.send(error);
  });
};

exports.search = function(req, res) {
  var query = req.params.query;
  searchForTitle(query)
  .then((books)=>{
    res.json(books);
  }).catch((error) => {
    log.error("On API /books, ERROR: %s",error);
    res.send(error);
  });
};

exports.olid = function(req, res){
  var olid = req.params.olid;
  getBookByOLID(olid).then((book)=>{
    res.json(book);
  }).catch((err)=>{
    log.error("On API /books/:olid, OLID:%s, ERROR:%s",olid, err);
    res.status(400).send(err);
  })
}
