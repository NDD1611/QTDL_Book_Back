const connection = require("../database/config")


let allLoaiSach = async () => {
    try {
        let con = await connection()
        let [rs, field] = await con.execute('select * from loaisach');
        con.end()
        return rs
    } catch (e) {
        console.log(e)
    }
}

let addNewBook = async (book) => {
    try {
        let con = await connection()
        var [rs, field] = await con.execute('select max(bookID) as max from book')
        let max = rs[0].max
        max++
        let sql = "insert into book (bookID, name, nopage, image, nhaXuatBan, tenTacGia, moTa, sl, loaiSach_loaiID) values (?,?,?,?,?,?,?,?,?)"
        var [rs, field] = await con.execute(sql, [max, book.name, book.nopage, book.image, book.nhaXuatBan, book.tenTacGia, book.moTa, book.sl, book.loaiSach])
        con.end()
        return {
            err: 0
        }
    } catch (e) {
        console.log(e, "addNewBook")
        return {
            err: 1
        }
    }
}

let getAllBook = async () => {
    try {
        let con = await connection()
        let sql = " select * from book"
        let [rs, field] = await con.execute(sql)
        con.end()
        return rs
    } catch (e) {
        console.log(e)
    }
}

let deleteBook = async (bookID) => {
    try {
        let con = await connection()
        let sql = "call deleteBook(?)"
        let [rs, field] = await con.execute(sql, [bookID])
        con.end()
        return {
            err: 0
        }
    } catch (e) {
        return {
            err: 1
        }
    }
}

let updateBook = async (book) => {
    try {
        let con = await connection()
        let sql = "call updateBook(?,?,?,?,?,?,?,?,?)"
        let [rs, field] = await con.execute(sql, [book.bookID, book.name, book.nopage, book.image, book.nhaXuatBan, book.tenTacGia, book.moTa, book.sl, book.loaiSach_loaiID])
        con.end()
        return {
            err: 0
        }
    } catch (e) {
        console.log(e)
        return {
            err: 1
        }
    }
}

let getBookByID = async (bookID) => {
    try {
        let con = await connection()
        let sql = " select * from book where bookID=?"
        let [rs, field] = await con.execute(sql, [bookID])
        con.end()
        return rs[0]
    } catch (e) {
        console.log(e)
    }
}
let regisAccount = async ({ userName, passWord, confirm, firstName, lastName, sex }) => {
    try {
        let con = await connection()
        var sql = 'select capUSerID() as id'
        var [rs, field] = await con.execute(sql)
        let userId = rs[0]['id']
        var sql = 'select username from account where username = ?'
        var [rs, field] = await con.execute(sql, [userName])
        if (rs.length === 0) {
            let sqlInsertUser = 'insert into user values (?,?,?,?)'
            let sqlInsertAccount = 'insert into account values (?,?,?,?)'
            await con.execute(sqlInsertUser, [userId, sex, firstName, lastName])
            await con.execute(sqlInsertAccount, [userName, passWord, "User", userId])
        } else {
            return {
                err: 2,
                mes: 'Tài khoản đã tồn tại'
            }
        }
        con.end()
        return {
            err: 0
        }
    } catch (e) {
        console.log(e)
        return {
            err: 1
        }
    }
}

let login = async ({ userName, passWord }) => {
    try {
        let con = await connection()
        var sql = " select * from account where username=?"
        var [rs, field] = await con.execute(sql, [userName])
        let account = rs[0]
        if (rs && rs.length === 0) {
            con.end()
            return {
                err: 1,
                mes: 'Tài khoản không tồn tại'
            }
        } else if (account.password !== passWord) {
            con.end()
            return {
                err: 1,
                mes: 'Sai mật khẩu'
            }
        } else {
            var sql = 'select * from user where userID=?'
            var [rs, field] = await con.execute(sql, [account.user_userID])
            con.end()
            let user = rs[0]
            user = {
                ...user,
                role: account.role
            }
            return {
                err: 0,
                data: user
            }
        }
    } catch (e) {
        console.log(e)
        return {
            err: 1,
            mes: "Lỗi từ server"
        }
    }
}
let borrowBook = async ({ timeBorrow, userID, bookID }) => {
    try {
        console.log(timeBorrow, userID, bookID)
        let con = await connection()
        var sql = 'select sl from book where bookID=?'
        var [rs, filed] = await con.execute(sql, [bookID])
        var sl = rs[0]["sl"]
        if (sl === 0) {
            con.end()
            return {
                err: 1,
                mes: "Sách không có sẵn"
            }
        } else {
            var sql = "insert into muon values (?,?,?,?)"
            await con.execute(sql, [timeBorrow, '', userID, bookID])
            sql = 'update book set sl=? where bookID=?'
            await con.execute(sql, [sl - 1, bookID])
            con.end()
            return {
                err: 0
            }
        }

    } catch (e) {
        console.log(e)
        return {
            err: 1,
            mes: "Lỗi server"
        }
    }
}
let getListBorrow = async () => {
    try {
        let con = await connection()
        let sql = 'select * from muon join book on muon.book_bookID = book.bookID join user on muon.user_userID=user.userID'
        let [rs, field] = await con.execute(sql)
        console.log(rs)
        var newList = rs.map((br) => {
            let { ngayMuon, name, image, firstName, lastName } = br
            let data = { ngayMuon, name, image, firstName, lastName }
            return data
        })
        con.end()
        return newList
    } catch (e) {
        console.log(e)
    }
}
module.exports = {
    allLoaiSach,
    addNewBook,
    getAllBook,
    deleteBook,
    updateBook,
    getBookByID,
    regisAccount,
    login,
    borrowBook,
    getListBorrow
}