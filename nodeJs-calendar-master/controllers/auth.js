const {response} = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res= response ) => {

    const {  email, password } = req.body;
   
    try {

        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: '사용자가 이미 존재합니다'
            });
        }
         usuario = new Usuario (req.body);

         // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false ,
            msg: '관리자에게 문의하세요',
         })
    }
  
}

const loginUsuario = async (req, res= response ) => {

    const { email,  password } = req.body; 

    try {
        
        console.log('User Reg requested.');

        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: '이메일이 유효하지 않습니다'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: '비밀번호가 틀립니다'
            });
        }


         // Generar JWT
         const token = await generarJWT( usuario.id, usuario.name );

        res.json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '관리자에게 문의하세요'
        });
    }
}

const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,name,
        token
    })
}



module.exports = { 
    crearUsuario,
    loginUsuario,
    revalidarToken
}