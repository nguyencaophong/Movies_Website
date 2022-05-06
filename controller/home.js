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
        
        res.render( 'home/HomePage/index.ejs',{
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

exports.getMovieDetail = async( req,res ) =>{
    let movieDetail;
    try {
        
        const listPhimChieuRap = await Movie.find( {typeFilm: 'Phim-Chiếu-Rạp'} )
            .limit( 18 );
        
        const listPhimSapChieu = await Movie.find( {typeFilm: 'Phim-Sắp-Chiếu'} )
            .limit( 6 );
        
        movieDetail = await Movie.findOne( {name: req.params.name} );  
        if( movieDetail === null ) {
            movieDetail= 'Undified';
        }  
        res.render( 'home/MovieDetail/index.ejs',{
            listPhimChieuRap: listPhimChieuRap,
            movie: movieDetail,
            listPhimSapChieu: listPhimSapChieu
        } )
    } catch ( error ) {
        console.log( error )
    }
}

exports.getWatchMovie = async( req,res,next ) =>{
    try {

        const movieId = req.params.name;
        const movieDetail = await Movie.findById( movieId );
               
        res.render( 'home/VideoMovie/index.ejs',{
            movie: movieDetail
        } )
    } catch ( error ) {
        console.log( error )
    }
}