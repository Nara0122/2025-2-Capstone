const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async( req, res = response ) => {
   
    const eventos = await Evento.find()
    .populate('user','name');

    res.json({
    ok: true,
    eventos
    });
}


const crearEvento = async( req, res = response ) => {    
 
    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;
        
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: '관리자에게 문의하세요'
        });
    }
 }

 const actualizarEvento = async ( req, res = response ) => {   
    
    const eventoId = req.params.id;
    const uid = req.uid;
    
    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: '일정이 존재하지 않습니다'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: '수정 권한이 없습니다'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '관리자에게 문의하세요'
        });
    }

}

const eliminarEvento = async( req, res = response ) => {    
 
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: '해당 일정이 존재하지 않습니다'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: '수정 권한이 없습니다'
            });
        }


        await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '관리자에게 문의하세요'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}