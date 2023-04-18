// const jdsk = require('../../')
const service = require('../service/main')
const fs = require('fs')
let initRoutes = (app) => {

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.get("/all-loai-sach", async (req, res) => {
        let listLoais = await service.allLoaiSach()
        res.status(200).json(listLoais)
    })
    app.get("/book/:id", async (req, res) => {
        let { id } = req.params
        let book = await service.getBookByID(id)
        res.status(200).json(book)
    })
    app.post('/book', async (req, res) => {
        let book = req.body.data
        let rs = await service.addNewBook(book)
        if (rs.err == 0) {
            res.status(200).json({ mes: "success" })
        } else {
            res.status(401).json({ mes: 'failed' })
        }
    })
    app.get('/all-book', async (req, res) => {
        let rs = await service.getAllBook()
        res.json(rs)
    })
    app.delete('/book', async (req, res) => {
        let rs = await service.deleteBook(req.body.bookID)
        res.json(rs)
    })
    app.put('/book', async (req, res) => {
        let rs = await service.updateBook(req.body)
        res.json(rs)
    })
    app.post('/regis', async (req, res) => {
        let rs = await service.regisAccount(req.body)
        res.json(rs)
    })
    app.post('/login', async (req, res) => {
        let rs = await service.login(req.body)
        res.json(rs)
    })
    app.post('/borrow_book', async (req, res) => {
        let rs = await service.borrowBook(req.body)
        res.json(rs)
    })

    app.get('/list_borrow', async (req, res) => {
        let rs = await service.getListBorrow()
        res.json(rs)
    })
    app.get("/all-image", (req, res) => {
        const path = './public/image/';
        let fileImages = fs.readdirSync(path).map((file) => {
            return "/public/image/" + file
        })
        res.json(fileImages)
    })
}

module.exports = initRoutes