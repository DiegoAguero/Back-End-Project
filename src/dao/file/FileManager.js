import fs from 'fs'

class FileManager{
    constructor(path = './db/db.json'){
        this.path = path
    }

    getNextId(list){
        return (list.length == 0) ? 1 : list[list.length - 1]._id + 1
    }

    async get(){
        return fs.promises.readFile(this.path, 'utf-8')
        .then(r => JSON.parse(r))
        .catch(e => {
            return []
        })
    }
    async getById(id){
        const data = await this.get()
        return data.find(d => d._id == id)
    }
    async add(data){
        const list = await this.get()
        data._id = this.getNextId(list)
        list.push(data)
        return fs.promises.writeFile(this.path, JSON.stringify(list)), data
    }
    async delete(id){
        const list = await this.get()
        const getProd = this.getById(parseInt(id))
        const filter = list.filter(d => d._id != parseInt(id))
        fs.promises.writeFile(this.path, JSON.stringify(filter))
        return getProd
    }
    async update(id, data){
        const list = await this.get()
        const idx = list.findIndex(item => item._id == id )
        list[idx] = data
        fs.promises.writeFile(this.path, JSON.stringify(list))
        return data
    }
}

export default FileManager