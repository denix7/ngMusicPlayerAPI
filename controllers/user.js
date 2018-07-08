'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

function userTest(req, res){
    res.status(200).send({message: 'test users works'});
}

//Registrar usuarios
function saveUser(req, res){
    var user = new User();//nueva instancia para setear valores
    var params = req.body;//todo los datos que nos llegan por post

    if(params.name && params.surname && params.email && params.password)
    {
        console.log(params);
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_ADMIN';
        user.image = 'null';

        //Controla usuarios dupolicados
        User.find({ $or: [
            {email: user.email.toLowerCase()}
        ]}).exec((err, users)=>{

            if(err){
                return res.status(500).send({message: 'Error en la peticion de usuario'}) 
            }    
            else if(users && users.length >=1){//1 o mas usuarios encontrados con el mismo correo
                return res.status(200).send({message: 'El usuario que intenta registrar ya existe'});
            }
            else{
            //Encriptar contraseña
                bcrypt.hash(params.password, null, null, function(err, hash){
                    user.password = hash;
                    if(user.name != null & user.surname != null, user.email != null){
                        //si existe datos guardamos
                        user.save((err, userStored) => {
                            if(err)
                                res.status(500).send({message: 'Error al guardar el usuario'});
                            else if(!userStored){
                                res.status(404).send({message: 'No se ha registrado el usuario'});
                            }else{
                                res.status(200).send({user:userStored});
                            }    
                        });
                    }else{
                        res.status(200).send({message: 'Introduce todos los campos'})
                    }
                });
            }
        });
    }else{
        res.status(500).send({message: 'Es necesario llenar todos los campos'});
    }    
}
module.exports = {
    userTest,
    saveUser
}