const path = require( 'path' );

const Movie = require( '../models/movie' )

const ITEMS_PER_CONTAINER_LIST = 5;

exports.getIndex = async( req,res,next ) =>{
    const page = req.query.page || 1;

    try {
        const listPhimBo = await Movie.find( {typeFilm: 'Phim-Bộ'} )
            .limit( 18 );
        const listPhimLe = await Movie.find( {typeFilm: 'Phim-Lẻ'} )
            .limit( 18 );
        const listChieuRap = await Movie.find( {typeFilm: 'Phim-Chiếu-Rạp'} )
            .limit( 18 );
        const HoatHinh = await Movie.find( {typeFilm: 'Hoạt-Hình'} )
            .limit( 18 );
        const listPhimSapChieu = await Movie.find( {typeFilm: 'Phim-Sắp-Chiếu'} )
            .limit( 6 );
        
        res.render( 'home/index',{
            listPhimBo: listPhimBo,
            listPhimLe:listPhimLe,
            listChieuRap:listChieuRap,
            HoatHinh:HoatHinh,
            listPhimSapChieu:listPhimSapChieu,
            pageTitle:'TRANG CHU',
            path:'/'
        } )
    } 
    catch ( error ) {
        console.log( error )
    }
}

exports.getMovieDetail = async( req,res,next ) =>{
    try {
        const movieDetail = await Movie.findOne( {name: req.params.name} );     

        const listPhimChieuRap = await Movie.find( {typeFilm: 'Phim-Chiếu-Rạp'} )
            .limit( 18 );

        const listPhimSapChieu = await Movie.find( {typeFilm: 'Phim-Sắp-Chiếu'} )
            .limit( 6 );

        res.render( 'home/movie-detail',{
            movie: movieDetail,
            listPhimChieuRap: listPhimChieuRap,
            listPhimSapChieu: listPhimSapChieu,
            national: movieDetail.national
        } )
    } catch ( error ) {
        console.log( error )
    }
}

exports.getWatchMovie = async( req,res,next ) =>{
    try {

        const listPhimChieuRap = await Movie.find( {typeFilm: 'Phim-Chiếu-Rạp'} );
        res.render( 'home/movie-watch',{
            listPhimChieuRap: listPhimChieuRap
        } )
    } catch ( error ) {
        
    }
}