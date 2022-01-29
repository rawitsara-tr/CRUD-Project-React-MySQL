const express = require("express");
const multer = require("multer");
const dbCon = require("../Util/connecttion");
const path = require("path");

let filename = "";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("1 >> storage req", req.body);
    cb(null, "../../public/");
  },
  filename: (req, file, cb) => {
    // console.log("2 >> file", file);
    filename = file.originalname;
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("avatar", 3);

module.exports = {
  // 1 fetch Fruit from MySQL
  // app.get('/fruits', fruit_service.getFruit); 
  getFruit: (req, res) => {
    let sql = 'SELECT d.id, d.name, d.category_id, p.type AS categoryname FROM FRUIT AS d join CATEGORY AS p ON d.category_id = p.id'
    dbCon.query(sql, (error, results) => {
      if (error) throw error;
      return res.send(results);
    })
  },

  // 2 insert Fruit
  // app.post('/fruits',fruit_service.upload,fruit_service.createFruit);
  createFruit: async (req, res) => {
    async function printFiles() {
      let avatarbody = req.files;
      console.log('5 req files >> ', avatarbody)
      for (let i = 0; i < 1; i++) {
        console.log('6 loop of FRUIT >> i = ', i)
        let { name, category_id } = req.body;

        dbCon.query(
          "INSERT INTO FRUIT (name, category_id) VALUES (?,?)",
          [name, category_id],
          (error, results) => {
            if (error) console.log("err server");
            // console.log("1 record add complete");
            // console.log("3 >> INSERT FRUIT results", results);
          }
        );

        for (let i = 0; i < req.files.length; i++) {
          console.log('7 loop of IMAGE >> i = ', i)
          let data = avatarbody[i].filename;
          console.log(`8 >> req.files${i}.filename`)
          console.log(`9 >> `, data)
          let avatar = data;

          dbCon.query(
            " INSERT  INTO IMAGE(name, fruit_id) VALUES (?,(SELECT id FROM FRUIT WHERE name = ? ) )",
            [avatar, name],
            (error, results) => {
              if (error) console.log(error);
              console.log(`10 >> insert IMAGE ${i}`)
              // console.log("1 record add complete");
              // console.log("4 >> INSERT IMAGE results", results);
            }
          );
        }
      }
    }
    try {
      const createdUser = await printFiles();
      res.send('success')
      // console.log('1')
      // console.log("7 >> try", createdUser);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error.",
      });
      console.log("err catch", err);
    }
  },

  // 3 update Fruit in MySQL
  // app.put('/fruits', fruit_service.updateFruit); 
  updateFruit: (req, res) => {
    console.log('id >> ', req.body.id)
    console.log('name >> ', req.body.name)
    console.log('category_id >> ', req.body.category_id)
    console.log('file >> ', req.files)
    updateData = { id: req.body.id, name: req.body.name, category_id: req.body.category_id }
    let avatarbody = req.files;

    // // [1] query old data
    let oldSql = 'SELECT * FROM FRUIT WHERE id = ?'
    let value = [updateData.id]
    let oldData = {}
    let newData = {}
    dbCon.query(oldSql, value, (error, results) => {
      if (error) throw error;
      oldData = results[0]

      // [2] update object data
      if (updateData.name !== undefined && updateData.category_id !== undefined) {
        newData = { id: updateData.id, name: updateData.name, category_id: updateData.category_id }
      } else if (updateData.name !== undefined && updateData.category_id === undefined) {
        newData = { id: updateData.id, name: updateData.name, category_id: oldData.category_id }
      } else if (updateData.name === undefined && updateData.category_id !== undefined) {
        newData = { id: updateData.id, name: oldData.name, category_id: updateData.category_id }
      } else {
        newData = { id: updateData.id, name: oldData.name, category_id: oldData.category_id }
      }
      console.log('old >> ', oldData)
      console.log('update >> ', updateData)
      console.log('new >> ', newData)

      // [3] save into database
      let sql = 'UPDATE FRUIT SET name = ?,  category_id = ? WHERE id = ?';
      let value2 = [newData.name, newData.category_id, newData.id];
      dbCon.query(sql, value2, (error, results) => {
        if (error) throw error;
        return res.send({ message: "update successful" });
      });

      let value3 = req.body.id
      console.log("value3", value3)
      for (let i = 0; i < req.files.length; i++) {
        console.log(`8 >> `, req.files.length)
        console.log(`8 >> `, avatarbody)
        let data = avatarbody[i].filename;
        console.log(`9 >> `, data)
        let avatar = data;

        dbCon.query(
          " INSERT INTO IMAGE(name, fruit_id) VALUES (?, (SELECT id FROM FRUIT WHERE id = ?))",
          [avatar, value3],
          (error, results) => {
            console.log('6')
            if (error) console.log(error);
            console.log(`10 >> INSERT IMAGE ${i}`)
            // console.log("1 record add complete");
            // console.log("4 >> INSERT IMAGE results", results);
          }
        );
      }

    })
  },

  // 4 delete Fruit from MySQL
  //app.delete('/fruits/:id', fruit_service.deleteFruit); 
  deleteFruit: (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM FRUIT WHERE id = ?';
    let value = [id];
    dbCon.query(sql, value, (error, results) => {
      if (error) throw error;
      console.log("record delete complete")
      res.send({ data: results, message: 'delete successful' })
    })
  },

  // 5 fetch Catagory from MySQL
  // app.get('/fruitss', fruit_service.getFruitCategory)
  getFruitCategory: (req, res) => {
    let sql = 'SELECT * FROM CATEGORY';
    dbCon.query(sql, (error, results) => {
      if (error) throw error;
      //console.log('getCategory', results)
      return res.send(results);
    });
  },

  // 6 delete Fruit Image
  // app.delete('/deleteImage/:id',fruit_service.deleteFruitImage);
  deleteFruitImage: (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM IMAGE WHERE id = ?';
    let value = [id];
    dbCon.query(sql, value, (error, results) => {
      if (error) throw error;
      res.send({ data: results, message: 'delete successful' })
    })
  },

  // 7 select Fruit Image
  // app.get('/selectImage',fruit_service.getSelectAllImages);
  getSelectAllImages: (req, res) => {
    let sql = 'SELECT * FROM IMAGE'
    dbCon.query(sql, (error, results) => {
      if (error) throw error;
      return res.send(results);
    })
  },
  upload,
};
