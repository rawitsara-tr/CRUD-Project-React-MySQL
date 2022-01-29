const express = require("express");
const multer = require("multer");
const dbCon = require("../Util/connecttion");
const path = require("path");
const mergeJson = require("merge-json")
const jsonMerger = require("json-merger");

let filename = "";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("1 >> storage req", req.body);
    cb(null, "../../public/");
  },
  filename: (req, file, cb) => {
    filename = file.originalname;
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
}).single("avatar");

module.exports = {
  getCategory: (req, res) => {
    let sql = "SELECT * FROM CATEGORY";
    dbCon.query(sql, (error, results) => {
      if (error) throw error;
      let message = "";
      if (results === undefined || results.length === 0) {
        message = "no data";
      } else {
        message = "fetch data successful";
      }
      //  return res.send({data: results, message: message});
      return res.send(results);
    });
  },

  createCategory: (req, res) => {
    // let id = req.body.id;
    let type = req.body.type;
    let avatar = req.file.filename;
    // console.log('40 req.file.filename >> ', avatar)
    dbCon.query(
      "INSERT INTO CATEGORY (type,image) VALUES (?,?)",
      [type, avatar],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.send(results)
        // res.status(201).send(`Name added `);
      }
    );
  },

  updateCategoryy: (req, res) => {
    // console.log('id', req.body.id)
    // console.log('type', req.body.type)
    // console.log('file', req.file)
    updateData = { id: req.body.id, type: req.body.type, image: req.file }

    // [1] query old data
    let oldSql = 'SELECT * FROM CATEGORY WHERE id = ?'
    let value = [updateData.id]
    let oldData = {}
    let newData = {}
    dbCon.query(oldSql, value, (error, results) => {
      if (error) throw error;
      oldData = results[0]
      // console.log('69 >> oldData', oldData)

      // [2] update object data
      if (updateData.type !== undefined && updateData.image !== undefined) {
        newData = { id: updateData.id, type: updateData.type, image: updateData.image.filename }
      } else if (updateData.type !== undefined && updateData.image === undefined) {
        newData = { id: updateData.id, type: updateData.type, image: oldData.image }
      } else if (updateData.type === undefined && updateData.image !== undefined) {
        newData = { id: updateData.id, type: oldData.type, image: updateData.image.filename }
      } else {
        newData = { id: updateData.id, type: oldData.type, image: oldData.image }
      }

      console.log('old >> ', oldData)
      console.log('update >> ', updateData)
      console.log('new >> ', newData)

      // [3] save into database
      let sql = "UPDATE CATEGORY SET type = ?, image = ? WHERE id = ?";
      let value2 = [newData.type, newData.image, newData.id];
      dbCon.query(sql, value2, (error, results) => {
        if (error) throw error;
        return res.send({ message: "update successful" });
      });
    })
  },

  deleteCategoryy: (req, res) => {
    let id = req.params.id;
    let sql = "DELETE FROM CATEGORY WHERE id = ?";
    let value = [id];
    dbCon.query(sql, value, (error, results) => {
      if (error) throw error;
      console.log("1 record delete complete");
      res.send({ data: results, message: "delete successful" });
    });
  },
  upload,
};
