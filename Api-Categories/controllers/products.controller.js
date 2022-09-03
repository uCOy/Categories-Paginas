const Products = require('../models/Products');
const Categories = require('../models/Categories');

exports.findAll = async (req, res) => {
    await Products.findAll({
        attributes: ['id','name', 'description'],
        order:[['id','ASC']], 
        include:[Categories]
    })
    .then( (products) => {
        return res.json({
            erro:false,
            products
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nehum Produto encontrado!!!`
        });
    });
};

exports.findAllPages = async (req, res) => {
    console.log(req.params);

    const {page=1} = req.params;
    const limit = 2;
    let lastPage = 1;

    const countProducts = await Products.count()
    console.log(countProducts)

    if(countProducts === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Error: Products não encontrada!!!"
        })
    } else {
        lastPage = Math.ceil(countProducts / limit);
        console.log(lastPage);
    }
    // Select id, name, description from Products Limit 2 offset 3
    // Exemplo:
    // pag 1 = 1,2
    // pag 2 = 3,4
    // pag 3 = 5,6

    await Products.findAll({
        attributes: ['id','name', 'description', 'quantity', 'price', 'categorieId'],
        order:[['id','ASC']],
        offset: Number((page * limit) - limit), // pag 3 * 2 = 6
        limit: limit
    })
    .then( (products) => {
        return res.json({
            erro:false,
            products,
            countProducts,
            lastPage
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nehum Categoria encontrado!!!`
        });
    });
};

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: { id: id }})
        // const products = await Products.findByPk(id);
        // if(!products) {
        //     return res.status(400).json({
        //         erro: true,
        //         mensagem: "Erro Nehum Produto encontrado!"
        //     })
        // }
        const products = await Products.findAll({
            where: {id: id},
            include:[Categories]
        });
        if(!products) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro Nehum Produto encontrado!"
            })
        }
        res.status(200).json({
            erro: false,
            products
        })
    }catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
};

exports.create = async (req, res) => {
    // const{ name, email, gender, password } = req.body;
    var dados = req.body;
    console.log(dados);
    // dados.password = await bcrypt.hash(dados.password,8);
    // console.log(dados.password);
    
    await Products.create(dados)
    .then(()=>{
        return res.json({
            erro: false,
            mensagem:'Produto cadastrado com sucesso!'
        });
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Produto não cadastrado...${err}`
        })
    })
};

exports.update = async (req, res) => {
    const{ id} = req.body;

    await Products.update(req.body,{ where: { id}})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Produto alterado com sucesso"
        })
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Produto não alterado ...${err}`
        })
    })
};

exports.delete = async (req, res) => {
    const {id} = req.params;
    await Products.destroy({where: { id }})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Produto apagado com sucesso"
        });
    }).catch(() => {
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: ${err} Produto não apagado...`
        });
    });
};