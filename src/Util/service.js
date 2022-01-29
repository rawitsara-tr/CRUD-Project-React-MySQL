const express = require('express');  //
const app = express(); //
const bodyParser = require('body-parser');
const category_service = require('../server/category_service') //
const fruit_service = require('../server/fruit_service') //
const http = require("http");
const cors = require('cors');
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('/public_html/'));

app.get('/categorys',category_service.getCategory);
app.post('/categorys',category_service.upload,category_service.createCategory);
app.put('/categoryss',category_service.upload,category_service.updateCategoryy);
app.delete('/categorys/:id',category_service.deleteCategoryy);

// 1 fetch Fruit
app.get('/fruits',fruit_service.getFruit);
// 2 insert
app.post('/fruits',fruit_service.upload,fruit_service.createFruit);
// 3 update
app.put('/fruits',fruit_service.upload,fruit_service.updateFruit);
// 4 delete
app.delete('/fruits/:id',fruit_service.deleteFruit);
// 5 fetch Catagory
app.get('/fruitsCategory',fruit_service.getFruitCategory)
// 6 delete Fruit Image
app.delete('/deleteImage/:id',fruit_service.deleteFruitImage);
// 7 select Fruit All Image
app.get('/selectAllImages',fruit_service.getSelectAllImages);

http.createServer(app).listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});


