const path = require( 'path' );

const Movie = require( '../models/movie' );
const User = require( '../models/user' );
const { move } = require( '../routes/home' );

const ITEMS_PER_CONTAINER_LIST = 5;

exports.getIndex = async ( req, res ) => {
    const page = req.query.page || 1;

    try {
        const listPhimBo = await Movie.find( { typeFilm: 'Phim-Bộ' } )
            .limit( 18 );
        const listPhimLe = await Movie.find( { typeFilm: 'Phim-Lẻ' } )
            .limit( 18 );
        const listChieuRap = await Movie.find( { typeFilm: 'Phim-Chiếu-Rạp' } )
            .limit( 18 );
        const HoatHinh = await Movie.find( { typeFilm: 'Hoạt-Hình' } )
            .limit( 18 );
        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
            .limit( 6 );

        res.render( 'home/HomePage/index.ejs', {
            listPhimBo: listPhimBo,
            listPhimLe: listPhimLe,
            listChieuRap: listChieuRap,
            HoatHinh: HoatHinh,
            listPhimSapChieu: listPhimSapChieu,
            modeCategory:false,
            pageTitle: 'TRANG CHU',
            path: '/'
        } )
    }
    catch ( error ) {
        console.log( error )
    }
}

exports.getMovieDetail = async( req,res ) =>{
    try {

        const listPhimChieuRap = await Movie.find( { typeFilm: 'Phim-Chiếu-Rạp' } )
            .limit( 18 );

        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
            .limit( 6 );

        const movieDetail = await Movie.findOne( { name: req.params.name } );
        const listComment = movieDetail.listComment.sort( ( a,b ) =>{
            return b.location - a.location;
        } )
        const listEpisode = movieDetail.listEpisode.sort( ( a,b ) =>{
            return a.episode - b.episode;
        } )

        const userDetail = await User.findById( req.user._id );
        
        if ( movieDetail === null ) {
            movieDetail = 'Undified';
        }

        if( movieDetail.listEpisode.length===0 ) {
            var modeWatching=false;
        }

        res.render( 'home/MovieDetail/index.ejs', {
            movie: movieDetail,
            listPhimSapChieu: listPhimSapChieu,
            modeWatching: modeWatching,
            user: userDetail,
            listcomment: listComment,
            listEpisode:listEpisode,
            listPhimChieuRap: listPhimChieuRap
            
        } )
    } catch ( error ) {
        console.log( error )
    }
}

exports.getWatchMovie = async ( req, res ) => {
    try {
        const episodeFilm = req.query.episode;
        
        
        const movieDetail = await Movie.findOne( { name: req.params.name } );
        const listPhimChieuRap = await Movie.find( { typeFilm: 'Phim-Chiếu-Rạp' } )
            .limit( 18 )
        
        const listEpisode =await movieDetail.listEpisode.sort( ( a,b ) =>{
            return a.episode - b.episode;
        } )
        const listComment =await movieDetail.listComment.sort( ( a,b ) =>{
            return b.location - a.location;
        } )
        
        const userDetail = await User.findById( req.user._id );

        // Check query (episode is Number)?
        if( isNaN( episodeFilm ) ) {
            return res.redirect( `${movieDetail.name}?episode=1` )
        }
        
        const movieEpisodeDetail = movieDetail.listEpisode.filter( value =>{
            return value.episode.toString()===req.query.episode.toString()
        } );

        res.render( 'home/VideoMovie/index.ejs', {
            movie: movieDetail,
            movieEpisodeDetail: movieEpisodeDetail,
            user: userDetail,
            listcomment: listComment,
            listEpisode: listEpisode,
            listPhimChieuRap: listPhimChieuRap
        } )

    } catch ( error ) {
        console.log( error )
    }
}


exports.searchMovie = async( req,res )=>{
    try {
        const keywordSearch = req.body.Search
        const listMovie = await Movie.find();
        const listMovieDetail = listMovie.filter( value =>{
            return ( value.name.toUpperCase().includes( keywordSearch.toUpperCase() ) || 
                    value.typeFilm.replace( /-/g,'' ).toUpperCase().includes( keywordSearch.replace( /\s/g, '' ).toUpperCase() ) )
        } )

        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
            .limit( 6 );

        res.render( 'home/HomePage/index.ejs',{
            listCategory : listMovieDetail,
            listPhimSapChieu:listPhimSapChieu,
            nameCategory: keywordSearch,
            modeCategory: true
        } )
    } catch ( error ) {
        console.log( error );
    }
}


exports.getCategory = async( req,res )=>{
    try {
        const getCategory = req.params.category;
        const listMovie =await Movie.find();
        const listMovieDetail = await listMovie.filter( value =>{
            return ( value.typeFilm === getCategory )||( value.national.replace( ' ','-' )===getCategory );
            
        } )
        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
            .limit( 6 );
        
        res.render( 'home/HomePage/index.ejs',{
            listCategory : listMovieDetail,
            listPhimSapChieu:listPhimSapChieu,
            nameCategory: getCategory,
            modeCategory: true
        } )
    } catch ( error ) {
        console.log( error );
    }
}